"use client";

import React, { useState } from 'react';
import TopHeader from '@/components/dashboard/TopHeader';
import Sidebar from '@/components/dashboard/Sidebar';
import ChatWrapper from './ChatWrapper';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader username="Trader" onToggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
      
      {/* Floating Chat Component */}
      <ChatWrapper />
    </div>
  );
} 