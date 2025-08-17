"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MainNav } from '@/components/dashboard/MainNav';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Bell, 
  ChevronDown,
  Users,
  Target,
  Goal,
  Layout,
  LogOut,
  User,
  Settings2
} from 'lucide-react';
import { Icons } from '@/components/icons';

interface HeaderProps {
  username: string;
}

const Header: React.FC<HeaderProps> = ({ username }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center">
            <div className="bg-teal-500 text-white p-1.5 rounded mr-2 flex items-center justify-center">
              <span className="font-bold text-xs">PT</span>
            </div>
            <span className="text-xl font-bold text-teal-600">Profitever Traders</span>
          </div>
          
          {/* Main Navigation */}
          <MainNav />
          
          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-700"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              Menu
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${showMobileMenu ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </div>
        
        {/* User Actions */}
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-gray-700 hover:text-teal-600 hover:bg-teal-50 relative">
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
                  <Button variant="ghost" className="rounded-full p-0 h-9 w-9 flex items-center justify-center" aria-label="Profile options">
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
      </div>
      
      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="lg:hidden bg-white border-b border-gray-200 py-2 px-4">
          <nav className="flex flex-col space-y-1">
            <Button variant="ghost" className="justify-start text-gray-700 hover:text-teal-600 hover:bg-teal-50">
              <Icons.dashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="ghost" className="justify-start text-gray-700 hover:text-teal-600 hover:bg-teal-50">
              <Icons.portfolio className="h-4 w-4 mr-2" />
              Portfolio
            </Button>
            
            {/* PET Zone Mobile Section */}
            <div className="border-l-2 border-teal-500 pl-3 ml-2">
              <Button variant="ghost" className="justify-start text-gray-700 hover:text-teal-600 hover:bg-teal-50 w-full">
                <Users className="h-4 w-4 mr-2" />
                PET Zone
              </Button>
              <div className="pl-6 space-y-1 mt-1">
                <Button variant="ghost" size="sm" className="justify-start text-gray-600 hover:text-teal-600 hover:bg-teal-50 w-full">
                  <Target className="h-3.5 w-3.5 mr-2" />
                  Focused Area
                </Button>
                <Button variant="ghost" size="sm" className="justify-start text-gray-600 hover:text-teal-600 hover:bg-teal-50 w-full">
                  <Goal className="h-3.5 w-3.5 mr-2" />
                  Weekly Goals
                </Button>
                <Button variant="ghost" size="sm" className="justify-start text-gray-600 hover:text-teal-600 hover:bg-teal-50 w-full">
                  <Layout className="h-3.5 w-3.5 mr-2" />
                  Trade Setup
                </Button>
              </div>
            </div>
            
            <Button variant="ghost" className="justify-start text-gray-700 hover:text-teal-600 hover:bg-teal-50">
              <Icons.investPremium className="h-4 w-4 mr-2" />
              Invest Premium
            </Button>
            
            {/* Videos Mobile Section */}
            <div className="border-l-2 border-teal-500 pl-3 ml-2">
              <Button variant="ghost" className="justify-start text-gray-700 hover:text-teal-600 hover:bg-teal-50 w-full">
                <Icons.videos className="h-4 w-4 mr-2" />
                Videos
              </Button>
              <div className="pl-6 space-y-1 mt-1">
                <Button variant="ghost" size="sm" className="justify-start text-gray-600 hover:text-teal-600 hover:bg-teal-50 w-full">
                  <Icons.videos className="h-3.5 w-3.5 mr-2" />
                  Live Sessions
                </Button>
                <Button variant="ghost" size="sm" className="justify-start text-gray-600 hover:text-teal-600 hover:bg-teal-50 w-full">
                  <Icons.tradeSetup className="h-3.5 w-3.5 mr-2" />
                  Trade Align Setup
                </Button>
                <Button variant="ghost" size="sm" className="justify-start text-gray-600 hover:text-teal-600 hover:bg-teal-50 w-full">
                  <Icons.focusedArea className="h-3.5 w-3.5 mr-2" />
                  Pre Trade Plan
                </Button>
              </div>
            </div>
            
            <Button variant="ghost" className="justify-start text-gray-700 hover:text-teal-600 hover:bg-teal-50">
              <Icons.meetings className="h-4 w-4 mr-2" />
              Meetings
            </Button>
            <Button variant="ghost" className="justify-start text-gray-700 hover:text-teal-600 hover:bg-teal-50">
              <Icons.downloads className="h-4 w-4 mr-2" />
              Downloads
            </Button>
            <Button variant="ghost" className="justify-start text-gray-700 hover:text-teal-600 hover:bg-teal-50">
              <Icons.help className="h-4 w-4 mr-2" />
              How We Help
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;