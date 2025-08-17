"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, TrendingUp, TrendingDown, ArrowRight, Info } from 'lucide-react';

// Mock stock data
const stockData = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 187.68, change: 1.25, volume: '45.2M' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 950.02, change: 15.32, volume: '52.3M' },
  { symbol: 'META', name: 'Meta Platforms', price: 485.39, change: -2.15, volume: '19.8M' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 215.76, change: -4.28, volume: '38.6M' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway', price: 412.50, change: 0.75, volume: '5.2M' },
  { symbol: 'JPM', name: 'JPMorgan Chase', price: 198.45, change: 2.10, volume: '12.4M' },
  { symbol: 'V', name: 'Visa Inc.', price: 275.80, change: 0.95, volume: '8.7M' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.32, change: 2.78, volume: '22.1M' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 175.98, change: -0.42, volume: '18.7M' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.12, change: 1.05, volume: '31.5M' },
];

// Mock chart data (price points for the selected stock)
const generateChartData = (symbol: string) => {
  const basePrice = stockData.find(stock => stock.symbol === symbol)?.price || 100;
  const volatility = Math.random() * 5; // Random volatility factor
  
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    const randomFactor = (Math.random() - 0.5) * volatility;
    const price = basePrice + randomFactor + (Math.sin(i / 8) * 3); // Add some wave pattern
    return { time: `${hour}:00`, price: parseFloat(price.toFixed(2)) };
  });
};

interface MarketSummaryProps {}

const MarketSummary: React.FC<MarketSummaryProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [chartData, setChartData] = useState<Array<{ time: string; price: number }>>([]);
  const [hoverPoint, setHoverPoint] = useState<{ time: string; price: number } | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers' | 'all'>('all');
  // Add state to track if component is mounted on client side
  const [isClient, setIsClient] = useState(false);

  // Initialize chartData after client-side mounting to avoid hydration errors
  useEffect(() => {
    setIsClient(true);
    setChartData(generateChartData(selectedStock));
  }, [selectedStock]);

  const filteredStocks = stockData.filter(stock => 
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(stock => {
    if (activeTab === 'gainers') return stock.change > 0;
    if (activeTab === 'losers') return stock.change < 0;
    return true;
  });

  // Chart dimensions
  const chartWidth = 500;
  const chartHeight = 200;
  const padding = { top: 20, right: 30, bottom: 30, left: 40 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Calculate scales
  const xScale = (i: number) => (i / (chartData.length - 1)) * innerWidth + padding.left;
  
  // Use client-side calculated values only after component is mounted
  const minPrice = isClient && chartData.length > 0 ? Math.min(...chartData.map(d => d.price)) * 0.995 : 0;
  const maxPrice = isClient && chartData.length > 0 ? Math.max(...chartData.map(d => d.price)) * 1.005 : 0;
  
  const yScale = (price: number) => innerHeight - ((price - minPrice) / (maxPrice - minPrice)) * innerHeight + padding.top;

  // Generate path for the chart line
  const linePath = isClient && chartData.length > 0 ? chartData.map((point, i) => {
    const x = xScale(i);
    const y = yScale(point.price);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ') : '';

  // Handle mouse move on chart
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left - padding.left;
    
    // Find closest data point
    const index = Math.min(
      Math.max(0, Math.round((mouseX / innerWidth) * (chartData.length - 1))),
      chartData.length - 1
    );
    
    const point = chartData[index];
    setHoverPoint(point);
    setShowTooltip(true);
    setTooltipPosition({ 
      x: xScale(index),
      y: yScale(point.price)
    });
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    setHoverPoint(null);
  };

  const selectedStockData = stockData.find(stock => stock.symbol === selectedStock) || stockData[0];
  
  // Generate these values on the client side to avoid hydration mismatches
  const dayRangeLow = isClient ? (selectedStockData.price - (Math.random() * 5)).toFixed(2) : "0.00";
  const dayRangeHigh = isClient ? (selectedStockData.price + (Math.random() * 5)).toFixed(2) : "0.00";
  const weekHigh = isClient ? (selectedStockData.price * 1.2).toFixed(2) : "0.00";
  const weekLow = isClient ? (selectedStockData.price * 0.8).toFixed(2) : "0.00";

  // Return a loading state or skeleton UI during server rendering
  if (!isClient) {
    return (
      <Card className="bg-white border-none shadow-sm">
        <CardHeader className="pb-2 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-gray-800">Market Summary</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 border border-gray-200 rounded-md h-[350px] bg-gray-50"></div>
            <div className="md:col-span-2">
              <div className="h-[300px] bg-gray-50 rounded-md animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-none shadow-sm">
      <CardHeader className="pb-2 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-800">Market Summary</CardTitle>
          <div className="flex items-center space-x-2">
            <Button 
              variant={activeTab === 'all' ? "default" : "outline"} 
              size="sm" 
              className={`h-8 text-xs ${activeTab === 'all' ? 'bg-teal-500 hover:bg-teal-600' : 'text-gray-600 border-gray-200 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </Button>
            <Button 
              variant={activeTab === 'gainers' ? "default" : "outline"} 
              size="sm" 
              className={`h-8 text-xs ${activeTab === 'gainers' ? 'bg-teal-500 hover:bg-teal-600' : 'text-gray-600 border-gray-200 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('gainers')}
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Gainers
            </Button>
            <Button 
              variant={activeTab === 'losers' ? "default" : "outline"} 
              size="sm" 
              className={`h-8 text-xs ${activeTab === 'losers' ? 'bg-teal-500 hover:bg-teal-600' : 'text-gray-600 border-gray-200 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('losers')}
            >
              <TrendingDown className="h-3 w-3 mr-1" />
              Losers
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stock List */}
          <div className="md:col-span-1 border border-gray-200 rounded-md overflow-hidden">
            <div className="p-2 bg-gray-50 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search stocks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-8 text-sm bg-white border-gray-200"
                />
              </div>
            </div>
            <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
              {filteredStocks.length > 0 ? (
                filteredStocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    className={`flex items-center justify-between p-2.5 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedStock === stock.symbol ? 'bg-gray-50' : ''
                    }`}
                    onClick={() => setSelectedStock(stock.symbol)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2 text-gray-500">
                        <span className="text-xs font-semibold">{stock.symbol.slice(0, 2)}</span>
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-800">{stock.symbol}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[120px]">{stock.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm">${stock.price.toFixed(2)}</div>
                      <div className={`text-xs ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">No stocks found</div>
              )}
            </div>
          </div>

          {/* Chart and Details */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{selectedStockData.name} ({selectedStockData.symbol})</h3>
                <div className="flex items-center mt-1">
                  <span className="text-2xl font-bold mr-2">${selectedStockData.price.toFixed(2)}</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                    selectedStockData.change >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {selectedStockData.change >= 0 ? '+' : ''}{selectedStockData.change.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Volume</div>
                <div className="font-medium">{selectedStockData.volume}</div>
              </div>
            </div>

            {/* Stock Chart */}
            <div className="relative bg-white p-2 rounded-md border border-gray-100 mb-4">
              <svg
                width={chartWidth}
                height={chartHeight}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="overflow-visible"
              >
                {/* Grid lines */}
                {Array.from({ length: 5 }).map((_, i) => {
                  const y = padding.top + (innerHeight / 4) * i;
                  const price = maxPrice - ((maxPrice - minPrice) / 4) * i;
                  return (
                    <g key={i}>
                      <line
                        x1={padding.left}
                        y1={y}
                        x2={chartWidth - padding.right}
                        y2={y}
                        stroke="#e5e7eb"
                        strokeWidth={1}
                      />
                      <text
                        x={padding.left - 5}
                        y={y}
                        textAnchor="end"
                        dominantBaseline="middle"
                        fontSize={10}
                        fill="#6b7280"
                      >
                        ${price.toFixed(2)}
                      </text>
                    </g>
                  );
                })}

                {/* X-axis labels */}
                {chartData.filter((_, i) => i % 4 === 0).map((point, i) => {
                  const x = xScale(i * 4);
                  return (
                    <text
                      key={i}
                      x={x}
                      y={chartHeight - 10}
                      textAnchor="middle"
                      fontSize={10}
                      fill="#6b7280"
                    >
                      {point.time}
                    </text>
                  );
                })}

                {/* Chart line */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth={2}
                />

                {/* Area under the line */}
                <path
                  d={`${linePath} L ${xScale(chartData.length - 1)} ${yScale(minPrice)} L ${xScale(0)} ${yScale(minPrice)} Z`}
                  fill="url(#gradient)"
                  opacity={0.2}
                />

                {/* Gradient definition */}
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.1} />
                  </linearGradient>
                </defs>

                {/* Hover point */}
                {showTooltip && hoverPoint && (
                  <circle
                    cx={tooltipPosition.x}
                    cy={tooltipPosition.y}
                    r={4}
                    fill="#60a5fa"
                    stroke="white"
                    strokeWidth={2}
                  />
                )}

                {/* Vertical line at hover point */}
                {showTooltip && hoverPoint && (
                  <line
                    x1={tooltipPosition.x}
                    y1={padding.top}
                    x2={tooltipPosition.x}
                    y2={chartHeight - padding.bottom}
                    stroke="#60a5fa"
                    strokeWidth={1}
                    strokeDasharray="3,3"
                  />
                )}
              </svg>

              {/* Tooltip */}
              {showTooltip && hoverPoint && (
                <div
                  className="absolute bg-white border border-gray-200 shadow-sm rounded p-2 pointer-events-none z-10"
                  style={{
                    left: tooltipPosition.x + 10,
                    top: tooltipPosition.y - 40,
                    transform: 'translateX(-50%)',
                  }}
                >
                  <div className="text-xs font-medium">{hoverPoint.time}</div>
                  <div className="text-sm font-bold">${hoverPoint.price.toFixed(2)}</div>
                </div>
              )}
            </div>

            {/* Additional info */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 bg-gray-50 rounded border border-gray-200">
                <div className="text-xs text-gray-600 font-medium">Day Range</div>
                <div className="text-sm font-semibold mt-1">
                  ${dayRangeLow} - ${dayRangeHigh}
                </div>
              </div>
              <div className="p-2 bg-green-50 rounded border border-green-100">
                <div className="text-xs text-green-600 font-medium">52W High</div>
                <div className="text-sm font-semibold mt-1">
                  ${weekHigh}
                </div>
              </div>
              <div className="p-2 bg-red-50 rounded border border-red-100">
                <div className="text-xs text-red-600 font-medium">52W Low</div>
                <div className="text-sm font-semibold mt-1">
                  ${weekLow}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm" className="text-xs border-gray-200 text-gray-600 hover:bg-gray-50">
            View Full Market Data
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardContent>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f9fafb; /* gray-50 */
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb; /* gray-200 */
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db; /* gray-300 */
        }
      `}</style>
    </Card>
  );
};

export default MarketSummary; 