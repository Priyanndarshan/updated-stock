'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, BarChart, ArrowDownUp } from 'lucide-react';
import { LiveChartData } from '@/app/Chart/page';

interface StockStatsProps {
  liveData: LiveChartData;
  stockName?: string;
  stockSymbol?: string;
}

export default function StockStats({ 
  liveData, 
  stockName = 'Stock',
  stockSymbol = 'SYM'
}: StockStatsProps) {
  // Check if price change is positive
  const isPositive = liveData.dayChange && !liveData.dayChange.startsWith('-');
  
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {stockName}
            <span className="text-sm text-gray-400">{stockSymbol}</span>
            <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-900/30 text-blue-400">NASDAQ</span>
          </h2>
          <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleTimeString()}</p>
        </div>
        <div className="flex items-center mt-2 sm:mt-0">
          <span className={`text-lg font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            ${liveData.currentPrice || 'N/A'}
          </span>
          <span className={`ml-2 px-2 py-1 rounded ${isPositive ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
            {liveData.dayChange || '0.00'} ({liveData.dayChangePercent || '0.00%'})
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Current Price */}
        <Card className="p-3 bg-gray-800/70 border-gray-700 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs text-gray-400">Current Price</p>
              <p className="text-lg font-bold text-white">${liveData.currentPrice || 'N/A'}</p>
            </div>
            <div className={`p-2 rounded-full ${isPositive ? 'bg-green-900/20' : 'bg-red-900/20'}`}>
              {isPositive ? 
                <TrendingUp className="h-5 w-5 text-green-400" /> : 
                <TrendingDown className="h-5 w-5 text-red-400" />
              }
            </div>
          </div>
        </Card>
        
        {/* Volume */}
        <Card className="p-3 bg-gray-800/70 border-gray-700 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs text-gray-400">Volume</p>
              <p className="text-lg font-bold text-white">{liveData.volume || 'N/A'}</p>
            </div>
            <div className="p-2 rounded-full bg-blue-900/20">
              <BarChart className="h-5 w-5 text-blue-400" />
            </div>
          </div>
        </Card>
        
        {/* Support/Resistance */}
        <Card className="p-3 bg-gray-800/70 border-gray-700 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs text-gray-400">Support/Resistance</p>
              <p className="text-lg font-bold text-white">
                <span className="text-green-400">${liveData.support || 'N/A'}</span>
                <span className="text-gray-400 mx-1">/</span>
                <span className="text-red-400">${liveData.resistance || 'N/A'}</span>
              </p>
            </div>
            <div className="p-2 rounded-full bg-purple-900/20">
              <ArrowDownUp className="h-5 w-5 text-purple-400" />
            </div>
          </div>
        </Card>
        
        {/* Market Trend */}
        <Card className="p-3 bg-gray-800/70 border-gray-700 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs text-gray-400">Market Trend</p>
              <p className="text-lg font-bold">
                <span className={`
                  ${liveData.trend?.toLowerCase().includes('uptrend') ? 'text-green-400' : 
                    liveData.trend?.toLowerCase().includes('downtrend') ? 'text-red-400' : 
                    liveData.trend?.toLowerCase().includes('volatile') ? 'text-yellow-400' : 
                    'text-gray-400'}
                `}>
                  {liveData.trend || 'N/A'}
                </span>
              </p>
            </div>
            <div className={`p-2 rounded-full 
              ${liveData.trend?.toLowerCase().includes('uptrend') ? 'bg-green-900/20' : 
                liveData.trend?.toLowerCase().includes('downtrend') ? 'bg-red-900/20' : 
                liveData.trend?.toLowerCase().includes('volatile') ? 'bg-yellow-900/20' : 
                'bg-gray-700/20'}
            `}>
              <TrendingUp className={`h-5 w-5 
                ${liveData.trend?.toLowerCase().includes('uptrend') ? 'text-green-400' : 
                  liveData.trend?.toLowerCase().includes('downtrend') ? 'text-red-400' : 
                  liveData.trend?.toLowerCase().includes('volatile') ? 'text-yellow-400' : 
                  'text-gray-400'}
              `} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 