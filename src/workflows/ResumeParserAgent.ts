
import { supabase } from "@/integrations/supabase/client";

// Define the parsed resume structure
export interface ParsedResume {
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

// Input parameters for the agent
export interface ResumeParserInput {
  resume_url: string;
  candidate_id: string;
  org_id: string;
}

/**
 * ResumeParserAgent: Downloads and parses PDF resumes using Azure OpenAI
 */
export class ResumeParserAgent {
  private input: ResumeParserInput;
  
  constructor(input: ResumeParserInput) {
    this.input = input;
  }
  
  /**
   * Downloads the PDF from the provided URL
   */
  private async downloadPDF(): Promise<ArrayBuffer | null> {
    try {
      console.log(`Downloading PDF from ${this.input.resume_url}`);
      const response = await fetch(this.input.resume_url);
      
      if (!response.ok) {
        throw new Error(`Failed to download PDF: ${response.status} ${response.statusText}`);
      }
      
      return await response.arrayBuffer();
    } catch (error) {
      console.error("Error downloading PDF:", error);
      return null;
    }
  }
  
  /**
   * Extracts text from the PDF
   */
  private async extractTextFromPDF(pdfBuffer: ArrayBuffer): Promise<string> {
    try {
      // Using a third-party service to extract text from PDF
      // This is a placeholder - you would implement the actual PDF text extraction
      // In a real implementation, you might use a library like pdf.js or a service
      
      // Simulating text extraction for demonstration purposes
      const textContent = "Extracted text from PDF would appear here";
      
      return textContent;
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      return "";
    }
  }
  
  /**
   * Parses resume text using Azure OpenAI
   */
  private async parseResumeWithAI(resumeText: string): Promise<ParsedResume | null> {
    try {
      // In a real implementation, you would call Azure OpenAI API here
      // This is a placeholder for the actual API call
      
      // Example system message
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
      `;
      
      // For now, return a mock parsed resume
      // In production, you would replace this with actual Azure OpenAI API call
      const mockParsedResume: ParsedResume = {
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
      
      return mockParsedResume;
    } catch (error) {
      console.error("Error parsing resume with AI:", error);
      return null;
    }
  }
  
  /**
   * Stores the parsed result in the ai_results table
   */
  private async storeResult(parsedResume: ParsedResume): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('ai_results')
        .insert({
          job_type: "resume_parse",
          candidate_id: this.input.candidate_id,
          org_id: this.input.org_id,
          result: parsedResume
        })
        .select('id')
        .single();
      
      if (error) {
        throw error;
      }
      
      console.log(`Stored parsed resume with result ID: ${data.id}`);
      return true;
    } catch (error) {
      console.error("Error storing parsed resume:", error);
      return false;
    }
  }
  
  /**
   * Creates additional workflow jobs based on the parsed resume
   */
  private async createWorkflowJobs(): Promise<boolean> {
    try {
      const followUpJobs = [
        "embed_resume",
        "auto_tag_candidate",
        "role_fit_score",
        "interview_kit"
      ];
      
      const workflowJobsData = followUpJobs.map(jobType => ({
        job_type: jobType,
        candidate_id: this.input.candidate_id,
        org_id: this.input.org_id,
        job_id: "", // This would be populated from the candidate's job_id in a real implementation
        status: "pending"
      }));
      
      // First, get the job_id from the candidate
      const { data: candidateData, error: candidateError } = await supabase
        .from('candidates')
        .select('job_id')
        .eq('id', this.input.candidate_id)
        .single();
      
      if (candidateError) {
        console.error("Error fetching candidate job_id:", candidateError);
        return false;
      }
      
      // Update the job_id in all workflow jobs
      const jobId = candidateData.job_id || "";
      workflowJobsData.forEach(job => job.job_id = jobId);
      
      // Insert all workflow jobs
      const { error } = await supabase
        .from('workflow_jobs')
        .insert(workflowJobsData);
      
      if (error) {
        throw error;
      }
      
      console.log(`Created ${followUpJobs.length} follow-up workflow jobs`);
      return true;
    } catch (error) {
      console.error("Error creating workflow jobs:", error);
      return false;
    }
  }
  
  /**
   * Updates the candidate record with parsed information
   */
  private async updateCandidateRecord(parsedResume: ParsedResume): Promise<boolean> {
    try {
      // Only update email if it was empty before
      const { data: candidate, error: fetchError } = await supabase
        .from('candidates')
        .select('email')
        .eq('id', this.input.candidate_id)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // If candidate already has an email, don't overwrite it
      if (candidate.email) {
        return true;
      }
      
      // Update the candidate record with the parsed email
      const { error: updateError } = await supabase
        .from('candidates')
        .update({ email: parsedResume.email })
        .eq('id', this.input.candidate_id);
      
      if (updateError) {
        throw updateError;
      }
      
      console.log(`Updated candidate record with parsed email: ${parsedResume.email}`);
      return true;
    } catch (error) {
      console.error("Error updating candidate record:", error);
      return false;
    }
  }
  
  /**
   * Main execution method for the agent
   */
  public async run(): Promise<{ success: boolean; message: string }> {
    try {
      // 1. Download the PDF
      const pdfBuffer = await this.downloadPDF();
      if (!pdfBuffer) {
        return { success: false, message: "Failed to download PDF" };
      }
      
      // 2. Extract text from the PDF
      const resumeText = await this.extractTextFromPDF(pdfBuffer);
      if (!resumeText) {
        return { success: false, message: "Failed to extract text from PDF" };
      }
      
      // 3. Parse the resume with AI
      const parsedResume = await this.parseResumeWithAI(resumeText);
      if (!parsedResume) {
        return { success: false, message: "Failed to parse resume with AI" };
      }
      
      // 4. Store the result
      const storeSuccess = await this.storeResult(parsedResume);
      if (!storeSuccess) {
        return { success: false, message: "Failed to store parsed resume" };
      }
      
      // 5. Update candidate record with parsed email
      await this.updateCandidateRecord(parsedResume);
      
      // 6. Create additional workflow jobs
      const workflowJobsSuccess = await this.createWorkflowJobs();
      if (!workflowJobsSuccess) {
        return { 
          success: true, 
          message: "Resume parsed and stored, but failed to create follow-up workflow jobs" 
        };
      }
      
      return { 
        success: true, 
        message: "Resume successfully parsed, stored, and follow-up jobs created" 
      };
    } catch (error) {
      console.error("Error running ResumeParserAgent:", error);
      return { 
        success: false, 
        message: `Error running ResumeParserAgent: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }
}

/**
 * Helper function to create and run a ResumeParserAgent instance
 */
export async function parseResume(input: ResumeParserInput): Promise<{ success: boolean; message: string }> {
  const agent = new ResumeParserAgent(input);
  return await agent.run();
}
