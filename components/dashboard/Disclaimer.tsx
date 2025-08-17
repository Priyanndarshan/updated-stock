import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Disclaimer: React.FC = () => {
  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="text-gray-800 uppercase text-base font-bold">DISCLAIMER</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm">
          <p>
            The content shared in live sessions or consultations, including all strategies, insights, market analysis, and trade setups, is strictly for educational purposes only. It is not intended as financial, investment, or trading advice.
          </p>
          
          <p>
            VARAAHI Group of Companies (PET) does not provide stock recommendations, trading tips, or investment advice. We are not responsible for any profits, losses, or financial decisions made based on the information discussed during these sessions.
          </p>
          
          <p>
            These sessions comply with SEBI guidelines for educational institutions and are designed to enhance knowledge, not to provide financial advice.
          </p>
          
          <p className="font-medium">Important Notice:</p>
          
          <ul className="list-disc pl-5 space-y-1">
            <li>Trading and investing involve significant risk. Past performance does not guarantee future results.</li>
            <li>Participants are advised to conduct their own research before making any trading or investment decisions.</li>
            <li>By attending live sessions or consultations, you acknowledge that:</li>
            <li>You are solely responsible for your trading and investment decisions.</li>
            <li>You understand the risks involved in trading and financial markets.</li>
            <li>PET, its mentors, and trainers are not liable for any financial outcomes.</li>
          </ul>
          
          <p className="font-medium">Learn, practice, and trade responsibly!</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Disclaimer;
