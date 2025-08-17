"use client";

import React from 'react';
import StandaloneAddTaskCard from '@/components/dashboard/StandaloneAddTaskCard';

export default function AddTaskPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Task</h1>
        
        <StandaloneAddTaskCard />
      </div>
    </div>
  );
}