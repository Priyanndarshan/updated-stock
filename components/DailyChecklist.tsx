import React, { useState } from 'react';

interface ChecklistItem {
  id: number;
  text: string;
  checked: boolean;
}

const DailyChecklist: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: 1, text: 'Mindset Check: Did you complete 17 minutes of meditation or mental clarity?', checked: false },
    { id: 2, text: 'Concept Review: Did you watch previous trade plan videos or review past concepts?', checked: false },
    { id: 3, text: 'Market Levels: Did you check the previous day\'s high and low?', checked: false },
    { id: 4, text: 'Focused Area: Did you identify today\'s key demand & supply zones?', checked: false },
    { id: 5, text: 'Trade Decision: Have you decided whether to trade or stay out?', checked: false },
    { id: 6, text: 'Goal Alignment: Did you review your weekly and income goals?', checked: false },
    { id: 7, text: 'News & Events: Did you check for any market-moving news?', checked: false },
    { id: 8, text: 'Percentage Theory: Did you analyze the market\'s demand & supply using % theory?', checked: false },
    { id: 9, text: 'Premium Investment: Did you check if there is any investment premium opportunity?', checked: false },
    { id: 10, text: 'Mindset: Are you positive and disciplined before entering the market?', checked: true },
  ]);

  const handleCheckboxChange = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const completedCount = items.filter(item => item.checked).length;
  const totalCount = items.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <div className="dashboard-card dashboard-card-pink">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 border-0">DAILY CHECKLIST</h2>
        <div className="text-sm text-gray-600">
          {completedCount}/{totalCount} completed
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-primary h-2 rounded-full" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="checklist-item bg-white p-2 rounded border border-gray-100 hover:shadow-sm transition-shadow">
            <input
              type="checkbox"
              id={`checklist-item-${item.id}`}
              checked={item.checked}
              onChange={() => handleCheckboxChange(item.id)}
              className="checklist-checkbox"
            />
            <label htmlFor={`checklist-item-${item.id}`} className="text-sm cursor-pointer checklist-text">{item.text}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyChecklist; 