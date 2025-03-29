
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Calendar, Play, Pause, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import schedulerService, { ScheduledTask } from '@/services/schedulerService';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

const TaskScheduler = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    cronExpression: '*/5 * * * *',
    command: ''
  });

  useEffect(() => {
    // Load tasks when component mounts
    loadTasks();
  }, []);

  const loadTasks = () => {
    const tasks = schedulerService.getTasks();
    setTasks(tasks);
  };

  const handleCreateTask = () => {
    if (!newTask.name || !newTask.command) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide both a task name and command."
      });
      return;
    }
    
    schedulerService.createTask(
      newTask.name,
      newTask.description,
      newTask.cronExpression,
      newTask.command
    );
    
    toast({
      title: "Task scheduled",
      description: `Task "${newTask.name}" has been scheduled successfully.`
    });
    
    // Reset form and close dialog
    setNewTask({
      name: '',
      description: '',
      cronExpression: '*/5 * * * *',
      command: ''
    });
    setIsDialogOpen(false);
    
    // Refresh task list
    loadTasks();
  };
  
  const handleToggleTask = (id: string) => {
    schedulerService.toggleTaskStatus(id);
    loadTasks();
    
    const task = tasks.find(task => task.id === id);
    if (task) {
      toast({
        title: task.isActive ? "Task paused" : "Task resumed",
        description: `Task "${task.name}" has been ${task.isActive ? "paused" : "resumed"}.`
      });
    }
  };
  
  const handleDeleteTask = (id: string) => {
    const task = tasks.find(task => task.id === id);
    
    schedulerService.deleteTask(id);
    loadTasks();
    
    if (task) {
      toast({
        title: "Task deleted",
        description: `Task "${task.name}" has been deleted.`
      });
    }
  };
  
  const formatNextRun = (date: Date | null) => {
    if (!date) return 'Not scheduled';
    return new Date(date).toLocaleString();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Scheduled Tasks</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800">
            <DialogHeader>
              <DialogTitle className="text-white">Create Scheduled Task</DialogTitle>
              <DialogDescription className="text-gray-400">
                Schedule browser commands to run at regular intervals
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="task-name">Task Name</Label>
                <Input
                  id="task-name"
                  placeholder="Daily Google Search"
                  value={newTask.name}
                  onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="task-description">Description (optional)</Label>
                <Input
                  id="task-description"
                  placeholder="Searches Google for daily news"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="task-schedule">Schedule (minutes)</Label>
                <div className="flex gap-2">
                  <Input
                    id="task-schedule"
                    type="number"
                    min="1"
                    placeholder="5"
                    value={newTask.cronExpression.replace(/\D/g, '')}
                    onChange={(e) => {
                      const minutes = e.target.value ? parseInt(e.target.value, 10) : 5;
                      setNewTask({...newTask, cronExpression: `*/${minutes} * * * *`});
                    }}
                    className="bg-gray-800 border-gray-700 w-24"
                  />
                  <span className="flex items-center text-gray-400">minutes</span>
                </div>
                <span className="text-xs text-gray-500">Task will run every X minutes</span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="task-command">Command</Label>
                <Input
                  id="task-command"
                  placeholder="search Google for tech news"
                  value={newTask.command}
                  onChange={(e) => setNewTask({...newTask, command: e.target.value})}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTask}>
                Create Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {tasks.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-400">No scheduled tasks yet</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Create your first task
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <Card key={task.id} className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white flex items-center">
                      {task.name}
                      <Badge 
                        variant={task.isActive ? "default" : "outline"}
                        className="ml-2"
                      >
                        {task.isActive ? 'Active' : 'Paused'}
                      </Badge>
                    </CardTitle>
                    {task.description && (
                      <CardDescription className="text-gray-400 mt-1">
                        {task.description}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-gray-300 text-sm pb-2">
                <div className="flex items-center mb-1">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  Next run: {formatNextRun(task.nextRun)}
                </div>
                <div className="pl-6 text-gray-400 mt-1">
                  Command: "{task.command}"
                </div>
              </CardContent>
              <CardFooter className="pt-2 border-t border-gray-700 flex justify-between">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleToggleTask(task.id)}
                >
                  {task.isActive ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" /> Resume
                    </>
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskScheduler;
