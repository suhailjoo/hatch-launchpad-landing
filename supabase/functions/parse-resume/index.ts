
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

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
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase URL or service role key');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the request body
    const { resume_url, candidate_id, org_id } = await req.json();
    
    // Validate input parameters
    if (!resume_url || !candidate_id || !org_id) {
      throw new Error('Missing required parameters: resume_url, candidate_id, or org_id');
    }
    
    console.log(`Processing resume for candidate ${candidate_id} from ${resume_url}`);
    
    // 1. Download the PDF
    const pdfResponse = await fetch(resume_url);
    if (!pdfResponse.ok) {
      throw new Error(`Failed to download PDF: ${pdfResponse.status} ${pdfResponse.statusText}`);
    }
    
    // Extract text from PDF - in a real implementation, you would use a PDF library
    // For this example, we'll mock the extraction
    console.log("Extracting text from PDF...");
    const extractedText = "Mock extracted text from resume"; // Mock extraction
    
    // 2. Call Azure OpenAI to parse the resume
    // In this example, we'll use a mock parsed resume
    console.log("Parsing resume with AI...");
    
    // This would be where you call Azure OpenAI in a real implementation
    const parsedResume: ParsedResume = {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "555-123-4567",
      location: "San Francisco, CA",
      experience: [
        {
          role: "Software Engineer",
          company: "Tech Corp",
          start_date: "2020-01",
          end_date: "2023-03",
          type: "full_time"
        },
        {
          role: "Software Engineering Intern",
          company: "Startup Inc",
          start_date: "2019-05",
          end_date: "2019-08",
          type: "internship"
        }
      ],
      urls: ["https://github.com/janedoe", "https://linkedin.com/in/janedoe"],
      projects: ["Personal Portfolio", "Task Management App"],
      certifications: ["AWS Certified Developer"],
      awards: ["Dean's List 2018-2019"],
      interests: ["Hiking", "Photography"]
    };
    
    // 3. Store the result in the ai_results table
    console.log("Storing parsed resume result...");
    const { data: aiResultData, error: aiResultError } = await supabase
      .from('ai_results')
      .insert({
        job_type: "resume_parse",
        candidate_id,
        org_id,
        result: parsedResume
      })
      .select('id')
      .single();
    
    if (aiResultError) {
      throw new Error(`Failed to store AI result: ${aiResultError.message}`);
    }
    
    // 4. Update the candidate record with the parsed email if it's empty
    const { data: candidate, error: fetchCandidateError } = await supabase
      .from('candidates')
      .select('email, job_id')
      .eq('id', candidate_id)
      .single();
    
    if (fetchCandidateError) {
      throw new Error(`Failed to fetch candidate: ${fetchCandidateError.message}`);
    }
    
    if (!candidate.email) {
      console.log("Updating candidate with parsed email...");
      const { error: updateCandidateError } = await supabase
        .from('candidates')
        .update({ email: parsedResume.email })
        .eq('id', candidate_id);
      
      if (updateCandidateError) {
        throw new Error(`Failed to update candidate: ${updateCandidateError.message}`);
      }
    }
    
    // 5. Create additional workflow jobs
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
      .insert(workflowJobsData);
    
    if (workflowJobsError) {
      throw new Error(`Failed to create workflow jobs: ${workflowJobsError.message}`);
    }
    
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
