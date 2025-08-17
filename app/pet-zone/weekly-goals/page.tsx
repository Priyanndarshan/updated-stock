"use client";

import React from 'react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { Search, Filter, X, Download, ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/components/ui/utils';

// Sample data for the weekly goals
const weeklyGoalsData = [
  { 
    id: 1, 
    week: 'Mar 10 - Mar 16, 2025', 
    title: 'Consistent Profit', 
    target: '₹50,000', 
    achieved: '₹42,500',
    progress: 85,
    status: 'In Progress'
  },
  { 
    id: 2, 
    week: 'Mar 3 - Mar 9, 2025', 
    title: 'Risk Management', 
    target: '2% max drawdown', 
    achieved: '1.5% drawdown',
    progress: 100,
    status: 'Completed'
  },
  { 
    id: 3, 
    week: 'Feb 24 - Mar 2, 2025', 
    title: 'Trade Discipline', 
    target: 'Follow all setups', 
    achieved: '90% adherence',
    progress: 90,
    status: 'Completed'
  },
  { 
    id: 4, 
    week: 'Feb 17 - Feb 23, 2025', 
    title: 'Profit Target', 
    target: '₹40,000', 
    achieved: '₹45,000',
    progress: 100,
    status: 'Completed'
  },
  { 
    id: 5, 
    week: 'Feb 10 - Feb 16, 2025', 
    title: 'Trade Frequency', 
    target: 'Max 3 trades/day', 
    achieved: 'Avg 2.5 trades/day',
    progress: 100,
    status: 'Completed'
  },
];

export default function WeeklyGoalsPage() {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date(2025, 2, 15)); // March 15, 2025
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [activeTab, setActiveTab] = React.useState<string>("all");
  const [currentWeekStart, setCurrentWeekStart] = React.useState<Date>(
    startOfWeek(selectedDate, { weekStartsOn: 1 }) // Week starts on Monday
  );
  
  // Calculate week range
  const weekStart = currentWeekStart;
  const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
  const weekRange = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
  
  // Navigate to previous week
  const goToPreviousWeek = () => {
    const prevWeek = subWeeks(currentWeekStart, 1);
    setCurrentWeekStart(prevWeek);
  };
  
  // Navigate to next week
  const goToNextWeek = () => {
    const nextWeek = addWeeks(currentWeekStart, 1);
    setCurrentWeekStart(nextWeek);
  };
  
  // Set to current week when date is selected
  React.useEffect(() => {
    setCurrentWeekStart(startOfWeek(selectedDate, { weekStartsOn: 1 }));
  }, [selectedDate]);
  
  // Filter data based on search query and active tab
  const filteredData = React.useMemo(() => {
    return weeklyGoalsData.filter(item => {
      // Apply search filter
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Apply tab filter
      if (activeTab === 'completed' && item.status !== 'Completed') {
        return false;
      }
      if (activeTab === 'in-progress' && item.status !== 'In Progress') {
        return false;
      }
      
      return true;
    });
  }, [weeklyGoalsData, searchQuery, activeTab]);

  return (
    <div className="container mx-auto py-8 px-4 mt-4">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>PET Zone</span>
          <span>/</span>
          <span className="text-gray-800 font-medium">Weekly Goals</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Weekly Goals</h1>
        <p className="text-gray-500">Set and track your weekly trading goals and objectives</p>
      </div>

      {/* Week Selector */}
      <Card className="mb-8 border-gray-200 shadow-sm">
        <CardHeader className="pb-3 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium text-gray-700">Select Week</CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToPreviousWeek}
                className="h-8 w-8 p-0 border-gray-200 bg-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-gray-700 min-w-[150px] text-center">
                {weekRange}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToNextWeek}
                className="h-8 w-8 p-0 border-gray-200 bg-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Jump to Date</label>
              <DatePicker 
                date={selectedDate} 
                setDate={(date: Date | undefined) => {
                  if (date) setSelectedDate(date);
                }} 
                placeholder="Select a date"
                defaultMonth={new Date(2025, 2)}
                className="w-full"
              />
            </div>
            
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Goals</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search by title"
                  className="pl-9 border-gray-200 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="md:col-span-1 flex items-end">
              <Button 
                variant="default" 
                size="default" 
                className="bg-teal-500 hover:bg-teal-600 text-white w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Goal
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals List */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium text-gray-700">Weekly Goals</CardTitle>
            <Tabs 
              defaultValue="all" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-auto"
            >
              <TabsList className="bg-gray-100">
                <TabsTrigger 
                  value="all"
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-md px-4"
                >
                  All
                </TabsTrigger>
                <TabsTrigger 
                  value="in-progress"
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-md px-4"
                >
                  In Progress
                </TabsTrigger>
                <TabsTrigger 
                  value="completed"
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-md px-4"
                >
                  Completed
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[60px] font-medium text-gray-700">ID</TableHead>
                <TableHead className="font-medium text-gray-700">WEEK</TableHead>
                <TableHead className="font-medium text-gray-700">GOAL</TableHead>
                <TableHead className="font-medium text-gray-700">TARGET</TableHead>
                <TableHead className="font-medium text-gray-700">ACHIEVED</TableHead>
                <TableHead className="font-medium text-gray-700">PROGRESS</TableHead>
                <TableHead className="font-medium text-gray-700">STATUS</TableHead>
                <TableHead className="text-right font-medium text-gray-700">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((goal) => (
                  <TableRow key={goal.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{goal.id}</TableCell>
                    <TableCell>{goal.week}</TableCell>
                    <TableCell className="font-medium text-gray-800">{goal.title}</TableCell>
                    <TableCell>{goal.target}</TableCell>
                    <TableCell>{goal.achieved}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={goal.progress} className="h-2 w-[100px]" />
                        <span className="text-sm text-gray-600">{goal.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "font-medium border-0 px-2 py-0.5",
                        goal.status === 'Completed' 
                          ? "bg-green-50 text-green-700" 
                          : "bg-blue-50 text-blue-700"
                      )}>
                        {goal.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                    No goals found. Try adjusting your filters or add a new goal.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between py-4 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            Showing {filteredData.length} of {weeklyGoalsData.length} goals
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Export
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="bg-teal-500 hover:bg-teal-600 text-white"
            >
              View Report
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 