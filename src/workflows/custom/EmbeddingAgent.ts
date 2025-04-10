
import { BaseAgent } from './BaseAgent';
import { supabase } from "@/integrations/supabase/client";

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
      description: "Creates vector embeddings from parsed resume data using AI.",
      goal: "Generate high-quality vector embeddings that accurately represent candidate resumes for semantic search."
    });
  }
  
  /**
   * Executes the embedding generation operation
   */
  public async execute(input: EmbeddingInput): Promise<{ success: boolean; message: string }> {
    try {
      this.log(`Starting embedding generation for candidate ${input.candidate_id}`);
      
      // Show initial toast notification
      this.showToast(
        "Generating Resume Embedding",
        "Creating a vector representation of the candidate's resume..."
      );
      
      // Validate input
      if (!this.validateInput(input, ['candidate_id', 'org_id'])) {
        throw new Error('Missing required input parameters');
      }
      
      // Call the Edge Function to generate the embedding
      const { data, error } = await supabase.functions.invoke('embed-resume', {
        body: {
          candidate_id: input.candidate_id,
          org_id: input.org_id
        }
      });
      
      if (error) {
        this.log(`Error calling embed-resume function: ${error.message}`);
        throw error;
      }
      
      if (!data.success) {
        this.showToast(
          "Embedding Generation Failed",
          data.message || 'Unknown error in embed-resume function',
          "destructive"
        );
        
        return { 
          success: false, 
          message: data.message || 'Unknown error in embed-resume function' 
        };
      }
      
      // Show success toast
      this.showToast(
        "Resume Embedding Created",
        `Vector representation created with ${data.dimensions || 'multiple'} dimensions.`
      );
      
      return { 
        success: true, 
        message: data.message || 'Resume embedding created successfully' 
      };
      
    } catch (error) {
      this.log(`Error executing embedding generation: ${error instanceof Error ? error.message : String(error)}`);
      
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
