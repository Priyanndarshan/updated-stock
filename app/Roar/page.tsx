'use client'
import React, { useEffect, useState, useRef, memo, createContext, useContext, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Chat } from "@/components/Chat";
import { useChat, ChatProvider } from "@/components/ChatContext";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

declare global {
  interface Window {
    TradingView: any;
    html2canvas: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
  }
}

// Add custom CSS for theme colors
const customStyles = `
  :root:not(.theme-dark) {
    --tv-color-platform-background: #f8fafc;
    --tv-color-pane-background: #ffffff;
    --tv-color-toolbar-button-background-hover: #e2e8f0;
    --tv-color-toolbar-button-background-expanded: #e2e8f0;
    --tv-color-toolbar-button-background-active: #dbeafe;
    --tv-color-toolbar-button-background-active-hover: #bfdbfe;
    --tv-color-toolbar-button-text: #1e40af;
    --tv-color-toolbar-button-text-hover: #1e40af;
    --tv-color-toolbar-button-text-active: #2563eb;
    --tv-color-toolbar-button-text-active-hover: #3b82f6;
    --tv-color-item-active-text: #2563eb;
    --tv-color-toolbar-toggle-button-background-active: #2563eb;
    --tv-color-toolbar-toggle-button-background-active-hover: #3b82f6;
  }

  .theme-dark:root {
    --tv-color-platform-background: #0f172a;
    --tv-color-pane-background: #1e293b;
    --tv-color-toolbar-button-background-hover: #334155;
    --tv-color-toolbar-button-background-expanded: #334155;
    --tv-color-toolbar-button-background-active: #1e40af;
    --tv-color-toolbar-button-background-active-hover: #2563eb;
    --tv-color-toolbar-button-text: #e2e8f0;
    --tv-color-toolbar-button-text-hover: #f8fafc;
    --tv-color-toolbar-button-text-active: #bfdbfe;
    --tv-color-toolbar-button-text-active-hover: #dbeafe;
    --tv-color-item-active-text: #60a5fa;
    --tv-color-toolbar-toggle-button-background-active: #2563eb;
    --tv-color-toolbar-toggle-button-background-active-hover: #3b82f6;
  }
  
  /* Modern scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.1);
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(71, 85, 105, 0.5);
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(71, 85, 105, 0.7);
  }
  
  /* Glassmorphism and modern UI styles */
  .glass-card {
    background: rgba(30, 41, 59, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
  
  .glass-card-light {
    background: rgba(248, 250, 252, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  }
  
  /* Button and interactive element animations */
  .btn-hover-effect {
    transition: all 0.2s ease;
  }
  
  .btn-hover-effect:hover {
    transform: translateY(-2px);
  }
  
  /* Chart container enhancements */
  .chart-container {
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  }
  
  .chart-container:hover {
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  }
`;

// Symbol search helper function
const getValidTradingViewSymbol = (symbol?: string, name?: string): string => {
  // If we have a valid stock symbol, use it with proper formatting
  if (symbol && symbol.trim().length > 0) {
    // Check if symbol already has an exchange prefix
    if (symbol.includes(':')) {
      return symbol.trim();
    }
    // Add NASDAQ as default exchange if needed
    return `NASDAQ:${symbol.trim().toUpperCase()}`;
  }
  
  // If we only have a name, use it as a search term
  if (name && name.trim().length > 0) {
    return name.trim();
  }
  
  // Default fallback
  return "NASDAQ:AAPL";
};

// Define the interface for TradingView live data
interface LiveChartData {
  currentPrice?: string;
  dayChange?: string;
  dayChangePercent?: string;
  volume?: string;
  timestamp?: string;
  support?: string;
  resistance?: string;
  trend?: string;
}

// Create a context to share live data
const LiveChartDataContext = createContext<{
  liveData: LiveChartData;
  updateLiveData: (data: LiveChartData) => void;
}>({
  liveData: {},
  updateLiveData: () => {}
});

// Hook to access live chart data
export const useLiveChartData = () => useContext(LiveChartDataContext);

// TradingView Widget Component
const TradingViewWidget = memo(({ isDarkMode, symbol, stockName }: { isDarkMode: boolean; symbol?: string; stockName?: string }) => {
  const container = useRef<HTMLDivElement>(null);
  const [resolvedSymbol, setResolvedSymbol] = useState<string>(getValidTradingViewSymbol(symbol, stockName));
  
  // Access the context to update live data
  const { updateLiveData, liveData } = useLiveChartData();
  
  // Function to extract data from Trading View widget
  const extractLiveData = useCallback(() => {
    try {
      console.log('Attempting to extract live chart data...');

      const extractNumber = (text: string | undefined | null): string | undefined => {
        if (!text) return undefined;
        const match = text.match(/[\d,]+\.?\d*/);
        return match ? match[0].replace(/,/g, '') : undefined;
      };

      const getData = () => {
        let currentPrice: string | undefined;
        const priceSelectors = [
          '.tv-symbol-price-quote__value',
          '.tv-symbol-header__first-line span',
          '[data-name="legend-series-item"] [data-name="legend-price-value"]'
        ];

        for (const selector of priceSelectors) {
          const element = document.querySelector(selector);
          if (element?.textContent) {
            currentPrice = extractNumber(element.textContent.trim());
            console.log(`Found price using selector ${selector}: ${currentPrice}`);
            break;
          }
        }

        let volume: string | undefined;
        const volumeSelectors = [
          '.tv-symbol-volume',
          '[data-name="legend-volume-value"]'
        ];

        for (const selector of volumeSelectors) {
          const element = document.querySelector(selector);
          if (element?.textContent) {
            volume = element.textContent.trim();
            break;
          }
        }

        const support = document.querySelector('.sidebar-support')?.textContent?.trim() || "N/A";
        const resistance = document.querySelector('.sidebar-resistance')?.textContent?.trim() || "N/A";

        let trend = document.querySelector('.sidebar-trend')?.textContent?.trim();
        if (!trend && currentPrice) {
          const changeElement = document.querySelector('.tv-symbol-price-quote__change');
          if (changeElement) {
            const changeText = changeElement.textContent;
            if (changeText && changeText.includes('-')) {
              trend = 'Downtrend';
            } else if (changeText && !changeText.includes('0.00')) {
              trend = 'Uptrend';
            } else {
              trend = 'Sideways';
            }
          } else {
            trend = 'Sideways';
          }
        }

        let dayChange: string | undefined;
        let dayChangePercent: string | undefined;
        const changeSelectors = [
          '.tv-symbol-price-quote__change',
          '.tv-symbol-header__second-line span'
        ];

        for (const selector of changeSelectors) {
          const element = document.querySelector(selector);
          if (element?.textContent) {
            const changeText = element.textContent.trim();
            const changeMatch = changeText.match(/([+-]?[\d,]+\.?\d*)/);
            if (changeMatch) {
              dayChange = changeMatch[1];
            }
            const percentMatch = changeText.match(/\((.*?)\)/);
            if (percentMatch) {
              dayChangePercent = percentMatch[1];
            }
            break;
          }
        }

        console.log('Extracted data from TradingView:', {
          currentPrice, volume, support, resistance, trend,
          dayChange, dayChangePercent
        });

        const data: LiveChartData = {
          currentPrice: currentPrice || "N/A",
          volume: volume || "N/A",
          support,
          resistance, 
          trend: trend || "Sideways",
          dayChange: dayChange || "0.00",
          dayChangePercent: dayChangePercent || "0.00%",
          timestamp: new Date().toISOString()
        };

        updateLiveData(data);
      };

      // Retry mechanism
      const retryInterval = setInterval(() => {
        getData();
        if (liveData.currentPrice !== "N/A") {
          clearInterval(retryInterval);
        }
      }, 2000);

    } catch (error) {
      console.error('Error extracting live data:', error);
    }
  }, [updateLiveData, liveData]);
  
  // Set up periodic data extraction
  useEffect(() => {
    console.log('Setting up live data extraction...');
    
    // Initial extraction after a delay to allow widget to load
    const initialTimer = setTimeout(() => {
      extractLiveData();
      
      // Additional single extraction attempt after a short delay for reliability
      setTimeout(extractLiveData, 5000);
    }, 3000);
    
    // We no longer poll every 10 seconds to reduce load on Yahoo Finance API
    // Data extraction will only occur when the component mounts initially
    
    return () => {
      clearTimeout(initialTimer);
    };
  }, [extractLiveData]);

  useEffect(() => {
    // Update the resolved symbol when props change
    setResolvedSymbol(getValidTradingViewSymbol(symbol, stockName));
    
    // Extract live data once when the symbol changes
    setTimeout(() => {
      extractLiveData();
    }, 3000); // Give TradingView chart time to load new symbol
  }, [symbol, stockName, extractLiveData]);

  useEffect(() => {
    // Add custom styles to document
    const styleElement = document.createElement('style');
    styleElement.textContent = customStyles;
    document.head.appendChild(styleElement);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": resolvedSymbol,
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "enable_publishing": true,
      "withdateranges": true,
      "hide_side_toolbar": false,
      "allow_symbol_change": true,
      "details": true,
      "hotlist": true,
      "calendar": true,
      "news": ["headlines"],
      "studies": [
        "MASimple@tv-basicstudies",
        "RSI@tv-basicstudies",
        "MACD@tv-basicstudies"
      ],
      "support_host": "https://www.tradingview.com",
      "container_id": "tradingview_chart",
      "show_popup_button": true,
      "popup_width": "1000",
      "popup_height": "650",
      "enable_signin_button": true,
      "hide_top_toolbar": false,
      "hide_legend": false,
      "save_image": true,
      "backgroundColor": "#1e293b",
      "gridColor": "#334155",
      "widgetbar": {
        "details": true,
        "news": true,
        "watchlist": true,
        "datawindow": true,
        "economic": true
      }
    });

    if (container.current) {
      container.current.innerHTML = '';
      container.current.appendChild(script);
    }

    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    };
  }, [isDarkMode, resolvedSymbol]);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      <div className="tradingview-widget-copyright text-xs text-gray-400">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="text-blue-500 hover:text-blue-600">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
});

TradingViewWidget.displayName = 'TradingViewWidget';

const ChartPage = () => {
  // NOTE: All state is only stored in memory and is NOT persisted in localStorage or any other storage mechanism.
  // Data is cleared when the page is refreshed or closed.
  const searchParams = useSearchParams();
  const symbol = searchParams ? searchParams.get('symbol') : null;
  const stockName = searchParams ? searchParams.get('name') : null;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [chartHeight, setChartHeight] = useState('calc(90vh - 120px)');
  const tradingViewWindowRef = useRef<Window | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [analysis, setAnalysis] = useState<any>(null);
  const { clearMessages } = useChat();
  const previousSymbolRef = useRef<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Add stock search functionality
  const [inputSymbol, setInputSymbol] = useState(symbol || 'AAPL');
  const [currentSymbol, setCurrentSymbol] = useState(symbol || 'AAPL');
  const [currentStockName, setCurrentStockName] = useState(stockName || 'Apple Inc.');
  
  // Live chart data state
  const [liveChartData, setLiveChartData] = useState<LiveChartData>({});
  const [isDataLoading, setIsDataLoading] = useState(false);
  
  // Function to update live chart data
  const updateLiveData = (data: any) => {
    setLiveChartData(data);
  };
  
  // Function to handle stock symbol search
  const handleSearch = () => {
    if (inputSymbol.trim() === '') return;
    
    const newSymbol = inputSymbol.trim().toUpperCase();
    setCurrentSymbol(newSymbol);
    
    // Clear messages if symbol has changed
    if (newSymbol !== previousSymbolRef.current) {
      clearMessages();
      previousSymbolRef.current = newSymbol;
    }
    
    // Fetch data for the new symbol - only when user initiates a search
    fetchStockData(newSymbol);
    
    // Update analysis with new symbol
    setAnalysis((prevAnalysis: any) => ({
      ...prevAnalysis,
      stockSymbol: newSymbol,
      stockName: currentStockName || newSymbol
    }));
  };

  // Function to fetch stock data (only when needed - on search or initial load)
  const fetchStockData = async (symbol: string) => {
    try {
      setIsDataLoading(true);
      console.log(`Fetching data for ${symbol}...`);
      
      // Call the backend API
      const response = await fetch(`http://localhost:5000/stock-details?symbol=${symbol}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }
      
      const data = await response.json();
      console.log('Received stock data:', data);
      
      // Update stock name if available
      if (data.shortName || data.longName) {
        setCurrentStockName(data.longName || data.shortName);
      }
      
      // Format live data
      const formattedData = {
        currentPrice: data.regularMarketPrice ? data.regularMarketPrice.toFixed(2) : 'N/A',
        volume: data.regularMarketVolume ? Number(data.regularMarketVolume).toLocaleString() : 'N/A',
        support: data.fiftyTwoWeekLow ? data.fiftyTwoWeekLow.toFixed(2) : 'N/A',
        resistance: data.fiftyTwoWeekHigh ? data.fiftyTwoWeekHigh.toFixed(2) : 'N/A',
        dayChangeDiff: data.regularMarketPrice && data.regularMarketPreviousClose 
          ? (data.regularMarketPrice - data.regularMarketPreviousClose).toFixed(2) 
          : '0.00',
        dayChangePercent: data.regularMarketPrice && data.regularMarketPreviousClose
          ? ((data.regularMarketPrice - data.regularMarketPreviousClose) / data.regularMarketPreviousClose * 100).toFixed(2) + '%'
          : '0.00%',
        trend: determineTrend(data),
        timestamp: new Date().toISOString()
      };
      
      // Update live data state
      updateLiveData(formattedData);
      
      // Update analysis
      setAnalysis((prevAnalysis: any) => ({
        ...prevAnalysis,
        stockName: data.longName || data.shortName || symbol,
        stockSymbol: symbol,
        currentPrice: formattedData.currentPrice,
        volume: formattedData.volume,
        support: formattedData.support,
        resistance: formattedData.resistance,
        dayChange: formattedData.dayChangeDiff,
        dayChangePercent: formattedData.dayChangePercent,
        trend: formattedData.trend,
        lastUpdated: formattedData.timestamp,
        isLiveData: true
      }));
      
    } catch (error) {
      console.error('Error fetching stock data:', error);
      // Use mock data on error
      const mockData = {
        currentPrice: '166.75',
        volume: '9.51M',
        support: '141.13',
        resistance: '208.70',
        dayChangeDiff: '2.05',
        dayChangePercent: '1.24%',
        trend: 'Uptrend',
        timestamp: new Date().toISOString()
      };
      
      updateLiveData(mockData);
      
      setAnalysis((prevAnalysis: any) => ({
        ...prevAnalysis,
        stockName: currentStockName || symbol,
        stockSymbol: symbol,
        currentPrice: mockData.currentPrice,
        volume: mockData.volume,
        support: mockData.support,
        resistance: mockData.resistance,
        dayChange: mockData.dayChangeDiff,
        dayChangePercent: mockData.dayChangePercent,
        trend: mockData.trend,
        lastUpdated: mockData.timestamp,
        isLiveData: false,
        isMockData: true
      }));
    } finally {
      setIsDataLoading(false);
    }
  };
  
  // Helper function to determine trend
  const determineTrend = (data: any): string => {
    if (!data.regularMarketPrice || !data.regularMarketPreviousClose) {
      return 'Sideways';
    }
    
    const changePercent = (data.regularMarketPrice - data.regularMarketPreviousClose) / data.regularMarketPreviousClose * 100;
    
    if (changePercent > 1.5) return 'Uptrend';
    if (changePercent < -1.5) return 'Downtrend';
    return 'Sideways';
  };

  // For the window opening functionality
  const updateHeight = () => {
    const windowHeight = window.innerHeight;
    setChartHeight(`${windowHeight - 200}px`);
  };

  useEffect(() => {
    updateHeight();
    window.addEventListener('resize', updateHeight);

    // Add custom styles to document
    const styleElement = document.createElement('style');
    styleElement.textContent = customStyles;
    document.head.appendChild(styleElement);
    
    // Set dark theme on mount
    document.documentElement.classList.add('theme-dark');
    
    // Create an analysis object from the URL parameters for the Chat component
    const initialSymbol = symbol || currentSymbol || 'AAPL';
    const initialName = stockName || currentStockName || 'Apple Inc.';
    
    // If navigating to a different stock, clear the chat history
    if (previousSymbolRef.current && previousSymbolRef.current !== initialSymbol) {
      clearMessages();
    }
    
    // Update the previous symbol reference
    previousSymbolRef.current = initialSymbol;
    
    // Initial data fetch - only once on mount with the initial symbol
    fetchStockData(initialSymbol);
    
    setAnalysis({
      stockName: initialName,
      stockSymbol: initialSymbol,
      // Add any other fields that are required for the Chat to work
      currentPrice: liveChartData.currentPrice || "N/A",
      volume: liveChartData.volume || "N/A",
      support: liveChartData.support || "N/A",
      resistance: liveChartData.resistance || "N/A",
      dayChange: liveChartData.dayChange || "0.00",
      dayChangePercent: liveChartData.dayChangePercent || "0.00%",
      trend: liveChartData.trend || "Sideways",
      lastUpdated: new Date().toISOString(),
      isLiveData: true,
      strategies: {
        shortTerm: "Continue monitoring the chart for trading opportunities.",
        mediumTerm: "Follow market trends and adjust your position accordingly.",
        longTerm: "Consider the company fundamentals for long-term investment decisions."
      },
      recommendation: "View the live chart for the most current information."
    });

    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  // Effect to handle welcome screen and analyze URL params
  useEffect(() => {
    // Check if there are URL parameters
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.has('symbol')) {
        // Get current symbol
        const currentSymbol = params.get('symbol');
        
        // If symbol changed and we have a previous symbol, clear chat history
        if (previousSymbolRef.current && currentSymbol !== previousSymbolRef.current) {
          clearMessages();
        }
        
        // Update the ref with current symbol
        previousSymbolRef.current = currentSymbol;
      }
    }
  }, [clearMessages]);

  // Create analysis object from URL parameters and sidebar data
  useEffect(() => {
    if (typeof window !== 'undefined' && symbol) {
      // Extract data from search params
      const params = new URLSearchParams(window.location.search);
      
      // Add a slight delay to ensure DOM elements are available
      const timer = setTimeout(() => {
        // Get values from DOM elements
        const currentPrice = document.querySelector('.sidebar-price')?.textContent?.trim() || 'N/A';
        const trend = document.querySelector('.sidebar-trend')?.textContent?.trim() || 'sideways pattern';
        const support = document.querySelector('.sidebar-support')?.textContent?.trim() || 'N/A';
        const resistance = document.querySelector('.sidebar-resistance')?.textContent?.trim() || 'N/A';
        const volume = document.querySelector('.sidebar-volume')?.textContent?.trim() || 'N/A';
        const peRatio = document.querySelector('.sidebar-pe')?.textContent?.trim() || 'N/A';
        
        // Create analysis object with data from search params and element references
        const currentAnalysis = {
          name: stockName || 'Apple Inc',
          stockName: stockName || 'Apple Inc',
          stockSymbol: symbol || 'AAPL',
          currentPrice: currentPrice,
          trend: trend,
          support: support,
          resistance: resistance,
          volume: volume,
          peRatio: peRatio,
          weekRange: "N/A", // Add this to match API expectations
          strategies: {
            shortTerm: "Monitor key support/resistance levels",
            mediumTerm: "Follow the overall market trend",
            longTerm: "Consider fundamentals for long-term position"
          },
          recommendation: 'View the live chart for the most current information'
        };
        
        setAnalysis(currentAnalysis);
      }, 500); // 500ms delay
      
      return () => clearTimeout(timer);
    }
  }, [symbol, stockName]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  // Open TradingView in a proper popup window
  const openTradingViewWindow = () => {
    const width = Math.min(1200, window.screen.width * 0.9);
    const height = Math.min(800, window.screen.height * 0.9);
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    // Use the resolved symbol for opening the popup
    const searchTerm = getValidTradingViewSymbol(symbol || undefined, stockName || undefined);
    
    // Open the actual TradingView website in a new window with dark theme
    const tvWindow = window.open(
      `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(searchTerm)}&theme=dark`,
      'TradingViewPopup',
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=yes,toolbar=yes,menubar=yes,location=yes`
    );
    
    if (tvWindow) {
      tradingViewWindowRef.current = tvWindow;
      setIsPopupOpen(true);
      
      // Focus the window
      tvWindow.focus();
      
      // Set up a check to determine if popup was closed
      const checkIfClosed = setInterval(() => {
        if (tradingViewWindowRef.current && tradingViewWindowRef.current.closed) {
          clearInterval(checkIfClosed);
          setIsPopupOpen(false);
        }
      }, 1000);
    } else {
      alert("Your browser blocked the popup. Please allow popups for this site to use this feature.");
    }
  };
  
  // Bring focus to the TradingView window
  const focusTradingViewWindow = () => {
    if (tradingViewWindowRef.current && !tradingViewWindowRef.current.closed) {
      tradingViewWindowRef.current.focus();
    } else {
      // If window is closed or not available, ask to open it
      if (confirm('The TradingView window is not open. Would you like to open it now?')) {
        openTradingViewWindow();
      }
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <LiveChartDataContext.Provider value={{ liveData: liveChartData, updateLiveData }}>
      <div className="min-h-screen transition-colors duration-300 bg-gradient-to-b from-gray-950 to-gray-900 flex overflow-hidden">
        {/* Left Sidebar - Chat */}
        <div 
          className={`fixed top-0 left-0 h-full z-50 w-[380px] transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ height: '100vh' }}
        >
          <div className="h-full flex flex-col">
            {/* We're removing the sidebar header since the Chat component now has its own header */}
            <div className="h-full">
              <Chat analysis={analysis} onClose={toggleSidebar} />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div 
          className={`flex-1 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'ml-[380px]' : 'ml-0'
          }`}
        >
          <div className="max-w-[1800px] mx-auto px-6 sm:px-8 lg:px-10 py-6">
            <header className="mb-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0 mb-8">
                <div className="flex items-center">
                  {!isSidebarOpen && (
                    <button 
                      onClick={toggleSidebar}
                      className="mr-5 p-2.5 rounded-xl hover:bg-gray-800/70 text-gray-300 border border-gray-700/50 bg-gray-800/30 transition-all duration-200 btn-hover-effect"
                      aria-label="Open chat"
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <span className="ml-2 text-sm font-medium hidden sm:inline">Trading Assistant</span>
                      </div>
                    </button>
                  )}
                  <div>
                    <div className="flex items-center mb-1.5">
                      <h1 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-blue-50 tracking-tight leading-none">
                        Market Insights Pro
                      </h1>
                      <span className="ml-3 px-2.5 py-1 text-xs font-semibold tracking-wide text-blue-200 bg-blue-900/30 border border-blue-800/50 rounded-full">LIVE</span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-400 font-light">
                      {currentSymbol ? (
                        <span className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <span className="font-medium text-gray-300">{currentStockName || 'Stock'}</span>
                          <span className="mx-2 text-gray-600">•</span>
                          <span className="text-gray-500 font-light tracking-wide">{currentSymbol}</span>
                        </span>
                      ) : (
                        'Access advanced market analysis and AI-powered trading insights'
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Stock Search Input */}
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Input
                        type="text"
                        value={inputSymbol}
                        onChange={(e) => setInputSymbol(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Enter stock symbol (e.g., AAPL)"
                        className="bg-gray-800/70 border-gray-700/50 text-white w-40 sm:w-60"
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                    <Button 
                      onClick={handleSearch}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Search
                    </Button>
                  </div>
                  
                  {/* Quick Stock Buttons */}
                  <div className="hidden sm:flex space-x-2">
                    <Button 
                      onClick={() => { setInputSymbol('AAPL'); handleSearch(); }}
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-gray-800/50"
                    >
                      AAPL
                    </Button>
                    <Button 
                      onClick={() => { setInputSymbol('GOOG'); handleSearch(); }}
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-gray-800/50"
                    >
                      GOOG
                    </Button>
                  </div>
                  
                  {!isPopupOpen ? (
                    <button 
                      onClick={openTradingViewWindow}
                      className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg shadow-blue-900/30 btn-hover-effect"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                      </svg>
                      Open TradingView
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button 
                        onClick={focusTradingViewWindow}
                        className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg shadow-emerald-900/30 btn-hover-effect"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                        </svg>
                        Focus Chart
                      </button>
                      <button 
                        onClick={openTradingViewWindow}
                        className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg shadow-blue-900/30 btn-hover-effect"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        New Window
                      </button>
                    </div>
                  )}

                  {isLoggedIn && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/70 border border-gray-700/50">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-medium shadow-lg shadow-blue-900/20">
                        {username.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm font-medium text-gray-300">
                        {username || 'User'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* TradingView Chart Container */}
            <div className="chart-container bg-gray-800/70 glass-card border border-gray-700/50" style={{ height: chartHeight }}>
              <TradingViewWidget isDarkMode={isDarkMode} symbol={symbol || undefined} stockName={stockName || undefined} />
            </div>
            
            {/* Trading Tips Section */}
            {analysis && analysis.strategies && (
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass-card rounded-xl p-5 backdrop-blur-md border-l-4 border-blue-600">
                  <div className="flex items-center mb-3">
                    <svg className="w-5 h-5 mr-2 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <h3 className="text-lg font-bold text-white">Short-Term Strategy</h3>
                  </div>
                  <p className="text-gray-400">{analysis.strategies.shortTerm}</p>
                </div>
                
                <div className="glass-card rounded-xl p-5 backdrop-blur-md border-l-4 border-indigo-600">
                  <div className="flex items-center mb-3">
                    <svg className="w-5 h-5 mr-2 text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    <h3 className="text-lg font-bold text-white">Medium-Term Outlook</h3>
                  </div>
                  <p className="text-gray-400">{analysis.strategies.mediumTerm}</p>
                </div>
                
                <div className="glass-card rounded-xl p-5 backdrop-blur-md border-l-4 border-purple-600">
                  <div className="flex items-center mb-3">
                    <svg className="w-5 h-5 mr-2 text-purple-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                    <h3 className="text-lg font-bold text-white">Long-Term Investment</h3>
                  </div>
                  <p className="text-gray-400">{analysis.strategies.longTerm}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Login Modal - Redesigned */}
        <div id="loginModal" className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center hidden">
          <div className="glass-card w-full max-w-md mx-4 rounded-2xl shadow-2xl p-8 border border-gray-700/30">
            <div className="text-center mb-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 mb-4 shadow-lg shadow-blue-900/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">Secure Login</h3>
              <p className="text-gray-400">Access your premium trading account</p>
            </div>
            
            <button 
              onClick={() => document.getElementById('loginModal')?.classList.add('hidden')}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2 text-gray-300">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 btn-hover-effect"
              >
                Sign in
              </button>
              
              <div className="text-center text-sm text-gray-500 mt-4">
                Don't have an account? 
                <a href="#" className="ml-1 font-medium text-blue-400 hover:text-blue-300 transition-colors">
                  Sign up
                </a>
              </div>
            </form>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slideIn {
            from { transform: translateX(-20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
            100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
          }
          
          .animate-fade-in {
            animation: fadeIn 0.3s ease-out forwards;
          }
          
          .animate-slide-in {
            animation: slideIn 0.4s ease-out forwards;
          }
          
          .animate-pulse-blue {
            animation: pulse 2s infinite;
          }
          
          /* Card hover animations */
          .glass-card {
            transition: all 0.3s ease;
          }
          
          .glass-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            border-color: rgba(59, 130, 246, 0.5);
          }
        `}</style>
      </div>
    </LiveChartDataContext.Provider>
  );
};

export default function RoarPage() {
  return (
    <ChatProvider>
      <ChartPage />
    </ChatProvider>
  );
}
