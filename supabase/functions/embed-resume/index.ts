
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
    const azureEmbeddingDeploymentId = Deno.env.get('AZURE_EMBEDDING_DEPLOYMENT_ID') || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase URL or service role key');
    }
    
    if (!azureOpenAIEndpoint || !azureOpenAIKey || !azureEmbeddingDeploymentId) {
      throw new Error('Missing Azure OpenAI configuration');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the request body
    const { candidate_id, org_id } = await req.json();
    
    // Validate input parameters
    if (!candidate_id || !org_id) {
      throw new Error('Missing required parameters: candidate_id or org_id');
    }
    
    console.log(`Processing resume embedding for candidate ${candidate_id}`);
    
    // 1. Fetch the parsed resume from ai_results
    console.log("Fetching parsed resume data from ai_results table...");
    const { data: resumeData, error: resumeError } = await supabase
      .from('ai_results')
      .select('result')
      .eq('job_type', 'resume_parse')
      .eq('candidate_id', candidate_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (resumeError) {
      console.error("Error fetching parsed resume:", resumeError);
      throw new Error(`Failed to fetch parsed resume: ${resumeError.message}`);
    }
    
    if (!resumeData || !resumeData.result) {
      throw new Error('No parsed resume found for this candidate');
    }
    
    const parsedResume = resumeData.result;
    console.log("Retrieved parsed resume data");
    
    // 2. Flatten the parsed resume into a string
    console.log("Flattening resume data into a string...");
    let flattenedText = `Name: ${parsedResume.name || ''}\n`;
    flattenedText += `Email: ${parsedResume.email || ''}\n`;
    
    if (parsedResume.phone) {
      flattenedText += `Phone: ${parsedResume.phone}\n`;
    }
    
    if (parsedResume.location) {
      flattenedText += `Location: ${parsedResume.location}\n`;
    }
    
    flattenedText += "\nExperience:\n";
    if (Array.isArray(parsedResume.experience)) {
      parsedResume.experience.forEach((exp) => {
        flattenedText += `${exp.role} at ${exp.company}`;
        if (exp.start_date || exp.end_date) {
          flattenedText += ` (${exp.start_date || ''} to ${exp.end_date || 'present'})`;
        }
        flattenedText += ` - ${exp.type}\n`;
      });
    }
    
    if (Array.isArray(parsedResume.urls) && parsedResume.urls.length > 0) {
      flattenedText += "\nURLs:\n";
      parsedResume.urls.forEach((url) => {
        flattenedText += `${url}\n`;
      });
    }
    
    if (Array.isArray(parsedResume.projects) && parsedResume.projects.length > 0) {
      flattenedText += "\nProjects:\n";
      parsedResume.projects.forEach((project) => {
        flattenedText += `${project}\n`;
      });
    }
    
    if (Array.isArray(parsedResume.certifications) && parsedResume.certifications.length > 0) {
      flattenedText += "\nCertifications:\n";
      parsedResume.certifications.forEach((cert) => {
        flattenedText += `${cert}\n`;
      });
    }
    
    if (Array.isArray(parsedResume.awards) && parsedResume.awards.length > 0) {
      flattenedText += "\nAwards:\n";
      parsedResume.awards.forEach((award) => {
        flattenedText += `${award}\n`;
      });
    }
    
    if (Array.isArray(parsedResume.interests) && parsedResume.interests.length > 0) {
      flattenedText += "\nInterests:\n";
      parsedResume.interests.forEach((interest) => {
        flattenedText += `${interest}\n`;
      });
    }
    
    console.log("Resume flattened to text:", flattenedText.substring(0, 100) + "...");
    
    // 3. Call Azure OpenAI to generate embedding
    console.log(`Calling Azure OpenAI (${azureEmbeddingDeploymentId}) to generate embedding...`);
    
    // Construct the Azure OpenAI API URL for embeddings
    const azureOpenAIUrl = `${azureOpenAIEndpoint}/openai/deployments/${azureEmbeddingDeploymentId}/embeddings?api-version=2023-05-15`;
    
    // Call Azure OpenAI API to generate embedding
    const openAIResponse = await fetch(azureOpenAIUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': azureOpenAIKey,
      },
      body: JSON.stringify({
        input: flattenedText,
        model: "text-embedding-3-large", // Explicitly set the model
      }),
    });
    
    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error("Azure OpenAI API Error:", errorText);
      throw new Error(`Azure OpenAI API error: ${openAIResponse.status} ${errorText}`);
    }
    
    const openAIData = await openAIResponse.json();
    console.log("Azure OpenAI embedding response received");
    
    if (!openAIData.data || !openAIData.data[0] || !openAIData.data[0].embedding) {
      console.error("Invalid Azure OpenAI response:", JSON.stringify(openAIData));
      throw new Error('Invalid response from Azure OpenAI');
    }
    
    // Extract the embedding vector
    const embeddingVector = openAIData.data[0].embedding;
    console.log(`Successfully generated embedding vector with ${embeddingVector.length} dimensions`);
    
    // 4. Store the embedding vector in the candidates table
    console.log("Storing embedding vector in candidates table...");
    
    const { error: updateCandidateError } = await supabase
      .from('candidates')
      .update({ 
        embedding_vector: embeddingVector,
        updated_at: new Date().toISOString()
      })
      .eq('id', candidate_id);
    
    if (updateCandidateError) {
      console.error("Error updating candidate with embedding vector:", updateCandidateError);
      throw new Error(`Failed to update candidate with embedding vector: ${updateCandidateError.message}`);
    }
    
    console.log("Embedding vector stored successfully");
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Resume embedding created successfully",
        dimensions: embeddingVector.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
    
  } catch (error) {
    console.error("Error processing resume embedding:", error);
    
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
