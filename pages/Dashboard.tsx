
import React, { useState } from 'react';
import { ArrowUpRight, Plus, Target, Users, TrendingUp, Bell, Eye, EyeOff, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_GROUPS } from '../constants';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';

const data = [
  { name: 'Mon', amt: 20 },
  { name: 'Tue', amt: 45 },
  { name: 'Wed', amt: 30 },
  { name: 'Thu', amt: 70 },
  { name: 'Fri', amt: 50 },
  { name: 'Sat', amt: 90 },
  { name: 'Sun', amt: 60 },
];

const Dashboard = () => {
  const { user, updateUser } = useApp();
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  if (!user) return null;

  const activeGoalsCount = user.savingsGoals ? user.savingsGoals.length : 0;
  const unreadNotifications = user.notifications ? user.notifications.filter(n => !n.read).length : 0;

  const markAllRead = () => {
      if (user.notifications) {
          const updated = user.notifications.map(n => ({...n, read: true}));
          updateUser({ notifications: updated });
      }
      setShowNotifications(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 pb-24 dark:text-gray-100 relative" onClick={() => showNotifications && setShowNotifications(false)}>
      {/* Header */}
      <header className="flex justify-between items-center relative z-20">
        <div onClick={() => navigate('/profile')} className="cursor-pointer group">
          <h2 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Welcome back,</h2>
          <h1 className="text-2xl md:text-3xl font-bold text-navy-900 dark:text-white group-hover:text-gold-600 transition-colors">{user.name}</h1>
        </div>
        
        <div className="relative">
            <button 
                onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); }}
                className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-gray-100 dark:border-slate-700 relative hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
                <Bell size={24} className="text-gray-600 dark:text-gray-300" />
                {unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                        <h3 className="font-bold text-navy-900 dark:text-white">Notifications</h3>
                        <button onClick={markAllRead} className="text-xs text-gold-600 font-bold hover:underline">Mark all read</button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {user.notifications && user.notifications.length > 0 ? (
                            user.notifications.map((note) => (
                                <div key={note.id} className={`p-4 border-b border-gray-50 dark:border-slate-700 last:border-0 flex gap-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 ${!note.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                    <div className={`mt-1 ${
                                        note.type === 'success' ? 'text-green-500' :
                                        note.type === 'warning' ? 'text-red-500' : 'text-blue-500'
                                    }`}>
                                        {note.type === 'success' ? <CheckCircle size={16} /> :
                                         note.type === 'warning' ? <AlertTriangle size={16} /> : <Info size={16} />}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-navy-900 dark:text-white">{note.title}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{note.message}</p>
                                        <span className="text-[10px] text-gray-400 mt-2 block">{note.date}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-400 text-sm">No notifications</div>
                        )}
                    </div>
                </div>
            )}
        </div>
      </header>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 dark:from-slate-950 dark:to-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-navy-900/10 relative overflow-hidden">
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-gray-400 text-sm font-medium">Total Savings Balance</p>
                  <button onClick={() => setShowBalance(!showBalance)} className="text-gray-400 hover:text-white transition-colors">
                    {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
                <h3 className="text-4xl font-bold font-display">
                  {showBalance ? `GHS ${user.savingsBalance.toLocaleString()}` : '•••••••'}
                </h3>
              </div>
              <div className="bg-gold-500/20 text-gold-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <TrendingUp size={14} /> +12.5%
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => navigate('/wallet')}
                className="flex-1 bg-gold-500 hover:bg-gold-600 text-navy-900 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20"
              >
                <Plus size={18} /> Add Money
              </button>
              <button 
                 onClick={() => navigate('/groups')}
                 className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-colors backdrop-blur-sm"
              >
                My Groups
              </button>
            </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col gap-2">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Users size={20} />
          </div>
          <span className="text-gray-500 dark:text-gray-400 text-sm">Active Groups</span>
          <span className="text-xl font-bold text-navy-900 dark:text-white">{MOCK_GROUPS.length}</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col gap-2">
          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Target size={20} />
          </div>
          <span className="text-gray-500 dark:text-gray-400 text-sm">Active Goals</span>
          <span className="text-xl font-bold text-navy-900 dark:text-white">{activeGoalsCount}</span>
        </div>
      </div>

      {/* Savings Growth Chart */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-navy-900 dark:text-white">Weekly Activity</h3>
          <select className="bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 text-sm rounded-lg px-3 py-1 outline-none">
            <option>This Week</option>
            <option>Last Week</option>
          </select>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}} 
                dy={10}
              />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)', radius: 8}}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  backgroundColor: '#1e293b',
                  color: '#fff'
                }}
              />
              <Bar dataKey="amt" radius={[4, 4, 4, 4]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 5 ? '#f59e0b' : '#94a3b8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Groups Teaser */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-navy-900 dark:text-white">Your Groups</h3>
          <button onClick={() => navigate('/groups')} className="text-gold-600 text-sm font-semibold flex items-center hover:text-gold-500">
            View All <ArrowUpRight size={16} />
          </button>
        </div>
        
        <div className="space-y-3">
          {MOCK_GROUPS.map((group) => (
            <div key={group.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-navy-50 dark:bg-slate-700 flex items-center justify-center font-bold text-navy-900 dark:text-white text-lg">
                {group.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-navy-900 dark:text-white">{group.name}</h4>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                   <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-md font-medium">
                     Payout: {group.nextPayoutDate}
                   </span>
                </div>
              </div>
              <div className="text-right">
                <span className="block font-bold text-navy-900 dark:text-white">GHS {group.contributionAmount}</span>
                <span className="text-xs text-gray-400">{group.frequency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
