
import React, { useState } from 'react';
import { CreditCard, ArrowRightLeft, Download, Upload, Clock, X, Check, Smartphone, Building, User as UserIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TransactionType, Transaction } from '../types';

const WalletPage = () => {
  const { user, updateUser } = useApp();
  const [activeModal, setActiveModal] = useState<'topup' | 'withdraw' | 'transfer' | null>(null);
  
  // Form States
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [note, setNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const resetForm = () => {
    setAmount('');
    setRecipient('');
    setNote('');
    setSelectedAccount('');
    setActiveModal(null);
    setIsProcessing(false);
  };

  const handleTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsProcessing(true);

    // Simulate API delay
    setTimeout(() => {
      const numAmount = Number(amount);
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        amount: numAmount,
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
        type: activeModal === 'topup' ? TransactionType.DEPOSIT : 
              activeModal === 'withdraw' ? TransactionType.WITHDRAWAL : 
              TransactionType.TRANSFER,
        description: activeModal === 'topup' ? `Top up from ${selectedAccount}` :
                     activeModal === 'withdraw' ? `Withdrawal to ${selectedAccount}` :
                     `Transfer to ${recipient}`
      };

      let newBalance = user.balance;
      if (activeModal === 'topup') {
        newBalance += numAmount;
      } else {
        if (numAmount > user.balance) {
            alert("Insufficient funds!");
            setIsProcessing(false);
            return;
        }
        newBalance -= numAmount;
      }

      updateUser({
        balance: newBalance,
        transactions: [newTransaction, ...(user.transactions || [])]
      });

      alert("Transaction Successful!");
      resetForm();
    }, 1500);
  };

  if (!user) return null;

  return (
    <div className="p-4 md:p-8 pb-24 dark:text-gray-100">
      <h1 className="text-2xl font-bold text-navy-900 dark:text-white mb-8">My Wallet</h1>

      {/* Main Card */}
      <div className="bg-navy-900 dark:bg-slate-950 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        
        <div className="relative z-10">
            <span className="text-gray-400 font-medium">Available Balance</span>
            <h2 className="text-4xl md:text-5xl font-bold font-display mt-2 mb-8">GHS {user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
            
            <div className="flex gap-4">
                <ActionButton icon={Upload} label="Top Up" onClick={() => setActiveModal('topup')} />
                <ActionButton icon={Download} label="Withdraw" onClick={() => setActiveModal('withdraw')} />
                <ActionButton icon={ArrowRightLeft} label="Transfer" onClick={() => setActiveModal('transfer')} />
            </div>
        </div>
      </div>

      {/* Transactions */}
      <div>
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-navy-900 dark:text-white">Recent Transactions</h3>
            <button className="text-sm text-gold-600 font-semibold hover:text-gold-500">See All</button>
        </div>

        <div className="space-y-4">
            {user.transactions && user.transactions.length > 0 ? (
                user.transactions.map((t) => (
                    <div key={t.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl flex items-center gap-4 border border-gray-100 dark:border-slate-700">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            t.type === TransactionType.DEPOSIT ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 
                            t.type === TransactionType.WITHDRAWAL ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 
                            'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                            {t.type === TransactionType.DEPOSIT ? <Upload size={20} /> : 
                             t.type === TransactionType.WITHDRAWAL ? <Download size={20} /> : <ArrowRightLeft size={20} />}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-navy-900 dark:text-white">{t.description}</h4>
                            <span className="text-xs text-gray-400">{t.date}</span>
                        </div>
                        <span className={`font-bold ${
                             t.type === TransactionType.DEPOSIT ? 'text-green-600 dark:text-green-400' : 'text-navy-900 dark:text-white'
                        }`}>
                            {t.type === TransactionType.DEPOSIT ? '+' : '-'} GHS {t.amount.toLocaleString()}
                        </span>
                    </div>
                ))
            ) : (
                <div className="text-center py-8 text-gray-400">No transactions yet.</div>
            )}
        </div>
      </div>

      {/* MODAL */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm">
           <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-navy-900 dark:text-white capitalize">{activeModal === 'topup' ? 'Top Up Wallet' : activeModal === 'withdraw' ? 'Withdraw Funds' : 'Transfer Money'}</h3>
                 <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X size={24} />
                 </button>
              </div>

              <form onSubmit={handleTransaction} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (GHS)</label>
                    <input 
                      type="number" 
                      placeholder="0.00" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-gold-500 font-bold text-lg" 
                      required
                      min="1"
                    />
                 </div>

                 {activeModal !== 'transfer' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{activeModal === 'topup' ? 'From Account' : 'To Account'}</label>
                        <select 
                            value={selectedAccount}
                            onChange={(e) => setSelectedAccount(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-gold-500"
                            required
                        >
                            <option value="">Select Account</option>
                            {user.linkedAccounts.map(acc => (
                                <option key={acc.id} value={`${acc.provider} - ${acc.accountNumber}`}>
                                    {acc.provider} ({acc.accountNumber.slice(-4)})
                                </option>
                            ))}
                        </select>
                    </div>
                 )}

                 {activeModal === 'transfer' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipient Number / ID</label>
                            <div className="relative">
                                <UserIcon size={20} className="absolute left-3 top-3.5 text-gray-400" />
                                <input 
                                type="text" 
                                placeholder="055..." 
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-gold-500" 
                                required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Note (Optional)</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Lunch money" 
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-gold-500" 
                            />
                        </div>
                    </>
                 )}

                 <button 
                    type="submit" 
                    disabled={isProcessing}
                    className="w-full bg-navy-900 dark:bg-gold-500 text-white dark:text-navy-900 font-bold py-4 rounded-xl transition-all mt-4 flex items-center justify-center gap-2 hover:opacity-90"
                 >
                    {isProcessing ? 'Processing...' : `Confirm ${activeModal === 'topup' ? 'Top Up' : activeModal === 'withdraw' ? 'Withdrawal' : 'Transfer'}`}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

const ActionButton = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
    <button onClick={onClick} className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm py-3 rounded-xl flex flex-col items-center gap-1 transition-colors">
        <Icon size={20} />
        <span className="text-xs font-medium">{label}</span>
    </button>
);

export default WalletPage;
