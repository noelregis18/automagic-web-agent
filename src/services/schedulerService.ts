import { BrowserAction } from './browserService';

export type ScheduledTask = {
  id: string;
  name: string;
  description: string;
  cronExpression: string;
  command: string;
  isActive: boolean;
  lastRun: Date | null;
  nextRun: Date | null;
  createdAt: Date;
};

export type TaskResult = {
  taskId: string;
  success: boolean;
  message: string;
  actions: BrowserAction[];
  timestamp: Date;
};

class SchedulerService {
  private tasks: ScheduledTask[] = [];
  private taskResults: Record<string, TaskResult[]> = {};
  private timers: Record<string, number> = {};
  
  constructor() {
    // Load tasks from localStorage on initialization
    this.loadTasks();
    
    // Start all active tasks
    this.startAllActiveTasks();
  }
  
  private loadTasks(): void {
    try {
      const savedTasks = localStorage.getItem('scheduledTasks');
      if (savedTasks) {
        this.tasks = JSON.parse(savedTasks);
        // Convert string dates back to Date objects
        this.tasks.forEach(task => {
          task.createdAt = new Date(task.createdAt);
          task.lastRun = task.lastRun ? new Date(task.lastRun) : null;
          task.nextRun = task.nextRun ? new Date(task.nextRun) : null;
        });
      }
    } catch (error) {
      console.error('Failed to load scheduled tasks:', error);
      this.tasks = [];
    }
  }
  
  private saveTasks(): void {
    try {
      localStorage.setItem('scheduledTasks', JSON.stringify(this.tasks));
    } catch (error) {
      console.error('Failed to save scheduled tasks:', error);
    }
  }
  
  createTask(
    name: string, 
    description: string, 
    cronExpression: string, 
    command: string
  ): ScheduledTask {
    const task: ScheduledTask = {
      id: this.generateId(),
      name,
      description,
      cronExpression,
      command,
      isActive: true,
      lastRun: null,
      nextRun: this.calculateNextRun(cronExpression),
      createdAt: new Date()
    };
    
    this.tasks.push(task);
    this.saveTasks();
    this.startTask(task);
    
    return task;
  }
  
  getTasks(): ScheduledTask[] {
    return [...this.tasks];
  }
  
  getTaskById(id: string): ScheduledTask | undefined {
    return this.tasks.find(task => task.id === id);
  }
  
  updateTask(id: string, updates: Partial<ScheduledTask>): ScheduledTask | null {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      return null;
    }
    
    // Stop task if it's running
    this.stopTask(id);
    
    // Update task
    const updatedTask = {
      ...this.tasks[taskIndex],
      ...updates
    };
    
    // Recalculate next run if cron expression changed
    if (updates.cronExpression) {
      updatedTask.nextRun = this.calculateNextRun(updatedTask.cronExpression);
    }
    
    this.tasks[taskIndex] = updatedTask;
    this.saveTasks();
    
    // Restart task if it's active
    if (updatedTask.isActive) {
      this.startTask(updatedTask);
    }
    
    return updatedTask;
  }
  
  deleteTask(id: string): boolean {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      return false;
    }
    
    // Stop task if it's running
    this.stopTask(id);
    
    // Remove task
    this.tasks.splice(taskIndex, 1);
    this.saveTasks();
    
    return true;
  }
  
  toggleTaskStatus(id: string): ScheduledTask | null {
    const task = this.getTaskById(id);
    if (!task) {
      return null;
    }
    
    const updatedTask = this.updateTask(id, { isActive: !task.isActive });
    return updatedTask;
  }
  
  private startAllActiveTasks(): void {
    this.tasks.forEach(task => {
      if (task.isActive) {
        this.startTask(task);
      }
    });
  }
  
  private startTask(task: ScheduledTask): void {
    // Stop existing timer if it exists
    this.stopTask(task.id);
    
    // Simple implementation for demonstration purposes
    // In a real app, use a proper cron parser
    const intervalMs = this.getIntervalFromCron(task.cronExpression);
    
    // Create new timer
    this.timers[task.id] = window.setInterval(() => {
      this.executeTask(task);
    }, intervalMs);
    
    console.log(`Task "${task.name}" scheduled to run every ${intervalMs / 1000} seconds`);
  }
  
  private stopTask(id: string): void {
    if (this.timers[id]) {
      window.clearInterval(this.timers[id]);
      delete this.timers[id];
    }
  }
  
  async executeTask(task: ScheduledTask): Promise<TaskResult> {
    console.log(`Executing task: ${task.name}`);
    
    // Update task's last run time
    const taskIndex = this.tasks.findIndex(t => t.id === task.id);
    if (taskIndex !== -1) {
      this.tasks[taskIndex].lastRun = new Date();
      this.tasks[taskIndex].nextRun = this.calculateNextRun(task.cronExpression);
      this.saveTasks();
    }
    
    // This would call the browserService in a real implementation
    // For now, we'll just simulate a successful execution
    const result: TaskResult = {
      taskId: task.id,
      success: true,
      message: `Task "${task.name}" executed successfully`,
      actions: [
        {
          id: this.generateId(),
          type: 'navigation',
          description: `Automated task: ${task.name}`,
          status: 'completed',
          timestamp: new Date()
        }
      ],
      timestamp: new Date()
    };
    
    // Store result
    if (!this.taskResults[task.id]) {
      this.taskResults[task.id] = [];
    }
    this.taskResults[task.id].push(result);
    
    // Trim results to keep only the last 10
    if (this.taskResults[task.id].length > 10) {
      this.taskResults[task.id] = this.taskResults[task.id].slice(-10);
    }
    
    return result;
  }
  
  getTaskResults(taskId: string): TaskResult[] {
    return this.taskResults[taskId] || [];
  }
  
  private calculateNextRun(cronExpression: string): Date {
    // Simple implementation that just adds the interval to the current time
    // In a real app, use a proper cron parser/calculator
    const now = new Date();
    const intervalMs = this.getIntervalFromCron(cronExpression);
    const nextRun = new Date(now.getTime() + intervalMs);
    return nextRun;
  }
  
  private getIntervalFromCron(cronExpression: string): number {
    // Very simple implementation for demo purposes
    // Just extract numbers from the cron expression and use as minutes
    // In a real app, use a proper cron parser
    const matches = cronExpression.match(/\d+/g);
    const minutes = matches && matches.length > 0 ? parseInt(matches[0], 10) : 5;
    return minutes * 60 * 1000;
  }
  
  private generateId(): string {
    return Math.random().toString(36).substring(2, 11);
  }
}

export default new SchedulerService();
