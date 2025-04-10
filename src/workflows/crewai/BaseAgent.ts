
import { Agent as CrewAgent, Tool } from 'crewai';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

/**
 * BaseAgent: Abstract base class for all CrewAI agents in the application
 */
export abstract class BaseAgent {
  protected name: string;
  protected description: string;
  protected goal: string;
  protected tools: Tool[];
  
  constructor({
    name,
    description,
    goal,
    tools = []
  }: {
    name: string;
    description: string;
    goal: string;
    tools?: Tool[];
  }) {
    this.name = name;
    this.description = description;
    this.goal = goal;
    this.tools = tools;
  }
  
  /**
   * Creates a CrewAI agent instance with the configured properties
   */
  public createCrewAgent(): CrewAgent {
    return new CrewAgent({
      name: this.name,
      description: this.description,
      goal: this.goal,
      allowDelegation: false,
      verbose: true,
      tools: this.tools
    });
  }
  
  /**
   * Shows a toast notification
   */
  protected showToast(title: string, description: string, variant: 'default' | 'destructive' = 'default') {
    toast({
      title,
      description,
      variant
    });
  }
  
  /**
   * Makes a Supabase function call
   */
  protected async callEdgeFunction(functionName: string, payload: any): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: payload
      });
      
      if (error) {
        console.error(`Error calling ${functionName}:`, error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error(`Exception in ${functionName}:`, error);
      throw error;
    }
  }
  
  /**
   * Abstract method that all agents must implement
   */
  public abstract execute(input: any): Promise<any>;
}
