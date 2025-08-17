"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Brain, BookOpen, LineChart, Target, CheckCircle, Goal, Newspaper, Percent, DollarSign, Smile } from 'lucide-react';

interface ChecklistItem {
  id: number;
  text: string;
  checked: boolean;
  category: 'Mindset' | 'Preparation' | 'Analysis' | 'Strategy';
  icon: React.ReactNode;
}

const DailyChecklist: React.FC = () => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { 
      id: 1, 
      text: 'Mindset Check: Did you complete 17 minutes of meditation or mental clarity?', 
      checked: false,
      category: 'Mindset',
      icon: <Brain className="h-4 w-4 text-amber-600" />
    },
    { 
      id: 2, 
      text: 'Concept Review: Did you watch previous trade plan videos or review past concepts?', 
      checked: false,
      category: 'Preparation',
      icon: <BookOpen className="h-4 w-4 text-blue-600" />
    },
    { 
      id: 3, 
      text: 'Market Levels: Did you check the previous day\'s high and low?', 
      checked: false,
      category: 'Analysis',
      icon: <LineChart className="h-4 w-4 text-purple-600" />
    },
    { 
      id: 4, 
      text: 'Focused Area: Did you identify today\'s key demand & supply zones?', 
      checked: false,
      category: 'Analysis',
      icon: <Target className="h-4 w-4 text-purple-600" />
    },
    { 
      id: 5, 
      text: 'Trade Decision: Have you decided whether to trade or stay out?', 
      checked: false,
      category: 'Strategy',
      icon: <CheckCircle className="h-4 w-4 text-green-600" />
    },
    { 
      id: 6, 
      text: 'Goal Alignment: Did you review your weekly and income goals?', 
      checked: false,
      category: 'Strategy',
      icon: <Goal className="h-4 w-4 text-green-600" />
    },
    { 
      id: 7, 
      text: 'News & Events: Did you check for any market-moving news?', 
      checked: false,
      category: 'Analysis',
      icon: <Newspaper className="h-4 w-4 text-purple-600" />
    },
    { 
      id: 8, 
      text: 'Percentage Theory: Did you analyze the market\'s demand & supply using % theory?', 
      checked: false,
      category: 'Analysis',
      icon: <Percent className="h-4 w-4 text-purple-600" />
    },
    { 
      id: 9, 
      text: 'Premium Investment: Did you check if there is any investment premium opportunity?', 
      checked: false,
      category: 'Strategy',
      icon: <DollarSign className="h-4 w-4 text-green-600" />
    },
    { 
      id: 10, 
      text: 'Mindset: Are you positive and disciplined before entering the market?', 
      checked: true,
      category: 'Mindset',
      icon: <Smile className="h-4 w-4 text-amber-600" />
    }
  ]);

  const handleCheckboxChange = (id: number) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Mindset':
        return 'text-amber-600';
      case 'Preparation':
        return 'text-blue-600';
      case 'Analysis':
        return 'text-purple-600';
      case 'Strategy':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="text-gray-800 uppercase text-base font-bold">DAILY CHECKLIST</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {checklist.map((item) => (
            <div key={item.id} className="flex items-start space-x-2 pb-2 border-b border-gray-100 last:border-0">
              <Checkbox 
                id={`checkbox-${item.id}`} 
                checked={item.checked}
                onCheckedChange={() => handleCheckboxChange(item.id)}
                className="mt-1"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  {item.icon}
                  <span className={`text-xs font-semibold ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                </div>
                <Label 
                  htmlFor={`checkbox-${item.id}`}
                  className={`text-sm text-gray-800 font-medium cursor-pointer ${item.checked ? 'line-through text-gray-500' : ''}`}
                >
                  {item.text}
                </Label>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-right">
          <p className="text-xs text-gray-500">
            {checklist.filter(item => item.checked).length} of {checklist.length} tasks completed
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyChecklist; 