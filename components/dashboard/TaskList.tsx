"use client";

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Brain,
  BookOpen,
  LineChart,
  Target,
  CheckCircle,
  Goal,
  Newspaper,
  Percent,
  DollarSign,
  Smile,
  Filter,
  Plus
} from 'lucide-react';

interface TradingTask {
  id: string;
  title: string;
  category: 'Preparation' | 'Analysis' | 'Strategy' | 'Mindset';
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High';
  icon: React.ReactNode;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<TradingTask[]>([
    { 
      id: 'TASK-001', 
      title: 'Complete 17 minutes of meditation or mental clarity exercise', 
      category: 'Mindset', 
      completed: false, 
      priority: 'High',
      icon: <Brain className="h-4 w-4 text-amber-500" />
    },
    { 
      id: 'TASK-002', 
      title: 'Review previous trade plan videos or past trading concepts', 
      category: 'Preparation', 
      completed: false, 
      priority: 'Medium',
      icon: <BookOpen className="h-4 w-4 text-blue-500" />
    },
    { 
      id: 'TASK-003', 
      title: 'Check previous day\'s high and low market levels', 
      category: 'Analysis', 
      completed: true, 
      priority: 'High',
      icon: <LineChart className="h-4 w-4 text-purple-500" />
    },
    { 
      id: 'TASK-004', 
      title: 'Identify today\'s key demand & supply zones', 
      category: 'Analysis', 
      completed: false, 
      priority: 'High',
      icon: <Target className="h-4 w-4 text-purple-500" />
    },
    { 
      id: 'TASK-005', 
      title: 'Decide whether to trade or stay out of the market today', 
      category: 'Strategy', 
      completed: false, 
      priority: 'High',
      icon: <CheckCircle className="h-4 w-4 text-green-500" />
    },
    { 
      id: 'TASK-006', 
      title: 'Review weekly and income trading goals', 
      category: 'Strategy', 
      completed: false, 
      priority: 'Medium',
      icon: <Goal className="h-4 w-4 text-green-500" />
    },
    { 
      id: 'TASK-007', 
      title: 'Check for any market-moving news or events', 
      category: 'Analysis', 
      completed: true, 
      priority: 'Medium',
      icon: <Newspaper className="h-4 w-4 text-purple-500" />
    },
    { 
      id: 'TASK-008', 
      title: 'Analyze market\'s demand & supply using percentage theory', 
      category: 'Analysis', 
      completed: false, 
      priority: 'Medium',
      icon: <Percent className="h-4 w-4 text-purple-500" />
    },
    { 
      id: 'TASK-009', 
      title: 'Check for any investment premium opportunities', 
      category: 'Strategy', 
      completed: false, 
      priority: 'Low',
      icon: <DollarSign className="h-4 w-4 text-green-500" />
    },
    { 
      id: 'TASK-010', 
      title: 'Ensure positive and disciplined mindset before entering the market', 
      category: 'Mindset', 
      completed: true, 
      priority: 'High',
      icon: <Smile className="h-4 w-4 text-amber-500" />
    },
  ]);

  const [filter, setFilter] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    category: 'Analysis' as TradingTask['category'],
    priority: 'Medium' as TradingTask['priority']
  });

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleAddTask = () => {
    if (newTask.title.trim() === '') return;
    
    // Generate a new task ID
    const newId = `TASK-${(tasks.length + 1).toString().padStart(3, '0')}`;
    
    // Get the appropriate icon based on category
    let icon;
    switch (newTask.category) {
      case 'Mindset':
        icon = <Brain className="h-4 w-4 text-amber-500" />;
        break;
      case 'Preparation':
        icon = <BookOpen className="h-4 w-4 text-blue-500" />;
        break;
      case 'Strategy':
        icon = <CheckCircle className="h-4 w-4 text-green-500" />;
        break;
      case 'Analysis':
      default:
        icon = <LineChart className="h-4 w-4 text-purple-500" />;
        break;
    }
    
    // Create the new task
    const taskToAdd: TradingTask = {
      id: newId,
      title: newTask.title,
      category: newTask.category,
      priority: newTask.priority,
      completed: false,
      icon: icon
    };
    
    // Add the new task to the list
    setTasks([...tasks, taskToAdd]);
    
    // Reset the form
    setNewTask({
      title: '',
      category: 'Analysis',
      priority: 'Medium'
    });
    
    // Close the dialog
    setIsDialogOpen(false);
  };

  const filteredTasks = filter 
    ? tasks.filter(task => task.category === filter)
    : tasks;

  const completedCount = tasks.filter(task => task.completed).length;
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Preparation':
        return 'bg-blue-100 text-blue-600';
      case 'Analysis':
        return 'bg-purple-100 text-purple-600';
      case 'Strategy':
        return 'bg-green-100 text-green-600';
      case 'Mindset':
        return 'bg-amber-100 text-amber-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Card className="h-full bg-white border-none shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold text-gray-800">Daily Trading Checklist</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs border-gray-200 bg-white text-gray-600 hover:bg-gray-50" onClick={() => setFilter(null)}>
            All
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs border-gray-200 bg-white text-gray-600 hover:bg-gray-50" onClick={() => setFilter('Mindset')}>
            Mindset
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs border-gray-200 bg-white text-gray-600 hover:bg-gray-50" onClick={() => setFilter('Analysis')}>
            Analysis
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div 
              key={task.id} 
              className="flex items-start space-x-3 py-2 border-b border-gray-100 last:border-0"
            >
              <Checkbox 
                id={task.id} 
                checked={task.completed}
                onCheckedChange={() => handleToggleTask(task.id)}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  {task.icon}
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${getCategoryColor(task.category)}`}>
                    {task.category}
                  </span>
                  {task.priority === 'High' && (
                    <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                      High Priority
                    </span>
                  )}
                </div>
                <label 
                  htmlFor={task.id}
                  className={`text-sm text-gray-800 font-medium cursor-pointer ${task.completed ? 'line-through text-gray-400' : ''}`}
                >
                  {task.title}
                </label>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {completedCount} of {tasks.length} tasks completed
          </p>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs border-gray-200 bg-white text-gray-600 hover:bg-gray-50">
                <Plus className="h-3 w-3 mr-1" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>
                  Create a new task for your trading checklist.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="task-title">Task Title</Label>
                  <Input 
                    id="task-title" 
                    placeholder="Enter task description" 
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="task-category">Category</Label>
                    <Select 
                      value={newTask.category}
                      onValueChange={(value) => setNewTask({...newTask, category: value as TradingTask['category']})}
                    >
                      <SelectTrigger id="task-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Analysis">Analysis</SelectItem>
                        <SelectItem value="Strategy">Strategy</SelectItem>
                        <SelectItem value="Preparation">Preparation</SelectItem>
                        <SelectItem value="Mindset">Mindset</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="task-priority">Priority</Label>
                    <Select 
                      value={newTask.priority}
                      onValueChange={(value) => setNewTask({...newTask, priority: value as TradingTask['priority']})}
                    >
                      <SelectTrigger id="task-priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddTask}>Add Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskList;