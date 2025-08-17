'use client';

import React from 'react';
import { Geist, Geist_Mono } from "next/font/google";

// Use the same font definitions as the root layout
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// This injects styles at the component level rather than the layout level
const ChartStyles = () => {
  React.useEffect(() => {
    // Create style element
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      /* Hide TradingView header and any other unwanted headers */
      body .tv-header,
      body .header-chart-panel,
      body header[data-role="header"],
      body .chart-container__top-toolbar,
      body .ui-draggable-handle,
      /* Hide any parent layout elements */
      #root-layout-header,
      .app-header,
      .app-layout-header,
      .global-header,
      header,
      .main-header,
      .top-header,
      .global-navigation,
      nav[role="navigation"],
      [data-testid="header"],
      [data-testid="top-header"],
      [data-testid="global-header"] {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
      
      /* Override any padding/margin from the default layout */
      body {
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        background-color: #111827 !important;
        height: 100vh !important;
        max-height: 100vh !important;
        position: fixed !important;
        width: 100% !important;
      }
    
      /* Make sure the page takes full height */
      html, body, #__next, main {
        height: 100% !important;
        overflow: hidden !important;
        max-height: 100vh !important;
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  return null;
};

export default function ChartWithChatTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`} 
         style={{ position: 'fixed', inset: 0, height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <ChartStyles />
      {children}
    </div>
  );
} 