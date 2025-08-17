'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, RefreshCw, Send, User, MessageSquare, X } from 'lucide-react';
import { Message, useChat } from './ChatContext';
import { fetchStockDetails, formatStockData } from '@/services/stockDataService';

interface ChatProps {
  analysis: any;
  onClose?: () => void;
}

interface MarkdownComponentProps {
  node?: any;
  children?: React.ReactNode;
  href?: string;
  className?: string;
}

export function Chat({ analysis, onClose }: ChatProps) {
  const { 
    messages, 
    addMessage, 
    setMessages, 
    isLoading: chatLoading, 
    setIsLoading: setChatLoading,
    userHasScrolled,
    setUserHasScrolled
  } = useChat();
  
  const [userInput, setUserInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const welcomeMessageShownRef = useRef(false);
  const analysisRef = useRef(analysis);

  // Beginner trading questions for quick access
  const beginnerQuestions = [
    "What does P/E ratio mean?",
    "How do I read this stock chart?",
    "What is a good entry point for this stock?",
    "Is it a good time to buy this stock?",
    "What are support and resistance levels?",
    "How important is volume in trading?",
    "What's moving the market today?",
    "How do I interpret the RSI indicator?",
  ];

  // Update the ref when analysis changes to avoid triggering effects
  useEffect(() => {
    analysisRef.current = analysis;
  }, [analysis]);

  // Function to format timestamp
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  // Handle sending messages with stable callback reference
  const handleSendMessage = useCallback(async () => {
    if (userInput.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: userInput,
      timestamp: new Date()
    };
    addMessage(userMessage);
    setUserInput('');
    setShowSuggestions(false);

    // Set loading state
    setChatLoading(true);

    try {
      // First fetch fresh stock data from the liveData.py API
      const freshStockData = await fetchStockDetails(analysisRef.current.stockSymbol);
      
      // Format the fresh data for analysis
      const formattedData = formatStockData(freshStockData, analysisRef.current.stockSymbol);
      
      // Merge the formatted data with the current analysis object
      const updatedAnalysis = {
        ...analysisRef.current,
        ...formattedData,
        rawData: freshStockData  // Include the complete raw API response
      };

      // Call Gemini API to get response - sending the freshly fetched data
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
          analysis: updatedAnalysis
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      
      // Add assistant message
      addMessage({
        role: 'assistant',
        content: data.message || 'I apologize, but I could not generate a response. Please try again.',
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error getting response:', error);
      
      // Add error message
      addMessage({
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please check if the backend API is running and try again.',
        timestamp: new Date()
      });
    } finally {
      setChatLoading(false);
    }
  }, [userInput, addMessage, setChatLoading]);

  // Handle question suggestion click
  const handleQuestionClick = (question: string) => {
    setUserInput(question);
    setShowSuggestions(false);
  };

  // Handle scroll to auto-scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current && !userHasScrolled) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [userHasScrolled]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Watch for user scrolling
  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
    
    if (!isAtBottom) {
      setUserHasScrolled(true);
    } else {
      setUserHasScrolled(false);
    }
  }, [setUserHasScrolled]);

  // Add scroll event listener
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
      return () => {
        chatContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  // Initial setup - add welcome message once
  useEffect(() => {
    // If analysis is null or undefined, don't proceed
    if (!analysis || welcomeMessageShownRef.current) return;
    
    // Always show welcome message on component mount, regardless of existing messages
    addMessage({
      role: 'assistant',
      content: `# Welcome! I'm AI Analyst, your financial advisor assistant.\n\nI can analyze stock charts and provide trading insights based on technical indicators. Ask me questions about market conditions, trading strategies, or specific stock performance.\n\nHow can I help with your trading decisions today?`,
      timestamp: new Date()
    });
    welcomeMessageShownRef.current = true;
    
  }, [analysis, addMessage]);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 to-gray-950">
      {/* Header */}
      <div className="bg-gray-800/60 backdrop-blur-md border-b border-gray-700/50 p-2.5 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-7 h-7 rounded-full bg-blue-600/20 flex items-center justify-center">
            <Bot className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <span className="ml-2 text-sm font-medium text-gray-200">AI Analyst</span>
        </div>
        
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200 transition-colors">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Message container with proper scrolling */}
      <div 
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto py-4 px-3 scroll-smooth space-y-4"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 #111827' }}
      >
        {messages.map((message: Message, index: number) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] flex ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div 
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-blue-600/20 text-blue-400 ml-2' 
                    : 'bg-gray-700/30 text-gray-300 mr-2'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="h-3.5 w-3.5" />
                ) : (
                  <Bot className="h-3.5 w-3.5" />
                )}
              </div>
              
              <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div 
                  className={`px-3 py-2 rounded-lg shadow-sm mb-1 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-gray-700 text-white rounded-tl-none border border-gray-600'
                  }`}
                >
                  <div className="prose prose-invert prose-sm max-w-none">
                    {message.content ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ node, ...props }) => <p className="mb-1 last:mb-0 text-white" {...props} />,
                          a: (props) => (
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline"
                              {...props}
                            />
                          ),
                          h1: (props) => <h1 className="text-lg font-bold mt-2 mb-1 text-white" {...props} />,
                          h2: (props) => <h2 className="text-base font-semibold mt-2 mb-1 text-white" {...props} />,
                          h3: (props) => <h3 className="text-sm font-semibold mt-1.5 mb-1 text-white" {...props} />,
                          ul: (props) => <ul className="list-disc pl-4 mb-1 text-gray-100" {...props} />,
                          ol: (props) => <ol className="list-decimal pl-4 mb-1 text-gray-100" {...props} />,
                          li: (props) => <li className="mb-0.5 text-gray-100" {...props} />,
                          blockquote: (props) => (
                            <blockquote
                              className="border-l-2 border-gray-500 pl-2 text-gray-300 italic my-1"
                              {...props}
                            />
                          ),
                          hr: () => <hr className="border-gray-600 my-2" />,
                          table: (props) => (
                            <div className="overflow-x-auto my-1">
                              <table className="table-auto border-collapse w-full text-xs text-gray-100" {...props} />
                            </div>
                          ),
                          tr: (props) => <tr className="border-b border-gray-700" {...props} />,
                          th: (props) => (
                            <th className="px-2 py-1 text-left font-medium text-gray-300" {...props} />
                          ),
                          td: (props) => <td className="px-2 py-1 text-gray-100" {...props} />,
                          code: (props: React.ClassAttributes<HTMLElement> & React.HTMLAttributes<HTMLElement> & { className?: string }) => {
                            if (props.className) {
                              return <code {...props} className="text-xs text-gray-100" />;
                            }
                            return (
                              <code
                                className="bg-gray-800/50 text-gray-200 px-1 py-0.5 rounded-md text-xs font-mono"
                                {...props}
                              />
                            );
                          },
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="text-white text-sm italic">No message content</p>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-gray-500">
                  {message.timestamp && formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {chatLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-transparent text-gray-300 rounded-lg rounded-tl-sm border border-gray-700/30 px-3 py-2 shadow-sm backdrop-blur-sm">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-600/20 to-gray-700/20 p-0.5 shadow-sm ring-1 ring-gray-600/20 flex items-center justify-center">
                <Bot className="h-3 w-3 text-gray-300" />
              </div>
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Suggested questions for beginners */}
      {showSuggestions && (
        <div className="p-2 border-t border-gray-800/50 bg-gray-800/20">
          <p className="text-xs text-gray-400 mb-2">Suggested questions for beginners:</p>
          <div className="flex flex-wrap gap-2">
            {beginnerQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(question)}
                className="px-2.5 py-1 bg-gray-800/60 hover:bg-blue-600/20 border border-gray-700/40 hover:border-blue-500/30 rounded-full text-xs text-gray-300 whitespace-nowrap transition-all duration-200 hover:text-blue-300"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Input area - ensure it's visible and has a fixed height */}
      <div className="p-3 border-t border-gray-800/50 bg-gray-800/40">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask about the market analysis..."
            className="flex-grow bg-gray-800/70 text-gray-200 placeholder-gray-500 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600/50 border border-gray-700/50 text-xs"
          />
          <button
            type="submit"
            disabled={chatLoading}
            className={`bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-md shadow-md transition-colors duration-200 ${
              chatLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Send className="h-3 w-3" />
          </button>
        </form>
        <div className="text-[10px] text-center mt-1 text-gray-500">
          Powered by Google Gemini
        </div>
      </div>
    </div>
  );
} 
