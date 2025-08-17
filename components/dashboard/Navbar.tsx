"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, User, Menu, X, BarChart2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center px-0">
        <div className="flex-shrink-0 mr-8 pl-0">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/assets/varaahi.jpeg" 
              alt="VARAAHI Group of Companies" 
              width={180} 
              height={55} 
            />
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-4 flex-grow">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                Dashboard <span className="ml-1">▼</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem>
                <Link href="/dashboard" className="w-full">Overview</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/dashboard/analytics" className="w-full">Analytics</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/dashboard/reports" className="w-full">Reports</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                PET Zone <span className="ml-1">▼</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem>
                <Link href="/pet-zone/strategies" className="w-full">Strategies</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/pet-zone/tools" className="w-full">Tools</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/pet-zone/community" className="w-full">Community</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="ghost" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100">
            <Link href="/invest-premium" className="w-full">Invest Premium</Link>
          </Button>
          
          <Button variant="ghost" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100">
            <Link href="/videos" className="w-full">Videos</Link>
          </Button>
          
          <Button variant="ghost" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100">
            <Link href="/meetings" className="w-full">Meetings</Link>
          </Button>
          
          <Button variant="ghost" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100">
            <Link href="/downloads" className="w-full">Downloads</Link>
          </Button>
          
          <Button variant="ghost" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100">
            <Link href="/how-we-help" className="w-full">How We Help</Link>
          </Button>
        </nav>
        
        <div className="flex items-center gap-4 ml-auto pr-4">
          <div className="relative hidden md:block w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-gray-100 pl-8 focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute right-2 top-2 text-xs text-gray-500">
              Ctrl K
            </div>
          </div>
          
          <Button variant="outline" className="hidden md:flex">
            <User className="mr-2 h-4 w-4" />
            Sign In
          </Button>
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-gray-700"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-1">
            <div className="py-2 border-b border-gray-100">
              <p className="font-medium text-gray-900">Dashboard</p>
              <div className="mt-2 pl-4 space-y-2">
                <Link href="/dashboard" className="block text-gray-600 hover:text-gray-900">Overview</Link>
                <Link href="/dashboard/analytics" className="block text-gray-600 hover:text-gray-900">Analytics</Link>
                <Link href="/dashboard/reports" className="block text-gray-600 hover:text-gray-900">Reports</Link>
              </div>
            </div>
            
            <div className="py-2 border-b border-gray-100">
              <p className="font-medium text-gray-900">PET Zone</p>
              <div className="mt-2 pl-4 space-y-2">
                <Link href="/pet-zone/strategies" className="block text-gray-600 hover:text-gray-900">Strategies</Link>
                <Link href="/pet-zone/tools" className="block text-gray-600 hover:text-gray-900">Tools</Link>
                <Link href="/pet-zone/community" className="block text-gray-600 hover:text-gray-900">Community</Link>
              </div>
            </div>
            
            <div className="py-2 border-b border-gray-100">
              <Link href="/invest-premium" className="block text-gray-900 font-medium hover:text-blue-600">Invest Premium</Link>
            </div>
            
            <div className="py-2 border-b border-gray-100">
              <Link href="/videos" className="block text-gray-900 font-medium hover:text-blue-600">Videos</Link>
            </div>
            
            <div className="py-2 border-b border-gray-100">
              <Link href="/meetings" className="block text-gray-900 font-medium hover:text-blue-600">Meetings</Link>
            </div>
            
            <div className="py-2 border-b border-gray-100">
              <Link href="/downloads" className="block text-gray-900 font-medium hover:text-blue-600">Downloads</Link>
            </div>
            
            <div className="py-2 border-b border-gray-100">
              <Link href="/how-we-help" className="block text-gray-900 font-medium hover:text-blue-600">How We Help</Link>
            </div>
            
            <div className="py-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full bg-gray-100 pl-8"
                />
              </div>
            </div>
            
            <div className="py-3">
              <Button className="w-full">
                <User className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar; 