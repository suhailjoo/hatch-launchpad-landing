
import { BaseAgent } from './BaseAgent';
import { supabase } from "@/integrations/supabase/client";

// Input parameters for the agent
export interface ResumeParserInput {
  resume_url: string;
  candidate_id: string;
  org_id: string;
}

/**
 * ResumeParserAgent: Extracts text from PDF resumes and uses AI to structure the information
 */
export class ResumeParserAgent extends BaseAgent {
  constructor() {
    super({
      name: "Resume Parser",
      description: "Extracts and structures information from resume PDFs.",
      goal: "Extract text from resumes using a PDF parser and then structure it with AI."
    });
  }
  
  /**
   * Executes the resume parsing operation
   */
  public async execute(input: ResumeParserInput): Promise<{ success: boolean; message: string }> {
    try {
      this.log(`Starting resume parsing for candidate ${input.candidate_id}`);
      
      // Show initial toast notification
      this.showToast(
        "Processing Resume",
        "Extracting and analyzing candidate information..."
      );
      
      // Validate input
      if (!this.validateInput(input, ['resume_url', 'candidate_id', 'org_id'])) {
        throw new Error('Missing required input parameters');
      }
      
      // Call the Edge Function to parse the resume
      const { data, error } = await supabase.functions.invoke('parse-resume', {
        body: {
          resume_url: input.resume_url,
          candidate_id: input.candidate_id,
          org_id: input.org_id
        }
      });
      
      if (error) {
        this.log(`Error calling parse-resume function: ${error.message}`);
        throw error;
      }
      
      if (!data.success) {
        this.showToast(
          "Resume Parsing Failed",
          data.message || 'Unknown error in parse-resume function',
          "destructive"
        );
        
        return { 
          success: false, 
          message: data.message || 'Unknown error in parse-resume function' 
        };
      }
      
      // Show success toast
      this.showToast(
        "Resume Processed Successfully",
        "Candidate information has been extracted and analyzed."
      );
      
      return { 
        success: true, 
        message: data.message || 'Resume successfully parsed and processed' 
      };
      
    } catch (error) {
      this.log(`Error executing resume parsing: ${error instanceof Error ? error.message : String(error)}`);
      
      this.showToast(
        "Resume Parsing Error",
        `Error processing resume: ${error instanceof Error ? error.message : String(error)}`,
        "destructive"
      );
      
      return { 
        success: false, 
        message: `Error executing ResumeParserAgent: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }
}

/**
 * Helper function to create and run a ResumeParserAgent instance
 */
export async function parseResume(input: ResumeParserInput): Promise<{ success: boolean; message: string }> {
  const agent = new ResumeParserAgent();
  return await agent.execute(input);
}
