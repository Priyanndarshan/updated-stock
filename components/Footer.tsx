import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-3 px-6 text-sm text-gray-600 border-t bg-white">
      <div className="container mx-auto flex justify-between items-center">
        <p>Copyright © {currentYear} PET Administration. All rights reserved.</p>
        <div className="flex space-x-6">
          <a href="#" className="text-primary hover:underline">Terms</a>
          <a href="#" className="text-primary hover:underline">Privacy</a>
          <a href="#" className="text-primary hover:underline">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 