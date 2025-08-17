"use client";

import React from 'react';
import { Play, Calendar, Users, Star, Search, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';

// Sample live session videos
const liveSessionVideos = [
  {
    id: 1,
    title: "Live Trading Session: Intraday Strategies",
    thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop",
    duration: "1:45:30",
    date: "March 5, 2025",
    instructor: "Rahul Sharma",
    category: "Intraday",
    rating: 4.9,
    viewers: 3245,
    description: "Watch our experts trade live and explain their decision-making process."
  },
  {
    id: 2,
    title: "Live Market Opening Bell Analysis",
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop",
    duration: "1:15:22",
    date: "March 12, 2025",
    instructor: "Priya Patel",
    category: "Market Analysis",
    rating: 4.8,
    viewers: 2890,
    description: "Join us for the market opening bell as we analyze the day's potential movements."
  },
  {
    id: 3,
    title: "Live Options Trading Session",
    thumbnail: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?q=80&w=2070&auto=format&fit=crop",
    duration: "2:05:15",
    date: "March 10, 2025",
    instructor: "Vikram Singh",
    category: "Options",
    rating: 4.7,
    viewers: 2367,
    description: "Live options trading with real-time analysis and trade execution."
  },
  {
    id: 4,
    title: "Live Swing Trading Setups",
    thumbnail: "https://images.unsplash.com/photo-1642790551116-18e150f248e5?q=80&w=2070&auto=format&fit=crop",
    duration: "1:38:45",
    date: "March 8, 2025",
    instructor: "Ananya Desai",
    category: "Swing Trading",
    rating: 4.6,
    viewers: 1876,
    description: "Discover potential swing trading setups for the upcoming week."
  },
  {
    id: 5,
    title: "Live Futures Trading Session",
    thumbnail: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?q=80&w=2070&auto=format&fit=crop",
    duration: "1:52:30",
    date: "March 7, 2025",
    instructor: "Rajiv Kumar",
    category: "Futures",
    rating: 4.8,
    viewers: 2145,
    description: "Live futures trading with real-time market analysis."
  },
  {
    id: 6,
    title: "Live Technical Analysis Workshop",
    thumbnail: "https://images.unsplash.com/photo-1642790551116-18e150f248e5?q=80&w=2070&auto=format&fit=crop",
    duration: "1:25:10",
    date: "March 6, 2025",
    instructor: "Neha Sharma",
    category: "Technical Analysis",
    rating: 4.9,
    viewers: 2678,
    description: "Live workshop on applying technical analysis to current market conditions."
  }
];

// Categories for filtering
const categories = [
  { value: "all", label: "All Categories" },
  { value: "intraday", label: "Intraday" },
  { value: "options", label: "Options" },
  { value: "futures", label: "Futures" },
  { value: "swing", label: "Swing Trading" },
  { value: "technical", label: "Technical Analysis" },
];

export default function LiveSessionsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filter videos based on category and search query
  const filteredVideos = React.useMemo(() => {
    return liveSessionVideos.filter(video => {
      // Apply category filter
      if (selectedCategory !== "all" && 
          !video.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
        return false;
      }
      
      // Apply search filter
      if (searchQuery && 
          !video.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !video.instructor.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [selectedCategory, searchQuery]);

  // Render video card
  const renderVideoCard = (video: any) => (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="relative">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="h-48 w-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="default" 
            size="icon" 
            className="rounded-full bg-white text-gray-900 hover:bg-gray-100 h-12 w-12"
          >
            <Play className="h-6 w-6" />
          </Button>
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {video.duration}
        </div>
        <Badge 
          variant="secondary" 
          className="absolute top-2 left-2 bg-white text-gray-800 border-0"
        >
          {video.category}
        </Badge>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{video.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-1">
          <Calendar className="h-3.5 w-3.5 mr-1.5" />
          <span>{video.date}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <Users className="h-3.5 w-3.5 mr-1.5" />
          <span>{video.viewers.toLocaleString()} viewers</span>
          <div className="mx-2 h-1 w-1 rounded-full bg-gray-300"></div>
          <Star className="h-3.5 w-3.5 mr-1.5 text-yellow-500" />
          <span>{video.rating}</span>
        </div>
      </div>
      
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <span className="text-sm font-medium">{video.instructor}</span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 p-0 h-auto"
        >
          Watch Now
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <span>Videos</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-800 font-medium">Live Sessions</span>
        </div>
        
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Live Trading Sessions</h1>
          <p className="text-gray-500">Access recorded live trading sessions and expert analysis</p>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search sessions..."
              className="pl-9 border-gray-200 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              className={cn(
                "whitespace-nowrap",
                selectedCategory === "all" 
                  ? "bg-teal-600 hover:bg-teal-700" 
                  : "text-gray-600 hover:text-gray-900"
              )}
              onClick={() => setSelectedCategory("all")}
            >
              All Categories
            </Button>
            
            {categories.slice(1).map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                className={cn(
                  "whitespace-nowrap",
                  selectedCategory === category.value 
                    ? "bg-teal-600 hover:bg-teal-700" 
                    : "text-gray-600 hover:text-gray-900"
                )}
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.length > 0 ? (
            filteredVideos.map(renderVideoCard)
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-1">No sessions found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 