'use client';

import React from 'react';
import { Chat } from '@/components/Chat';

interface ChatSectionProps {
  analysis: any;
}

export default function ChatSection({ analysis }: ChatSectionProps) {
  return (
    <div className="h-full bg-gray-900 flex flex-col overflow-hidden border-l border-gray-800">
      <div className="flex-grow h-full">
        <Chat analysis={analysis} />
      </div>
    </div>
  );
} 