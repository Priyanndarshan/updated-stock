"use client";

import React from 'react';
import MarketSummary from '@/components/dashboard/MarketSummary';
import TaskList from '@/components/dashboard/TaskList';
import Overview from '@/components/dashboard/Overview';
import { 
  TrendingUp, 
  AlertTriangle, 
  BarChart3, 
  LineChart
} from 'lucide-react';

// Mock market insights data
const marketInsights = [
  {
    title: 'Market Trend',
    description: 'S&P 500 showing bullish momentum with strong support at 4,800 level',
    icon: <TrendingUp className="h-5 w-5 text-green-500" />,
    color: 'bg-green-50 border-green-200'
  },
  {
    title: 'Volatility Alert',
    description: 'VIX index rising above 20, indicating increased market uncertainty',
    icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    color: 'bg-amber-50 border-amber-200'
  },
  {
    title: 'Sector Performance',
    description: 'Technology and Healthcare leading gains, Energy sector lagging',
    icon: <BarChart3 className="h-5 w-5 text-teal-500" />,
    color: 'bg-teal-50 border-teal-200'
  },
  {
    title: 'Economic Indicators',
    description: 'Fed meeting minutes release today at 2:00 PM EST, expect volatility',
    icon: <LineChart className="h-5 w-5 text-purple-500" />,
    color: 'bg-purple-50 border-purple-200'
  }
];

export default function DashboardPage() {
  return (
    <div className="px-4 py-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Trading Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your trading overview for today.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market Summary */}
            <MarketSummary />
            
            {/* Market Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {marketInsights.map((insight, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border ${insight.color} shadow-sm`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">{insight.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{insight.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Overview Stats */}
            <Overview />
          </div>
          
          {/* Sidebar - 1/3 width on large screens */}
          <div className="lg:col-span-1 space-y-6">
            {/* Trading Checklist */}
            <TaskList />
          </div>
        </div>
      </div>
    </div>
  );
} 