import React, { useState } from 'react';
import { Plus, Users, Calendar, DollarSign, ChevronRight, X } from 'lucide-react';
import { MOCK_GROUPS } from '../constants';
import { Group } from '../types';

const Groups = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'my-groups' | 'explore'>('my-groups');

  return (
    <div className="p-4 md:p-8 pb-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Susu Groups</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-navy-900 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-navy-800"
        >
          <Plus size={18} /> New Group
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('my-groups')}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === 'my-groups' ? 'text-navy-900' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          My Groups
          {activeTab === 'my-groups' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-navy-900 rounded-t-full" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('explore')}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === 'explore' ? 'text-navy-900' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Explore Public Groups
          {activeTab === 'explore' && (
             <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-navy-900 rounded-t-full" />
          )}
        </button>
      </div>

      {/* Group List */}
      <div className="grid md:grid-cols-2 gap-4">
        {MOCK_GROUPS.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
        {/* Add a dummy card for Explore view if needed, but keeping it simple */}
        {activeTab === 'explore' && (
            <div className="md:col-span-2 py-10 text-center text-gray-400">
                <p>No public groups available right now.</p>
            </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-navy-900">Create New Group</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowCreateModal(false); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                <input type="text" placeholder="e.g. Work Colleagues" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy-900/10" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contribution (GHS)</label>
                    <input type="number" placeholder="200" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy-900/10" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy-900/10">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                    </select>
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Members</label>
                <input type="range" min="2" max="50" defaultValue="10" className="w-full accent-navy-900" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>2 members</span>
                    <span>50 members</span>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold py-3 rounded-xl transition-colors">
                    Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Fixed: Explicitly typed as React.FC to resolve key prop issue
const GroupCard: React.FC<{ group: Group }> = ({ group }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
      
      <div className="relative">
        <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-navy-50 text-navy-900 flex items-center justify-center text-xl font-bold">
                {group.name.charAt(0)}
            </div>
            <span className="bg-cream text-gold-600 px-3 py-1 rounded-full text-xs font-bold border border-gold-100">
                {group.frequency}
            </span>
        </div>

        <h3 className="text-lg font-bold text-navy-900 mb-1">{group.name}</h3>
        <p className="text-sm text-gray-500 mb-6">Next Payout: <span className="text-navy-900 font-medium">{group.nextPayout}</span></p>

        {/* Progress Bar */}
        <div className="mb-6">
            <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-500">Cycle Progress</span>
                <span className="font-bold text-navy-900">{group.progress}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-navy-900 rounded-full" style={{ width: `${group.progress}%` }}></div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4">
            <div>
                <span className="block text-xs text-gray-400 mb-1">Contribution</span>
                <div className="flex items-center gap-1 text-navy-900 font-bold">
                    <DollarSign size={14} className="text-gold-500" />
                    {group.contributionAmount}
                </div>
            </div>
             <div>
                <span className="block text-xs text-gray-400 mb-1">Members</span>
                <div className="flex items-center gap-1 text-navy-900 font-bold">
                    <Users size={14} className="text-gold-500" />
                    {group.totalMembers}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Groups;