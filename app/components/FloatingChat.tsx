"use client";

import React, { useState } from 'react';
import { X, Send, MessageSquare, Maximize2, Minimize2 } from 'lucide-react';

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{text: string, isUser: boolean}[]>([
    { text: "Hello! How can I assist you with your trading analysis today?", isUser: false }
  ]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Add user message
      setMessages([...messages, { text: message, isUser: true }]);
      
      // Simulate assistant response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: "I'm analyzing your request. I'll have an answer for you shortly.", 
          isUser: false 
        }]);
      }, 1000);
      
      setMessage('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Chat Interface */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-xl overflow-hidden transition-all duration-300 ease-in-out border border-slate-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse"></div>
              <h3 className="text-white font-medium text-sm">AI Trading Assistant</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
              >
                <Minimize2 size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div className="h-80 overflow-y-auto p-4 bg-slate-900/50 backdrop-blur-sm space-y-4">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-3/4 p-3 rounded-lg ${
                    msg.isUser 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-slate-700 text-gray-100 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-700 bg-slate-800/80 backdrop-blur-sm">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about stock analysis..."
                className="flex-1 bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
                disabled={!message.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={`${
          isOpen ? 'bg-slate-700 hover:bg-slate-800' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
        } text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 w-14 h-14 group`}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <div className="relative">
            <MessageSquare size={24} />
            <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3"></span>
          </div>
        )}
        <span className={`absolute right-16 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ${isOpen ? 'hidden' : ''}`}>
          Ask ChatGPT
        </span>
      </button>
    </div>
  );
};

export default FloatingChat; 