
import React, { useState } from 'react';
import { Plus, Target, Lock, TrendingUp, X, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SavingGoal, Transaction, TransactionType } from '../types';

interface SavingsProps {
  isEmbedded?: boolean;
}

const Savings: React.FC<SavingsProps> = ({ isEmbedded = false }) => {
  const { user, updateUser } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  
  // Create Goal State
  const [newGoal, setNewGoal] = useState({ name: '', target: '', deadline: '', icon: '💰', color: 'bg-blue-500' });
  
  // Top Up State
  const [topUpAmount, setTopUpAmount] = useState('');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const goal: SavingGoal = {
        id: Date.now().toString(),
        name: newGoal.name,
        targetAmount: Number(newGoal.target),
        currentAmount: 0,
        deadline: newGoal.deadline,
        icon: newGoal.icon,
        color: newGoal.color
    };

    updateUser({
        savingsGoals: [...(user.savingsGoals || []), goal]
    });
    
    setShowCreateModal(false);
    setNewGoal({ name: '', target: '', deadline: '', icon: '💰', color: 'bg-blue-500' });
  };

  const openTopUp = (goalId: string) => {
    setSelectedGoalId(goalId);
    setShowTopUpModal(true);
  };

  const handleTopUpGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedGoalId) return;

    const amount = Number(topUpAmount);
    if (amount > user.balance) {
        alert("Insufficient wallet balance!");
        return;
    }

    // Deduct from wallet, add to savings balance, add to specific goal
    const updatedGoals = (user.savingsGoals || []).map(goal => {
        if (goal.id === selectedGoalId) {
            return { ...goal, currentAmount: goal.currentAmount + amount };
        }
        return goal;
    });

    // Record Transaction
    const transaction: Transaction = {
        id: Date.now().toString(),
        type: TransactionType.TRANSFER,
        amount: amount,
        date: new Date().toISOString().split('T')[0],
        description: `Saved towards ${updatedGoals.find(g => g.id === selectedGoalId)?.name}`,
        status: 'completed'
    };

    updateUser({
        balance: user.balance - amount,
        savingsBalance: user.savingsBalance + amount,
        savingsGoals: updatedGoals,
        transactions: [transaction, ...(user.transactions || [])]
    });

    setShowTopUpModal(false);
    setTopUpAmount('');
    alert("Goal funded successfully!");
  };

  if (!user) return null;

  return (
    <div className={isEmbedded ? "mt-4" : "p-4 md:p-8 dark:text-gray-100 pb-24"}>
      {!isEmbedded && (
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Personal Savings</h1>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-navy-900 dark:bg-gold-500 text-white dark:text-navy-900 p-2 rounded-full hover:bg-navy-800 dark:hover:bg-gold-600 transition-colors shadow-lg shadow-navy-900/10"
          >
            <Plus size={24} />
          </button>
        </div>
      )}
      
      {/* Total Savings Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-900 dark:to-blue-800 rounded-3xl p-6 text-white mb-8 shadow-xl shadow-blue-500/10">
         <div className="flex justify-between items-start">
            <div>
                <span className="text-blue-100 text-sm font-medium">Total Saved</span>
                <h2 className="text-3xl font-bold font-display mt-1">GHS {user.savingsBalance.toLocaleString()}</h2>
            </div>
            <div className="bg-white/20 p-2 rounded-xl">
                <TrendingUp size={24} />
            </div>
         </div>
      </div>
      
      <div className="grid gap-4">
        {user.savingsGoals && user.savingsGoals.length > 0 ? (
            user.savingsGoals.map((goal) => (
                <div key={goal.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row gap-6 items-center">
                    <div className={`w-16 h-16 rounded-2xl ${goal.color.replace('bg-', 'bg-').replace('500', '100')} dark:bg-opacity-20 flex items-center justify-center text-3xl`}>
                        {goal.icon}
                    </div>
                    <div className="flex-1 w-full">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-navy-900 dark:text-white text-lg">{goal.name}</h3>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Target: GHS {goal.targetAmount.toLocaleString()}</span>
                        </div>
                        <div className="h-3 w-full bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                            <div 
                                className={`h-full ${goal.color} rounded-full transition-all duration-1000`} 
                                style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>Saved: GHS {goal.currentAmount.toLocaleString()}</span>
                            <span>{Math.round((goal.currentAmount / goal.targetAmount) * 100)}%</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => openTopUp(goal.id)}
                        className="w-full md:w-auto px-6 py-2 border border-gray-200 dark:border-slate-600 rounded-xl font-medium text-navy-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        Top Up
                    </button>
                </div>
            ))
        ) : (
            <div className="text-center py-10 text-gray-400 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                <p>No savings goals yet. Create one to start saving!</p>
            </div>
        )}

        {/* Create new Goal Placeholder */}
        <button 
            onClick={() => setShowCreateModal(true)}
            className="border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-gold-500 hover:text-gold-500 transition-colors gap-2 min-h-[150px] bg-white/50 dark:bg-slate-800/30"
        >
            <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-slate-700 flex items-center justify-center">
                <Target size={24} />
            </div>
            <span className="font-medium">Create New Goal</span>
        </button>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm">
           <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-navy-900 dark:text-white">Create Saving Goal</h3>
                 <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X size={24} />
                 </button>
              </div>

              <form onSubmit={handleCreateGoal} className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goal Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Dream Vacation" 
                        value={newGoal.name}
                        onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-gold-500" 
                        required
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Amount (GHS)</label>
                      <input 
                        type="number" 
                        placeholder="5000" 
                        value={newGoal.target}
                        onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-gold-500" 
                        required
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deadline</label>
                      <input 
                        type="date" 
                        value={newGoal.deadline}
                        onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-gold-500" 
                        required
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
                      <div className="flex gap-2">
                          {['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-orange-500'].map(color => (
                              <button
                                type="button"
                                key={color}
                                onClick={() => setNewGoal({...newGoal, color})}
                                className={`w-8 h-8 rounded-full ${color} ${newGoal.color === color ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-slate-800' : ''}`}
                              />
                          ))}
                      </div>
                  </div>

                  <button type="submit" className="w-full bg-navy-900 dark:bg-gold-500 text-white dark:text-navy-900 font-bold py-3 rounded-xl mt-2 hover:opacity-90 transition-opacity">
                      Create Goal
                  </button>
              </form>
           </div>
        </div>
      )}

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm">
           <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-navy-900 dark:text-white">Fund Goal</h3>
                 <button onClick={() => setShowTopUpModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X size={24} />
                 </button>
              </div>

              <div className="mb-6 bg-gray-50 dark:bg-slate-700 p-4 rounded-xl flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-300">Wallet Balance</span>
                  <span className="font-bold text-navy-900 dark:text-white">GHS {user.balance.toLocaleString()}</span>
              </div>

              <form onSubmit={handleTopUpGoal} className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount to Save (GHS)</label>
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-gold-500 font-bold text-lg" 
                        required
                        max={user.balance}
                      />
                  </div>

                  <button type="submit" className="w-full bg-navy-900 dark:bg-gold-500 text-white dark:text-navy-900 font-bold py-3 rounded-xl mt-2 hover:opacity-90 transition-opacity">
                      Confirm Transfer
                  </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Savings;
