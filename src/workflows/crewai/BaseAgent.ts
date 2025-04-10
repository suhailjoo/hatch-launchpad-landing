
import { toast } from "@/components/ui/use-toast";

/**
 * BaseAgent: Foundation class for all CrewAI agents
 * 
 * Note: This implementation is compatible with the CrewAI enterprise edition
 */
export interface BaseAgentConfig {
  name: string;
  description: string;
  goal: string;
  tools?: any[];
}

export class BaseAgent {
  private config: BaseAgentConfig;
  
  constructor(config: BaseAgentConfig) {
    this.config = config;
  }
  
  /**
   * Creates an agent configuration object for the CrewAI enterprise API
   */
  public createCrewAgent(): any {
    return {
      name: this.config.name,
      description: this.config.description,
      goal: this.config.goal,
      tools: this.config.tools || [],
      verbose: true
    };
  }
  
  /**
   * Shows a toast notification
   */
  protected showToast(
    title: string, 
    description: string, 
    variant: "default" | "destructive" = "default"
  ): void {
    toast({
      title,
      description,
      variant
    });
  }
}
