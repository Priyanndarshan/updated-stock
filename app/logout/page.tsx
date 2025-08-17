"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear all stored data
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear any cookies (if using js-cookie or similar)
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });

    // Optional: Add a small delay to show the logout message
    const timer = setTimeout(() => {
      router.push('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleImmediateRedirect = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-xl text-gray-900">Successfully Logged Out</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            You have been successfully logged out of your account. All session data has been cleared.
          </p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <LogOut className="h-4 w-4" />
            <span>Redirecting to home page...</span>
          </div>
          
          <Button 
            onClick={handleImmediateRedirect}
            className="w-full bg-teal-600 hover:bg-teal-700"
          >
            Go to Home Page
          </Button>
          
          <p className="text-xs text-gray-400">
            You will be automatically redirected in a few seconds
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 