"use client";

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function PETZone() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar username="Chavan" />
      
      <div className="p-4 bg-gray-100 flex-grow">
        <div className="mb-4">
          <h1 className="text-gray-500 uppercase text-sm font-medium">PET ZONE</h1>
        </div>
        
        <div className="bg-white p-6 rounded-md shadow-sm">
          <h2 className="text-xl font-bold mb-4">PET Zone</h2>
          <p>This is a placeholder for the PET Zone page.</p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 