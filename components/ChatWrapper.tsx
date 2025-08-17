"use client";

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import FloatingChat from './FloatingChat';

const ChatWrapper = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Check if we should hide the chat component
    const shouldHide = pathname?.includes('/chart-with-chat');
    
    // Set visibility with delay for animation
    setIsVisible(!shouldHide);
    
    // Add scroll event listener to adjust chat based on scroll
    const handleScroll = () => {
      // You could implement scroll-aware behavior here if needed
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);
  
  if (!isVisible) return null;
  
  return (
    <div className="chat-wrapper-container animate-fadeIn">
      <FloatingChat />
    </div>
  );
};

export default ChatWrapper; 