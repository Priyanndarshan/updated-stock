"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';
import { Bell, User, Settings2, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopHeaderProps {
  username: string;
  onToggleSidebar: () => void;
}

export default function TopHeader({ username, onToggleSidebar }: TopHeaderProps) {
  const router = useRouter();

  // Handle logout functionality
  const handleLogout = () => {
    // Clear any stored user data/tokens
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    
    // Redirect to logout page for proper cleanup
    router.push('/logout');
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="h-16 flex items-center justify-between px-4">
        {/* Left side: Toggle button */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-700 hover:text-teal-600 mr-2"
            onClick={onToggleSidebar}
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
        </div>
        
        {/* User Actions */}
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-700 hover:text-teal-600 hover:bg-teal-50 relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          
          {/* Profile Section */}
          <div className="flex items-center space-x-3 ml-2 pl-2 border-l border-gray-200">
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">Welcome, {username}</p>
              <p className="text-xs text-gray-500">Pro Trader</p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="rounded-full p-0 h-9 w-9 flex items-center justify-center" 
                  aria-label="Profile options"
                >
                  <Avatar className="h-9 w-9 bg-teal-100 text-teal-600">
                    <span className="font-medium text-sm">{username.charAt(0)}</span>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-md rounded-md p-1">
                <div className="flex items-center p-3 border-b border-gray-100">
                  <Avatar className="h-8 w-8 bg-teal-100 text-teal-600 mr-2">
                    <span className="font-medium text-sm">{username.charAt(0)}</span>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{username}</p>
                    <p className="text-xs text-gray-500">Pro Trader</p>
                  </div>
                </div>
                
                {/* My Profile - Links to profile page */}
                <Link href="/profile" passHref>
                  <DropdownMenuItem className="cursor-pointer text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md my-1 py-2">
                    <User className="mr-2 h-4 w-4 text-gray-500" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                </Link>
                
                {/* Account Settings - Links to account settings page */}
                <Link href="/account-settings" passHref>
                  <DropdownMenuItem className="cursor-pointer text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md my-1 py-2">
                    <Settings2 className="mr-2 h-4 w-4 text-gray-500" />
                    <span>Account Settings</span>
                  </DropdownMenuItem>
                </Link>
                
                {/* Log Out - Handles logout functionality */}
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md my-1 py-2"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
} 