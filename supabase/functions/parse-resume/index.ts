
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";
// Import pdf.js for PDF text extraction
import * as pdfjs from "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/+esm";

// Define the parsed resume structure
interface ParsedResume {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  experience: {
    role: string;
    company: string;
    start_date?: string;
    end_date?: string;
    type: "full_time" | "internship";
  }[];
  urls: string[];
  projects?: string[];
  certifications?: string[];
  awards?: string[];
  interests?: string[];
}

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
    const azureOpenAIDeploymentId = Deno.env.get('AZURE_OPENAI_DEPLOYMENT_ID') || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase URL or service role key');
    }
    
    if (!azureOpenAIEndpoint || !azureOpenAIKey || !azureOpenAIDeploymentId) {
      throw new Error('Missing Azure OpenAI configuration');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the request body
    const { resume_url, candidate_id, org_id } = await req.json();
    
    // Validate input parameters
    if (!resume_url || !candidate_id || !org_id) {
      throw new Error('Missing required parameters: resume_url, candidate_id, or org_id');
    }
    
    console.log(`Processing resume for candidate ${candidate_id} from ${resume_url}`);
    
    // STEP 1: Download the PDF
    console.log("Downloading PDF from:", resume_url);
    const pdfResponse = await fetch(resume_url);
    if (!pdfResponse.ok) {
      throw new Error(`Failed to download PDF: ${pdfResponse.status} ${pdfResponse.statusText}`);
    }
    
    const pdfArrayBuffer = await pdfResponse.arrayBuffer();
    const pdfSize = pdfArrayBuffer.byteLength;
    console.log(`PDF downloaded successfully. Size: ${pdfSize} bytes`);
    
    // STEP 2: Extract text from PDF using pdf.js
    console.log("Extracting text from PDF using pdf.js...");
    
    try {
      // Initialize PDF.js - FIX: Proper assignment without await
      pdfjs.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
      
      // Load the PDF document
      const loadingTask = pdfjs.getDocument({ data: pdfArrayBuffer });
      const pdfDocument = await loadingTask.promise;
      const numPages = pdfDocument.numPages;
      console.log(`PDF loaded successfully. Pages: ${numPages}`);
      
      // Extract text from each page
      let extractedText = '';
      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        extractedText += pageText + '\n';
      }
      
      console.log("Extracted text sample:", extractedText.substring(0, 200) + "...");
      console.log("Total extracted text length:", extractedText.length);
      
      // STEP 3: Call Azure OpenAI to process and structure the extracted text
      console.log(`Calling Azure OpenAI (${azureOpenAIDeploymentId}) to process extracted text...`);
      
      // Construct the Azure OpenAI API URL
      const azureOpenAIUrl = `${azureOpenAIEndpoint}/openai/deployments/${azureOpenAIDeploymentId}/chat/completions?api-version=2025-01-01-preview`;
      
      // System message for parsing resumes
      const systemMessage = `
        You are an expert resume analyzer. A PDF resume has been parsed into plain text, and your job is to structure this information.
        
        Format your response as a valid JSON object with these fields:
        {
          "name": string,
          "email": string,
          "phone": string (optional),
          "location": string (optional),
          "experience": [
            {
              "role": string,
              "company": string,
              "start_date": string (optional),
              "end_date": string (optional),
              "type": "full_time" | "internship"
            }
          ],
          "urls": string[],
          "projects": string[] (optional),
          "certifications": string[] (optional),
          "awards": string[] (optional),
          "interests": string[] (optional)
        }
        
        Only include fields if they are present in the resume. Include all relevant information.
        For experience, determine if each position is full_time or internship based on the context.
        The response must be valid JSON with no explanation or additional text.
      `;
      
      // Call Azure OpenAI API
      const openAIResponse = await fetch(azureOpenAIUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': azureOpenAIKey,
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: extractedText }
          ],
          temperature: 0.1, // Lower temperature for more deterministic outputs
          max_tokens: 1000,
          model: "gpt-4o-mini", // Use a smaller, faster model
        }),
      });
      
      if (!openAIResponse.ok) {
        const errorText = await openAIResponse.text();
        console.error("Azure OpenAI API Error:", errorText);
        throw new Error(`Azure OpenAI API error: ${openAIResponse.status} ${errorText}`);
      }
      
      const openAIData = await openAIResponse.json();
      console.log("Azure OpenAI response received");
      
      if (!openAIData.choices || !openAIData.choices[0] || !openAIData.choices[0].message) {
        console.error("Invalid Azure OpenAI response:", JSON.stringify(openAIData));
        throw new Error('Invalid response from Azure OpenAI');
      }
      
      // Extract the parsed resume from the AI response
      const aiResponseContent = openAIData.choices[0].message.content;
      console.log("AI response content sample:", aiResponseContent.substring(0, 200) + "...");
      
      let parsedResume: ParsedResume;
      
      try {
        // Extract JSON from the response if it's surrounded by backticks or other text
        const jsonMatch = aiResponseContent.match(/```json\s*([\s\S]*?)\s*```/) || 
                          aiResponseContent.match(/{[\s\S]*}/);
        
        const jsonContent = jsonMatch ? jsonMatch[0].replace(/```json|```/g, '') : aiResponseContent;
        parsedResume = JSON.parse(jsonContent);
        
        // Validate required fields
        if (!parsedResume.name || !parsedResume.email || !Array.isArray(parsedResume.experience)) {
          console.error("Missing required fields in parsed resume:", JSON.stringify(parsedResume));
          throw new Error('Missing required fields in parsed resume');
        }
        
        console.log("Successfully parsed resume data");
      } catch (parseError) {
        console.error('Failed to parse JSON from Azure OpenAI response:', parseError);
        console.log('Raw response:', aiResponseContent);
        throw new Error('Failed to parse resume data from AI response');
      }
      
      // STEP 4: Store the result in the ai_results table
      console.log("Storing parsed resume result in ai_results table...");
      
      // Type assertion to work around the type issue
      const { data: aiResultData, error: aiResultError } = await supabase
        .from('ai_results')
        .insert({
          job_type: "resume_parse",
          candidate_id,
          org_id,
          result: parsedResume
        } as any)
        .select('id')
        .single();
      
      if (aiResultError) {
        console.error("Error storing AI result:", aiResultError);
        throw new Error(`Failed to store AI result: ${aiResultError.message}`);
      }
      
      console.log("AI result stored with ID:", aiResultData.id);
      
      // STEP 5: Update the candidate record with the parsed email if it's empty
      console.log("Checking if candidate email needs to be updated...");
      const { data: candidate, error: fetchCandidateError } = await supabase
        .from('candidates')
        .select('email, job_id')
        .eq('id', candidate_id)
        .single();
      
      if (fetchCandidateError) {
        console.error("Error fetching candidate:", fetchCandidateError);
        throw new Error(`Failed to fetch candidate: ${fetchCandidateError.message}`);
      }
      
      if (!candidate.email && parsedResume.email) {
        console.log("Updating candidate with parsed email:", parsedResume.email);
        const { error: updateCandidateError } = await supabase
          .from('candidates')
          .update({ email: parsedResume.email })
          .eq('id', candidate_id);
        
        if (updateCandidateError) {
          console.error("Error updating candidate:", updateCandidateError);
          throw new Error(`Failed to update candidate: ${updateCandidateError.message}`);
        }
        
        console.log("Candidate email updated successfully");
      } else {
        console.log("Candidate already has an email, skipping update");
      }
      
      // STEP 6: Create additional workflow jobs
      console.log("Creating follow-up workflow jobs...");
      const followUpJobs = [
        "embed_resume",
        "auto_tag_candidate",
        "role_fit_score",
        "interview_kit"
      ];
      
      const jobId = candidate.job_id || "";
      
      const workflowJobsData = followUpJobs.map(jobType => ({
        job_type: jobType,
        candidate_id,
        org_id,
        job_id: jobId,
        status: "pending"
      }));
      
      const { error: workflowJobsError } = await supabase
        .from('workflow_jobs')
        .insert(workflowJobsData as any);
      
      if (workflowJobsError) {
        console.error("Error creating workflow jobs:", workflowJobsError);
        throw new Error(`Failed to create workflow jobs: ${workflowJobsError.message}`);
      }
      
      console.log("Follow-up workflow jobs created successfully");
      
      // Return success response
      return new Response(
        JSON.stringify({
          success: true,
          message: "Resume successfully parsed and processed",
          result_id: aiResultData.id
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    } catch (pdfError) {
      console.error("Error processing PDF:", pdfError);
      throw new Error(`PDF processing error: ${pdfError instanceof Error ? pdfError.message : String(pdfError)}`);
    }
    
  } catch (error) {
    console.error("Error processing resume:", error);
    
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
