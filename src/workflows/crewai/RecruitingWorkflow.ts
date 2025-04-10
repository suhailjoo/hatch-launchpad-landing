
import { Crew } from './Crew';
import { ResumeParserAgent } from './ResumeParserAgent';
import { EmbeddingAgent } from './EmbeddingAgent';
import { TaskFactory } from './TaskFactory';
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
      
      // Create agents
      const resumeParserAgent = new ResumeParserAgent();
      const embeddingAgent = new EmbeddingAgent();
      
      // Create tasks
      const parseResumeTask = TaskFactory.createResumeParsingTask(
        resumeParserAgent,
        { resume_url, candidate_id, org_id }
      );
      
      const generateEmbeddingTask = TaskFactory.createEmbeddingTask(
        embeddingAgent,
        { candidate_id, org_id }
      );
      
      // Make embedding task depend on parse resume task
      generateEmbeddingTask.setParentTasks([parseResumeTask]);
      
      // Create crew
      const crew = new Crew({
        name: "Candidate Processing Crew",
        description: "A crew that processes new candidates by parsing their resumes and generating embeddings",
        agents: [resumeParserAgent, embeddingAgent],
        tasks: [parseResumeTask, generateEmbeddingTask]
      });
      
      // Execute the crew
      await crew.execute();
      
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
