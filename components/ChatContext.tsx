'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatContextType {
  messages: Message[];
  addMessage: (message: Message) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  userHasScrolled: boolean;
  setUserHasScrolled: React.Dispatch<React.SetStateAction<boolean>>;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const welcomeMessageShownRef = React.useRef(false);

  const addMessage = (message: Message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  const clearMessages = () => {
    setMessages([]);
    welcomeMessageShownRef.current = false;
  };

  // Initial setup - add welcome message once on mount
  useEffect(() => {
    if (messages.length === 0 && !welcomeMessageShownRef.current) {
      addMessage({
        role: 'assistant',
        content: `# Welcome! I'm AI Analyst, your financial advisor assistant.\n\nI can analyze stock charts and provide trading insights based on technical indicators. Ask me questions about market conditions, trading strategies, or specific stock performance.\n\nHow can I help with your trading decisions today?`,
        timestamp: new Date()
      });
      welcomeMessageShownRef.current = true;
    }
  }, [messages.length, addMessage]);

  return (
    <ChatContext.Provider value={{ 
      messages, 
      addMessage, 
      setMessages, 
      isLoading, 
      setIsLoading,
      userHasScrolled,
      setUserHasScrolled,
      clearMessages
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
} 