
import { toast } from "@/components/ui/use-toast";

/**
 * BaseAgent: Foundation class for all custom AI agents
 */
export interface BaseAgentConfig {
  name: string;
  description: string;
  goal: string;
}

export class BaseAgent {
  protected config: BaseAgentConfig;
  
  constructor(config: BaseAgentConfig) {
    this.config = config;
  }
  
  /**
   * Validate input parameters
   */
  protected validateInput(input: any, requiredFields: string[]): boolean {
    for (const field of requiredFields) {
      if (!input[field]) {
        console.error(`Missing required field: ${field}`);
        return false;
      }
    }
    return true;
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
  
  /**
   * Log agent activity
   */
  protected log(message: string): void {
    console.log(`[${this.config.name}] ${message}`);
  }
}
