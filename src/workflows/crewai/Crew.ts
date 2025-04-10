
import { Crew as CrewAICrew, Process, Task } from 'crewai';
import { BaseAgent } from './BaseAgent';

/**
 * Crew: Orchestrates multiple agents to work together on complex tasks
 */
export class Crew {
  private name: string;
  private description: string;
  private agents: BaseAgent[];
  private tasks: Task[];
  private verbose: boolean;
  
  constructor({
    name,
    description,
    agents = [],
    tasks = [],
    verbose = true
  }: {
    name: string;
    description: string;
    agents?: BaseAgent[];
    tasks?: Task[];
    verbose?: boolean;
  }) {
    this.name = name;
    this.description = description;
    this.agents = agents;
    this.tasks = tasks;
    this.verbose = verbose;
  }
  
  /**
   * Add an agent to the crew
   */
  public addAgent(agent: BaseAgent): void {
    this.agents.push(agent);
  }
  
  /**
   * Add a task to the crew
   */
  public addTask(task: Task): void {
    this.tasks.push(task);
  }
  
  /**
   * Execute all tasks with the crew of agents
   */
  public async execute(): Promise<any> {
    try {
      console.log(`Executing crew "${this.name}" with ${this.agents.length} agents and ${this.tasks.length} tasks`);
      
      // Convert BaseAgent instances to CrewAI Agent instances
      const crewAgents = this.agents.map(agent => agent.createCrewAgent());
      
      // Create the CrewAI crew
      const crew = new CrewAICrew({
        agents: crewAgents,
        tasks: this.tasks,
        verbose: this.verbose,
        process: Process.Sequential
      });
      
      // Execute the crew
      const result = await crew.kickoff();
      
      console.log(`Crew "${this.name}" execution completed`);
      return result;
      
    } catch (error) {
      console.error(`Error executing crew "${this.name}":`, error);
      throw error;
    }
  }
}
