import React from 'react';
import { Card, CardContent } from '../ui/card';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon }) => {
  const isPositive = change.startsWith('+');
  
  return (
    <Card className="card-light overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="stat-title">{title}</p>
            <h3 className="stat-value mt-1">{value}</h3>
            <p className={isPositive ? 'stat-change-positive' : 'stat-change-negative'}>
              {change}
            </p>
          </div>
          <div className="stat-icon">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard; 