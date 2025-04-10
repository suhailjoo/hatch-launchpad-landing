
import { Crew as CrewAICrew, Agent, Task } from 'crewai';

/**
 * Configuration for creating a Crew
 */
export interface CrewConfig {
  name: string;
  description: string;
  agents: Agent[];
  tasks: Task[];
}

/**
 * Crew: A wrapper around CrewAI's Crew class
 */
export class Crew {
  private config: CrewConfig;
  private crew: CrewAICrew;
  
  constructor(config: CrewConfig) {
    this.config = config;
    this.crew = new CrewAICrew({
      agents: config.agents,
      tasks: config.tasks,
      verbose: true
    });
  }
  
  /**
   * Executes the crew's tasks
   */
  public async execute(): Promise<void> {
    try {
      console.log(`Executing crew: ${this.config.name}`);
      await this.crew.run();
    } catch (error) {
      console.error(`Error executing crew: ${error}`);
      throw error;
    }
  }
}
