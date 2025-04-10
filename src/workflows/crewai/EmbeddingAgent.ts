
import { BaseAgent } from './BaseAgent';
import { createSupabaseFunctionTool } from './tools/SupabaseTool';
import { toast } from "@/components/ui/use-toast";

// Input parameters for the agent
export interface EmbeddingInput {
  candidate_id: string;
  org_id: string;
}

/**
 * EmbeddingAgent: Creates an embedding vector for a candidate résumé
 * 
 * This agent:
 * 1. Fetches the parsed résumé from ai_results
 * 2. Flattens it into a text representation
 * 3. Uses Azure OpenAI to generate an embedding vector
 * 4. Stores the vector in the candidates table
 */
export class EmbeddingAgent extends BaseAgent {
  constructor() {
    super({
      name: "Embedding Generator",
      description: "I create vector embeddings from parsed resume data using AI.",
      goal: "Generate high-quality vector embeddings that accurately represent candidate resumes for semantic search.",
      tools: [
        createSupabaseFunctionTool(
          "embed_resume",
          "Generates a vector embedding from parsed resume data using Azure OpenAI",
          "embed-resume"
        )
      ]
    });
  }
  
  /**
   * Executes the embedding generation operation
   */
  public async execute(input: EmbeddingInput): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`Starting embedding generation for candidate ${input.candidate_id}`);
      
      // Show initial toast notification
      this.showToast(
        "Generating Resume Embedding",
        "Creating a vector representation of the candidate's resume..."
      );
      
      // Create the CrewAI agent
      const agent = this.createCrewAgent();
      
      // Execute the task using the agent
      const result = await agent.execute(
        `Generate an embedding vector for the resume of candidate ${input.candidate_id} in organization ${input.org_id}.`,
        {
          input: JSON.stringify(input)
        }
      );
      
      // Parse the result - since result is a string from the tool
      const parsedResult = JSON.parse(result);
      
      if (!parsedResult.success) {
        this.showToast(
          "Embedding Generation Failed",
          parsedResult.message || 'Unknown error in embed-resume function',
          "destructive"
        );
        
        return { 
          success: false, 
          message: parsedResult.message || 'Unknown error in embed-resume function' 
        };
      }
      
      // Show success toast
      this.showToast(
        "Resume Embedding Created",
        `Vector representation created with ${parsedResult.dimensions || 'multiple'} dimensions.`
      );
      
      return { 
        success: true, 
        message: parsedResult.message || 'Resume embedding created successfully' 
      };
      
    } catch (error) {
      console.error("Error executing EmbeddingAgent:", error);
      
      this.showToast(
        "Embedding Generation Error",
        `Error creating embedding: ${error instanceof Error ? error.message : String(error)}`,
        "destructive"
      );
      
      return { 
        success: false, 
        message: `Error executing EmbeddingAgent: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }
}

/**
 * Helper function to create and run an EmbeddingAgent instance
 */
export async function createEmbedding(input: EmbeddingInput): Promise<{ success: boolean; message: string }> {
  const agent = new EmbeddingAgent();
  return await agent.execute(input);
}
