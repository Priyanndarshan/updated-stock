import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface Sale {
  id: number;
  name: string;
  email: string;
  amount: string;
  image?: string;
}

const RecentSales: React.FC = () => {
  const sales: Sale[] = [
    {
      id: 1,
      name: 'Olivia Martin',
      email: 'olivia.martin@email.com',
      amount: '+$1,999.00'
    },
    {
      id: 2,
      name: 'Jackson Lee',
      email: 'jackson.lee@email.com',
      amount: '+$39.00'
    },
    {
      id: 3,
      name: 'Isabella Nguyen',
      email: 'isabella.nguyen@email.com',
      amount: '+$299.00'
    },
    {
      id: 4,
      name: 'William Kim',
      email: 'will@email.com',
      amount: '+$99.00'
    },
    {
      id: 5,
      name: 'Sofia Davis',
      email: 'sofia.davis@email.com',
      amount: '+$39.00'
    }
  ];

  return (
    <Card className="card-light h-full">
      <CardHeader className="card-header">
        <CardTitle>Recent Sales</CardTitle>
        <p className="text-sm text-gray-500">
          You made 265 sales this month
        </p>
      </CardHeader>
      <CardContent className="card-content">
        <div className="recent-sales-list">
          {sales.map((sale) => (
            <div key={sale.id} className="recent-sale-item hover:bg-gray-50 rounded-md p-2 transition-colors">
              <div className="user-avatar">
                <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                  {sale.image ? (
                    <AvatarImage src={sale.image} alt={sale.name} />
                  ) : (
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {sale.name.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-800">{sale.name}</p>
                  <p className="text-xs text-gray-500">{sale.email}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-green-600">{sale.amount}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentSales; 