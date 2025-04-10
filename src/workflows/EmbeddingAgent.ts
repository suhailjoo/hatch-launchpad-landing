
import { supabase } from "@/integrations/supabase/client";
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
export class EmbeddingAgent {
  private input: EmbeddingInput;
  
  constructor(input: EmbeddingInput) {
    this.input = input;
  }
  
  /**
   * Main execution method for the agent
   * This method calls the embed-resume Edge Function to process the resume
   */
  public async run(): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`Calling embed-resume Edge Function for candidate ${this.input.candidate_id}`);
      
      // Show toast notification
      toast({
        title: "Generating Resume Embedding",
        description: "Creating a vector representation of the candidate's resume...",
      });
      
      // Call the Edge Function to generate the embedding
      const { data, error } = await supabase.functions.invoke('embed-resume', {
        body: {
          candidate_id: this.input.candidate_id,
          org_id: this.input.org_id
        }
      });
      
      if (error) {
        console.error('Error calling embed-resume function:', error);
        toast({
          title: "Embedding Generation Failed",
          description: `Failed to generate embedding: ${error.message}`,
          variant: "destructive"
        });
        
        return { 
          success: false, 
          message: `Failed to generate embedding: ${error.message}` 
        };
      }
      
      if (!data.success) {
        toast({
          title: "Embedding Generation Failed",
          description: data.message || 'Unknown error in embed-resume function',
          variant: "destructive"
        });
        
        return { 
          success: false, 
          message: data.message || 'Unknown error in embed-resume function' 
        };
      }
      
      // Show success toast
      toast({
        title: "Resume Embedding Created",
        description: `Vector representation created with ${data.dimensions} dimensions.`,
      });
      
      return { 
        success: true, 
        message: data.message || 'Resume embedding created successfully' 
      };
      
    } catch (error) {
      console.error("Error running EmbeddingAgent:", error);
      
      toast({
        title: "Embedding Generation Error",
        description: `Error creating embedding: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive"
      });
      
      return { 
        success: false, 
        message: `Error running EmbeddingAgent: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }
}

/**
 * Helper function to create and run an EmbeddingAgent instance
 */
export async function createEmbedding(input: EmbeddingInput): Promise<{ success: boolean; message: string }> {
  const agent = new EmbeddingAgent(input);
  return await agent.run();
}
