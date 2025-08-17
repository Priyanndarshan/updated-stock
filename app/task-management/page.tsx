"use client";

import React, { useState } from 'react';
import AddTaskCard from '@/components/dashboard/AddTaskCard';
import TaskList from '@/components/dashboard/TaskList';
import { Brain, BookOpen, LineChart, CheckCircle } from 'lucide-react';

export default function TaskManagementPage() {
  const [tasks, setTasks] = useState<any[]>([]);

  const handleAddTask = (task: {
    title: string;
    category: 'Preparation' | 'Analysis' | 'Strategy' | 'Mindset';
    priority: 'Low' | 'Medium' | 'High';
  }) => {
    // In a real app, you would add this task to your state or database
    console.log('New task added:', task);
    
    // For demonstration purposes, we'll just show an alert
    alert(`New task added: ${task.title} (${task.category}, ${task.priority} priority)`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Task Management</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column - Add Task Card */}
          <div>
            <AddTaskCard onAddTask={handleAddTask} />
          </div>
          
          {/* Right column - Task List */}
          <div>
            <TaskList />
          </div>
        </div>
        
        {/* Design Explanation */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Design Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Intuitive Interface</h3>
                  <p className="text-sm text-gray-600">Clean layout with clear visual hierarchy for easy task creation.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <LineChart className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Live Preview</h3>
                  <p className="text-sm text-gray-600">Real-time task preview helps users visualize how their task will appear.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Consistent Styling</h3>
                  <p className="text-sm text-gray-600">Matches the application's color scheme and design language.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Contextual Features</h3>
                  <p className="text-sm text-gray-600">Additional features like due dates and reminders enhance task management.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 