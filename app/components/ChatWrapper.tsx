"use client";

import { usePathname } from 'next/navigation';
import FloatingChat from './FloatingChat';

const ChatWrapper = () => {
  const pathname = usePathname();
  
  // Don't show chat on the chart-with-chat route
  if (pathname?.includes('/chart-with-chat')) {
    return null;
  }
  
  return <FloatingChat />;
};

export default ChatWrapper; 