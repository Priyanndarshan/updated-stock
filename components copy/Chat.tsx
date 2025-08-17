import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Button } from './ui/button';
import { Send, User, Bot, Loader2, BarChart2, RefreshCw, ArrowUpRight, CornerUpRight, MessageSquare, FileText, TrendingUp, DollarSign, Activity } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChatContext } from './ChatContext';
import { useLiveChartData } from '@/app/Chart/page';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

interface ChatProps {
  analysis: any;
  onClose?: () => void;
}

interface MarkdownComponentProps {
  node?: any;
  children?: React.ReactNode;
  [key: string]: any;
}

export function Chat({ analysis, onClose }: ChatProps) {
  const { messages, setMessages, addMessage } = useChatContext();
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const { liveData, updateLiveData } = useLiveChartData();
  const [livePriceUpdated, setLivePriceUpdated] = useState(false);
  const [userHasScrolled, setUserHasScrolled] = useState(false);

  const suggestions = [
    "Explain the current market trend",
    "What are the key support and resistance levels?",
    "Suggest a trading strategy for this stock",
    "What is the volume analysis telling us?",
    "What technical indicators should I watch?"
  ];

  const scrollToBottom = () => {
    if (!userHasScrolled && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isScrolledToBottom = scrollHeight - scrollTop - clientHeight < 50;
      
      if (!isScrolledToBottom) {
        setUserHasScrolled(true);
      } else {
        setUserHasScrolled(false);
      }
    }
  };

  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (latestMessage && latestMessage.role === 'assistant') {
      scrollToBottom();
    }
  }, [messages]);

  // Monitor liveData changes but with safeguards
  useEffect(() => {
    // Don't do anything here to prevent the infinite update loop
    // We'll only update data when user takes an action instead
  }, []); // Empty dependency array

  // Function to fetch live data from the Flask API - only called when user submits a query
  const fetchLiveDataFromAPI = async (symbol: string) => {
    try {
      console.log('Fetching live data from API for symbol:', symbol);
      const response = await fetch(`http://localhost:5000/stock-details?symbol=${symbol}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      console.log('Live data from API:', data);
      return data;
    } catch (error) {
      console.error('Error fetching live data from API:', error);
      // Return null but don't clear existing data
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMessage = {
      role: 'user' as const,
      content: inputValue.trim(),
      timestamp: new Date()
    };
    addMessage(userMessage);
    setInputValue('');
    setShowSuggestions(false);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Reset user scrolling state
    setUserHasScrolled(false);

    setLoading(true);

    try {
      // Get the stock symbol from analysis
      const stockSymbol = analysis?.stockSymbol || 'AAPL'; // Default to AAPL if no symbol provided
      
      // Store previous liveData to restore in case of API error
      const previousLiveData = liveData;
      
      // Fetch live data from the Flask API - ONLY make API call here when user asks a question
      const apiLiveData = await fetchLiveDataFromAPI(stockSymbol);
      
      // Create enhanced analysis with API data if available
      let currentData = analysis ? { ...analysis } : {};
      
      if (apiLiveData) {
        // Format the API data for the LLM
        currentData = {
          ...currentData,
          currentPrice: apiLiveData.regularMarketPrice?.toString() || currentData.currentPrice || 'N/A',
          volume: apiLiveData.regularMarketVolume?.toString() || currentData.volume || 'N/A',
          support: apiLiveData.fiftyTwoWeekLow?.toString() || currentData.support || 'N/A',
          resistance: apiLiveData.fiftyTwoWeekHigh?.toString() || currentData.resistance || 'N/A',
          dayChange: (apiLiveData.regularMarketPrice - apiLiveData.regularMarketPreviousClose)?.toFixed(2) || "N/A",
          dayChangePercent: ((apiLiveData.regularMarketPrice - apiLiveData.regularMarketPreviousClose) / apiLiveData.regularMarketPreviousClose * 100)?.toFixed(2) + "%" || "N/A",
          trend: apiLiveData.beta > 1 ? "Volatile" : (apiLiveData.beta < 0 ? "Downtrend" : "Stable"),
          stockName: apiLiveData.shortName || apiLiveData.longName || currentData.stockName,
          stockSymbol: stockSymbol
        };
        
        // Fix the trend determination to avoid linter error
        const trendValue = apiLiveData.beta > 1 ? 'Volatile' : (apiLiveData.beta < 0 ? 'Downtrend' : 'Stable');
        
        const formattedLiveData = {
          currentPrice: apiLiveData.regularMarketPrice?.toString() || previousLiveData.currentPrice || 'N/A',
          volume: apiLiveData.regularMarketVolume?.toString() || previousLiveData.volume || 'N/A',
          support: apiLiveData.fiftyTwoWeekLow?.toString() || previousLiveData.support || 'N/A',
          resistance: apiLiveData.fiftyTwoWeekHigh?.toString() || previousLiveData.resistance || 'N/A',
          dayChange: (apiLiveData.regularMarketPrice - apiLiveData.regularMarketPreviousClose)?.toFixed(2) || previousLiveData.dayChange || 'N/A',
          dayChangePercent: ((apiLiveData.regularMarketPrice - apiLiveData.regularMarketPreviousClose) / apiLiveData.regularMarketPreviousClose * 100)?.toFixed(2) + '%' || previousLiveData.dayChangePercent || 'N/A',
          trend: trendValue || previousLiveData.trend || 'Sideways',
          timestamp: new Date().toISOString()
        };
        
        // Update the liveData in the context to refresh the UI
        if (typeof updateLiveData === 'function') {
          updateLiveData(formattedLiveData);
          setLivePriceUpdated(true);
        }
      } else {
        // If API call fails, keep using the existing live data
        // Don't update or reset the LiveChartData context
        currentData = {
          ...currentData,
          currentPrice: liveData.currentPrice || currentData.currentPrice || 'N/A',
          trend: liveData.trend || currentData.trend || 'N/A',
          support: liveData.support || currentData.support || 'N/A',
          resistance: liveData.resistance || currentData.resistance || 'N/A',
          volume: liveData.volume || currentData.volume || 'N/A',
          dayChange: liveData.dayChange || "N/A",
          dayChangePercent: liveData.dayChangePercent || "N/A"
        };
      }
      
      const enhancedAnalysis = {
        ...currentData,
        liveData: apiLiveData ? {
          ...apiLiveData,
          timestamp: new Date().toISOString()
        } : {
          ...liveData,
          timestamp: new Date().toISOString()
        },
        isLiveData: !!apiLiveData, // True if we got API data
        lastUpdated: new Date().toISOString()
      };

      console.log('User Query:', inputValue.trim());
      console.log('Live Data from API included with query:', enhancedAnalysis);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue.trim(),
          analysis: enhancedAnalysis
        }),
      });

      const data = await response.json();
      
      if (data.message) {
        // Add timestamp to message
        addMessage({
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        });
      } else if (data.error) {
        addMessage({
          role: 'assistant',
          content: `Sorry, there was an error: ${data.error}. Please try asking in a different way.`,
          timestamp: new Date()
        });
      } else {
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error('Error submitting question:', error);
      
      // Don't clear data if there's an error, just show an error message
      addMessage({
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again or check if the API server is running.",
        timestamp: new Date()
      });
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
      textareaRef.current.focus();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const formatTime = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  // Create a simplified display of current stock data
  const renderLiveDataSummary = () => {
    // We're removing this component completely per user request
    return null;
  };

  // Function to update welcome message with live data
  const updateWelcomeMessageWithLiveData = (customLiveData?: any) => {
    // This function has been deprecated since we no longer show analysis data in welcome message
    // Keeping empty implementation to avoid breaking existing calls
    return;
  };

  // Focus textarea when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Initial setup - add welcome message once
  useEffect(() => {
    // If analysis is null or undefined, don't proceed
    if (!analysis) return;
    
    // If we're missing a welcome message, add one
    const hasWelcomeMessage = messages.some(
      msg => msg.role === 'assistant' && msg.content.includes("I'm ROAR AI")
    );
    
    if (!hasWelcomeMessage) {
      addMessage({
        role: 'assistant',
        content: `# Welcome! I'm ROAR AI, your financial advisor assistant.\n\nI can analyze stock charts and provide trading insights based on technical indicators. Ask me questions about market conditions, trading strategies, or specific stock performance.\n\nHow can I help with your trading decisions today?`,
        timestamp: new Date()
      });
    }
  }, []); // Only run once on mount

  return (
    <div 
      className="flex flex-col bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden rounded-lg shadow-2xl border border-gray-800 animate-fadeIn" 
      style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      {/* Header with glowing effect */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-gray-800/50 bg-black/60 backdrop-blur-md relative z-10">
        {/* Subtle glow effect behind the header */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-indigo-900/5 to-purple-900/10 animate-pulse opacity-30"></div>
        
        <div className="flex items-center space-x-3 z-10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/20 animate-pulse">
            <MessageSquare className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-semibold text-white tracking-wide">AI Trading Assistant</span>
        </div>
        <div className="flex items-center space-x-3 z-10">
          <button
            onClick={() => {
              // Clear all messages and add the initial welcome message
              setMessages([]);
              addMessage({
                role: 'assistant',
                content: `# Welcome! I'm ROAR AI, your financial advisor assistant.\n\nI can analyze stock charts and provide trading insights based on technical indicators. Ask me questions about market conditions, trading strategies, or specific stock performance.\n\nHow can I help with your trading decisions today?`,
                timestamp: new Date()
              });
              // Reset user scrolling state
              setUserHasScrolled(false);
            }}
            className="px-3 py-1.5 bg-gray-800/70 hover:bg-gray-700/80 rounded-full text-xs font-medium text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-1.5 hover:shadow-lg hover:shadow-blue-900/20 hover:scale-105"
          >
            <RefreshCw size={12} className="animate-pulse" />
            New Chat
          </button>
          {onClose && (
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800/70 focus:outline-none text-gray-400 hover:text-white transition-colors duration-300 hover:rotate-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Live Data Summary - Only show if we have meaningful data */}
      {liveData && liveData.currentPrice && liveData.currentPrice !== 'N/A' && renderLiveDataSummary()}
      
      {/* Chat messages area with custom scrollbar */}
      <div 
        ref={chatContainerRef} 
        className="flex-grow overflow-y-auto py-6 px-4 space-y-6 custom-scrollbar bg-gradient-to-b from-black/70 to-gray-900/40"
        onScroll={handleScroll}
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
        
        {/* Chat Message Container */}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            } ${message.role === 'user' ? 'animate-userMessage' : 'animate-assistantMessage'}`}
          >
            <div
              className={`flex items-start max-w-[85%] ${
                message.role === 'user'
                  ? 'bg-transparent text-gray-100 rounded-2xl rounded-tr-sm border border-gray-700/30'
                  : 'bg-transparent text-gray-100 rounded-2xl rounded-tl-sm border border-gray-700/30'
              } px-4 py-3 shadow-sm relative overflow-hidden backdrop-blur-sm`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {message.role === 'user' ? (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 p-0.5 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/20">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-500/30 to-orange-600/30 flex items-center justify-center">
                        <User className="h-4 w-4 text-amber-300" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600/20 to-gray-700/20 p-0.5 shadow-lg shadow-gray-500/20 ring-2 ring-gray-600/20">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-700/30 to-gray-800/30 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-gray-300" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium text-sm ${
                        message.role === 'user' 
                          ? 'text-gray-200'
                          : 'text-gray-200'
                      }`}>
                        {message.role === 'user' ? 'You' : 'Financial Analyst'}
                      </span>
                      {message.role === 'assistant' && (
                        <span className="text-xs bg-gray-800/50 text-gray-300 px-2 py-0.5 rounded-full border border-gray-600/20 font-medium">
                          AI
                        </span>
                      )}
                    </div>
                    {message.timestamp && (
                      <span className="text-xs text-gray-500 font-medium">{formatTime(message.timestamp)}</span>
                    )}
                  </div>
                  <div className={`prose max-w-none prose-p:my-1 prose-headings:mb-2 prose-pre:my-0 prose-headings:font-semibold ${
                    message.role === 'user'
                      ? 'prose-invert prose-p:text-gray-100 prose-headings:text-gray-50'
                      : 'prose-invert prose-p:text-gray-100 prose-headings:text-gray-50'
                  }`}>
                    <ReactMarkdown
                      children={message.content}
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ node, children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        a: ({ node, href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
                          >
                            {children}
                          </a>
                        ),
                        code: (props: React.ClassAttributes<HTMLElement> & React.HTMLAttributes<HTMLElement> & { className?: string }) => {
                          const isInline = !props.className;
                          if (isInline) {
                            return (
                              <code className="px-1.5 py-0.5 rounded bg-gray-900 text-gray-100 text-sm border border-gray-700/30 font-mono" {...props}>
                                {props.children}
                              </code>
                            );
                          }
                          return (
                            <div className="relative group my-3 rounded-lg overflow-hidden ring-1 ring-gray-700/50">
                              <div className="flex items-center justify-between px-4 py-2 bg-gray-900/90 border-b border-gray-700/50">
                                <span className="text-xs font-medium text-gray-400">Code</span>
                                <button 
                                  className="text-gray-400 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                                  onClick={() => {
                                    if (typeof props.children === 'string') {
                                      navigator.clipboard.writeText(props.children);
                                    }
                                  }}
                                >
                                  <div className="flex items-center gap-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                                      <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                                    </svg>
                                    <span className="text-xs">Copy</span>
                                  </div>
                                </button>

                              </div>
                              <div className="relative">
                                <pre className="p-4 text-sm overflow-x-auto bg-gray-900/50 font-mono">
                                  <code className={`language-${props.className || 'javascript'}`}>{props.children}</code>
                                </pre>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 animate-shimmer"></div>
                              </div>
                            </div>
                          );
                        },
                      }}
                    />
                  </div>

                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading indicator with constant shimmer effect */}
        {loading && (
          <div className="flex justify-start animate-slideInUp">
            <div className="flex items-start gap-3 bg-gray-900/40 text-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg border border-gray-700/20 relative overflow-hidden backdrop-blur-sm">
              {/* Constant shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent animate-shimmer"></div>
              
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600/20 to-gray-700/20 p-0.5 shadow-lg shadow-gray-500/20 ring-2 ring-gray-600/20">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-700/30 to-gray-800/30 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-gray-300" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400/50 animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 rounded-full bg-amber-400/50 animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 rounded-full bg-amber-400/50 animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Bottom fixed section */}
      <div className="flex-shrink-0 border-t border-gray-800/50">
        {/* Suggestion pills */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="p-3 bg-black/70 backdrop-blur-sm">
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1.5 bg-gray-800/60 hover:bg-amber-600/20 border border-gray-700/40 hover:border-amber-500/30 rounded-full text-xs text-gray-300 whitespace-nowrap transition-all duration-300 hover:text-amber-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat input with glowing effect */}
        <div className="p-3 bg-black/60 backdrop-blur-md relative">
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyPress}
              placeholder="Ask about the market analysis..."
              className="w-full bg-gray-800/70 text-gray-100 rounded-2xl border border-gray-700/50 focus:border-amber-600/50 focus:ring-2 focus:ring-amber-600/30 py-3 pl-4 pr-12 placeholder-gray-400 focus:outline-none resize-none"
              style={{ minHeight: '50px', maxHeight: '100px' }}
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className={`absolute right-2 bottom-2.5 rounded-full w-8 h-8 flex items-center justify-center ${
                loading || !inputValue.trim() 
                  ? 'bg-gray-700/70 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
              }`}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">Powered by ROAR AI</span>
            <span className="text-xs text-gray-500">Press Ctrl+Enter to send</span>
          </div>
        </div>
      </div>

      {/* Add styles for custom scrollbar and animations */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(17, 24, 39, 0.6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(55, 65, 81, 0.8);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(75, 85, 99, 0.8);
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .animate-shimmer {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 165, 0, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s linear infinite;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        @keyframes slideInUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
} 
