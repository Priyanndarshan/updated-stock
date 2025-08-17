'use client';

import React from 'react';
import { AlertTriangle, Info, Shield, HelpCircle, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="text-sm text-gray-400 flex items-center">
              <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
              <span>
                Trading involves significant risk. Past performance is not indicative of future results.
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            <a href="#" className="flex items-center hover:text-white transition-colors">
              <Info className="h-3.5 w-3.5 mr-1" />
              About
            </a>
            <a href="#" className="flex items-center hover:text-white transition-colors">
              <Shield className="h-3.5 w-3.5 mr-1" />
              Privacy
            </a>
            <a href="#" className="flex items-center hover:text-white transition-colors">
              <HelpCircle className="h-3.5 w-3.5 mr-1" />
              Help Center
            </a>
            <a href="#" className="flex items-center hover:text-white transition-colors">
              <Mail className="h-3.5 w-3.5 mr-1" />
              Contact
            </a>
          </div>
          
          <div className="mt-4 md:mt-0 text-xs text-gray-500">
            &copy; {new Date().getFullYear()} ROAR Trade. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
} 