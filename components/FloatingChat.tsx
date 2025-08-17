"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, X, Bot, Sparkles, Camera, Loader2 } from 'lucide-react';
import { sendMessageToGemini } from '@/services/gemini';

type Message = {
  text: string;
  isUser: boolean;
  timestamp: Date;
  isProcessing?: boolean;
};

const FloatingChat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [includeScreenshot, setIncludeScreenshot] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isProcessing) {
      // Add user message
      const userMessage: Message = {
        text: message,
        isUser: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsChatOpen(true);
      setMessage('');
      
      // Show typing indicator
      setIsTyping(true);
      setIsProcessing(true);
      
      try {
        // Add a temporary processing message for Gemini
        const processingMessage: Message = {
          text: "Processing your request...",
          isUser: false,
          timestamp: new Date(),
          isProcessing: true
        };
        
        setMessages(prev => [...prev, processingMessage]);
        
        // Send to Gemini API with screenshot if enabled
        const response = await sendMessageToGemini(message, includeScreenshot);
        
        // Replace processing message with actual response
        setMessages(prev => prev.filter(msg => !msg.isProcessing).concat({
          text: response,
          isUser: false,
          timestamp: new Date()
        }));
      } catch (error) {
        console.error("Error getting response from Gemini:", error);
        
        // Replace processing message with error message
        setMessages(prev => prev.filter(msg => !msg.isProcessing).concat({
          text: "Sorry, I encountered an error processing your request. Please try again.",
          isUser: false,
          timestamp: new Date()
        }));
      } finally {
        setIsTyping(false);
        setIsProcessing(false);
      }
    }
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Toggle screenshot inclusion
  const toggleScreenshot = () => {
    setIncludeScreenshot(prev => !prev);
  };

  return (
    <>
      {/* Main input bar */}
      <div className="fixed bottom-0 inset-x-0 z-50 flex justify-center mb-3 px-6 pointer-events-none">
        <div 
          className="w-full max-w-lg bg-[#1a1d2d] rounded-full shadow-md pointer-events-auto border border-slate-700/30 transition-all duration-300"
        >
          <form 
            onSubmit={handleSendMessage} 
            className="flex items-center px-4 py-2"
          >
            <button
              type="button"
              onClick={toggleScreenshot}
              className={`mr-2 p-1.5 rounded-full transition-colors ${
                includeScreenshot 
                  ? 'text-[#5736DB] bg-slate-700/30' 
                  : 'text-slate-400 hover:text-slate-300'
              }`}
              title={includeScreenshot ? "Screenshot enabled" : "Screenshot disabled"}
            >
              <Camera size={12} />
            </button>
            
            <div className="mr-2 text-[#5736DB] opacity-70">
              <Sparkles size={14} className="animate-pulse" />
            </div>
            
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={includeScreenshot ? "Ask about what you see..." : "Ask ChatGPT..."}
              className="flex-1 bg-transparent text-gray-200 border-none outline-none text-xs placeholder-gray-500 transition-all"
              onFocus={() => {
                if (messages.length > 0) setIsChatOpen(true);
              }}
              disabled={isProcessing}
            />
            
            <button
              type="submit"
              disabled={!message.trim() || isProcessing}
              aria-label="Send message"
              className={`ml-1 p-1.5 rounded-full transition-all duration-300 ${
                message.trim() && !isProcessing
                  ? 'bg-[#5736DB] text-white' 
                  : 'bg-slate-700/40 text-slate-500'
              }`}
            >
              {isProcessing ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <ArrowUp size={12} />
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Chat popup area */}
      {isChatOpen && (
        <div 
          className="fixed bottom-12 right-6 w-80 z-50 bg-[#1a1d2d] rounded-lg shadow-lg border border-slate-700/30 overflow-hidden transition-all duration-300 transform animate-slideUp"
        >
          {/* Chat header */}
          <div className="flex items-center justify-between p-2 border-b border-slate-700/50 bg-[#161925]">
            <div className="flex items-center">
              <div className="relative mr-2">
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <Bot size={14} className="text-[#5736DB]" />
              </div>
              <span className="text-xs font-medium text-gray-200">Gemini AI Assistant</span>
              {includeScreenshot && (
                <span className="ml-2 text-[9px] bg-[#5736DB]/20 text-[#5736DB] px-1 py-0.5 rounded">
                  Vision
                </span>
              )}
            </div>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="text-slate-400 hover:text-slate-300 transition-colors p-1 hover:bg-slate-700/30 rounded-full"
            >
              <X size={14} />
            </button>
          </div>

          {/* Messages */}
          <div className="h-72 overflow-y-auto p-3 space-y-3 bg-[#1E2330] custom-scrollbar">
            {messages.filter(msg => !msg.isProcessing).map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} items-end animate-fadeIn`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {!msg.isUser && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#5736DB]/20 flex items-center justify-center mr-2 border border-[#5736DB]/30">
                    <Bot size={12} className="text-[#5736DB]" />
                  </div>
                )}
                
                <div 
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-xs shadow-sm ${
                    msg.isUser 
                      ? 'bg-[#5736DB] text-white rounded-br-sm ml-2' 
                      : 'bg-slate-700/60 text-gray-200 rounded-bl-sm border border-slate-600/20'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  <div className={`text-[10px] mt-1 opacity-70 ${msg.isUser ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start items-end animate-fadeIn">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#5736DB]/20 flex items-center justify-center mr-2 border border-[#5736DB]/30">
                  <Bot size={12} className="text-[#5736DB]" />
                </div>
                <div className="bg-slate-700/60 text-gray-200 rounded-lg rounded-bl-sm px-3 py-2 text-xs border border-slate-600/20 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>
          
          {/* Quick actions bar */}
          <div className="flex items-center justify-between p-2 border-t border-slate-700/50 bg-[#161925]">
            <div className="flex space-x-2">
              <button 
                className="text-[10px] text-slate-300 bg-slate-700/50 hover:bg-slate-700/70 px-2 py-1 rounded-sm transition-colors"
                onClick={() => setMessages([])}
              >
                Clear
              </button>
              <button 
                className={`text-[10px] ${includeScreenshot ? 'text-[#5736DB] bg-[#5736DB]/20' : 'text-slate-300 bg-slate-700/50 hover:bg-slate-700/70'} px-2 py-1 rounded-sm transition-colors flex items-center gap-1`}
                onClick={toggleScreenshot}
              >
                <Camera size={8} />
                {includeScreenshot ? 'Vision On' : 'Vision Off'}
              </button>
            </div>
            <div className="text-[10px] text-slate-400">Gemini AI</div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChat; 