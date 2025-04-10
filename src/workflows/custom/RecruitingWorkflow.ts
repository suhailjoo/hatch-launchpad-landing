
import { ResumeParserAgent } from './ResumeParserAgent';
import { EmbeddingAgent } from './EmbeddingAgent';
import { toast } from "@/components/ui/use-toast";

/**
 * RecruitingWorkflow: Orchestrates the end-to-end candidate processing flow
 */
export class RecruitingWorkflow {
  /**
   * Process a new candidate by parsing their resume and generating an embedding
   */
  public static async processCandidate({
    resume_url,
    candidate_id,
    org_id
  }: {
    resume_url: string;
    candidate_id: string;
    org_id: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      // Show initial toast
      toast({
        title: "Processing Candidate",
        description: "Starting the resume parsing and embedding workflow..."
      });
      
      console.log(`Starting candidate processing workflow for candidate ${candidate_id}`);
      
      // Create agents
      const resumeParserAgent = new ResumeParserAgent();
      const embeddingAgent = new EmbeddingAgent();
      
      // Step 1: Parse resume
      console.log("Step 1: Parsing resume...");
      const parseResult = await resumeParserAgent.execute({ 
        resume_url, 
        candidate_id, 
        org_id 
      });
      
      if (!parseResult.success) {
        console.error("Resume parsing failed:", parseResult.message);
        return parseResult;
      }
      
      // Step 2: Generate embedding (only if resume parsing succeeded)
      console.log("Step 2: Generating embedding...");
      const embeddingResult = await embeddingAgent.execute({ 
        candidate_id, 
        org_id 
      });
      
      if (!embeddingResult.success) {
        console.error("Embedding generation failed:", embeddingResult.message);
        return embeddingResult;
      }
      
      // Show success toast
      toast({
        title: "Candidate Processing Complete",
        description: "Successfully processed the candidate's resume and generated embeddings."
      });
      
      return {
        success: true,
        message: "Candidate processing workflow completed successfully"
      };
      
    } catch (error) {
      console.error("Error in RecruitingWorkflow:", error);
      
      toast({
        title: "Workflow Error",
        description: `Error processing candidate: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive"
      });
      
      return {
        success: false,
        message: `Error in RecruitingWorkflow: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
}
