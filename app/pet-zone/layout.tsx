import React from 'react';

export default function PetZoneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-white">
        {children}
      </main>
    </div>
  );
} 