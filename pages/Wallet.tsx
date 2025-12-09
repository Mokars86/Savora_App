import React from 'react';
import { CreditCard, ArrowRightLeft, Download, Upload, Clock } from 'lucide-react';
import { MOCK_USER, MOCK_TRANSACTIONS } from '../constants';

const WalletPage = () => {
  return (
    <div className="p-4 md:p-8 pb-24">
      <h1 className="text-2xl font-bold text-navy-900 mb-8">My Wallet</h1>

      {/* Main Card */}
      <div className="bg-navy-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        
        <div className="relative z-10">
            <span className="text-gray-400 font-medium">Available Balance</span>
            <h2 className="text-4xl md:text-5xl font-bold font-display mt-2 mb-8">GHS {MOCK_USER.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
            
            <div className="flex gap-4">
                <ActionButton icon={Upload} label="Top Up" />
                <ActionButton icon={Download} label="Withdraw" />
                <ActionButton icon={ArrowRightLeft} label="Transfer" />
            </div>
        </div>
      </div>

      {/* Transactions */}
      <div>
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-navy-900">Recent Transactions</h3>
            <button className="text-sm text-gold-600 font-semibold">See All</button>
        </div>

        <div className="space-y-4">
            {MOCK_TRANSACTIONS.map((t) => (
                <div key={t.id} className="bg-white p-4 rounded-2xl flex items-center gap-4 border border-gray-100">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        t.type === 'DEPOSIT' ? 'bg-green-100 text-green-600' : 
                        t.type === 'WITHDRAWAL' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                        {t.type === 'DEPOSIT' ? <Upload size={20} /> : 
                         t.type === 'WITHDRAWAL' ? <Download size={20} /> : <ArrowRightLeft size={20} />}
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-navy-900">{t.description}</h4>
                        <span className="text-xs text-gray-400">{t.date}</span>
                    </div>
                    <span className={`font-bold ${
                         t.type === 'DEPOSIT' ? 'text-green-600' : 'text-navy-900'
                    }`}>
                        {t.type === 'DEPOSIT' ? '+' : '-'} GHS {t.amount}
                    </span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ icon: Icon, label }: { icon: any, label: string }) => (
    <button className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm py-3 rounded-xl flex flex-col items-center gap-1 transition-colors">
        <Icon size={20} />
        <span className="text-xs font-medium">{label}</span>
    </button>
);

export default WalletPage;
