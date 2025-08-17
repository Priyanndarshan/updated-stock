"use client";

import React, { useEffect, useState } from 'react';
import { format, addMinutes, parseISO } from 'date-fns';
import { Search, X, Download, ChevronDown, BarChart4, Calendar, Tag, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';
import { 
  ComposedChart, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine,
  Brush,
  Area
} from 'recharts';

// Sample data for the stocks
const focusedAreaData = [
  { id: 1, date: new Date(2025, 2, 13), title: 'BANKNIFTY', action: 'Download' },
  { id: 2, date: new Date(2025, 2, 13), title: 'NIFTY', action: 'Download' },
  { id: 3, date: new Date(2025, 2, 12), title: 'BANKNIFTY', action: 'Download' },
  { id: 4, date: new Date(2025, 2, 11), title: 'BANKNIFTY', action: 'Download' },
  { id: 5, date: new Date(2025, 2, 11), title: 'NIFTY', action: 'Download' },
  { id: 6, date: new Date(2025, 2, 10), title: 'BANKNIFTY', action: 'Download' },
  { id: 7, date: new Date(2025, 2, 10), title: 'NIFTY', action: 'Download' },
  { id: 8, date: new Date(2025, 2, 7), title: 'BANKNIFTY', action: 'Download' },
  { id: 9, date: new Date(2025, 2, 7), title: 'NIFTY', action: 'Download' },
];

// Helper function to generate realistic OHLC data for 30-minute intervals
const generateStockData = (symbol: string, date: Date) => {
  const basePrice = symbol === 'BANKNIFTY' ? 52000 : 25000;
  const volatility = symbol === 'BANKNIFTY' ? 150 : 70;
  const intervals = 13; // 30-minute intervals in a 6.5 hour trading day
  
  const data = [];
  let currentPrice = basePrice;
  
  // Start time 9:15 AM
  let currentTime = new Date(date);
  currentTime.setHours(9, 15, 0, 0);
  
  for (let i = 0; i < intervals; i++) {
    // More realistic OHLC calculation with price movement trends
    const open = currentPrice;
    
    // Trend bias (market tends to follow a trend)
    const trendBias: number = i > 0 
      ? (data[i-1].close > data[i-1].open ? 0.6 : 0.4) 
      : 0.5;
    
    // Movement direction based on trend bias
    const movementUp: boolean = Math.random() < trendBias;
    
    // Calculate high and low based on volatility and trend
    const highDelta: number = Math.random() * volatility * (movementUp ? 1.2 : 0.8);
    const lowDelta: number = Math.random() * volatility * (movementUp ? 0.8 : 1.2);
    
    const high: number = open + highDelta;
    const low: number = Math.max(open - lowDelta, open * 0.98);
    
    // Close price calculation - follows the trend with some randomness
    const closeRange: number = high - low;
    const closePosition: number = movementUp ? 
      0.5 + (Math.random() * 0.5) : // Upper half for uptrend
      Math.random() * 0.5;          // Lower half for downtrend
    
    const close: number = low + (closeRange * closePosition);
    
    // Volume calculation - higher on trend changes or high volatility
    const volumeBase = Math.floor(Math.random() * 10000000) + 1000000;
    const volumeFactor = (Math.abs(close - open) / open) * 10; // Higher volume on larger moves
    const volume = Math.floor(volumeBase * (1 + volumeFactor));
    
    // Add 30-minute interval data
    data.push({
      time: format(currentTime, 'HH:mm'),
      timestamp: currentTime.getTime(),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: volume,
      gain: close > open,
    });
    
    // Update for next interval
    currentPrice = close;
    currentTime = addMinutes(currentTime, 30);
  }
  
  return data;
};

// Get unique titles from data for dropdown
const uniqueTitles = Array.from(new Set(focusedAreaData.map(item => item.title)));

// Custom tooltip for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
        <p className="font-semibold text-gray-800 mb-1">{label}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <p className="text-sm text-gray-600">Open:</p>
          <p className="text-sm font-medium text-gray-800">{data.open.toLocaleString()}</p>
          <p className="text-sm text-gray-600">High:</p>
          <p className="text-sm font-medium text-green-600">{data.high.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Low:</p>
          <p className="text-sm font-medium text-red-600">{data.low.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Close:</p>
          <p className={`text-sm font-medium ${data.gain ? 'text-green-600' : 'text-red-600'}`}>
            {data.close.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">Volume:</p>
          <p className="text-sm font-medium text-gray-800">{data.volume.toLocaleString()}</p>
        </div>
      </div>
    );
  }
  return null;
};

// Custom ChartCanvas component that includes candlesticks
const CandlestickChart = ({ data, width = 500, height = 300 }: { data: any[], width?: number, height?: number }) => {
  const [tooltip, setTooltip] = useState<{ visible: boolean, x: number, y: number, data: any }>({
    visible: false,
    x: 0,
    y: 0,
    data: null
  });
  
  // Scales for the chart
  const xScale = (index: number) => width * (index + 0.5) / data.length;
  const padding = { top: 30, right: 60, bottom: 50, left: 70 };
  const chartHeight = height - padding.top - padding.bottom;
  const chartWidth = width - padding.left - padding.right;
  
  const yMin = Math.min(...data.map(d => d.low)) * 0.999;
  const yMax = Math.max(...data.map(d => d.high)) * 1.001;
  const yRange = yMax - yMin;
  
  // Scale for y axis
  const yScale = (value: number) => chartHeight - ((value - yMin) / yRange * chartHeight) + padding.top;
  
  // Format price values
  const formatPrice = (price: number) => price.toLocaleString();
  
  // Handle hover
  const handleMouseMove = (event: React.MouseEvent, entry: any) => {
    setTooltip({
      visible: true,
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
      data: entry
    });
  };
  
  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false });
  };
  
  return (
    <div className="relative" style={{ width: '100%', height: '100%' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        {/* Background */}
        <rect 
          x="0" 
          y="0" 
          width={width} 
          height={height} 
          fill="#f8fafc" 
          rx="4" 
          ry="4"
        />
        
        {/* Chart area background */}
        <rect 
          x={padding.left} 
          y={padding.top} 
          width={chartWidth} 
          height={chartHeight} 
          fill="#ffffff" 
          stroke="#e2e8f0" 
          strokeWidth={1}
        />
        
        {/* Title */}
        <text x={padding.left} y={20} fontSize={12} fontWeight="bold" fill="#334155">
          OHLC Chart - 30-Minute Intervals
        </text>
        
        {/* Y-axis */}
        <line 
          x1={padding.left} 
          y1={padding.top} 
          x2={padding.left} 
          y2={height - padding.bottom} 
          stroke="#cbd5e1" 
          strokeWidth={1} 
        />
        
        {/* Y-axis labels and gridlines */}
        {[0, 0.2, 0.4, 0.6, 0.8, 1].map((ratio, i) => {
          const y = padding.top + (chartHeight * ratio);
          const price = yMax - (yRange * ratio);
          return (
            <g key={`grid-y-${i}`}>
              <line
                x1={padding.left - 5}
                x2={width - padding.right}
                y1={y}
                y2={y}
                stroke={i === 0 ? "#cbd5e1" : "#e2e8f0"}
                strokeDasharray={i === 0 ? "0" : "2,2"}
                strokeWidth={1}
              />
              <text x={10} y={y + 4} fill="#64748b" fontSize={10} textAnchor="start" fontFamily="system-ui">
                {formatPrice(price)}
              </text>
            </g>
          );
        })}
        
        {/* X-axis */}
        <line 
          x1={padding.left} 
          y1={height - padding.bottom} 
          x2={width - padding.right} 
          y2={height - padding.bottom} 
          stroke="#cbd5e1" 
          strokeWidth={1} 
        />
        
        {/* X-axis gridlines and labels */}
        {data.map((entry, index) => {
          const x = padding.left + ((chartWidth) / (data.length - 1)) * index;
          return (
            <g key={`x-${index}`}>
              {index % 2 === 0 && (
                <>
                  <line
                    x1={x}
                    x2={x}
                    y1={padding.top}
                    y2={height - padding.bottom}
                    stroke="#e2e8f0"
                    strokeDasharray="2,2"
                    strokeOpacity={0.5}
                  />
                  <text 
                    x={x} 
                    y={height - padding.bottom + 15} 
                    fill="#64748b" 
                    fontSize={10}
                    fontFamily="system-ui"
                    textAnchor="middle"
                  >
                    {entry.time}
                  </text>
                </>
              )}
            </g>
          );
        })}
        
        {/* Highest price line */}
        {data.length > 0 && (
          <g>
            <line
              x1={padding.left}
              x2={width - padding.right}
              y1={yScale(yMax)}
              y2={yScale(yMax)}
              stroke="#10b981"
              strokeWidth={1.5}
              strokeDasharray="3,3"
            />
            {/* Highlighted area for high price */}
            <rect
              x={padding.left}
              y={yScale(yMax) - 10}
              width={chartWidth}
              height={2}
              fill="#10b981"
              fillOpacity={0.3}
            />
            {/* Label with background */}
            <rect 
              x={width - padding.right + 3}
              y={yScale(yMax) - 8}
              width={55}
              height={16}
              fill="#e6f7f0"
              stroke="#10b981"
              strokeWidth={1}
              rx={3}
              ry={3}
            />
            <text 
              x={width - padding.right + 6} 
              y={yScale(yMax) + 4}
              fill="#10b981"
              fontSize={10}
              fontWeight="bold"
              fontFamily="system-ui"
              textAnchor="start"
            >
              H: {formatPrice(yMax)}
            </text>
            {/* Price label on left side too */}
            <rect 
              x={padding.left - 65}
              y={yScale(yMax) - 8}
              width={60}
              height={16}
              fill="#e6f7f0"
              stroke="#10b981"
              strokeWidth={1}
              rx={3}
              ry={3}
            />
            <text 
              x={padding.left - 60} 
              y={yScale(yMax) + 4}
              fill="#10b981"
              fontSize={10}
              fontWeight="bold"
              fontFamily="system-ui"
              textAnchor="start"
            >
              HIGH: {formatPrice(yMax)}
            </text>
          </g>
        )}
        
        {/* Lowest price line */}
        {data.length > 0 && (
          <g>
            <line
              x1={padding.left}
              x2={width - padding.right}
              y1={yScale(yMin)}
              y2={yScale(yMin)}
              stroke="#ef4444"
              strokeWidth={1.5}
              strokeDasharray="3,3"
            />
            {/* Highlighted area for low price */}
            <rect
              x={padding.left}
              y={yScale(yMin) - 1}
              width={chartWidth}
              height={2}
              fill="#ef4444"
              fillOpacity={0.3}
            />
            {/* Label with background */}
            <rect 
              x={width - padding.right + 3}
              y={yScale(yMin) - 8}
              width={55}
              height={16}
              fill="#fde8e8"
              stroke="#ef4444"
              strokeWidth={1}
              rx={3}
              ry={3}
            />
            <text 
              x={width - padding.right + 6} 
              y={yScale(yMin) + 4}
              fill="#ef4444"
              fontSize={10}
              fontWeight="bold"
              fontFamily="system-ui"
              textAnchor="start"
            >
              L: {formatPrice(yMin)}
            </text>
            {/* Price label on left side too */}
            <rect 
              x={padding.left - 65}
              y={yScale(yMin) - 8}
              width={60}
              height={16}
              fill="#fde8e8"
              stroke="#ef4444"
              strokeWidth={1}
              rx={3}
              ry={3}
            />
            <text 
              x={padding.left - 60} 
              y={yScale(yMin) + 4}
              fill="#ef4444"
              fontSize={10}
              fontWeight="bold"
              fontFamily="system-ui"
              textAnchor="start"
            >
              LOW: {formatPrice(yMin)}
            </text>
          </g>
        )}
        
        {/* Render candlesticks */}
        <g className="candlestick-series">
          {data.map((entry, index) => {
            const { open, close, high, low, gain } = entry;
            
            // Calculate the positions
            const x = padding.left + ((chartWidth) / (data.length - 1)) * index;
            const width = Math.max(chartWidth / data.length * 0.6, 6); // Min width of 6px
            const candleX = x - width / 2;
            
            // Y positions based on price
            const openY = yScale(open);
            const closeY = yScale(close);
            const highY = yScale(high);
            const lowY = yScale(low);
            
            // Candle body dimensions
            const candleHeight = Math.abs(closeY - openY) || 1; // Ensure at least 1px height
            const candleY = gain ? closeY : openY;
            
            // Colors for up/down candles - more professional colors
            const candleFill = gain ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)';
            const candleStroke = gain ? '#059669' : '#dc2626';
            
            return (
              <g key={`candle-${index}`}
                onMouseMove={(e) => handleMouseMove(e, entry)}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: 'pointer' }}
              >
                {/* Wick line */}
                <line
                  x1={x}
                  x2={x}
                  y1={highY}
                  y2={lowY}
                  stroke={candleStroke}
                  strokeWidth={1.5}
                />
                
                {/* Candle body */}
                <rect
                  x={candleX}
                  y={candleY}
                  width={width}
                  height={candleHeight}
                  fill={candleFill}
                  stroke={candleStroke}
                  strokeWidth={1}
                  rx={1}
                  ry={1}
                />
              </g>
            );
          })}
        </g>
        
        {/* Reference line for opening price */}
        {data.length > 0 && (
          <line
            x1={padding.left}
            x2={width - padding.right}
            y1={yScale(data[0].open)}
            y2={yScale(data[0].open)}
            stroke="#94a3b8"
            strokeDasharray="3,3"
            strokeWidth={1}
          />
        )}
        
        {/* Chart Border */}
        <rect 
          x={0} 
          y={0} 
          width={width} 
          height={height} 
          fill="none" 
          stroke="#e2e8f0" 
          strokeWidth={1}
          rx="4"
          ry="4"
        />
      </svg>
      
      {/* Tooltip */}
      {tooltip.visible && tooltip.data && (
        <div 
          className="absolute bg-white p-3 border border-gray-200 shadow-lg rounded-md z-10"
          style={{ 
            left: tooltip.x + 10, 
            top: tooltip.y + 10,
            transform: tooltip.x > width - 150 ? 'translateX(-100%)' : 'none',
            transition: 'opacity 0.2s ease-in-out',
          }}
        >
          <div className="font-semibold text-gray-800 text-xs mb-2 pb-1 border-b border-gray-100">
            {tooltip.data.time}
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
            <p className="text-gray-600">Open:</p>
            <p className="font-medium text-gray-800">{formatPrice(tooltip.data.open)}</p>
            <p className="text-gray-600">High:</p>
            <p className="font-medium text-green-600">{formatPrice(tooltip.data.high)}</p>
            <p className="text-gray-600">Low:</p>
            <p className="font-medium text-red-600">{formatPrice(tooltip.data.low)}</p>
            <p className="text-gray-600">Close:</p>
            <p className={`font-medium ${tooltip.data.gain ? 'text-green-600' : 'text-red-600'}`}>
              {formatPrice(tooltip.data.close)}
            </p>
            <p className="text-gray-600">Change:</p>
            <p className={`font-medium ${tooltip.data.gain ? 'text-green-600' : 'text-red-600'}`}>
              {tooltip.data.gain ? '+' : '-'}
              {Math.abs(tooltip.data.close - tooltip.data.open).toFixed(2)} 
              ({Math.abs((tooltip.data.close - tooltip.data.open) / tooltip.data.open * 100).toFixed(2)}%)
            </p>
          </div>
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute top-2 right-2 bg-white/80 border border-gray-100 rounded-md px-2 py-1 flex gap-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
          <span className="text-gray-600">Bullish</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
          <span className="text-gray-600">Bearish</span>
        </div>
      </div>
    </div>
  );
};

// Custom Volume chart component
const VolumeChart = ({ data, width = 500, height = 150 }: { data: any[], width?: number, height?: number }) => {
  const [tooltip, setTooltip] = useState<{ visible: boolean, x: number, y: number, data: any }>({
    visible: false,
    x: 0,
    y: 0,
    data: null
  });
  
  // Chart padding
  const padding = { top: 10, right: 60, bottom: 30, left: 70 };
  const chartHeight = height - padding.top - padding.bottom;
  const chartWidth = width - padding.left - padding.right;
  
  // Scale
  const maxVolume = Math.max(...data.map(d => d.volume));
  
  // Format volume
  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `${(vol / 1000).toFixed(1)}K`;
    return vol.toString();
  };
  
  // Handle hover
  const handleMouseMove = (event: React.MouseEvent, entry: any) => {
    setTooltip({
      visible: true,
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
      data: entry
    });
  };
  
  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false });
  };
  
  return (
    <div className="relative" style={{ width: '100%', height: '100%' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        {/* Background */}
        <rect 
          x="0" 
          y="0" 
          width={width} 
          height={height} 
          fill="#f8fafc" 
          rx="4" 
          ry="4"
        />
        
        {/* Chart area background */}
        <rect 
          x={padding.left} 
          y={padding.top} 
          width={chartWidth} 
          height={chartHeight} 
          fill="#ffffff" 
          stroke="#e2e8f0" 
          strokeWidth={1}
        />
        
        {/* Y-axis */}
        <line 
          x1={padding.left} 
          y1={padding.top} 
          x2={padding.left} 
          y2={height - padding.bottom} 
          stroke="#cbd5e1" 
          strokeWidth={1} 
        />
        
        {/* Y-axis labels and gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = height - padding.bottom - (chartHeight * ratio);
          const vol = maxVolume * ratio;
          return (
            <g key={`grid-y-${i}`}>
              <line
                x1={padding.left - 5}
                x2={width - padding.right}
                y1={y}
                y2={y}
                stroke={i === 0 ? "#cbd5e1" : "#e2e8f0"}
                strokeDasharray={i === 0 ? "0" : "2,2"}
                strokeWidth={1}
              />
              <text x={10} y={y + 4} fill="#64748b" fontSize={10} fontFamily="system-ui" textAnchor="start">
                {formatVolume(vol)}
              </text>
            </g>
          );
        })}
        
        {/* X-axis */}
        <line 
          x1={padding.left} 
          y1={height - padding.bottom} 
          x2={width - padding.right} 
          y2={height - padding.bottom} 
          stroke="#cbd5e1" 
          strokeWidth={1} 
        />
        
        {/* Highest volume line */}
        {data.length > 0 && (
          <g>
            <line
              x1={padding.left}
              x2={width - padding.right}
              y1={height - padding.bottom - chartHeight}
              y2={height - padding.bottom - chartHeight}
              stroke="#64748b"
              strokeWidth={1}
              strokeDasharray="3,3"
            />
            <text 
              x={width - padding.right + 5} 
              y={height - padding.bottom - chartHeight + 4}
              fill="#64748b"
              fontSize={10}
              fontWeight="bold"
              fontFamily="system-ui"
              textAnchor="start"
            >
              Max: {formatVolume(maxVolume)}
            </text>
          </g>
        )}
        
        {/* Volume bars */}
        {data.map((entry, index) => {
          const x = padding.left + ((chartWidth) / (data.length - 1)) * index;
          const barWidth = Math.max(chartWidth / data.length * 0.6, 6);
          const barHeight = (entry.volume / maxVolume) * chartHeight;
          const barX = x - barWidth / 2;
          const barY = height - padding.bottom - barHeight;
          
          // Professional semi-transparent colors for volume bars
          const barFill = entry.gain 
            ? 'rgba(16, 185, 129, 0.4)' 
            : 'rgba(239, 68, 68, 0.4)';
          const barStroke = entry.gain ? '#059669' : '#dc2626';
          
          return (
            <g key={`vol-${index}`}
              onMouseMove={(e) => handleMouseMove(e, entry)}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill={barFill}
                stroke={barStroke}
                strokeWidth={0.8}
                rx={1}
                ry={1}
              />
            </g>
          );
        })}
        
        {/* Chart Border */}
        <rect 
          x={0} 
          y={0} 
          width={width} 
          height={height} 
          fill="none" 
          stroke="#e2e8f0" 
          strokeWidth={1}
          rx="4"
          ry="4"
        />
      </svg>
      
      {/* Tooltip */}
      {tooltip.visible && tooltip.data && (
        <div 
          className="absolute bg-white p-2 border border-gray-200 shadow-lg rounded-md z-10"
          style={{ 
            left: tooltip.x + 10, 
            top: tooltip.y - 10,
            transform: tooltip.x > width - 150 ? 'translateX(-100%)' : 'none',
            transition: 'opacity 0.2s ease-in-out',
          }}
        >
          <div className="font-semibold text-gray-800 text-xs mb-1 pb-1 border-b border-gray-100">
            {tooltip.data.time}
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
            <p className="text-gray-600">Volume:</p>
            <p className="font-medium text-gray-800">{tooltip.data.volume.toLocaleString()}</p>
            <p className="text-gray-600">Price:</p>
            <p className={`font-medium ${tooltip.data.gain ? 'text-green-600' : 'text-red-600'}`}>
              {tooltip.data.close.toLocaleString()}
            </p>
          </div>
        </div>
      )}
      
      <div className="absolute top-2 right-2 bg-white/80 border border-gray-100 rounded-md px-2 py-1 text-xs text-gray-700">
        Volume
      </div>
    </div>
  );
};

// Helper function to generate insights from chart data
const generateInsights = (data: any[], stats: any) => {
  if (!data || data.length === 0 || !stats) return null;
  
  // Calculate trend direction
  const trendDirection = stats.priceChange >= 0 ? "bullish" : "bearish";
  
  // Calculate volatility (average of high-low ranges)
  const volatility = data.reduce((sum, item) => sum + (item.high - item.low), 0) / data.length;
  const volatilityPercent = (volatility / stats.open) * 100;
  
  // Volume trend - compare first half to second half
  const halfIndex = Math.floor(data.length / 2);
  const firstHalfVolume = data.slice(0, halfIndex).reduce((sum, item) => sum + item.volume, 0);
  const secondHalfVolume = data.slice(halfIndex).reduce((sum, item) => sum + item.volume, 0);
  const volumeTrend = secondHalfVolume > firstHalfVolume ? "increasing" : "decreasing";
  
  // Count green vs red candles
  const greenCandles = data.filter(item => item.gain).length;
  const redCandles = data.length - greenCandles;
  
  // Identify potential support and resistance levels
  // For simplicity, use quartiles of the price range
  const priceRange = stats.high - stats.low;
  const resistanceLevel = stats.high - (priceRange * 0.25);
  const supportLevel = stats.low + (priceRange * 0.25);
  
  // Momentum analysis
  const endIndex = data.length - 1;
  const startIndex = Math.max(0, endIndex - 3); // Last 3 periods
  const recentTrend = data[endIndex].close > data[startIndex].close ? "positive" : "negative";
  
  // Relative strength - ratio of average gain to average loss
  const gains = data.filter(item => item.gain).map(item => item.close - item.open);
  const losses = data.filter(item => !item.gain).map(item => item.open - item.close);
  
  const avgGain = gains.length > 0 ? gains.reduce((sum, val) => sum + val, 0) / gains.length : 0;
  const avgLoss = losses.length > 0 ? losses.reduce((sum, val) => sum + val, 0) / losses.length : 0;
  
  const relativeStrength = avgLoss > 0 ? avgGain / avgLoss : avgGain > 0 ? 10 : 0;
  
  return {
    trendDirection,
    volatility,
    volatilityPercent,
    volumeTrend,
    greenCandles,
    redCandles, 
    resistanceLevel,
    supportLevel,
    recentTrend,
    relativeStrength
  };
};

export default function FocusedAreaPage() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);
  const [selectedTitle, setSelectedTitle] = React.useState<string>("");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [chartData, setChartData] = useState<any[]>([]);
  const [showChart, setShowChart] = useState(false);
  const [chartWidth, setChartWidth] = useState(0);
  const [chartHeight, setChartHeight] = useState(0);
  const chartContainerRef = React.useRef<HTMLDivElement>(null);

  // Filter data based on selected date and title
  const filteredData = React.useMemo(() => {
    return focusedAreaData.filter(item => {
      // Return all data if no filters are applied
      if (!selectedDate && !selectedTitle) return false;
      
      // Check date match (compare year, month, day)
      const dateMatches = selectedDate ? 
        item.date.getFullYear() === selectedDate.getFullYear() &&
        item.date.getMonth() === selectedDate.getMonth() &&
        item.date.getDate() === selectedDate.getDate() : true;
      
      // Check title match
      const titleMatches = selectedTitle ? item.title === selectedTitle : true;
      
      return dateMatches && titleMatches;
    });
  }, [selectedDate, selectedTitle]);

  // Generate chart data when selection changes
  useEffect(() => {
    if (selectedDate && selectedTitle) {
      setChartData(generateStockData(selectedTitle, selectedDate));
      setShowChart(true);
        } else {
      setShowChart(false);
    }
  }, [selectedDate, selectedTitle]);

  // Update chart dimensions when window resizes
  useEffect(() => {
    const updateChartDimensions = () => {
      if (chartContainerRef.current) {
        setChartWidth(chartContainerRef.current.clientWidth);
        setChartHeight(500); // Fixed height
      }
    };
    
    // Initial size
    updateChartDimensions();
    
    // Add resize listener
    window.addEventListener('resize', updateChartDimensions);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateChartDimensions);
  }, [showChart]);

  // Custom date setter that handles date selection
  const handleDateChange = (date: Date | undefined) => {
    if (date) setSelectedDate(date);
  };

  // Custom title setter that handles title selection
  const handleTitleChange = (title: string) => {
    setSelectedTitle(title);
  };

  const clearFilters = () => {
    setSelectedDate(undefined);
    setSelectedTitle("");
    setSearchQuery("");
    setShowChart(false);
  };

  // Calculate summary statistics
  const calculateStats = () => {
    if (!chartData || chartData.length === 0) return null;
    
    const closes = chartData.map(item => item.close);
    const volumes = chartData.map(item => item.volume);
    
    const openPrice = chartData[0].open;
    const closePrice = chartData[chartData.length - 1].close;
    const highPrice = Math.max(...chartData.map(item => item.high));
    const lowPrice = Math.min(...chartData.map(item => item.low));
    const totalVolume = volumes.reduce((sum, vol) => sum + vol, 0);
    const priceChange = closePrice - openPrice;
    const percentChange = (priceChange / openPrice) * 100;
    
    return {
      open: openPrice,
      close: closePrice,
      high: highPrice,
      low: lowPrice,
      priceChange,
      percentChange,
      totalVolume,
    };
  };
  
  const stats = calculateStats();
  
  // Generate market insights
  const insights = React.useMemo(() => {
    return generateInsights(chartData, stats);
  }, [chartData, stats]);

  // Recharts custom props for SVG elements
  const CustomizedDot = (props: any) => {
    const { cx, cy, stroke, payload, value } = props;
    
    if (payload.gain) {
      return <circle cx={cx} cy={cy} r={0} stroke="none" />;
    }
    
    return <circle cx={cx} cy={cy} r={0} stroke="none" />;
  };
  
  // Custom candlestick renderering using Recharts primitives
  const renderCandlesticks = () => {
    return chartData.map((item, index) => {
      const x = (chartWidth / chartData.length) * (index + 0.5);
      const width = chartWidth / chartData.length * 0.6;
      
      return (
        <g key={`candle-${index}`}>
          {/* Render candlestick here */}
        </g>
      );
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 mt-4">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>PET Zone</span>
          <span>/</span>
          <span className="text-gray-800 font-medium">Focused Area</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Stock Analysis</h1>
        <p className="text-gray-500">View detailed 30-minute candlestick charts for your selected stock and date</p>
      </div>

      <Card className="mb-6 border-gray-200 shadow-sm">
        <CardHeader className="pb-3 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium text-gray-700">Select Stock and Date</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Single Date Picker */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                Select Date
              </label>
                  <DatePicker 
                date={selectedDate} 
                setDate={handleDateChange}
                placeholder="Select date"
                    defaultMonth={new Date(2025, 2)}
                    className="w-full"
                  />
                </div>

            {/* Title Select */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Tag className="h-4 w-4 text-gray-500" />
                Select Stock
              </label>
              <Select value={selectedTitle} onValueChange={handleTitleChange}>
                    <SelectTrigger className="border-gray-200 bg-white">
                  <SelectValue placeholder="Select Stock" />
                    </SelectTrigger>
                    <SelectContent>
                  {uniqueTitles.map((title) => (
                    <SelectItem key={title} value={title}>
                      {title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFilters}
              className="border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {showChart && (
        <div className="space-y-6">
          {/* Stock Info Card */}
          {stats && (
            <Card className="border-gray-200 shadow-sm bg-white">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row justify-between mb-2">
                  <div>
                    <span className="text-xl font-bold text-gray-800">{selectedTitle}</span>
                    <Badge 
                      className={`ml-2 px-2 py-1 ${stats.percentChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {stats.percentChange >= 0 ? '▲' : '▼'} {Math.abs(stats.percentChange).toFixed(2)}%
            </Badge>
          </div>
                  <div className="text-sm text-gray-500">
                    {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
                  </div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-3">
                  <div className="bg-gray-50 rounded-md p-2">
                    <h3 className="text-xs font-medium text-gray-500">OPEN</h3>
                    <p className="text-sm font-semibold text-gray-800">{stats.open.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-md p-2">
                    <h3 className="text-xs font-medium text-gray-500">CLOSE</h3>
                    <p className={`text-sm font-semibold ${stats.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.close.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-md p-2">
                    <h3 className="text-xs font-medium text-gray-500">HIGH</h3>
                    <p className="text-sm font-semibold text-green-600">{stats.high.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-md p-2">
                    <h3 className="text-xs font-medium text-gray-500">LOW</h3>
                    <p className="text-sm font-semibold text-red-600">{stats.low.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-md p-2">
                    <h3 className="text-xs font-medium text-gray-500">CHANGE</h3>
                    <p className={`text-sm font-semibold ${stats.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.priceChange.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-md p-2">
                    <h3 className="text-xs font-medium text-gray-500">VOLUME</h3>
                    <p className="text-sm font-semibold text-gray-800">{(stats.totalVolume / 1000000).toFixed(2)}M</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chart Card */}
          <Card className="border-gray-200 shadow-sm overflow-hidden bg-white">
            <CardHeader className="pb-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-medium text-gray-800 flex items-center gap-2">
                    <BarChart4 className="h-5 w-5 text-teal-600" />
                    30-Minute Candlestick Chart
                  </CardTitle>
                  <CardDescription className="text-gray-500 mt-1">
                    Intraday price movement in 30-minute intervals
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-200 hover:bg-gray-50"
                  >
                    <Maximize2 className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-200 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[500px] w-full p-4" ref={chartContainerRef}>
                {chartData.length > 0 && (
                  <CandlestickChart 
                    data={chartData}
                    width={chartWidth || 800}
                    height={450}
                  />
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Volume Chart */}
          <Card className="border-gray-200 shadow-sm overflow-hidden bg-white">
            <CardHeader className="py-2 border-b border-gray-100">
              <CardTitle className="text-sm font-medium text-gray-700">Volume</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[150px] w-full p-4">
                {chartData.length > 0 && (
                  <VolumeChart 
                    data={chartData}
                    width={chartWidth || 800}
                    height={130}
                  />
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Market Insights Section */}
          {insights && (
            <Card className="border-gray-200 shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium text-gray-800 flex items-center gap-2">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="text-indigo-600"
                    >
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="16" x2="12" y2="12"/>
                      <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    Market Insights
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left column - Metrics and Analysis */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-1 mb-2">
                        Price Movement Analysis
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Market Trend:</span>
                          <span className={`text-sm font-medium ${insights.trendDirection === 'bullish' ? 'text-green-600' : 'text-red-600'}`}>
                            {insights.trendDirection.charAt(0).toUpperCase() + insights.trendDirection.slice(1)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Volatility:</span>
                          <span className="text-sm font-medium text-gray-800">
                            {insights.volatility.toFixed(2)} ({insights.volatilityPercent.toFixed(2)}%)
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Candle Distribution:</span>
                          <span className="text-sm font-medium text-gray-800">
                            <span className="text-green-600">{insights.greenCandles}</span> / <span className="text-red-600">{insights.redCandles}</span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Recent Momentum:</span>
                          <span className={`text-sm font-medium ${insights.recentTrend === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                            {insights.recentTrend.charAt(0).toUpperCase() + insights.recentTrend.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-1 mb-2">
                        Volume Analysis
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Volume Trend:</span>
                          <span className="text-sm font-medium text-gray-800">
                            {insights.volumeTrend.charAt(0).toUpperCase() + insights.volumeTrend.slice(1)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Avg Trade Volume:</span>
                          <span className="text-sm font-medium text-gray-800">
                            {stats?.totalVolume && chartData.length 
                              ? (stats.totalVolume / chartData.length / 1000000).toFixed(2) + 'M'
                              : '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right column - Technical Patterns and Key Levels */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-1 mb-2">
                        Technical Levels
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Resistance Level:</span>
                          <span className="text-sm font-medium text-gray-800">{insights.resistanceLevel.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Support Level:</span>
                          <span className="text-sm font-medium text-gray-800">{insights.supportLevel.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Relative Strength:</span>
                          <span className="text-sm font-medium text-gray-800">{insights.relativeStrength.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-1 mb-2">
                        Key Takeaways
                      </h3>
                      <div className="text-sm text-gray-600 space-y-2">
                        <p>
                          {insights.trendDirection === 'bullish' 
                            ? `The market shows ${insights.recentTrend === 'positive' ? 'strong' : 'moderate'} bullish momentum with support at ${insights.supportLevel.toLocaleString()}.`
                            : `The market shows ${insights.recentTrend === 'negative' ? 'strong' : 'moderate'} bearish momentum with resistance at ${insights.resistanceLevel.toLocaleString()}.`
                          }
                        </p>
                        <p>
                          Volume is {insights.volumeTrend}, indicating {insights.volumeTrend === 'increasing' 
                            ? 'increasing market participation and potential trend continuation.' 
                            : 'decreasing market participation and potential trend weakening.'}
                        </p>
                        <p>
                          The stock shows {insights.volatilityPercent > 1.5 ? 'high' : 'moderate'} intraday volatility at {insights.volatilityPercent.toFixed(2)}%, 
                          suggesting {insights.volatilityPercent > 1.5 ? 'cautious position sizing is recommended.' : 'normal trading conditions.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {!showChart && (
        <Card className="border-gray-200 shadow-sm bg-white">
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-center">
              <BarChart4 className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No chart to display</h3>
              <p className="text-gray-500 max-w-md">
                Select a stock and date to view the 30-minute candlestick chart data and analysis.
              </p>
            </div>
        </CardContent>
      </Card>
      )}
    </div>
  );
} 