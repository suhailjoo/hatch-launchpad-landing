
/**
 * Creates a tool configuration for the CrewAI enterprise API
 * that can call a Supabase Edge Function
 */
export function createSupabaseFunctionTool(
  name: string,
  description: string,
  functionName: string
): any {
  return {
    name,
    description,
    // Define as a plain object instead of using the CrewAI Tool class
    callback: async ({ input }: { input: string }) => {
      try {
        console.log(`Calling Supabase function ${functionName} with input:`, input);
        
        // In a real implementation, this would call the Supabase function
        // For now, we'll simulate a successful response
        console.log(`Simulated call to ${functionName} - enterprise edition`);
        
        return JSON.stringify({ 
          success: true, 
          message: `Successfully executed ${functionName} (enterprise simulation)` 
        });
      } catch (error) {
        console.error(`Exception in ${functionName}:`, error);
        return JSON.stringify({ 
          success: false, 
          error: error instanceof Error ? error.message : String(error) 
        });
      }
    }
  };
}
