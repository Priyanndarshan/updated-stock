"use client";

import React from 'react';

export default function MarketStatusBar() {
  return (
    <div className="bg-gray-50 border-b border-gray-200 py-1 px-4 text-xs overflow-x-auto sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between overflow-x-auto">
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">S&P 500</span>
            <span className="font-medium text-green-600">4,927.11</span>
            <span className="text-green-600 ml-1">+0.38%</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">NASDAQ</span>
            <span className="font-medium text-green-600">15,628.04</span>
            <span className="text-green-600 ml-1">+0.52%</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">DOW</span>
            <span className="font-medium text-red-600">38,671.69</span>
            <span className="text-red-600 ml-1">-0.14%</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">VIX</span>
            <span className="font-medium text-amber-600">18.62</span>
            <span className="text-amber-600 ml-1">+5.21%</span>
          </div>
        </div>
        <div className="flex items-center whitespace-nowrap">
          <span className="text-gray-600 mr-2">Market Status:</span>
          <span className="text-green-600 font-medium flex items-center">
            <span className="h-2 w-2 bg-green-500 rounded-full mr-1.5"></span>
            Open
          </span>
          <span className="text-gray-600 mx-2">|</span>
          <span className="text-gray-600">Last Updated: 10:45 AM EST</span>
        </div>
      </div>
    </div>
  );
} 