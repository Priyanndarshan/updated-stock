"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from "@/components/ui/utils";
import { Icons } from "@/components/icons";
import { 
  ChevronDown,
  ChevronRight,
  Users,
  Target,
  Goal,
  Layout,
  MenuIcon,
  X,
  MessageSquare,
  ZapIcon,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Navigation submenu items
const petZoneItems = [
  {
    title: "Focused Area",
    href: "/pet-zone/focused-area",
    icon: <Target className="h-4 w-4" />,
  },
  {
    title: "Weekly Goals",
    href: "/pet-zone/weekly-goals",
    icon: <Goal className="h-4 w-4" />,
  },
  {
    title: "Trade Setup",
    href: "/pet-zone/trade-setup",
    icon: <Layout className="h-4 w-4" />,
  },
];

const videoItems = [
  {
    title: "Live Sessions",
    href: "/videos/live-sessions",
    icon: <Icons.videos className="h-4 w-4" />,
  },
  {
    title: "Trade Align Setup",
    href: "/videos/trade-align-setup",
    icon: <Icons.tradeSetup className="h-4 w-4" />,
  },
  {
    title: "Pre Trade Plan",
    href: "/videos/pre-trade-plan",
    icon: <Icons.focusedArea className="h-4 w-4" />,
  },
];

interface SidebarProps {
  collapsed?: boolean;
  toggleSidebar?: () => void;
}

export default function Sidebar({ collapsed = false, toggleSidebar }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    petZone: false,
    videos: false
  });
  
  // Animation state for the Roar AI button
  const [isRoaring, setIsRoaring] = useState(false);
  
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Function to trigger the roaring animation
  const triggerRoar = () => {
    setIsRoaring(true);
    setTimeout(() => setIsRoaring(false), 2000); // Animation lasts 2 seconds
  };

  return (
    <div className={cn(
      "h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
      collapsed ? "w-[70px]" : "w-[260px]"
    )}>
      {/* Sidebar Header with Logo */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-center px-4">
        {!collapsed && (
          <div className="flex items-center">
            <Image 
              src="/assets/varaahi.jpeg" 
              alt="VARAAHI Group of Companies" 
              width={180} 
              height={55}
            />
          </div>
        )}
        {collapsed && (
          <div className="bg-orange-500 text-white p-1.5 rounded mx-auto flex items-center justify-center">
            <span className="font-bold text-xs">VR</span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4">
        {/* Dashboard Link */}
        <Link href="/dashboard">
          <div className={cn(
            "flex items-center py-2 mx-2 px-3 rounded-md text-gray-700 hover:bg-teal-50 hover:text-teal-700 group",
            collapsed ? "justify-center" : "justify-start"
          )}>
            <Icons.dashboard className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
            {!collapsed && <span className="font-medium">Dashboard</span>}
          </div>
        </Link>

        {/* Portfolio Link */}
        <Link href="/portfolio">
          <div className={cn(
            "flex items-center py-2 mx-2 px-3 rounded-md text-gray-700 hover:bg-teal-50 hover:text-teal-700 group",
            collapsed ? "justify-center" : "justify-start"
          )}>
            <Icons.portfolio className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
            {!collapsed && <span className="font-medium">Portfolio</span>}
          </div>
        </Link>
        
        {/* Separator */}
        <div className={cn(
          "mx-4 my-3 border-t border-gray-200",
          collapsed ? "mx-2" : "mx-4"
        )} />
        
        {/* Roar AI Link - Prominent position */}
        <Link href="/chart-with-chat">
          <div 
            className={cn(
              "flex items-center py-3 mx-2 px-3 mb-3 rounded-lg text-white group transition-all duration-300 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 shadow-md hover:shadow-lg",
              isRoaring ? "animate-pulse scale-105 roar-animation" : "",
              collapsed ? "justify-center mx-auto w-12 h-12" : "justify-start"
            )}
            onClick={triggerRoar}
          >
            <div className={cn(
              "relative flex items-center justify-center",
              collapsed ? "mx-auto" : "mr-3"
            )}>
              <Zap className={cn(
                "h-5 w-5 text-yellow-300",
                isRoaring ? "animate-ping absolute" : ""
              )} />
              {isRoaring && (
                <div className="absolute -inset-1 bg-yellow-400 rounded-full opacity-30 animate-pulse"></div>
              )}
            </div>
            {!collapsed && (
              <span className="font-bold text-white relative">
                Roar AI
                {isRoaring && (
                  <span className="absolute -left-1 -right-1 top-0 bottom-0 bg-white opacity-20 animate-pulse rounded-sm"></span>
                )}
                {isRoaring && (
                  <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs text-yellow-300 opacity-80 animate-bounce">Roar!</span>
                )}
              </span>
            )}
          </div>
        </Link>
        
        {/* Separator */}
        <div className={cn(
          "mx-4 my-3 border-t border-gray-200",
          collapsed ? "mx-2" : "mx-4"
        )} />

        {/* PET Zone with dropdown */}
        <div className="mt-1">
          <div
            className={cn(
              "flex items-center py-2 mx-2 px-3 rounded-md text-gray-700 hover:bg-teal-50 hover:text-teal-700 cursor-pointer group",
              collapsed ? "justify-center" : "justify-between"
            )}
            onClick={() => !collapsed && toggleSection('petZone')}
          >
            <div className="flex items-center">
              <Icons.petZone className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
              {!collapsed && <span className="font-medium">PET Zone</span>}
            </div>
            {!collapsed && (
              expandedSections.petZone ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
            )}
          </div>
          
          {/* PET Zone Dropdown Items */}
          {!collapsed && expandedSections.petZone && (
            <div className="pl-10 pr-3 space-y-1 mt-1">
              {petZoneItems.map((item, index) => (
                <Link href={item.href} key={index}>
                  <div className="flex items-center py-2 text-gray-600 hover:text-teal-700 rounded-md hover:bg-teal-50">
                    {item.icon}
                    <span className="ml-2 text-sm">{item.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Invest Premium Link */}
        <Link href="/invest-premium">
          <div className={cn(
            "flex items-center py-2 mx-2 px-3 rounded-md text-gray-700 hover:bg-teal-50 hover:text-teal-700 group",
            collapsed ? "justify-center" : "justify-start"
          )}>
            <Icons.investPremium className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
            {!collapsed && <span className="font-medium">Invest Premium</span>}
          </div>
        </Link>

        {/* Videos with dropdown */}
        <div>
          <div
            className={cn(
              "flex items-center py-2 mx-2 px-3 rounded-md text-gray-700 hover:bg-teal-50 hover:text-teal-700 cursor-pointer group",
              collapsed ? "justify-center" : "justify-between"
            )}
            onClick={() => !collapsed && toggleSection('videos')}
          >
            <div className="flex items-center">
              <Icons.videos className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
              {!collapsed && <span className="font-medium">Videos</span>}
            </div>
            {!collapsed && (
              expandedSections.videos ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
            )}
          </div>
          
          {/* Videos Dropdown Items */}
          {!collapsed && expandedSections.videos && (
            <div className="pl-10 pr-3 space-y-1 mt-1">
              {videoItems.map((item, index) => (
                <Link href={item.href} key={index}>
                  <div className="flex items-center py-2 text-gray-600 hover:text-teal-700 rounded-md hover:bg-teal-50">
                    {item.icon}
                    <span className="ml-2 text-sm">{item.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Meetings Link */}
        <Link href="/meetings">
          <div className={cn(
            "flex items-center py-2 mx-2 px-3 rounded-md text-gray-700 hover:bg-teal-50 hover:text-teal-700 group",
            collapsed ? "justify-center" : "justify-start"
          )}>
            <Icons.meetings className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
            {!collapsed && <span className="font-medium">Meetings</span>}
          </div>
        </Link>

        {/* Downloads Link */}
        <Link href="/downloads">
          <div className={cn(
            "flex items-center py-2 mx-2 px-3 rounded-md text-gray-700 hover:bg-teal-50 hover:text-teal-700 group",
            collapsed ? "justify-center" : "justify-start"
          )}>
            <Icons.downloads className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
            {!collapsed && <span className="font-medium">Downloads</span>}
          </div>
        </Link>

        {/* How We Help Link */}
        <Link href="/how-we-help">
          <div className={cn(
            "flex items-center py-2 mx-2 px-3 rounded-md text-gray-700 hover:bg-teal-50 hover:text-teal-700 group",
            collapsed ? "justify-center" : "justify-start"
          )}>
            <Icons.help className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
            {!collapsed && <span className="font-medium">How We Help</span>}
          </div>
        </Link>
      </div>
    </div>
  );
}

// Add this CSS at the end of the file for additional animation effects
// You can also add this to your global.css file if you prefer
const RoarStyles = () => (
  <style jsx global>{`
    @keyframes roar-wave {
      0% { transform: scale(1); opacity: 0.7; }
      50% { transform: scale(1.2); opacity: 0.3; }
      100% { transform: scale(1.4); opacity: 0; }
    }
    
    .roar-animation::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 8px;
      background: linear-gradient(45deg, #f59e0b, #ef4444);
      animation: roar-wave 2s ease-out infinite;
      z-index: -1;
    }
  `}</style>
); 