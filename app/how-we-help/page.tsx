"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  CheckCircle2, 
  Target, 
  BarChart2, 
  TrendingUp, 
  Calendar, 
  ListChecks, 
  Compass, 
  LineChart, 
  BarChart, 
  Clock, 
  Video, 
  Shield,
  ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function HowWeHelp() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl bg-white">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span>Dashboard</span>
          <span>/</span>
          <span className="text-gray-800 font-medium">How We Help</span>
        </div>
        <div className="text-center">
          <Badge variant="outline" className="bg-white text-teal-500 mb-4 px-4 py-1 border border-teal-100 rounded-full">UPCOMING BOOTCAMP</Badge>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">How PET Help</h1>
          <Separator className="mx-auto my-6 bg-teal-100 w-24" />
        </div>
      </div>

      <div className="space-y-8">
        {/* Positive Ambience Section */}
        <section>
          <Card className="border border-teal-100 shadow-sm hover:shadow-md transition-all overflow-hidden bg-white rounded-xl">
            <CardHeader className="pb-3 bg-white border-b border-teal-50">
              <div className="flex items-center gap-3">
                <div className="bg-teal-50 p-2 rounded-full">
                  <CheckCircle2 className="h-6 w-6 text-teal-500" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">Positive Ambience</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-5 bg-white">
              <p className="text-gray-600 leading-relaxed">
                Create a winning mindset with daily chants, motivational quotes, calming music, and affirmations. 
                A positive environment enhances focus, confidence, and disciplined trading at Profitever Traders.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Weekly Goals Section */}
        <section>
          <Card className="border border-teal-100 shadow-sm hover:shadow-md transition-all overflow-hidden bg-white rounded-xl">
            <CardHeader className="pb-3 bg-white border-b border-teal-50">
              <div className="flex items-center gap-3">
                <div className="bg-teal-50 p-2 rounded-full">
                  <Calendar className="h-6 w-6 text-teal-500" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">Weekly Goals</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-5 bg-white">
              <ul className="space-y-5">
                {[
                  {
                    icon: <BarChart2 className="h-4 w-4 text-teal-500" />,
                    title: "Analyze market trends and review past performance.",
                    description: "Evaluate previous trades to identify patterns and areas for improvement."
                  },
                  {
                    icon: <Target className="h-4 w-4 text-teal-500" />,
                    title: "Set clear, actionable goals for the week.",
                    description: "Define specific targets for profit, risk management, and skill development."
                  },
                  {
                    icon: <Compass className="h-4 w-4 text-teal-500" />,
                    title: "Identify key support & resistance levels.",
                    description: "Map out critical price points to inform entry and exit decisions."
                  },
                  {
                    icon: <ListChecks className="h-4 w-4 text-teal-500" />,
                    title: "Maintain discipline to execute trades effectively.",
                    description: "Follow your trading plan consistently without emotional interference."
                  }
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 group">
                    <div className="bg-teal-50 p-1.5 rounded-full group-hover:bg-teal-100 transition-colors mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">{item.title}</p>
                      <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Focused Areas Section */}
        <section>
          <Card className="border border-teal-100 shadow-sm hover:shadow-md transition-all overflow-hidden bg-white rounded-xl">
            <CardHeader className="pb-3 bg-white border-b border-teal-50">
              <div className="flex items-center gap-3">
                <div className="bg-teal-50 p-2 rounded-full">
                  <Target className="h-6 w-6 text-teal-500" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">Focused Areas</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-5 bg-white">
              <p className="text-gray-600 mb-6">
                Stay sharp by concentrating on market analysis, strategy, and discipline. To navigate the daily market efficiently:
              </p>
              <div className="grid md:grid-cols-3 gap-5">
                {[
                  {
                    icon: <TrendingUp className="h-5 w-5 text-teal-500" />,
                    title: "Analyze trends, key levels, and volume data",
                    description: "Identify market direction and strength through technical indicators."
                  },
                  {
                    icon: <LineChart className="h-5 w-5 text-teal-500" />,
                    title: "Utilize technical tools",
                    description: "Apply moving averages & candlestick patterns for precise entry and exit points."
                  },
                  {
                    icon: <BarChart className="h-5 w-5 text-teal-500" />,
                    title: "Stay updated with news",
                    description: "Monitor economic events to anticipate market moves and volatility."
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-white p-5 rounded-lg border border-teal-100 hover:border-teal-200 transition-colors">
                    <div className="bg-teal-50 p-2 rounded-full w-fit mb-3">
                      {item.icon}
                    </div>
                    <h3 className="font-medium text-gray-700 mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* General Analysis Section */}
        <section>
          <Card className="border border-teal-100 shadow-sm hover:shadow-md transition-all overflow-hidden bg-white rounded-xl">
            <CardHeader className="pb-3 bg-white border-b border-teal-50">
              <div className="flex items-center gap-3">
                <div className="bg-teal-50 p-2 rounded-full">
                  <BarChart2 className="h-6 w-6 text-teal-500" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">General Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-5 bg-white">
              <div className="grid md:grid-cols-3 gap-5">
                {[
                  {
                    icon: <Target className="h-4 w-4 text-teal-500" />,
                    title: "Trade Setup",
                    description: "Identify optimal entry & exit points for the current day's trading session.",
                    link: "/pet-zone/trade-setup",
                    linkText: "View details"
                  },
                  {
                    icon: <Video className="h-4 w-4 text-teal-500" />,
                    title: "Pre-Trade Plan Videos",
                    description: "Review market strategies before execution to prepare for trading.",
                    link: "/videos/pre-trade-plan",
                    linkText: "Watch videos"
                  },
                  {
                    icon: <Clock className="h-4 w-4 text-teal-500" />,
                    title: "Live Session",
                    description: "Engage in real-time analysis and decision-making with expert traders.",
                    link: "/videos/live-sessions",
                    linkText: "Join session"
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-white p-5 rounded-lg border border-teal-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-teal-50 p-1.5 rounded-full">
                        {item.icon}
                      </div>
                      <h3 className="font-medium text-gray-700">{item.title}</h3>
                    </div>
                    <p className="text-gray-500 text-sm">{item.description}</p>
                    <div className="mt-3 flex items-center text-teal-500 text-sm font-medium">
                      <Link href={item.link} className="flex items-center hover:underline">
                        {item.linkText} <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Trading Philosophy */}
        <section>
          <Card className="border border-teal-100 shadow-sm hover:shadow-md transition-all overflow-hidden bg-white rounded-xl">
            <CardContent className="py-8 bg-white">
              <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                <div className="bg-teal-50 p-3 rounded-full mb-4">
                  <Shield className="h-8 w-8 text-teal-500" />
                </div>
                <p className="text-gray-700 italic font-medium text-lg mb-4">
                  Risk-Free | Doubt-Free | Fear-Free Trading
                </p>
                <Separator className="my-4 bg-teal-100 w-24" />
                <p className="text-gray-600 font-medium">
                  Trade with clarity, confidence, and conviction—eliminate hesitation, embrace discipline, and execute with precision!
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Call to Action */}
      <div className="mt-12 flex justify-center">
        <Button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 rounded-lg text-lg shadow-sm hover:shadow-md transition-all">
          Join Our Next Trading Bootcamp
        </Button>
      </div>
    </div>
  );
} 