"use client";

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function InvestPremium() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar username="Chavan" />
      
      <div className="p-4 bg-gray-100 flex-grow">
        <div className="mb-4">
          <h1 className="text-gray-500 uppercase text-sm font-medium">INVEST PREMIUM</h1>
        </div>
        
        <div className="bg-white p-6 rounded-md shadow-sm">
          <h2 className="text-xl font-bold mb-4">Premium Investment Options</h2>
          <p>This is a placeholder for the Invest Premium page.</p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 