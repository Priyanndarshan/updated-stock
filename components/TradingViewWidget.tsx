'use client';

import React, { useEffect, useRef, memo, useState } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
  theme?: 'light' | 'dark';
  autosize?: boolean;
  height?: number;
  width?: number | string;
}

function TradingViewWidget({ 
  symbol = 'NASDAQ:AAPL', 
  theme = 'dark',
  autosize = true,
  height = 500,
  width = '100%'
}: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);
  const [lastLoadedSymbol, setLastLoadedSymbol] = useState(symbol);
  const scriptLoadedRef = useRef(false);

  // Only update the chart when symbol actually changes
  useEffect(() => {
    if (symbol !== lastLoadedSymbol) {
      setLastLoadedSymbol(symbol);
    }
  }, [symbol]);

  useEffect(() => {
    // If script is already loaded, don't reload it
    if (scriptLoadedRef.current) return;

    // Create a new script element
    const script = document.createElement('script');
    script.id = 'tradingview-widget-script';
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      scriptLoadedRef.current = true;
      initializeWidget();
    };
    document.head.appendChild(script);

    return () => {
      // No need to remove the script on every render
    };
  }, []); // Empty dependency array - only run once on mount

  // Initialize or update the widget with current symbol
  const initializeWidget = () => {
    if (container.current && typeof window.TradingView !== 'undefined') {
      // Clear the container
      container.current.innerHTML = '';
      
      // Create the widget
      new window.TradingView.widget({
        autosize: autosize,
        symbol: lastLoadedSymbol,
        interval: 'D',
        timezone: 'Etc/UTC',
        theme: theme,
        style: '1',
        locale: 'en',
        enable_publishing: false,
        hide_top_toolbar: true,
        hide_side_toolbar: true,
        allow_symbol_change: true,
        container_id: container.current.id,
        studies: [
          'MASimple@tv-basicstudies',
          'RSI@tv-basicstudies',
          'MACD@tv-basicstudies'
        ],
        width: width,
        height: height,
      });
    }
  };

  // Update widget when symbol changes
  useEffect(() => {
    if (scriptLoadedRef.current) {
      initializeWidget();
    }
  }, [lastLoadedSymbol, theme]);

  return (
    <div className="tradingview-widget-container" style={{ height: '100%', width: '100%' }}>
      <div id="tradingview_widget" ref={container} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}

// Use memo to prevent unnecessary re-renders
export default memo(TradingViewWidget);

// Add this to make TypeScript happy with the TradingView global
declare global {
  interface Window {
    TradingView: any;
  }
} 