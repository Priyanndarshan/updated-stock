'use client';

import React, { memo } from 'react';
import TradingViewWidget from '@/components/TradingViewWidget';

interface ChartSectionProps {
  symbol: string;
  isLoading?: boolean;
}

// Using memo to prevent unnecessary re-renders when props don't change
const ChartSection = memo(function ChartSection({ symbol, isLoading = false }: ChartSectionProps) {
  return (
    <div className="h-full bg-gray-900 flex flex-col relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center z-10">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="mt-4 text-blue-400">Loading chart...</span>
          </div>
        </div>
      )}
      <div className="flex-grow">
        <TradingViewWidget 
          symbol={symbol} 
          theme="dark" 
          autosize={true}
        />
      </div>
    </div>
  );
});

export default ChartSection; 