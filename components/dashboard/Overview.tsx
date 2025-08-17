"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  BarChart, 
  PieChart, 
  TrendingUp,
  Percent,
  Clock,
  Calendar
} from 'lucide-react';

const Overview: React.FC = () => {
  // Mock data for trading performance
  const performanceData = {
    daily: {
      totalTrades: 8,
      winRate: 62.5,
      profitLoss: 1250.75,
      profitFactor: 2.3,
      avgWin: 325.50,
      avgLoss: -142.25,
    },
    weekly: {
      totalTrades: 32,
      winRate: 59.4,
      profitLoss: 3875.25,
      profitFactor: 2.1,
      avgWin: 298.75,
      avgLoss: -156.50,
    },
    monthly: {
      totalTrades: 124,
      winRate: 61.3,
      profitLoss: 15250.50,
      profitFactor: 2.4,
      avgWin: 312.25,
      avgLoss: -148.75,
    }
  };

  // Mock data for portfolio allocation
  const portfolioData = {
    totalValue: 125750.25,
    cashAvailable: 42580.75,
    equityValue: 83169.50,
    allocation: [
      { category: 'Technology', percentage: 35, value: 29109.33 },
      { category: 'Healthcare', percentage: 25, value: 20792.38 },
      { category: 'Financials', percentage: 15, value: 12475.43 },
      { category: 'Consumer', percentage: 10, value: 8316.95 },
      { category: 'Energy', percentage: 8, value: 6653.56 },
      { category: 'Other', percentage: 7, value: 5821.85 },
    ]
  };

  return (
    <Card className="shadow-sm border-gray-200 bg-white">
      <CardHeader className="pb-2 border-b border-gray-200">
        <CardTitle className="text-lg font-bold text-gray-800">Trading Performance</CardTitle>
      </CardHeader>
      <CardContent className="bg-white">
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-50">
            <TabsTrigger value="performance" className="data-[state=active]:bg-white data-[state=active]:text-teal-600">Performance Metrics</TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-white data-[state=active]:text-teal-600">Portfolio Overview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-teal-600 flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        Time Frame
                      </p>
                      <div className="flex mt-1 space-x-2">
                        <span className="px-2 py-1 bg-white rounded-md text-xs font-medium text-teal-600 border border-gray-200">Daily</span>
                        <span className="px-2 py-1 bg-white rounded-md text-xs font-medium text-teal-600 border border-gray-200">Weekly</span>
                        <span className="px-2 py-1 bg-white rounded-md text-xs font-medium text-teal-600 border border-gray-200">Monthly</span>
                      </div>
                    </div>
                    <Calendar className="h-5 w-5 text-teal-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className={`${performanceData.daily.profitLoss >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Profit/Loss (Daily)</p>
                      <h3 className={`text-xl font-bold mt-1 ${performanceData.daily.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${performanceData.daily.profitLoss.toFixed(2)}
                      </h3>
                    </div>
                    {performanceData.daily.profitLoss >= 0 ? (
                      <ArrowUpRight className="h-5 w-5 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Win Rate (Daily)</p>
                      <h3 className="text-xl font-bold mt-1 text-purple-600">
                        {performanceData.daily.winRate}%
                      </h3>
                    </div>
                    <Percent className="h-5 w-5 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-gray-200 bg-white">
                <CardHeader className="pb-2 bg-gray-50">
                  <CardTitle className="text-sm font-medium text-gray-600">Daily Performance</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Total Trades</span>
                      <span className="text-sm font-medium">{performanceData.daily.totalTrades}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Win Rate</span>
                      <span className="text-sm font-medium">{performanceData.daily.winRate}%</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Profit Factor</span>
                      <span className="text-sm font-medium">{performanceData.daily.profitFactor}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Average Win</span>
                      <span className="text-sm font-medium text-green-600">${performanceData.daily.avgWin.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-sm text-gray-600">Average Loss</span>
                      <span className="text-sm font-medium text-red-600">${performanceData.daily.avgLoss.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-gray-200 bg-white">
                <CardHeader className="pb-2 bg-gray-50">
                  <CardTitle className="text-sm font-medium text-gray-600">Monthly Performance</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Total Trades</span>
                      <span className="text-sm font-medium">{performanceData.monthly.totalTrades}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Win Rate</span>
                      <span className="text-sm font-medium">{performanceData.monthly.winRate}%</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Profit Factor</span>
                      <span className="text-sm font-medium">{performanceData.monthly.profitFactor}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Average Win</span>
                      <span className="text-sm font-medium text-green-600">${performanceData.monthly.avgWin.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-sm text-gray-600">Average Loss</span>
                      <span className="text-sm font-medium text-red-600">${performanceData.monthly.avgLoss.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="portfolio" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Portfolio Value</p>
                      <h3 className="text-xl font-bold mt-1 text-green-600">
                        ${portfolioData.totalValue.toLocaleString()}
                      </h3>
                    </div>
                    <DollarSign className="h-5 w-5 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-teal-50 border-teal-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Cash Available</p>
                      <h3 className="text-xl font-bold mt-1 text-teal-600">
                        ${portfolioData.cashAvailable.toLocaleString()}
                      </h3>
                    </div>
                    <DollarSign className="h-5 w-5 text-teal-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Equity Value</p>
                      <h3 className="text-xl font-bold mt-1 text-purple-600">
                        ${portfolioData.equityValue.toLocaleString()}
                      </h3>
                    </div>
                    <TrendingUp className="h-5 w-5 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="border-gray-200 bg-white">
              <CardHeader className="pb-2 bg-gray-50">
                <CardTitle className="text-sm font-medium text-gray-600">Portfolio Allocation</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {portfolioData.allocation.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{item.category}</span>
                        <span className="text-sm text-gray-600">{item.percentage}% (${item.value.toLocaleString()})</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            index === 0 ? 'bg-teal-500' :
                            index === 1 ? 'bg-blue-500' :
                            index === 2 ? 'bg-purple-500' :
                            index === 3 ? 'bg-amber-500' :
                            index === 4 ? 'bg-red-500' :
                            'bg-gray-500'
                          }`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 flex justify-between items-center text-xs text-gray-500 border-t border-gray-100 pt-2">
          <span>Last updated: Today at 10:45 AM</span>
          <button className="text-teal-600 hover:text-teal-700 font-medium flex items-center">
            View Detailed Analytics
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Overview; 