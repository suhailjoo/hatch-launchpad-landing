
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const azureOpenAIEndpoint = Deno.env.get('AZURE_OPENAI_ENDPOINT') || '';
    const azureOpenAIKey = Deno.env.get('AZURE_OPENAI_API_KEY') || '';
    const azureEmbeddingDeploymentId = Deno.env.get('AZURE_EMBEDDING_DEPLOYMENT_ID') || 'text-embedding-3-large';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase URL or service role key');
    }
    
    if (!azureOpenAIEndpoint || !azureOpenAIKey) {
      throw new Error('Missing Azure OpenAI configuration');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the request body
    const { candidate_id, org_id } = await req.json();
    
    // Validate input parameters
    if (!candidate_id || !org_id) {
      throw new Error('Missing required parameters: candidate_id or org_id');
    }
    
    console.log(`Generating embedding for candidate ${candidate_id}`);
    
    // 1. Fetch the parsed resume result from the ai_results table
    const { data: parsedResumeResult, error: fetchError } = await supabase
      .from('ai_results')
      .select('result')
      .eq('job_type', 'resume_parse')
      .eq('candidate_id', candidate_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (fetchError) {
      console.error("Error fetching parsed resume:", fetchError);
      throw new Error(`Failed to fetch parsed resume: ${fetchError.message}`);
    }
    
    if (!parsedResumeResult || !parsedResumeResult.result) {
      throw new Error('No parsed resume found for this candidate');
    }
    
    const parsedResume = parsedResumeResult.result;
    console.log("Found parsed resume data");
    
    // 2. Flatten the parsed resume into a single string
    const experienceText = parsedResume.experience
      ? parsedResume.experience.map(exp => 
          `${exp.role} at ${exp.company} ${exp.start_date || ''} to ${exp.end_date || ''} (${exp.type})`
        ).join('. ')
      : '';
    
    const projectsText = parsedResume.projects 
      ? `Projects: ${parsedResume.projects.join(', ')}` 
      : '';
    
    const certificationsText = parsedResume.certifications 
      ? `Certifications: ${parsedResume.certifications.join(', ')}` 
      : '';
    
    const awardsText = parsedResume.awards 
      ? `Awards: ${parsedResume.awards.join(', ')}` 
      : '';
    
    const interestsText = parsedResume.interests 
      ? `Interests: ${parsedResume.interests.join(', ')}` 
      : '';
    
    const urlsText = parsedResume.urls 
      ? `URLs: ${parsedResume.urls.join(', ')}` 
      : '';
    
    // Combine all text fields into a single string
    const flattenedText = [
      `Name: ${parsedResume.name || ''}`,
      `Email: ${parsedResume.email || ''}`,
      `Phone: ${parsedResume.phone || ''}`,
      `Location: ${parsedResume.location || ''}`,
      `Experience: ${experienceText}`,
      projectsText,
      certificationsText,
      awardsText,
      interestsText,
      urlsText
    ].filter(text => text.length > 0).join('. ');
    
    console.log("Flattened resume text (sample):", flattenedText.substring(0, 100) + "...");
    
    // 3. Generate embedding using Azure OpenAI
    console.log(`Calling Azure OpenAI embedding model: ${azureEmbeddingDeploymentId}`);
    
    // Construct the Azure OpenAI API URL for embeddings
    const azureOpenAIUrl = `${azureOpenAIEndpoint}/openai/deployments/${azureEmbeddingDeploymentId}/embeddings?api-version=2023-05-15`;
    
    const embeddingResponse = await fetch(azureOpenAIUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': azureOpenAIKey,
      },
      body: JSON.stringify({
        input: flattenedText,
        model: "text-embedding-3-large"
      }),
    });
    
    if (!embeddingResponse.ok) {
      const errorText = await embeddingResponse.text();
      console.error("Azure OpenAI Embedding API Error:", errorText);
      throw new Error(`Azure OpenAI Embedding API error: ${embeddingResponse.status} ${errorText}`);
    }
    
    const embeddingData = await embeddingResponse.json();
    console.log("Embedding generated successfully");
    
    if (!embeddingData.data || !embeddingData.data[0] || !embeddingData.data[0].embedding) {
      console.error("Invalid embedding response:", JSON.stringify(embeddingData));
      throw new Error('Invalid response from Azure OpenAI Embedding API');
    }
    
    const embeddingVector = embeddingData.data[0].embedding;
    
    // 4. Store the embedding vector in the candidates table
    const { error: updateError } = await supabase
      .from('candidates')
      .update({
        embedding_vector: embeddingVector
      })
      .eq('id', candidate_id);
    
    if (updateError) {
      console.error("Error updating candidate with embedding:", updateError);
      throw new Error(`Failed to update candidate with embedding: ${updateError.message}`);
    }
    
    console.log("Embedding vector successfully stored for candidate:", candidate_id);
    
    // 5. Store a record in ai_results table
    const { data: aiResultData, error: aiResultError } = await supabase
      .from('ai_results')
      .insert({
        job_type: "embed_resume",
        candidate_id,
        org_id,
        result: {
          status: "success",
          embedding_dimensions: embeddingVector.length,
          embedding_model: azureEmbeddingDeploymentId
        }
      })
      .select('id')
      .single();
    
    if (aiResultError) {
      console.error("Error storing AI result:", aiResultError);
      throw new Error(`Failed to store AI result: ${aiResultError.message}`);
    }
    
    console.log("AI result stored with ID:", aiResultData.id);
    
    // Update the workflow job status
    const { error: workflowUpdateError } = await supabase
      .from('workflow_jobs')
      .update({ status: "completed" })
      .eq('job_type', 'embed_resume')
      .eq('candidate_id', candidate_id);
    
    if (workflowUpdateError) {
      console.error("Error updating workflow job status:", workflowUpdateError);
      // Non-critical error, continue
    }
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Resume embedding created and stored successfully",
        dimensions: embeddingVector.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
    
  } catch (error) {
    console.error("Error generating embedding:", error);
    
    // If this is a known error (e.g. no parsed resume), write it to ai_results
    try {
      const { candidate_id, org_id } = await req.json();
      
      if (candidate_id && org_id) {
        const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
        
        if (supabaseUrl && supabaseServiceKey) {
          const supabase = createClient(supabaseUrl, supabaseServiceKey);
          
          await supabase
            .from('ai_results')
            .insert({
              job_type: "embed_resume",
              candidate_id,
              org_id,
              result: {
                status: "error",
                error: error instanceof Error ? error.message : String(error)
              }
            });
          
          await supabase
            .from('workflow_jobs')
            .update({ status: "failed" })
            .eq('job_type', 'embed_resume')
            .eq('candidate_id', candidate_id);
        }
      }
    } catch (logError) {
      console.error("Error logging to ai_results:", logError);
    }
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : String(error)
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
