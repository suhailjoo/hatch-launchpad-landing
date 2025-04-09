
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

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
   * Main execution method for the agent
   * This method calls the parse-resume Edge Function to process the resume
   */
  public async run(): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`Calling parse-resume Edge Function for candidate ${this.input.candidate_id}`);
      
      // Show toast notification
      toast({
        title: "Processing Resume",
        description: "Extracting and analyzing candidate information...",
      });
      
      // Call the Edge Function to parse the resume
      const { data, error } = await supabase.functions.invoke('parse-resume', {
        body: {
          resume_url: this.input.resume_url,
          candidate_id: this.input.candidate_id,
          org_id: this.input.org_id
        }
      });
      
      if (error) {
        console.error('Error calling parse-resume function:', error);
        toast({
          title: "Resume Parsing Failed",
          description: `Failed to parse resume: ${error.message}`,
          variant: "destructive"
        });
        
        return { 
          success: false, 
          message: `Failed to parse resume: ${error.message}` 
        };
      }
      
      if (!data.success) {
        toast({
          title: "Resume Parsing Failed",
          description: data.message || 'Unknown error in parse-resume function',
          variant: "destructive"
        });
        
        return { 
          success: false, 
          message: data.message || 'Unknown error in parse-resume function' 
        };
      }
      
      // Show success toast
      toast({
        title: "Resume Processed Successfully",
        description: "Candidate information has been extracted and analyzed.",
      });
      
      return { 
        success: true, 
        message: data.message || 'Resume successfully parsed and processed' 
      };
      
    } catch (error) {
      console.error("Error running ResumeParserAgent:", error);
      
      toast({
        title: "Resume Parsing Error",
        description: `Error processing resume: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive"
      });
      
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
