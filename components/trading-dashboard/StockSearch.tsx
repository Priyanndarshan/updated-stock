'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, TrendingUp, Star } from 'lucide-react';

interface StockSearchProps {
  inputSymbol: string;
  setInputSymbol: (symbol: string) => void;
  handleSearch: () => void;
  setStockSymbol: (symbol: string) => void;
  setDisplaySymbol: (symbol: string) => void;
  isLoading?: boolean;
}

export default function StockSearch({
  inputSymbol,
  setInputSymbol,
  handleSearch,
  setStockSymbol,
  setDisplaySymbol,
  isLoading = false
}: StockSearchProps) {
  
  // Popular stocks for quick selection
  const popularStocks = [
    { symbol: 'AAPL', name: 'Apple' },
    { symbol: 'MSFT', name: 'Microsoft' },
    { symbol: 'GOOG', name: 'Google' },
    { symbol: 'AMZN', name: 'Amazon' },
    { symbol: 'TSLA', name: 'Tesla' }
  ];
  
  // Function to quickly select a stock
  const selectStock = (symbol: string) => {
    setInputSymbol(symbol);
    setStockSymbol(symbol);
    setDisplaySymbol(`NASDAQ:${symbol}`);
  };
  
  return (
    <div className="flex flex-col space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Enter stock symbol (e.g., AAPL, GOOG)"
            value={inputSymbol}
            onChange={(e) => setInputSymbol(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pr-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 rounded-md h-10"
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        <Button 
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Loading...
            </>
          ) : (
            'Search'
          )}
        </Button>
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-gray-400" />
          <span className="text-xs font-medium text-gray-400">Popular Tickers</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {popularStocks.map((stock) => (
            <Button
              key={stock.symbol}
              onClick={() => selectStock(stock.symbol)}
              variant="outline"
              size="sm"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white h-8"
              disabled={isLoading}
            >
              {stock.symbol}
              <span className="ml-1 text-xs text-gray-400">{stock.name}</span>
            </Button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center">
        <Star className="h-4 w-4 text-yellow-500 mr-2" />
        <span className="text-xs text-gray-400">Pro Tip: Search for any stock symbol, click on indicators to see detailed analysis</span>
      </div>
    </div>
  );
} 