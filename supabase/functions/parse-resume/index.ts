
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
    
    // 1. Download the PDF
    const pdfResponse = await fetch(resume_url);
    if (!pdfResponse.ok) {
      throw new Error(`Failed to download PDF: ${pdfResponse.status} ${pdfResponse.statusText}`);
    }
    
    const pdfBlob = await pdfResponse.blob();
    
    // This would be a real PDF text extraction in production
    // For simplicity, we'll use a mock extraction in this example
    console.log("Extracting text from PDF...");
    
    // In a real implementation, you would extract the text from the PDF using a PDF parser
    // For this example, we'll just use a placeholder
    const extractedText = "Jane Doe\nEmail: jane.doe@example.com\nPhone: 555-123-4567\nLocation: San Francisco, CA\n\nExperience:\nSoftware Engineer at Tech Corp (2020-01 to 2023-03)\nSoftware Engineering Intern at Startup Inc (2019-05 to 2019-08)\n\nProjects: Personal Portfolio, Task Management App\n\nCertifications: AWS Certified Developer\n\nAwards: Dean's List 2018-2019\n\nInterests: Hiking, Photography\n\nLinks: https://github.com/janedoe, https://linkedin.com/in/janedoe";
    
    // 2. Call Azure OpenAI to parse the resume
    console.log("Parsing resume with Azure OpenAI...");
    
    // Construct the Azure OpenAI API URL
    const azureOpenAIUrl = `${azureOpenAIEndpoint}/openai/deployments/${azureOpenAIDeploymentId}/chat/completions?api-version=2023-05-15`;
    
    // System message for parsing resumes
    const systemMessage = `
      You are an expert resume parser. Extract structured information from the resume text.
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
        temperature: 0.2, // Lower temperature for more deterministic outputs
        max_tokens: 800,
      }),
    });
    
    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      throw new Error(`Azure OpenAI API error: ${openAIResponse.status} ${errorText}`);
    }
    
    const openAIData = await openAIResponse.json();
    
    if (!openAIData.choices || !openAIData.choices[0] || !openAIData.choices[0].message) {
      throw new Error('Invalid response from Azure OpenAI');
    }
    
    // Extract the parsed resume from the AI response
    const aiResponseContent = openAIData.choices[0].message.content;
    let parsedResume: ParsedResume;
    
    try {
      // Extract JSON from the response if it's surrounded by backticks or other text
      const jsonMatch = aiResponseContent.match(/```json\s*([\s\S]*?)\s*```/) || 
                        aiResponseContent.match(/{[\s\S]*}/);
      
      const jsonContent = jsonMatch ? jsonMatch[0].replace(/```json|```/g, '') : aiResponseContent;
      parsedResume = JSON.parse(jsonContent);
      
      // Validate required fields
      if (!parsedResume.name || !parsedResume.email || !Array.isArray(parsedResume.experience)) {
        throw new Error('Missing required fields in parsed resume');
      }
    } catch (parseError) {
      console.error('Failed to parse JSON from Azure OpenAI response:', parseError);
      console.log('Raw response:', aiResponseContent);
      throw new Error('Failed to parse resume data from AI response');
    }
    
    // 3. Store the result in the ai_results table
    console.log("Storing parsed resume result...");
    // Type assertion to work around the type issue
    const { data: aiResultData, error: aiResultError } = await (supabase as any)
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
