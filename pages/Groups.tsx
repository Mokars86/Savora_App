

import React, { useState, useRef, useEffect } from 'react';
import { Plus, Users, DollarSign, ChevronDown, ChevronUp, AlertCircle, CheckCircle, Clock, ShieldCheck, Share2, Check, X as XIcon, MessageCircle, Send } from 'lucide-react';
import { MOCK_GROUPS } from '../constants';
import { Group, PayoutRequest, ChatMessage } from '../types';
import { useApp } from '../context/AppContext';

const Groups = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'my-groups' | 'explore'>('my-groups');
  const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);
  const { user } = useApp();

  const handleApprovePayout = (groupId: string, requestId: string) => {
    setGroups(prevGroups => prevGroups.map(group => {
      if (group.id !== groupId) return group;
      return {
        ...group,
        payoutRequests: group.payoutRequests.filter(req => req.id !== requestId),
        // In a real app, this would also reset the pool amount or update the member's paid status
      };
    }));
    alert("Payout Approved!");
  };

  const handleRejectPayout = (groupId: string, requestId: string) => {
    setGroups(prevGroups => prevGroups.map(group => {
      if (group.id !== groupId) return group;
      return {
        ...group,
        payoutRequests: group.payoutRequests.filter(req => req.id !== requestId)
      };
    }));
    alert("Payout Rejected.");
  };

  const handleRequestPayout = (groupId: string) => {
    if (!user) return;
    setGroups(prevGroups => prevGroups.map(group => {
      if (group.id !== groupId) return group;
      const newRequest: PayoutRequest = {
        id: Date.now().toString(),
        requesterId: user.id,
        requesterName: user.name,
        amount: group.poolAmount,
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
      };
      return {
        ...group,
        payoutRequests: [...group.payoutRequests, newRequest]
      };
    }));
    alert("Payout requested! Waiting for admin approval.");
  };

  const handleSendMessage = (groupId: string, text: string) => {
    if (!user || !text.trim()) return;
    setGroups(prevGroups => prevGroups.map(group => {
      if (group.id !== groupId) return group;
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        senderId: user.id,
        senderName: user.name,
        text: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      return {
        ...group,
        chatHistory: [...(group.chatHistory || []), newMessage]
      };
    }));
  };

  return (
    <div className="p-4 md:p-8 pb-24 dark:text-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Susu Groups</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-navy-900 dark:bg-gold-500 text-white dark:text-navy-900 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-navy-800 dark:hover:bg-gold-600 transition-colors"
        >
          <Plus size={18} /> New Group
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-slate-700 mb-6">
        <button 
          onClick={() => setActiveTab('my-groups')}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === 'my-groups' ? 'text-navy-900 dark:text-white' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          My Groups
          {activeTab === 'my-groups' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-navy-900 dark:bg-gold-500 rounded-t-full" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('explore')}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === 'explore' ? 'text-navy-900 dark:text-white' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          Explore Public Groups
          {activeTab === 'explore' && (
             <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-navy-900 dark:bg-gold-500 rounded-t-full" />
          )}
        </button>
      </div>

      {/* Group List */}
      <div className="grid md:grid-cols-2 gap-6">
        {groups.map((group) => (
          <GroupCard 
            key={group.id} 
            group={group} 
            onApprove={handleApprovePayout}
            onReject={handleRejectPayout}
            onRequestPayout={handleRequestPayout}
            onSendMessage={handleSendMessage}
          />
        ))}
        {/* Add a dummy card for Explore view if needed, but keeping it simple */}
        {activeTab === 'explore' && (
            <div className="md:col-span-2 py-10 text-center text-gray-400 dark:text-gray-500">
                <p>No public groups available right now.</p>
            </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-navy-900 dark:text-white">Create New Group</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <XIcon size={24} />
              </button>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowCreateModal(false); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Group Name</label>
                <input type="text" placeholder="e.g. Work Colleagues" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-navy-900/10 dark:focus:ring-gold-500/50" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contribution (GHS)</label>
                    <input type="number" placeholder="200" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-navy-900/10 dark:focus:ring-gold-500/50" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frequency</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-navy-900/10 dark:focus:ring-gold-500/50">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                    </select>
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Members</label>
                <input type="range" min="2" max="50" defaultValue="10" className="w-full accent-navy-900 dark:accent-gold-500" />
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

interface GroupCardProps {
  group: Group;
  onApprove: (groupId: string, requestId: string) => void;
  onReject: (groupId: string, requestId: string) => void;
  onRequestPayout: (groupId: string) => void;
  onSendMessage: (groupId: string, text: string) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onApprove, onReject, onRequestPayout, onSendMessage }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [cardTab, setCardTab] = useState<'overview' | 'chat'>('overview');
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { user } = useApp();

  const isAdmin = user && user.id === group.creatorId;
  const isMember = user && group.members.some(m => m.id === user.id);
  
  // Stats
  const paidMembers = group.members.filter(m => m.status === 'paid').length;
  const overdueMembers = group.members.filter(m => m.status === 'overdue').length;
  const totalMembers = group.members.length;
  const participationRate = Math.round((paidMembers / totalMembers) * 100);

  useEffect(() => {
    if (cardTab === 'chat' && isExpanded) {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [group.chatHistory, cardTab, isExpanded]);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = `https://savora.app/groups/join/${group.id}`;
    navigator.clipboard.writeText(link);
    alert(`Link copied: ${link}`);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
        onSendMessage(group.id, chatInput);
        setChatInput('');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all relative overflow-hidden group-card">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-bl-[4rem] -mr-8 -mt-8 pointer-events-none" />

      {/* Card Header (Always Visible) */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-navy-50 dark:bg-slate-700 text-navy-900 dark:text-white flex items-center justify-center text-xl font-bold">
                    {group.name.charAt(0)}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-navy-900 dark:text-white leading-tight flex items-center gap-2">
                      {group.name}
                      {isAdmin && (
                        <span className="text-[10px] bg-navy-900 text-white dark:bg-gold-500 dark:text-navy-900 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <ShieldCheck size={10} /> Admin
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="bg-cream dark:bg-navy-900 text-gold-600 dark:text-gold-500 px-2 py-0.5 rounded-md text-[10px] font-bold border border-gold-100 dark:border-gold-900/30 uppercase tracking-wide">
                            {group.frequency}
                        </span>
                        {overdueMembers > 0 && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-md">
                                <AlertCircle size={10} /> {overdueMembers} Late
                            </span>
                        )}
                    </div>
                </div>
            </div>
            
            <button 
              onClick={handleShare}
              className="p-2 text-gray-400 hover:text-navy-900 dark:hover:text-gold-500 transition-colors"
              title="Share Invite Link"
            >
              <Share2 size={20} />
            </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
            Next Payout: <span className="text-navy-900 dark:text-white font-medium bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-md">{group.nextPayout}</span>
        </p>

        {/* Progress Bar */}
        <div className="mb-6">
            <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-500 dark:text-gray-400">Contribution Cycle</span>
                <span className={`font-bold ${participationRate === 100 ? 'text-green-500' : 'text-navy-900 dark:text-white'}`}>
                    {participationRate}% Paid
                </span>
            </div>
            <div className="h-2 w-full bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-500 ${participationRate === 100 ? 'bg-green-500' : 'bg-navy-900 dark:bg-gold-500'}`} 
                    style={{ width: `${participationRate}%` }}
                ></div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-gray-50 dark:border-slate-700 pt-4">
            <div>
                <span className="block text-xs text-gray-400 mb-1">Contribution</span>
                <div className="flex items-center gap-1 text-navy-900 dark:text-white font-bold">
                    <DollarSign size={14} className="text-gold-500" />
                    {group.contributionAmount}
                </div>
            </div>
             <div>
                <span className="block text-xs text-gray-400 mb-1">Members</span>
                <div className="flex items-center gap-1 text-navy-900 dark:text-white font-bold">
                    <Users size={14} className="text-gold-500" />
                    {totalMembers}
                </div>
            </div>
        </div>
      </div>

      {/* Expand Button */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 text-xs font-semibold text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-slate-700 transition-colors"
      >
        {isExpanded ? 'Hide Details' : 'View Group Activity'}
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
          <div className="bg-gray-50 dark:bg-slate-700/30 border-t border-gray-100 dark:border-slate-700 animate-in slide-in-from-top-2 duration-200">
              
              {/* Tabs Switcher */}
              <div className="flex p-2 bg-gray-100 dark:bg-slate-800/50 mx-4 mt-4 rounded-xl">
                  <button 
                    onClick={() => setCardTab('overview')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${cardTab === 'overview' ? 'bg-white dark:bg-slate-600 shadow-sm text-navy-900 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                  >
                      Overview
                  </button>
                  <button 
                    onClick={() => setCardTab('chat')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${cardTab === 'chat' ? 'bg-white dark:bg-slate-600 shadow-sm text-navy-900 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                  >
                      Group Chat
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  </button>
              </div>

              {cardTab === 'overview' ? (
                <>
                  {/* ADMIN PANEL */}
                  {isAdmin && (
                    <div className="p-4 border-b border-gray-100 dark:border-slate-700">
                      <h4 className="text-xs font-bold text-navy-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                          <ShieldCheck size={14} className="text-gold-500" /> Admin Panel
                      </h4>
                      
                      {group.payoutRequests.length > 0 ? (
                        <div className="space-y-3">
                            {group.payoutRequests.map(req => (
                              <div key={req.id} className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-600 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-navy-900 dark:text-white">{req.requesterName}</span>
                                    <span className="text-xs text-gray-400">{req.date}</span>
                                </div>
                                <p className="text-xs text-gray-500 mb-3">Requested Payout: <span className="font-bold text-navy-900 dark:text-white">GHS {req.amount}</span></p>
                                <div className="flex gap-2">
                                    <button 
                                      onClick={() => onApprove(group.id, req.id)}
                                      className="flex-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 py-2 rounded-lg text-xs font-bold hover:bg-green-200 dark:hover:bg-green-900/50 flex items-center justify-center gap-1"
                                    >
                                      <Check size={14} /> Approve
                                    </button>
                                    <button 
                                      onClick={() => onReject(group.id, req.id)}
                                      className="flex-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 py-2 rounded-lg text-xs font-bold hover:bg-red-200 dark:hover:bg-red-900/50 flex items-center justify-center gap-1"
                                    >
                                      <XIcon size={14} /> Reject
                                    </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-xs text-gray-400 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-200 dark:border-slate-600">
                            No pending payout requests
                        </div>
                      )}
                    </div>
                  )}

                  {/* MEMBER ACTIONS (Request Payout) */}
                  {isMember && !isAdmin && (
                    <div className="p-4 border-b border-gray-100 dark:border-slate-700">
                        <button 
                          onClick={() => onRequestPayout(group.id)}
                          className="w-full py-3 bg-navy-900 dark:bg-gold-500 text-white dark:text-navy-900 rounded-xl text-sm font-bold shadow-lg shadow-navy-900/10 hover:shadow-xl transition-all"
                        >
                          Request Payout (GHS {group.poolAmount})
                        </button>
                    </div>
                  )}

                  {/* MEMBERS LIST */}
                  <div className="p-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Group Members</h4>
                      <div className="space-y-3">
                          {group.members.map((member) => (
                              <div key={member.id} className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                                          member.status === 'overdue' ? 'bg-red-100 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-900/50' :
                                          member.status === 'paid' ? 'bg-green-100 border-green-200 text-green-600 dark:bg-green-900/20 dark:border-green-900/50' :
                                          'bg-gray-200 border-gray-300 text-gray-600 dark:bg-slate-600 dark:border-slate-500'
                                      }`}>
                                          {member.name.charAt(0)}
                                      </div>
                                      <span className="text-sm font-medium text-navy-900 dark:text-white">{member.name}</span>
                                  </div>
                                  
                                  <div className="flex items-center">
                                      {member.status === 'paid' && (
                                          <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                                              <CheckCircle size={10} /> Paid
                                          </span>
                                      )}
                                      {member.status === 'overdue' && (
                                          <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
                                              <AlertCircle size={10} /> Late
                                          </span>
                                      )}
                                      {member.status === 'pending' && (
                                          <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-slate-600 px-2 py-1 rounded-full">
                                              <Clock size={10} /> Pending
                                          </span>
                                      )}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
                </>
              ) : (
                <div className="p-4">
                  <div className="h-64 overflow-y-auto space-y-3 mb-4 pr-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-600">
                     {group.chatHistory && group.chatHistory.length > 0 ? (
                        group.chatHistory.map((msg) => (
                          <div key={msg.id} className={`flex flex-col ${msg.senderId === user?.id ? 'items-end' : 'items-start'}`}>
                              <div className={`max-w-[85%] p-3 rounded-2xl text-xs ${
                                msg.senderId === user?.id 
                                ? 'bg-navy-900 text-white rounded-br-none' 
                                : 'bg-white dark:bg-slate-600 text-navy-900 dark:text-white border border-gray-100 dark:border-slate-500 rounded-bl-none'
                              }`}>
                                {msg.senderId !== user?.id && <p className="font-bold text-[10px] mb-1 opacity-70">{msg.senderName}</p>}
                                <p>{msg.text}</p>
                              </div>
                              <span className="text-[10px] text-gray-400 mt-1">{msg.timestamp}</span>
                          </div>
                        ))
                     ) : (
                       <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                         <MessageCircle size={32} className="mb-2"/>
                         <p className="text-xs">No messages yet. Start chatting!</p>
                       </div>
                     )}
                     <div ref={chatEndRef} />
                  </div>
                  
                  <form onSubmit={handleSend} className="relative">
                      <input 
                        type="text" 
                        placeholder="Type a message..." 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="w-full pl-4 pr-12 py-3 text-sm bg-white dark:bg-slate-600 dark:text-white border border-gray-200 dark:border-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                      <button 
                        type="submit" 
                        className="absolute right-2 top-2 p-1.5 bg-navy-900 dark:bg-gold-500 text-white dark:text-navy-900 rounded-lg hover:opacity-90 transition-opacity"
                        disabled={!chatInput.trim()}
                      >
                        <Send size={16} />
                      </button>
                  </form>
                </div>
              )}
          </div>
      )}
    </div>
  );
};

export default Groups;
