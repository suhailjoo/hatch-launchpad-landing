
import { Tool } from 'crewai';
import { supabase } from "@/integrations/supabase/client";

/**
 * Creates a tool that can call a Supabase Edge Function
 */
export function createSupabaseFunctionTool(
  name: string,
  description: string,
  functionName: string
): Tool {
  return new Tool({
    name,
    description,
    async callback({ input }) {
      try {
        console.log(`Calling Supabase function ${functionName} with input:`, input);
        
        const { data, error } = await supabase.functions.invoke(functionName, {
          body: JSON.parse(input)
        });
        
        if (error) {
          console.error(`Error calling ${functionName}:`, error);
          return JSON.stringify({ success: false, error: error.message });
        }
        
        return JSON.stringify(data);
      } catch (error) {
        console.error(`Exception in ${functionName}:`, error);
        return JSON.stringify({ 
          success: false, 
          error: error instanceof Error ? error.message : String(error) 
        });
      }
    }
  });
}
