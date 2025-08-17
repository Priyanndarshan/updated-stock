'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, Settings, User, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  username?: string;
}

export default function Header({ username = 'Trader' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-800 bg-gray-900 px-4 shadow-md backdrop-blur supports-[backdrop-filter]:bg-gray-900/80">
      <div className="flex items-center">
        <Link href="/dashboard" className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 font-bold text-white">
              RT
            </div>
            <div className="text-xl font-bold tracking-tight text-white">
              <span>ROAR</span>
              <span className="text-blue-400">Trade</span>
            </div>
          </div>
        </Link>
      </div>

      <nav className="hidden md:flex items-center space-x-1">
        <Link href="/dashboard" className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white">
          Dashboard
        </Link>
        <Link href="/chart-with-chat" className="px-3 py-2 text-sm font-medium text-white bg-gray-800 rounded-md">
          Trading View
        </Link>
        <Link href="/news" className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white">
          Market News
        </Link>
        <Link href="/portfolio" className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white">
          Portfolio
        </Link>
        <Link href="/screener" className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white">
          Screener
        </Link>
      </nav>

      <div className="flex items-center space-x-1">
        <div className="hidden md:flex items-center">
          <span className="mr-2 text-sm font-medium text-gray-300">Market: <span className="text-green-400">Open</span></span>
          <span className="rounded bg-green-900/30 px-1.5 py-0.5 text-xs text-green-400">S&P: +1.2%</span>
        </div>

        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <Bell size={18} />
        </Button>
        
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <HelpCircle size={18} />
        </Button>
        
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <Settings size={18} />
        </Button>
        
        <div className="ml-2 flex items-center space-x-2 border-l border-gray-700 pl-2">
          <div className="hidden md:block">
            <div className="text-sm font-medium text-white">{username}</div>
            <div className="text-xs text-gray-400">Premium</div>
          </div>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-medium">
            {username.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
} 