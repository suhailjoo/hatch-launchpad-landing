
import { BaseAgent } from './BaseAgent';

/**
 * TaskFactory: Creates common task configurations for the CrewAI enterprise API
 */
export class TaskFactory {
  /**
   * Create a task for parsing a resume
   */
  public static createResumeParsingTask(
    agent: BaseAgent,
    input: { resume_url: string; candidate_id: string; org_id: string }
  ): any {
    return {
      description: `Parse the resume located at ${input.resume_url} for candidate ${input.candidate_id}`,
      agent: agent.createCrewAgent(),
      context: [
        `The resume URL is: ${input.resume_url}`,
        `The candidate ID is: ${input.candidate_id}`,
        `The organization ID is: ${input.org_id}`
      ],
      async_execution: true
    };
  }
  
  /**
   * Create a task for generating an embedding
   */
  public static createEmbeddingTask(
    agent: BaseAgent,
    input: { candidate_id: string; org_id: string }
  ): any {
    return {
      description: `Generate an embedding vector for the resume of candidate ${input.candidate_id}`,
      agent: agent.createCrewAgent(),
      context: [
        `The candidate ID is: ${input.candidate_id}`,
        `The organization ID is: ${input.org_id}`
      ],
      async_execution: true
    };
  }
  
  /**
   * Create a custom task with specific description and context
   */
  public static createCustomTask(
    agent: BaseAgent,
    description: string,
    context: string[]
  ): any {
    return {
      description,
      agent: agent.createCrewAgent(),
      context,
      async_execution: true
    };
  }
}
