import React from 'react';

const Disclaimer: React.FC = () => {
  return (
    <div className="dashboard-card dashboard-card-yellow">
      <h2 className="text-xl font-bold text-gray-800 mb-4">DISCLAIMER</h2>
      <div className="text-sm text-gray-800">
        <p className="mb-3">
          The content shared in live sessions or consultations, including all strategies, insights, market analysis, and trade setups, is <span className="font-semibold">strictly for educational purposes only</span>. It is not intended as financial, investment, or trading advice.
        </p>
        <p className="mb-3">
          Profitever Traders (PET) does not provide stock recommendations, trading tips, or investment advice. We are not responsible for any profits, losses, or financial decisions made based on the information discussed during these sessions.
        </p>
        <p className="mb-3">
          These sessions comply with SEBI guidelines for educational institutions and are designed to enhance knowledge, not to provide financial advice.
        </p>
        <div className="mb-3">
          <p className="font-semibold text-gray-800 mb-2">Important Notice:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Trading and investing involve significant risk. Past performance does not guarantee future results.</li>
            <li>Participants are advised to conduct their own research before making any trading or investment decisions.</li>
            <li>By attending live sessions or consultations, you acknowledge that:</li>
            <ul className="list-circle pl-6 space-y-1 mt-1">
              <li>You are solely responsible for your trading and investment decisions.</li>
              <li>You understand the risks involved in trading and financial markets.</li>
              <li>PET, its mentors, and trainers are not liable for any financial outcomes.</li>
            </ul>
          </ul>
        </div>
        <p className="font-medium text-center text-primary">Learn, practice, and trade responsibly!</p>
      </div>
    </div>
  );
};

export default Disclaimer; 