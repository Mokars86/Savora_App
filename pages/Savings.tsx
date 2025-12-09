import React from 'react';
import { Plus, Target, Lock } from 'lucide-react';
import { MOCK_GOALS } from '../constants';

const Savings = () => {
  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Personal Savings</h1>
        <button className="bg-navy-900 text-white p-2 rounded-full hover:bg-navy-800">
          <Plus size={24} />
        </button>
      </div>
      
      {/* Add logic here similar to Groups but for Personal Goals. 
          Since the structure is similar to Dashboard's goal section but expanded, 
          I will keep this simple to focus on other core features given file limits. 
          In a real app, this would have detailed goal breakdowns. */}
      
      <div className="grid gap-4">
        {MOCK_GOALS.map((goal) => (
             <div key={goal.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
                <div className={`w-16 h-16 rounded-2xl ${goal.color} bg-opacity-10 flex items-center justify-center text-3xl`}>
                    {goal.icon}
                </div>
                <div className="flex-1 w-full">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-navy-900 text-lg">{goal.name}</h3>
                        <span className="text-sm font-medium text-gray-500">Target: {goal.targetAmount}</span>
                    </div>
                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
                        <div 
                            className={`h-full ${goal.color.replace('bg-', 'bg-')}`} 
                            style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>Saved: {goal.currentAmount}</span>
                        <span>{(goal.currentAmount / goal.targetAmount * 100).toFixed(0)}%</span>
                    </div>
                </div>
                <button className="w-full md:w-auto px-6 py-2 border border-gray-200 rounded-xl font-medium text-navy-900 hover:bg-gray-50">
                    Top Up
                </button>
             </div>
        ))}

        {/* Create new Goal Placeholder */}
        <button className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-gold-500 hover:text-gold-500 transition-colors gap-2 min-h-[150px]">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                <Target size={24} />
            </div>
            <span className="font-medium">Create New Goal</span>
        </button>
      </div>
    </div>
  );
};

export default Savings;