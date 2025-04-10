
import { BaseAgent } from './BaseAgent';
import { createSupabaseFunctionTool } from './tools/SupabaseTool';
import { toast } from "@/components/ui/use-toast";

// Input parameters for the agent
export interface ResumeParserInput {
  resume_url: string;
  candidate_id: string;
  org_id: string;
}

/**
 * ResumeParserAgent: Downloads and parses PDF resumes using Azure OpenAI
 */
export class ResumeParserAgent extends BaseAgent {
  constructor() {
    super({
      name: "Resume Parser",
      description: "I specialize in extracting structured information from resume PDFs using AI.",
      goal: "Accurately extract candidate information from resumes and store it in a structured format.",
      tools: [
        createSupabaseFunctionTool(
          "parse_resume",
          "Extracts structured information from a resume PDF using Azure OpenAI",
          "parse-resume"
        )
      ]
    });
  }
  
  /**
   * Executes the resume parsing operation
   */
  public async execute(input: ResumeParserInput): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`Starting resume parsing for candidate ${input.candidate_id}`);
      
      // Show initial toast notification
      this.showToast(
        "Processing Resume",
        "Extracting and analyzing candidate information..."
      );
      
      // Create the CrewAI agent
      const agent = this.createCrewAgent();
      
      // Execute the task using the agent
      const result = await agent.execute(
        `Parse the resume located at ${input.resume_url} for candidate ${input.candidate_id} in organization ${input.org_id}.`,
        {
          input: JSON.stringify(input)
        }
      );
      
      // Parse the result - since result is a string from the tool
      const parsedResult = JSON.parse(result);
      
      if (!parsedResult.success) {
        this.showToast(
          "Resume Parsing Failed",
          parsedResult.message || 'Unknown error in parse-resume function',
          "destructive"
        );
        
        return { 
          success: false, 
          message: parsedResult.message || 'Unknown error in parse-resume function' 
        };
      }
      
      // Show success toast
      this.showToast(
        "Resume Processed Successfully",
        "Candidate information has been extracted and analyzed."
      );
      
      return { 
        success: true, 
        message: parsedResult.message || 'Resume successfully parsed and processed' 
      };
      
    } catch (error) {
      console.error("Error executing ResumeParserAgent:", error);
      
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
