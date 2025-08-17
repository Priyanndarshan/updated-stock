'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LiveChartProvider, useLiveChartData } from '@/app/Chart/page';
import { ChatProvider, useChat } from '@/components/ChatContext';
import { fetchStockDetails, formatStockData } from '@/services/stockDataService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, X, Home, BarChart4, Newspaper, Settings, HelpCircle, TrendingUp, LogOut, MessageSquare, Users, ChevronRight, Star, Video, Download, Calendar } from 'lucide-react';
import Link from 'next/link';

// Import our components
import ChartSection from '@/components/trading-dashboard/ChartSection';
import ChatSection from '@/components/trading-dashboard/ChatSection';

function TradingDashboardContent() {
  const { liveData, updateLiveData } = useLiveChartData();
  const { messages } = useChat(); // Add this to listen for chat messages
  const [stockSymbol, setStockSymbol] = useState('GOOG');
  const [inputSymbol, setInputSymbol] = useState('GOOG');
  const [displaySymbol, setDisplaySymbol] = useState('NASDAQ:GOOG');
  const [stockName, setStockName] = useState('Alphabet Inc.');
  const [isLoading, setIsLoading] = useState(false);
  const initialLoadDone = useRef(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const lastUpdateTime = useRef(Date.now());
  const refreshIntervalMs = 30000; // Refresh data every 30 seconds if needed
  
  // Prepare analysis data from live chart data
  const analysis = {
    stockSymbol: stockSymbol,
    stockName: stockName,
    currentPrice: liveData.currentPrice,
    volume: liveData.volume,
    support: liveData.support,
    resistance: liveData.resistance,
    dayChange: liveData.dayChange,
    dayChangePercent: liveData.dayChangePercent,
    trend: liveData.trend,
    rawData: liveData.rawData || null, // Pass the complete raw data from the API
    timeframe: "daily", // Add timeframe information
    lastUpdated: liveData.timestamp || new Date().toISOString(),
    
    // Core price data
    marketOpen: liveData.marketOpen || "N/A",
    
    // Fundamental data
    marketCap: liveData.marketCap || "N/A",
    peRatio: liveData.peRatio || "N/A",
    dividendYield: liveData.dividendYield || "N/A",
    forwardPE: liveData.forwardPE || "N/A",
    priceToBook: liveData.priceToBook || "N/A",
    beta: liveData.beta || "N/A",
    
    // Technical indicators
    fiftyDayAverage: liveData.fiftyDayAverage || "N/A",
    twoHundredDayAverage: liveData.twoHundredDayAverage || "N/A",
    rsi: liveData.rsi || "N/A",
    macd: liveData.macd || "N/A",
    macdSignal: liveData.macdSignal || "N/A",
    
    // Performance metrics
    weekChange: liveData.weekChange || "N/A",
    monthChange: liveData.monthChange || "N/A",
    
    // Volume metrics
    averageVolume10Day: liveData.averageVolume10Day || "N/A",
    averageVolume3Month: liveData.averageVolume3Month || "N/A",
    
    // Analyst data
    targetPrice: liveData.targetPrice || "N/A",
    analystRating: liveData.analystRating || "N/A"
  };

  // Function to handle stock symbol search - only fetches data when explicitly triggered
  const handleSearch = () => {
    if (inputSymbol.trim() === '') return;
    
    const newSymbol = inputSymbol.trim().toUpperCase();
    if (newSymbol !== stockSymbol) {
      setStockSymbol(newSymbol);
      setDisplaySymbol(`NASDAQ:${newSymbol}`);
      fetchStockData(newSymbol);
    }
  };

  // Function to quickly select a stock
  const selectStock = (symbol: string) => {
    if (symbol !== stockSymbol) {
      setInputSymbol(symbol);
      setStockSymbol(symbol);
      setDisplaySymbol(`NASDAQ:${symbol}`);
      fetchStockData(symbol);
    }
  };

  // Separate function to fetch stock data - memoized with useCallback
  const fetchStockData = useCallback(async (symbol: string) => {
    try {
      setIsLoading(true);
      const data = await fetchStockDetails(symbol);
      
      // Update stock name if available
      if (data.shortName || data.longName) {
        setStockName(data.longName || data.shortName);
      }
      
      // Format and update chart data
      const formattedData = formatStockData(data, symbol);
      updateLiveData(formattedData);
      
      // Update last refresh time
      lastUpdateTime.current = Date.now();
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [updateLiveData, setStockName, setIsLoading]);

  // Load initial data only once when component mounts
  useEffect(() => {
    if (!initialLoadDone.current) {
      fetchStockData(stockSymbol);
      initialLoadDone.current = true;
    }
  }, []);

  // Effect to refresh data periodically if the user is active in the chat
  useEffect(() => {
    // When new messages are added (user is active), check if we need to refresh data
    const timeSinceLastUpdate = Date.now() - lastUpdateTime.current;
    
    // If it's been more than the refresh interval since the last update, fetch fresh data
    if (timeSinceLastUpdate > refreshIntervalMs) {
      console.log(`Refreshing stock data for ${stockSymbol} after chat activity`);
      fetchStockData(stockSymbol);
    }
  }, [messages, stockSymbol, refreshIntervalMs, fetchStockData]); // Include all dependencies

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isSidebarOpen && !target.closest('#sidebar') && !target.closest('#menu-button')) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-900 text-white">
      {/* Dark-themed Sidebar */}
      <div 
        id="sidebar" 
        className={`fixed top-0 left-0 h-full bg-[#111827] border-r border-gray-800/60 w-64 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out z-50 shadow-xl overflow-hidden`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-800/80 bg-gradient-to-r from-gray-900 to-[#111827]">
          <div className="text-xl font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
              <span className="text-white font-bold">PT</span>
            </div>
            <span>Roar AI</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-400 hover:text-white focus:outline-none hover:bg-gray-800/50 p-1 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        <nav className="px-3 py-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 100px)" }}>
          <ul className="space-y-1">
            <li>
              <Link 
                href="/dashboard" 
                className="flex items-center gap-3 text-gray-300 hover:text-white py-2 px-3 rounded-md hover:bg-gray-800/50 transition-colors"
              >
                <Home size={18} className="text-gray-400" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/portfolio" 
                className="flex items-center gap-3 text-gray-300 hover:text-white py-2 px-3 rounded-md hover:bg-gray-800/50 transition-colors"
              >
                <BarChart4 size={18} className="text-gray-400" />
                <span>Portfolio</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/chart-with-chat" 
                className="flex items-center gap-3 text-white py-2 px-3 rounded-md font-medium bg-gradient-to-r from-blue-900/40 to-gray-800/40 border border-blue-800/30"
              >
                <MessageSquare size={18} className="text-blue-400" />
                <span>Market Chat</span>
              </Link>
            </li>
            <li>
              <div 
                className="flex items-center justify-between gap-3 text-gray-300 hover:text-white py-2 px-3 rounded-md hover:bg-gray-800/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Users size={18} className="text-gray-400" />
                  <span>PET Zone</span>
                </div>
                <ChevronRight size={16} className="text-gray-500" />
              </div>
            </li>
            <li>
              <Link 
                href="/premium" 
                className="flex items-center gap-3 text-gray-300 hover:text-white py-2 px-3 rounded-md hover:bg-gray-800/50 transition-colors"
              >
                <Star size={18} className="text-gray-400" />
                <span>Invest Premium</span>
              </Link>
            </li>
            <li>
              <div 
                className="flex items-center justify-between gap-3 text-gray-300 hover:text-white py-2 px-3 rounded-md hover:bg-gray-800/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Video size={18} className="text-gray-400" />
                  <span>Videos</span>
                </div>
                <ChevronRight size={16} className="text-gray-500" />
              </div>
            </li>
            <li>
              <Link 
                href="/meetings" 
                className="flex items-center gap-3 text-gray-300 hover:text-white py-2 px-3 rounded-md hover:bg-gray-800/50 transition-colors"
              >
                <Calendar size={18} className="text-gray-400" />
                <span>Meetings</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/downloads" 
                className="flex items-center gap-3 text-gray-300 hover:text-white py-2 px-3 rounded-md hover:bg-gray-800/50 transition-colors"
              >
                <Download size={18} className="text-gray-400" />
                <span>Downloads</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/help" 
                className="flex items-center gap-3 text-gray-300 hover:text-white py-2 px-3 rounded-md hover:bg-gray-800/50 transition-colors"
              >
                <HelpCircle size={18} className="text-gray-400" />
                <span>How We Help</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Minimal header with hamburger menu and stock search */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900 h-[42px]">
        <div className="flex items-center gap-3">
          <button 
            id="menu-button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="text-gray-400 hover:text-white focus:outline-none hover:bg-gray-800 p-1.5 rounded-md transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu size={20} />
          </button>
          <div className="text-lg font-bold text-white flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600/20 flex items-center justify-center">
              <span className="text-white font-bold text-xs">PT</span>
            </div>
            <span>Roar AI</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Stock symbol..."
              value={inputSymbol}
              onChange={(e) => setInputSymbol(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-32 md:w-48 h-8 bg-gray-800 border-gray-700 text-white placeholder-gray-400 text-sm rounded-md"
              disabled={isLoading}
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <Search className="h-3.5 w-3.5 text-gray-400" />
            </div>
          </div>
          
          <Button 
            onClick={handleSearch}
            size="sm"
            className="h-8 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            Go
          </Button>
          
          <div className="hidden md:flex gap-1 ml-2">
            <Button 
              onClick={() => selectStock('AAPL')} 
              size="sm" 
              variant="outline"
              className="h-7 px-2 py-0 text-xs border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              AAPL
            </Button>
            <Button 
              onClick={() => selectStock('MSFT')} 
              size="sm" 
              variant="outline"
              className="h-7 px-2 py-0 text-xs border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              MSFT
            </Button>
            <Button 
              onClick={() => selectStock('GOOG')} 
              size="sm" 
              variant="outline"
              className="h-7 px-2 py-0 text-xs border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              GOOG
            </Button>
          </div>
        </div>
      </div>
      
      {/* Overlay when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" 
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      
      {/* Main Content Area with Chart and Chat - exact height calculation */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 overflow-hidden" style={{ height: "calc(100vh - 42px)" }}>
        {/* Chart Section - Takes 2/3 of the width on large screens */}
        <div className="lg:col-span-2 h-full overflow-hidden">
          <ChartSection 
            symbol={displaySymbol} 
            isLoading={isLoading}
          />
        </div>
        
        {/* Chat Section - Takes 1/3 of the width on large screens */}
        <div className="lg:col-span-1 h-full overflow-hidden border-l border-gray-800">
          <ChatSection analysis={analysis} />
        </div>
      </div>
    </div>
  );
}

export default function ChartWithChatPage() {
  return (
    <LiveChartProvider>
      <ChatProvider>
        <TradingDashboardContent />
      </ChatProvider>
    </LiveChartProvider>
  );
} 