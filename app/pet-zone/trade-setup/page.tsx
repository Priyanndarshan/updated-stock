"use client";

import React from 'react';
import { format } from 'date-fns';
import { 
  Search, 
  Filter, 
  X, 
  Download, 
  ArrowUpDown, 
  ChevronDown, 
  Eye, 
  Calculator, 
  LineChart, 
  Banknote, 
  Sparkles, 
  Target, 
  BarChart4,
  Trophy,
  Save, 
  Bookmark 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { cn } from '@/components/ui/utils';

// Sample data for the table
const tradeSetupData = [
  { 
    id: 1, 
    date: new Date(2025, 2, 15), 
    title: 'BANKNIFTY', 
    type: 'Intraday',
    strategy: 'Breakout',
    status: 'Active',
    action: 'View'
  },
  { 
    id: 2, 
    date: new Date(2025, 2, 15), 
    title: 'NIFTY', 
    type: 'Swing',
    strategy: 'Reversal',
    status: 'Active',
    action: 'View'
  },
  { 
    id: 3, 
    date: new Date(2025, 2, 14), 
    title: 'RELIANCE', 
    type: 'Positional',
    strategy: 'Trend Following',
    status: 'Completed',
    action: 'View'
  },
  { 
    id: 4, 
    date: new Date(2025, 2, 13), 
    title: 'HDFC BANK', 
    type: 'Intraday',
    strategy: 'Gap Fill',
    status: 'Completed',
    action: 'View'
  },
  { 
    id: 5, 
    date: new Date(2025, 2, 12), 
    title: 'INFOSYS', 
    type: 'Swing',
    strategy: 'Support/Resistance',
    status: 'Completed',
    action: 'View'
  },
  { 
    id: 6, 
    date: new Date(2025, 2, 11), 
    title: 'TCS', 
    type: 'Positional',
    strategy: 'Breakout',
    status: 'Completed',
    action: 'View'
  },
  { 
    id: 7, 
    date: new Date(2025, 2, 10), 
    title: 'BANKNIFTY', 
    type: 'Intraday',
    strategy: 'Reversal',
    status: 'Completed',
    action: 'View'
  },
];

// Trade types for the filter
const tradeTypes = [
  { value: "intraday", label: "Intraday" },
  { value: "swing", label: "Swing" },
  { value: "positional", label: "Positional" },
];

// Strategy types for the filter
const strategyTypes = [
  { value: "breakout", label: "Breakout" },
  { value: "reversal", label: "Reversal" },
  { value: "trend-following", label: "Trend Following" },
  { value: "gap-fill", label: "Gap Fill" },
  { value: "support-resistance", label: "Support/Resistance" },
];

export default function TradeSetupPage() {
  const [fromDate, setFromDate] = React.useState<Date | undefined>(undefined);
  const [toDate, setToDate] = React.useState<Date | undefined>(undefined);
  const [selectedType, setSelectedType] = React.useState<string>("all");
  const [selectedStrategy, setSelectedStrategy] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  // New state for trade setup and planning
  const [selectedTradeId, setSelectedTradeId] = React.useState<number | null>(null);
  const [showPlanningModal, setShowPlanningModal] = React.useState(false);
  const [tradeRisk, setTradeRisk] = React.useState(2); // Risk percentage
  const [positionSize, setPositionSize] = React.useState(0);
  const [accountSize, setAccountSize] = React.useState(10000);
  const [entryPrice, setEntryPrice] = React.useState("");
  const [stopLoss, setStopLoss] = React.useState("");
  const [takeProfit1, setTakeProfit1] = React.useState("");
  const [takeProfit2, setTakeProfit2] = React.useState("");
  const [notes, setNotes] = React.useState("");

  // Filter data based on search query and filters
  const filteredData = React.useMemo(() => {
    return tradeSetupData.filter(item => {
      // Apply search filter
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Apply date range filter
      if (fromDate && item.date < fromDate) {
        return false;
      }
      if (toDate) {
        const nextDay = new Date(toDate);
        nextDay.setDate(nextDay.getDate() + 1);
        if (item.date >= nextDay) {
          return false;
        }
      }
      
      // Apply type filter
      if (selectedType !== "all" && item.type.toLowerCase() !== selectedType.toLowerCase()) {
        return false;
      }
      
      // Apply strategy filter
      if (selectedStrategy !== "all") {
        const formattedStrategy = selectedStrategy.replace(/-/g, ' ').toLowerCase();
        if (item.strategy.toLowerCase() !== formattedStrategy) {
          return false;
        }
      }
      
      // Apply status filter
      if (statusFilter !== "all" && item.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }
      
      return true;
    });
  }, [tradeSetupData, searchQuery, fromDate, toDate, selectedType, selectedStrategy, statusFilter]);

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      if (sortConfig.key === 'date') {
        if (sortConfig.direction === 'ascending') {
          return a.date.getTime() - b.date.getTime();
        } else {
          return b.date.getTime() - a.date.getTime();
        }
      } else if (sortConfig.key === 'title') {
        if (sortConfig.direction === 'ascending') {
          return a.title.localeCompare(b.title);
        } else {
          return b.title.localeCompare(a.title);
        }
      } else if (sortConfig.key === 'type') {
        if (sortConfig.direction === 'ascending') {
          return a.type.localeCompare(b.type);
        } else {
          return b.type.localeCompare(a.type);
        }
      } else if (sortConfig.key === 'strategy') {
        if (sortConfig.direction === 'ascending') {
          return a.strategy.localeCompare(b.strategy);
        } else {
          return b.strategy.localeCompare(a.strategy);
        }
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const clearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setSelectedType("all");
    setSelectedStrategy("all");
    setSearchQuery("");
    setStatusFilter("all");
  };

  // Calculate position size and risk metrics
  const calculatePositionSize = () => {
    if (!entryPrice || !stopLoss) return;
    
    const entry = parseFloat(entryPrice);
    const stop = parseFloat(stopLoss);
    if (isNaN(entry) || isNaN(stop)) return;
    
    const riskAmount = accountSize * (tradeRisk / 100);
    const priceDiff = Math.abs(entry - stop);
    const positionSizeValue = riskAmount / priceDiff;
    
    setPositionSize(Math.floor(positionSizeValue * 100) / 100);
  };
  
  // Calculate risk-reward ratio
  const calculateRiskReward = () => {
    if (!entryPrice || !stopLoss || !takeProfit1) return "-";
    
    const entry = parseFloat(entryPrice);
    const stop = parseFloat(stopLoss);
    const tp = parseFloat(takeProfit1);
    
    if (isNaN(entry) || isNaN(stop) || isNaN(tp)) return "-";
    
    const risk = Math.abs(entry - stop);
    const reward = Math.abs(tp - entry);
    
    return (reward / risk).toFixed(2) + ":1";
  };
  
  // Effect to recalculate position size when inputs change
  React.useEffect(() => {
    calculatePositionSize();
  }, [entryPrice, stopLoss, tradeRisk, accountSize]);
  
  // Open trade planning modal for a specific trade
  const openTradePlanning = (id: number) => {
    setSelectedTradeId(id);
    setShowPlanningModal(true);
    
    // Find trade data and populate form (simulated for now)
    const trade = tradeSetupData.find(t => t.id === id);
    if (trade) {
      setEntryPrice("150.25"); // Example values
      setStopLoss("148.50");
      setTakeProfit1("153.75");
      setTakeProfit2("155.50");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 mt-4">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>PET Zone</span>
          <span>/</span>
          <span className="text-gray-800 font-medium">Trade Setup</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Trade Setup</h1>
        <p className="text-gray-500">Plan, analyze and manage trade setups with advanced risk management tools</p>
      </div>

      {/* Stats dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-gray-200 shadow-sm bg-white">
          <CardContent className="p-5 flex items-center">
            <div className="mr-4 bg-blue-50 p-3 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Setups</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {tradeSetupData.filter(t => t.status === "Active").length}
              </h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200 shadow-sm bg-white">
          <CardContent className="p-5 flex items-center">
            <div className="mr-4 bg-green-50 p-3 rounded-lg">
              <Trophy className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Win Rate</p>
              <h3 className="text-2xl font-bold text-gray-800">68.5%</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200 shadow-sm bg-white">
          <CardContent className="p-5 flex items-center">
            <div className="mr-4 bg-purple-50 p-3 rounded-lg">
              <BarChart4 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Risk:Reward</p>
              <h3 className="text-2xl font-bold text-gray-800">1:2.3</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200 shadow-sm bg-white">
          <CardContent className="p-5 flex items-center">
            <div className="mr-4 bg-amber-50 p-3 rounded-lg">
              <Banknote className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Position</p>
              <h3 className="text-2xl font-bold text-gray-800">$1,245</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8 border-gray-200 shadow-sm">
        <CardHeader className="pb-3 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium text-gray-700">Filter Options</CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setStatusFilter(statusFilter === "all" ? "active" : "all")}
                className={cn(
                  "text-xs h-8 border-gray-200",
                  statusFilter === "active" ? "bg-teal-50 text-teal-700 border-teal-200" : "bg-white"
                )}
              >
                {statusFilter === "active" ? "Showing Active Only" : "Show All"}
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* From Date */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <DatePicker 
                date={fromDate} 
                setDate={(date: Date | undefined) => {
                  if (date) setFromDate(date);
                }} 
                placeholder="Select start date"
                defaultMonth={new Date(2025, 2)}
                className="w-full"
              />
            </div>

            {/* To Date */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <DatePicker 
                date={toDate} 
                setDate={(date: Date | undefined) => {
                  if (date) setToDate(date);
                }} 
                placeholder="Select end date"
                defaultMonth={fromDate || new Date(2025, 2)}
                disabled={(date) => 
                  (fromDate ? date < fromDate : false) || 
                  date > new Date()
                }
                className="w-full"
              />
            </div>

            {/* Trade Type */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Trade Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="border-gray-200 bg-white">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {tradeTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Strategy */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Strategy</label>
              <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                <SelectTrigger className="border-gray-200 bg-white">
                  <SelectValue placeholder="Select Strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Strategies</SelectItem>
                  {strategyTypes.map((strategy) => (
                    <SelectItem key={strategy.value} value={strategy.value}>
                      {strategy.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
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
          </div>

          <div className="flex gap-2 mt-6">
            <Button 
              variant="default" 
              size="sm" 
              className="bg-teal-500 hover:bg-teal-600 text-white px-4"
            >
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFilters}
              className="border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* New quick action buttons */}
      <div className="flex gap-3 mb-6">
        <Button 
          variant="outline" 
          className="bg-white border-gray-200 text-gray-800 hover:bg-gray-50 hover:text-gray-900 shadow-sm"
        >
          <Sparkles className="mr-2 h-4 w-4 text-amber-500" />
          New Setup
        </Button>
        <Button 
          variant="outline" 
          className="bg-white border-gray-200 text-gray-800 hover:bg-gray-50 hover:text-gray-900 shadow-sm"
        >
          <Calculator className="mr-2 h-4 w-4 text-blue-500" />
          Position Calculator
        </Button>
        <Button 
          variant="outline" 
          className="bg-white border-gray-200 text-gray-800 hover:bg-gray-50 hover:text-gray-900 shadow-sm"
        >
          <Download className="mr-2 h-4 w-4 text-green-500" />
          Export
        </Button>
      </div>
      
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-medium text-gray-700">Results ({sortedData.length})</h3>
            <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
              {sortConfig?.key 
                ? `Sorted by ${sortConfig.key.charAt(0).toUpperCase() + sortConfig.key.slice(1)}: ${sortConfig.direction === 'ascending' ? 'A-Z' : 'Z-A'}`
                : 'Default Sort'}
            </Badge>
          </div>
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[60px] font-medium text-gray-700">ID</TableHead>
                <TableHead className="font-medium text-gray-700">
                  <Button 
                    variant="ghost" 
                    onClick={() => requestSort('date')}
                    className="flex items-center font-medium text-gray-700 hover:text-gray-900"
                  >
                    DATE
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="font-medium text-gray-700">
                  <Button 
                    variant="ghost" 
                    onClick={() => requestSort('title')}
                    className="flex items-center font-medium text-gray-700 hover:text-gray-900"
                  >
                    INSTRUMENT
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="font-medium text-gray-700">
                  <Button 
                    variant="ghost" 
                    onClick={() => requestSort('type')}
                    className="flex items-center font-medium text-gray-700 hover:text-gray-900"
                  >
                    TYPE
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="font-medium text-gray-700">
                  <Button 
                    variant="ghost" 
                    onClick={() => requestSort('strategy')}
                    className="flex items-center font-medium text-gray-700 hover:text-gray-900"
                  >
                    STRATEGY
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="font-medium text-gray-700">STATUS</TableHead>
                <TableHead className="text-right font-medium text-gray-700">ACTION</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length > 0 ? (
                sortedData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{format(item.date, 'dd/MM/yyyy')}</TableCell>
                    <TableCell className="font-medium text-gray-800">{item.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "font-medium border-0 px-2 py-0.5",
                        item.type === 'Intraday' 
                          ? "bg-blue-50 text-blue-700" 
                          : item.type === 'Swing'
                            ? "bg-purple-50 text-purple-700"
                            : "bg-amber-50 text-amber-700"
                      )}>
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.strategy}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "font-medium border-0 px-2 py-0.5",
                        item.status === 'Active' 
                          ? "bg-green-50 text-green-700" 
                          : "bg-gray-50 text-gray-700"
                      )}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                          onClick={() => openTradePlanning(item.id)}
                        >
                          <Calculator className="mr-2 h-4 w-4" />
                          Plan
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                    No results found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Trade Planning Modal */}
      {showPlanningModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Trade Planning: {tradeSetupData.find(t => t.id === selectedTradeId)?.title}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setShowPlanningModal(false)}>
                  <X className="h-5 w-5 text-gray-500" />
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Trading Parameters */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Trading Parameters</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Entry Price
                        </label>
                        <Input 
                          placeholder="Enter price" 
                          value={entryPrice}
                          onChange={(e) => setEntryPrice(e.target.value)}
                          className="border-gray-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Stop Loss
                        </label>
                        <Input 
                          placeholder="Enter price" 
                          value={stopLoss}
                          onChange={(e) => setStopLoss(e.target.value)}
                          className="border-gray-200"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Take Profit 1
                        </label>
                        <Input 
                          placeholder="Enter price" 
                          value={takeProfit1}
                          onChange={(e) => setTakeProfit1(e.target.value)}
                          className="border-gray-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Take Profit 2
                        </label>
                        <Input 
                          placeholder="Enter price" 
                          value={takeProfit2}
                          onChange={(e) => setTakeProfit2(e.target.value)}
                          className="border-gray-200"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Size
                      </label>
                      <Input 
                        placeholder="Enter account size" 
                        value={accountSize.toString()}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value)) setAccountSize(value);
                        }}
                        className="border-gray-200"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Risk Per Trade (%)
                      </label>
                      <div className="flex items-center gap-4">
                        <Input
                          type="range"
                          min={0.5}
                          max={5}
                          step={0.5}
                          value={tradeRisk}
                          onChange={(e) => setTradeRisk(parseFloat(e.target.value))}
                          className="flex-1"
                        />
                        <span className="bg-gray-100 px-2 py-1 rounded text-sm font-medium min-w-[50px] text-center">
                          {tradeRisk}%
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trade Notes
                      </label>
                      <Input
                        placeholder="Enter any notes about this trade setup..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="border-gray-200 min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Right Column: Calculations and Risk Management */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Risk Management</h3>
                  
                  <Card className="border-gray-200 mb-4">
                    <CardContent className="p-5">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Position Size</span>
                          <span className="text-xl font-bold text-gray-800">{positionSize}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Dollar Risk</span>
                          <span className="text-lg font-semibold text-red-600">
                            ${(accountSize * (tradeRisk / 100)).toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Risk-Reward Ratio</span>
                          <span className="text-lg font-semibold text-green-600">
                            {calculateRiskReward()}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Expected Value</span>
                          <span className="text-lg font-semibold text-blue-600">$257.50</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-gray-200 mb-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">Entry Checklist</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="h-4 w-4 border border-gray-300 rounded mr-2 flex items-center justify-center hover:bg-gray-100 cursor-pointer">
                          </div>
                          <label className="text-sm ml-2">
                            Trade aligns with overall market trend
                          </label>
                        </div>
                        <div className="flex items-center">
                          <div className="h-4 w-4 border border-gray-300 rounded mr-2 flex items-center justify-center hover:bg-gray-100 cursor-pointer">
                          </div>
                          <label className="text-sm ml-2">
                            Key support/resistance levels identified
                          </label>
                        </div>
                        <div className="flex items-center">
                          <div className="h-4 w-4 border border-gray-300 rounded mr-2 flex items-center justify-center hover:bg-gray-100 cursor-pointer">
                          </div>
                          <label className="text-sm ml-2">
                            Risk-reward ratio meets minimum criteria (1:2)
                          </label>
                        </div>
                        <div className="flex items-center">
                          <div className="h-4 w-4 border border-gray-300 rounded mr-2 flex items-center justify-center hover:bg-gray-100 cursor-pointer">
                          </div>
                          <label className="text-sm ml-2">
                            Position size within risk management guidelines
                          </label>
                        </div>
                        <div className="flex items-center">
                          <div className="h-4 w-4 border border-gray-300 rounded mr-2 flex items-center justify-center hover:bg-gray-100 cursor-pointer">
                          </div>
                          <label className="text-sm ml-2">
                            Trading setup matches strategy rules
                          </label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="flex gap-2 mt-6">
                    <Button className="flex-1 bg-teal-500 hover:bg-teal-600 text-white">
                      <Save className="mr-2 h-4 w-4" />
                      Save Plan
                    </Button>
                    <Button variant="outline" className="flex-1 border-gray-200">
                      <Bookmark className="mr-2 h-4 w-4" />
                      Save Template
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 