"use client";

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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
  Plus,
  Calendar,
  Clock,
  Tag,
  Bell,
  Users,
  Link
} from 'lucide-react';

const StandaloneAddTaskCard: React.FC = () => {
  const [newTask, setNewTask] = useState({
    title: '',
    category: 'Analysis' as 'Preparation' | 'Analysis' | 'Strategy' | 'Mindset',
    priority: 'Medium' as 'Low' | 'Medium' | 'High'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title.trim() === '') return;
    
    // For demonstration purposes, just show an alert
    alert(`New task added: ${newTask.title} (${newTask.category}, ${newTask.priority} priority)`);
    
    // Reset form
    setNewTask({
      title: '',
      category: 'Analysis',
      priority: 'Medium'
    });
  };

  const getCategoryIcon = () => {
    switch (newTask.category) {
      case 'Mindset':
        return <Brain className="h-4 w-4 text-amber-500" />;
      case 'Preparation':
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'Strategy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Analysis':
      default:
        return <LineChart className="h-4 w-4 text-purple-500" />;
    }
  };

  const getCategoryColor = () => {
    switch (newTask.category) {
      case 'Preparation':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'Analysis':
        return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'Strategy':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'Mindset':
        return 'bg-amber-100 text-amber-600 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getPriorityColor = () => {
    switch (newTask.priority) {
      case 'High':
        return 'bg-red-100 text-red-600 border-red-200';
      case 'Medium':
        return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'Low':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <Card className="h-full bg-white border-none shadow-sm overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-transparent">
        <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
          <Plus className="h-5 w-5 mr-2 text-primary" />
          Add New Task
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title" className="text-sm font-medium text-gray-700">
              Task Title
            </Label>
            <Input 
              id="task-title" 
              placeholder="Enter task description" 
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              className="border-gray-200 focus:border-primary focus:ring-primary"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-category" className="text-sm font-medium text-gray-700 flex items-center">
                <Tag className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                Category
              </Label>
              <Select 
                value={newTask.category}
                onValueChange={(value) => setNewTask({...newTask, category: value as any})}
              >
                <SelectTrigger id="task-category" className="border-gray-200">
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
            <div className="space-y-2">
              <Label htmlFor="task-priority" className="text-sm font-medium text-gray-700 flex items-center">
                <Target className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                Priority
              </Label>
              <Select 
                value={newTask.priority}
                onValueChange={(value) => setNewTask({...newTask, priority: value as any})}
              >
                <SelectTrigger id="task-priority" className="border-gray-200">
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
          
          {/* Task Preview */}
          <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Task Preview</h4>
            <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
              <div className="flex items-center gap-1.5 mb-1.5">
                {getCategoryIcon()}
                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${getCategoryColor()}`}>
                  {newTask.category}
                </span>
                {newTask.priority && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${getPriorityColor()}`}>
                    {newTask.priority} Priority
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-800 font-medium">
                {newTask.title || "Your task will appear here"}
              </p>
            </div>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="flex items-center space-x-2 text-xs text-gray-600 p-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
              <Calendar className="h-3.5 w-3.5 text-gray-500" />
              <span>Set due date</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-600 p-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
              <Clock className="h-3.5 w-3.5 text-gray-500" />
              <span>Set reminder</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-600 p-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
              <Bell className="h-3.5 w-3.5 text-gray-500" />
              <span>Notifications</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-600 p-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
              <Users className="h-3.5 w-3.5 text-gray-500" />
              <span>Assign to team</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-600 p-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors col-span-2">
              <Link className="h-3.5 w-3.5 text-gray-500" />
              <span>Add related resources</span>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="border-t border-gray-100 bg-gray-50 px-6 py-3">
        <Button 
          type="submit" 
          onClick={handleSubmit}
          className="w-full bg-primary hover:bg-primary/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StandaloneAddTaskCard; 