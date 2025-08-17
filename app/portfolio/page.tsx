"use client";

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  Briefcase, 
  DollarSign, 
  BarChart3, 
  PieChart, 
  Filter, 
  Download, 
  Clock, 
  ExternalLink,
  User,
  Shield,
  Mail,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Tablet,
  Smartphone,
  Globe,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import PortfolioService, { 
  User as UserType, 
  PortfolioAsset, 
  PortfolioPerformance, 
  AssetAllocation, 
  UserActivity, 
  PortfolioSummary 
} from '../../services/portfolioService';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Sample portfolio data
const portfolioAssets = [
  { id: 1, name: 'Apple Inc.', symbol: 'AAPL', shares: 35, price: 175.22, change: 2.45, marketValue: 6132.70, allocation: 25.8, costBasis: 5880.20, return: 4.3 },
  { id: 2, name: 'Microsoft Corp.', symbol: 'MSFT', shares: 20, price: 421.43, change: 1.83, marketValue: 8428.60, allocation: 35.5, costBasis: 7150.00, return: 17.9 },
  { id: 3, name: 'Tesla, Inc.', symbol: 'TSLA', shares: 15, price: 172.11, change: -1.52, marketValue: 2581.65, allocation: 10.9, costBasis: 3100.50, return: -16.7 },
  { id: 4, name: 'Amazon.com Inc.', symbol: 'AMZN', shares: 18, price: 178.95, change: 0.75, marketValue: 3221.10, allocation: 13.6, costBasis: 2950.20, return: 9.2 },
  { id: 5, name: 'Nvidia Corp.', symbol: 'NVDA', shares: 8, price: 885.97, change: 5.27, marketValue: 7087.76, allocation: 29.8, costBasis: 5320.00, return: 33.2 },
  { id: 6, name: 'Meta Platforms Inc.', symbol: 'META', shares: 14, price: 475.72, change: 1.92, marketValue: 6660.08, allocation: 28.0, costBasis: 5050.00, return: 31.9 },
];

// Portfolio performance history
const performanceData = [
  { date: '2023-09', value: 18750 },
  { date: '2023-10', value: 18200 },
  { date: '2023-11', value: 19450 },
  { date: '2023-12', value: 20100 },
  { date: '2024-01', value: 21300 },
  { date: '2024-02', value: 22450 },
  { date: '2024-03', value: 23750 },
];

// Asset allocation data
const allocationData = [
  { name: 'Technology', value: 58.3 },
  { name: 'Consumer Cyclical', value: 18.5 },
  { name: 'Communication', value: 13.2 },
  { name: 'Financial', value: 7.1 },
  { name: 'Healthcare', value: 2.9 },
];

// Performance comparison data
const comparisonData = [
  { name: 'Jan', portfolio: 5.2, sp500: 4.7, nasdaq: 5.5 },
  { name: 'Feb', portfolio: 3.8, sp500: 3.2, nasdaq: 4.1 },
  { name: 'Mar', portfolio: -1.2, sp500: -0.8, nasdaq: -1.5 },
  { name: 'Apr', portfolio: 4.5, sp500: 3.9, nasdaq: 5.2 },
  { name: 'May', portfolio: 2.9, sp500: 2.1, nasdaq: 3.3 },
  { name: 'Jun', portfolio: 1.7, sp500: 1.2, nasdaq: 1.8 },
];

// Monthly returns data
const monthlyReturns = [
  { month: 'Jan', return: 5.2 },
  { month: 'Feb', return: 3.8 },
  { month: 'Mar', return: -1.2 },
  { month: 'Apr', return: 4.5 },
  { month: 'May', return: 2.9 },
  { month: 'Jun', return: 1.7 },
];

// Portfolio summary metrics
const portfolioSummary = {
  totalValue: 23731.85,
  dayChange: 378.96,
  dayChangePercent: 1.62,
  totalReturn: 4428.65,
  totalReturnPercent: 22.91,
  startDate: '2023-07-15',
  riskLevel: 'Moderate-High',
  dividendYield: 1.2,
};

// Colors for the charts
const COLORS = ['#5736DB', '#45A29E', '#28D7BF', '#7158e2', '#3ae374'];

// Sample user details
const userDetails = {
  name: "Alex Thompson",
  email: "alex.thompson@example.com",
  accountType: "Premium Trader",
  accountNumber: "PT-78542-1239",
  joinDate: "July 15, 2023",
  verificationStatus: "Verified",
  tradingLevel: "Advanced",
  lastLogin: "Today, 08:32 AM",
  device: "Desktop - Chrome",
  location: "New York, USA",
  accountBalance: 127850.45,
  availableCash: 4118.60,
  pendingTransfers: 2000.00,
  margin: {
    available: 93731.85,
    used: 34118.60,
    maintenanceLevel: "Good",
    marginCallRisk: "Low",
  },
  profileCompletion: 92,
  loginHistory: [
    { date: "Today, 08:32 AM", device: "Desktop - Chrome", location: "New York, USA" },
    { date: "Yesterday, 06:45 PM", device: "Mobile - iOS App", location: "New York, USA" },
    { date: "Mar 14, 2024, 11:20 AM", device: "Tablet - Safari", location: "Chicago, USA" },
  ],
  recentActivities: [
    { date: "Mar 15, 2024", activity: "Bought 5 AAPL @ $175.22", value: "$876.10" },
    { date: "Mar 14, 2024", activity: "Sold 10 TSLA @ $172.11", value: "$1,721.10" },
    { date: "Mar 12, 2024", activity: "Deposit", value: "$5,000.00" },
  ]
};

export default function PortfolioPage() {
  const [timeRange, setTimeRange] = useState('6M');
  const [showUserDetails, setShowUserDetails] = useState(false);
  
  // Database state
  const [user, setUser] = useState<UserType | null>(null);
  const [portfolioAssets, setPortfolioAssets] = useState<PortfolioAsset[]>([]);
  const [performanceData, setPerformanceData] = useState<PortfolioPerformance[]>([]);
  const [allocationData, setAllocationData] = useState<AssetAllocation[]>([]);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary | null>(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Interactive states
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [editingAsset, setEditingAsset] = useState<PortfolioAsset | null>(null);
  const [newAsset, setNewAsset] = useState({
    symbol: '',
    name: '',
    shares: 0,
    price: 0,
    change_percent: 0,
    cost_basis: 0
  });

  // Fetch data from database
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setIsLoading(true);
        // For demo purposes, using the first user (Alex Thompson)
        // In a real app, you'd get the current user's ID from auth
        const sampleUserId = 'e44341c1-477a-41b3-8f66-f887f05838bf';
        
        const data = await PortfolioService.getPortfolioData(sampleUserId);
        
        if (data.user) setUser(data.user);
        if (data.assets) setPortfolioAssets(data.assets);
        if (data.performance) setPerformanceData(data.performance);
        if (data.allocation) setAllocationData(data.allocation);
        if (data.activities) setUserActivities(data.activities);
        if (data.summary) setPortfolioSummary(data.summary);
        
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        // Fallback to hardcoded data if database fails
        setUser(userDetails as any);
        setPortfolioAssets(portfolioAssets as any);
        setPerformanceData(performanceData as any);
        setAllocationData(allocationData as any);
        setUserActivities(userDetails.recentActivities as any);
        setPortfolioSummary(portfolioSummary as any);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  // Helper functions for interactive features
  const handleAddAsset = async () => {
    if (!user || !newAsset.symbol || !newAsset.name || newAsset.shares <= 0) return;
    
    try {
      setIsUpdating(true);
      
      const assetData = {
        user_id: user.id,
        symbol: newAsset.symbol.toUpperCase(),
        name: newAsset.name,
        shares: newAsset.shares,
        price: newAsset.price,
        change_percent: newAsset.change_percent,
        market_value: newAsset.shares * newAsset.price,
        allocation_percent: 0, // Will be calculated
        cost_basis: newAsset.cost_basis,
        return_percent: 0, // Will be calculated
        last_updated: new Date().toISOString()
      };
      
      const assetId = await PortfolioService.addPortfolioAsset(assetData);
      
      if (assetId) {
        // Refresh assets
        const updatedAssets = await PortfolioService.getPortfolioAssets(user.id);
        setPortfolioAssets(updatedAssets);
        
        // Reset form
        setNewAsset({
          symbol: '',
          name: '',
          shares: 0,
          price: 0,
          change_percent: 0,
          cost_basis: 0
        });
        setShowAddAsset(false);
        
        // Add activity
        await PortfolioService.addUserActivity({
          user_id: user.id,
          activity_type: 'BUY',
          description: `Bought ${newAsset.shares} ${newAsset.symbol} @ $${newAsset.price}`,
          value: newAsset.shares * newAsset.price,
          activity_date: new Date().toISOString().split('T')[0]
        });
      }
    } catch (error) {
      console.error('Error adding asset:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateAsset = async (asset: PortfolioAsset) => {
    try {
      setIsUpdating(true);
      
      const success = await PortfolioService.updatePortfolioAsset(asset.id, {
        price: asset.price,
        shares: asset.shares,
        change_percent: asset.change_percent,
        market_value: asset.shares * asset.price,
        last_updated: new Date().toISOString()
      });
      
      if (success) {
        // Refresh assets
        const updatedAssets = await PortfolioService.getPortfolioAssets(user!.id);
        setPortfolioAssets(updatedAssets);
        setEditingAsset(null);
      }
    } catch (error) {
      console.error('Error updating asset:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    if (!user) return;
    
    try {
      setIsUpdating(true);
      
      // Delete from database
      const success = await PortfolioService.deletePortfolioAsset(assetId);
      
      if (success) {
        // Remove from local state
        setPortfolioAssets(prev => prev.filter(a => a.id !== assetId));
        
        // Add activity
        await PortfolioService.addUserActivity({
          user_id: user.id,
          activity_type: 'SELL',
          description: 'Asset removed from portfolio',
          value: null,
          activity_date: new Date().toISOString().split('T')[0]
        });
      }
      
    } catch (error) {
      console.error('Error deleting asset:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="container mx-auto py-6 px-4 max-w-screen-2xl">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Dashboard</span>
          <ArrowRight size={12} />
          <span className="text-gray-800 font-medium">Portfolio</span>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">Your Portfolio</h1>
          <div className="flex gap-2">
            <button className="text-xs bg-white hover:bg-gray-50 text-gray-600 px-3 py-1.5 rounded border border-gray-200 flex items-center gap-1">
              <Filter size={12} />
              Filter
            </button>
            <button className="text-xs bg-white hover:bg-gray-50 text-gray-600 px-3 py-1.5 rounded border border-gray-200 flex items-center gap-1">
              <Download size={12} />
              Export
            </button>
          </div>
        </div>
      </div>
      
      {/* User Profile Section */}
      <div className="mb-6 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#5736DB] text-white flex items-center justify-center text-lg font-bold">
                {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'AT'}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                  {user?.name || 'Loading...'}
                  {user?.verification_status === "Verified" && (
                    <CheckCircle size={16} className="ml-2 text-green-500" />
                  )}
                </h2>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Mail size={12} className="mr-1" />
                  {user?.email || 'Loading...'}
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="bg-[#5736DB]/10 text-[#5736DB] text-[10px] font-medium px-2 py-0.5 rounded-full">
                    {user?.account_type || 'Loading...'}
                  </span>
                  <span className="text-xs text-gray-600">
                    ID: {user?.account_number || 'Loading...'}
                  </span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowUserDetails(!showUserDetails)}
              className="text-xs bg-white hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded border border-gray-200 flex items-center gap-1 transition-colors"
            >
              {showUserDetails ? 'Hide Details' : 'View Account Details'}
              <ChevronDown size={12} className={`ml-1 transition-transform ${showUserDetails ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
        
        {/* Collapsible Account Details */}
        {showUserDetails && (
          <div className="p-5 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Account Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                  <User size={14} className="mr-2 text-[#5736DB]" />
                  Account Information
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Member Since</span>
                    <span className="text-gray-800 font-medium">{user?.join_date || 'Loading...'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Trading Level</span>
                    <span className="text-gray-800 font-medium">{user?.trading_level || 'Loading...'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Login</span>
                    <span className="text-gray-800 font-medium">{user?.last_login ? new Date(user.last_login).toLocaleString() : 'Loading...'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Device</span>
                    <span className="text-gray-800 font-medium flex items-center">
                      <Tablet size={10} className="mr-1" />
                      {user?.device || 'Loading...'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location</span>
                    <span className="text-gray-800 font-medium flex items-center">
                      <Globe size={10} className="mr-1" />
                      {user?.location || 'Loading...'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Account Balance */}
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                  <DollarSign size={14} className="mr-2 text-[#5736DB]" />
                  Account Balance
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Value</span>
                    <span className="text-gray-800 font-medium">${user?.account_balance?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Available Cash</span>
                    <span className="text-gray-800 font-medium">${user?.available_cash?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pending Transfers</span>
                    <span className="text-gray-800 font-medium">${user?.pending_transfers?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Margin Available</span>
                    <span className="text-gray-800 font-medium">${user?.margin_available?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Margin Used</span>
                    <span className="text-gray-800 font-medium">${user?.margin_used?.toLocaleString() || '0'}</span>
                  </div>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                  <Clock size={14} className="mr-2 text-[#5736DB]" />
                  Recent Activity
                </h3>
                <div className="space-y-2.5 text-xs">
                  {userActivities.map((activity, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <span className="text-gray-800 font-medium">{activity.description}</span>
                        <div className="text-gray-500 text-[10px]">{activity.activity_date}</div>
                      </div>
                      <span className="text-gray-800 font-medium">
                        {activity.value ? `$${activity.value.toLocaleString()}` : 'N/A'}
                      </span>
                    </div>
                  ))}
                  <div className="pt-1">
                    <button className="text-[#5736DB] hover:text-[#452ba9] text-[10px] flex items-center">
                      View All Activity <ArrowRight size={10} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Security Status */}
            <div className="mt-5 pt-5 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield size={14} className="mr-2 text-green-600" />
                  <span className="text-xs font-medium text-gray-800">Account Security</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-6">
                    <div className="text-[10px] text-gray-500 mb-1">Profile Completion</div>
                    <div className="w-32 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-green-600 h-1.5 rounded-full" 
                        style={{ width: `${user?.profile_completion || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-1 text-[10px] ${user?.two_fa_enabled ? 'text-green-600' : 'text-gray-400'}`}>
                      <CheckCircle size={12} />
                      {user?.two_fa_enabled ? '2FA Enabled' : '2FA Disabled'}
                    </div>
                    <div className={`flex items-center gap-1 text-[10px] ${user?.email_verified ? 'text-green-600' : 'text-gray-400'}`}>
                      <CheckCircle size={12} />
                      {user?.email_verified ? 'Email Verified' : 'Email Unverified'}
                    </div>
                    <div className={`flex items-center gap-1 text-[10px] ${user?.kyc_approved ? 'text-green-600' : 'text-gray-400'}`}>
                      <CheckCircle size={12} />
                      {user?.kyc_approved ? 'KYC Approved' : 'KYC Pending'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Portfolio summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 font-medium">Total Value</div>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <Briefcase size={15} className="text-[#5736DB]" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold">${portfolioSummary?.total_value?.toLocaleString() || '0'}</div>
            <div className={`text-xs mt-1 flex items-center ${portfolioSummary?.day_change_percent && portfolioSummary.day_change_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {portfolioSummary?.day_change_percent && portfolioSummary.day_change_percent >= 0 ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
              {portfolioSummary?.day_change_percent && portfolioSummary.day_change_percent >= 0 ? '+' : ''}{portfolioSummary?.day_change_percent || 0}% today
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 font-medium">Total Return</div>
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp size={15} className="text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold">${portfolioSummary?.total_return?.toLocaleString() || '0'}</div>
            <div className={`text-xs mt-1 flex items-center ${portfolioSummary?.total_return_percent && portfolioSummary.total_return_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {portfolioSummary?.total_return_percent && portfolioSummary.total_return_percent >= 0 ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
              {portfolioSummary?.total_return_percent && portfolioSummary.total_return_percent >= 0 ? '+' : ''}{portfolioSummary?.total_return_percent || 0}% overall
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 font-medium">Risk Level</div>
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <BarChart3 size={15} className="text-amber-600" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold">{portfolioSummary?.risk_level || 'Moderate'}</div>
            <div className="text-xs mt-1 text-gray-500 flex items-center">
              <Clock size={12} className="mr-1" />
              Since {portfolioSummary?.start_date || '2023-07-15'}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 font-medium">Dividend Yield</div>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <DollarSign size={15} className="text-blue-600" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold">{portfolioSummary?.dividend_yield || 1.2}%</div>
            <div className="text-xs mt-1 text-gray-500 flex items-center">
              Annual yield on cost
            </div>
          </div>
        </div>
      </div>
      
      {/* Performance chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">Portfolio Performance</h2>
            <div className="flex bg-gray-100 rounded-md overflow-hidden text-xs">
              {['1M', '3M', '6M', 'YTD', '1Y', 'ALL'].map((range) => (
                <button
                  key={range}
                  className={`px-3 py-1.5 ${timeRange === range ? 'bg-[#5736DB] text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData.length > 0 ? performanceData : []}>
                <defs>
                  <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5736DB" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#5736DB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Value']}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#5736DB" 
                  fillOpacity={1} 
                  fill="url(#colorPortfolio)" 
                  dot={{ r: 4, fill: '#5736DB', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#5736DB', strokeWidth: 2, stroke: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Asset Allocation</h2>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={allocationData.length > 0 ? allocationData : []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="allocation_percent"
                  label={({ sector_name, allocation_percent }) => `${sector_name} ${allocation_percent}%`}
                  labelLine={false}
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Allocation']}
                  labelFormatter={(label) => `Sector: ${label}`}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Additional charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Performance Comparison</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, '']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="portfolio" 
                  name="Your Portfolio" 
                  stroke="#5736DB" 
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sp500" 
                  name="S&P 500" 
                  stroke="#45A29E" 
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="nasdaq" 
                  name="NASDAQ" 
                  stroke="#28D7BF" 
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Monthly Returns</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyReturns}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Return']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                />
                <Bar 
                  dataKey="return" 
                  name="Monthly Return" 
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                >
                  {
                    monthlyReturns.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.return >= 0 ? '#10B981' : '#EF4444'} 
                      />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Portfolio assets table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-base font-semibold text-gray-800">Your Assets</h2>
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-500">
              Last updated: Today, 10:45 AM
            </div>
            <button
              onClick={() => setShowAddAsset(true)}
              className="bg-[#5736DB] hover:bg-[#452ba9] text-white text-xs px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors"
            >
              <Plus size={12} />
              Add Asset
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Market Value</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Allocation</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Return</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {portfolioAssets.length > 0 ? portfolioAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 mr-3">
                        {asset.symbol.substring(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                        <div className="text-xs text-gray-500">{asset.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{asset.shares}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${asset.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center text-xs font-medium ${asset.change_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {asset.change_percent >= 0 ? '+' : ''}{asset.change_percent}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${asset.market_value.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2">
                        <div 
                          className="bg-[#5736DB] h-1.5 rounded-full" 
                          style={{ width: `${asset.allocation_percent}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{asset.allocation_percent}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center text-xs font-medium ${asset.return_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {asset.return_percent >= 0 ? '+' : ''}{asset.return_percent}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setEditingAsset(asset)}
                        className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                      >
                        <Edit size={12} className="mr-1" />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteAsset(asset.id)}
                        className="text-red-600 hover:text-red-800 text-xs flex items-center"
                      >
                        <Trash2 size={12} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    {isLoading ? 'Loading assets...' : 'No assets found. Add your first asset to get started!'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Additional features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-[#5736DB]/10 to-[#5736DB]/5 rounded-lg border border-[#5736DB]/20 p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-800">Optimize Your Portfolio</h3>
              <p className="text-sm text-gray-600 mt-1">Get personalized recommendations to improve your portfolio performance</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#5736DB]/20 flex items-center justify-center">
              <BarChart3 size={18} className="text-[#5736DB]" />
            </div>
          </div>
          
          <button className="mt-2 bg-[#5736DB] hover:bg-[#452ba9] text-white text-xs px-4 py-2 rounded-md transition-colors">
            View Recommendations
          </button>
        </div>
        
        <div className="bg-gradient-to-br from-[#28D7BF]/10 to-[#28D7BF]/5 rounded-lg border border-[#28D7BF]/20 p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-800">Set Investment Goals</h3>
              <p className="text-sm text-gray-600 mt-1">Track progress toward your financial targets and milestones</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#28D7BF]/20 flex items-center justify-center">
              <PieChart size={18} className="text-[#28D7BF]" />
            </div>
          </div>
          
          <button className="mt-2 bg-[#28D7BF] hover:bg-[#1eae9b] text-white text-xs px-4 py-2 rounded-md transition-colors">
            Set Goals
          </button>
        </div>
      </div>

      {/* Add Asset Modal */}
      {showAddAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Asset</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
                <input
                  type="text"
                  value={newAsset.symbol}
                  onChange={(e) => setNewAsset({...newAsset, symbol: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5736DB]"
                  placeholder="AAPL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5736DB]"
                  placeholder="Apple Inc."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shares</label>
                  <input
                    type="number"
                    value={newAsset.shares}
                    onChange={(e) => setNewAsset({...newAsset, shares: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5736DB]"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newAsset.price}
                    onChange={(e) => setNewAsset({...newAsset, price: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5736DB]"
                    placeholder="150.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Change %</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newAsset.change_percent}
                    onChange={(e) => setNewAsset({...newAsset, change_percent: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5736DB]"
                    placeholder="2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost Basis</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newAsset.cost_basis}
                    onChange={(e) => setNewAsset({...newAsset, cost_basis: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5736DB]"
                    placeholder="145.00"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddAsset}
                disabled={isUpdating}
                className="flex-1 bg-[#5736DB] hover:bg-[#452ba9] disabled:bg-gray-400 text-white py-2 px-4 rounded-md transition-colors"
              >
                {isUpdating ? 'Adding...' : 'Add Asset'}
              </button>
              <button
                onClick={() => setShowAddAsset(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Asset Modal */}
      {editingAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Asset</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
                <input
                  type="text"
                  value={editingAsset.symbol}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={editingAsset.name}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shares</label>
                  <input
                    type="number"
                    value={editingAsset.shares}
                    onChange={(e) => setEditingAsset({...editingAsset, shares: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5736DB]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingAsset.price}
                    onChange={(e) => setEditingAsset({...editingAsset, price: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5736DB]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Change %</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingAsset.change_percent}
                  onChange={(e) => setEditingAsset({...editingAsset, change_percent: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5736DB]"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleUpdateAsset(editingAsset)}
                disabled={isUpdating}
                className="flex-1 bg-[#5736DB] hover:bg-[#452ba9] disabled:bg-gray-400 text-white py-2 px-4 rounded-md transition-colors"
              >
                {isUpdating ? 'Updating...' : 'Update Asset'}
              </button>
              <button
                onClick={() => setEditingAsset(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5736DB] mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading portfolio data...</p>
          </div>
        </div>
      )}
    </div>
  );
} 