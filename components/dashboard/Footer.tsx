"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 px-6 text-gray-600 border-t border-gray-200 bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image 
                src="/assets/varaahi.jpeg" 
                alt="VARAAHI Group of Companies" 
                width={180} 
                height={55} 
              />
            </div>
            <p className="text-sm">
              Your trusted platform for stock trading analysis, education, and community.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-700">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link></li>
              <li><Link href="/pet-zone" className="hover:text-blue-600">PET Zone</Link></li>
              <li><Link href="/invest-premium" className="hover:text-blue-600">Invest Premium</Link></li>
              <li><Link href="/how-we-help" className="hover:text-blue-600">How We Help</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Media & Downloads</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/videos" className="hover:text-blue-600">Videos</Link></li>
              <li><Link href="/meetings" className="hover:text-blue-600">Meetings</Link></li>
              <li><Link href="/downloads" className="hover:text-blue-600">Downloads</Link></li>
              <li><Link href="/blog" className="hover:text-blue-600">Blog</Link></li>
              <li><Link href="/faq" className="hover:text-blue-600">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:support@varaahi.com" className="hover:text-blue-600">support@varaahi.com</a>
              </li>
              <li>123 Trading Street</li>
              <li>Financial District</li>
              <li>New York, NY 10001</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} VARAAHI Group of Companies. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0 text-sm">
            <Link href="/privacy" className="hover:text-blue-600">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-blue-600">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-blue-600">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 