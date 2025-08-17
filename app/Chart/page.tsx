'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define the structure of live stock data
export interface LiveChartData {
  currentPrice: string;
  volume: string;
  support: string;
  resistance: string;
  dayChange: string;
  dayChangePercent: string;
  trend: string;
  timestamp?: string;
  rawData?: any; // Full raw data from the API
  marketOpen?: string;
  marketCap?: string;
  peRatio?: string;
  dividendYield?: string;
  
  // Technical indicators
  fiftyDayAverage?: string;
  twoHundredDayAverage?: string;
  rsi?: string;
  macd?: string;
  macdSignal?: string;
  
  // Performance metrics
  weekChange?: string;
  monthChange?: string;
  
  // Volume metrics
  averageVolume10Day?: string;
  averageVolume3Month?: string;
  
  // Fundamental metrics
  forwardPE?: string;
  priceToBook?: string;
  beta?: string;
  
  // Analyst data
  targetPrice?: string;
  analystRating?: string;
}

// Default live data values
const defaultLiveData: LiveChartData = {
  currentPrice: 'N/A',
  volume: 'N/A',
  support: 'N/A',
  resistance: 'N/A',
  dayChange: 'N/A',
  dayChangePercent: 'N/A',
  trend: 'N/A',
  timestamp: new Date().toISOString()
};

// Create a context for live chart data
interface LiveChartContextType {
  liveData: LiveChartData;
  updateLiveData: (data: LiveChartData) => void;
  priceHistory: { price: number; time: string }[];
}

const LiveChartContext = createContext<LiveChartContextType>({
  liveData: defaultLiveData,
  updateLiveData: () => {},
  priceHistory: []
});

// Create a provider component
export function LiveChartProvider({ children }: { children: React.ReactNode }) {
  const [liveData, setLiveData] = useState<LiveChartData>(defaultLiveData);
  const [priceHistory, setPriceHistory] = useState<{ price: number; time: string }[]>([]);

  const updateLiveData = (data: LiveChartData) => {
    setLiveData(data);
    
    // Add new price to history if it's a valid number
    const price = parseFloat(data.currentPrice);
    if (!isNaN(price)) {
      const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setPriceHistory(prev => {
        // Keep last 20 data points for the chart
        const newHistory = [...prev, { price, time }];
        if (newHistory.length > 20) {
          return newHistory.slice(newHistory.length - 20);
        }
        return newHistory;
      });
    }
  };

  return (
    <LiveChartContext.Provider value={{ liveData, updateLiveData, priceHistory }}>
      {children}
    </LiveChartContext.Provider>
  );
}

// Hook to use the live chart data
export function useLiveChartData() {
  const context = useContext(LiveChartContext);
  if (context === undefined) {
    throw new Error('useLiveChartData must be used within a LiveChartProvider');
  }
  return context;
}

// Chart component
function StockChart() {
  const { priceHistory } = useLiveChartData();

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={priceHistory}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="time" 
            tick={{ fill: '#9CA3AF' }}
            axisLine={{ stroke: '#4B5563' }}
          />
          <YAxis 
            tick={{ fill: '#9CA3AF' }} 
            domain={['dataMin - 5', 'dataMax + 5']}
            axisLine={{ stroke: '#4B5563' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              color: '#F9FAFB'
            }} 
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#10B981" 
            strokeWidth={2} 
            dot={{ r: 3, fill: '#10B981' }}
            activeDot={{ r: 5, stroke: '#D1FAE5', strokeWidth: 1 }}
            name="Price"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Live Stats component
function LiveStats() {
  const { liveData } = useLiveChartData();
  const isPositive = liveData.dayChange && liveData.dayChange !== 'N/A' && !liveData.dayChange.startsWith('-');

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Current Price */}
      <Card className="p-4 bg-gray-800 border-gray-700">
        <div className="flex flex-col">
          <span className="text-sm text-gray-400 mb-1">Current Price</span>
          <span className="text-xl font-bold text-white">${liveData.currentPrice || 'N/A'}</span>
        </div>
      </Card>
      
      {/* Day Change */}
      <Card className={`p-4 ${isPositive ? 'bg-green-900/20' : 'bg-red-900/20'} border-${isPositive ? 'green' : 'red'}-700/30`}>
        <div className="flex flex-col">
          <span className="text-sm text-gray-400 mb-1">Day Change</span>
          <div className="flex items-center">
            <span className={`text-xl font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {liveData.dayChange || 'N/A'} ({liveData.dayChangePercent || 'N/A'})
            </span>
          </div>
        </div>
      </Card>
      
      {/* Volume */}
      <Card className="p-4 bg-gray-800 border-gray-700">
        <div className="flex flex-col">
          <span className="text-sm text-gray-400 mb-1">Volume</span>
          <span className="text-xl font-bold text-white">{liveData.volume || 'N/A'}</span>
        </div>
      </Card>
      
      {/* Support/Resistance */}
      <Card className="p-4 bg-gray-800 border-gray-700">
        <div className="flex flex-col">
          <span className="text-sm text-gray-400 mb-1">Support/Resistance</span>
          <span className="text-xl font-bold text-white">
            {liveData.support || 'N/A'} / {liveData.resistance || 'N/A'}
          </span>
        </div>
      </Card>
    </div>
  );
}

// Mock data for initial display
const mockHistoricalData = [
  { price: 150.25, time: '09:30' },
  { price: 151.10, time: '10:00' },
  { price: 150.75, time: '10:30' },
  { price: 152.00, time: '11:00' },
  { price: 151.50, time: '11:30' },
  { price: 152.25, time: '12:00' },
  { price: 153.00, time: '12:30' },
  { price: 152.50, time: '13:00' },
  { price: 153.75, time: '13:30' },
  { price: 154.25, time: '14:00' },
];

// Main Chart Page component
export default function ChartPage() {
  const [stockSymbol, setStockSymbol] = useState('AAPL');
  
  return (
    <LiveChartProvider>
      <ChartPageContent stockSymbol={stockSymbol} setStockSymbol={setStockSymbol} />
    </LiveChartProvider>
  );
}

/**
 * Formats volume for better readability
 */
function formatVolume(volume: number): string {
  if (!volume) return 'N/A';
  
  if (volume >= 1000000000) {
    return (volume / 1000000000).toFixed(2) + 'B';
  } else if (volume >= 1000000) {
    return (volume / 1000000).toFixed(2) + 'M';
  } else if (volume >= 1000) {
    return (volume / 1000).toFixed(2) + 'K';
  }
  
  return volume.toString();
}

function ChartPageContent({ 
  stockSymbol, 
  setStockSymbol 
}: { 
  stockSymbol: string; 
  setStockSymbol: React.Dispatch<React.SetStateAction<string>> 
}) {
  const { liveData, updateLiveData, priceHistory } = useLiveChartData();
  
  // Initialize with mock data for a better first-load experience
  useEffect(() => {
    if (priceHistory.length === 0) {
      updateLiveData({
        ...defaultLiveData,
        currentPrice: '154.25',
        dayChange: '+3.75',
        dayChangePercent: '+2.49%',
        volume: '45.2M',
        support: '150.50',
        resistance: '155.00',
        trend: 'Uptrend'
      });
    }
  }, []);
  
  // Fetch initial stock data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch stock details from API or mock data provider
        const response = await fetch(`http://localhost:5000/stock-details?symbol=${stockSymbol}`);
        
        if (response.ok) {
          const data = await response.json();
          
          // Set mock data
          updateLiveData({
            currentPrice: data.regularMarketPrice ? data.regularMarketPrice.toFixed(2) : '150.25',
            volume: data.regularMarketVolume ? formatVolume(data.regularMarketVolume) : '10.5M',
            support: data.fiftyTwoWeekLow ? data.fiftyTwoWeekLow.toFixed(2) : '130.50',
            resistance: data.fiftyTwoWeekHigh ? data.fiftyTwoWeekHigh.toFixed(2) : '165.00',
            dayChange: data.regularMarketPrice && data.regularMarketPreviousClose
              ? (data.regularMarketPrice - data.regularMarketPreviousClose).toFixed(2)
              : '+2.50',
            dayChangePercent: data.regularMarketPrice && data.regularMarketPreviousClose
              ? ((data.regularMarketPrice - data.regularMarketPreviousClose) / data.regularMarketPreviousClose * 100).toFixed(2) + '%'
              : '+1.68%',
            trend: data.beta ? (data.beta > 1 ? 'Uptrend' : 'Neutral') : 'Neutral',
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
        // Keep using default or mock data if API fails
      }
    };
    
    fetchInitialData();
    
    // Removed polling interval to reduce load on Yahoo Finance API
    // Data will now only be fetched when the component mounts or the stock symbol changes
    
    return () => {
      // No need to clear any interval
    };
  }, [stockSymbol]);
  
  return (
    <div className="px-4 py-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{stockSymbol} Live Chart</h1>
          <p className="text-gray-600">Real-time stock data and price movements</p>
        </div>
        
        <LiveStats />
        
        <Card className="p-6 bg-gray-900 border-gray-700 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Price Chart</h2>
          <StockChart />
        </Card>
      </div>
    </div>
  );
} 