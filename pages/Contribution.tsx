import React, { useState } from 'react';
import { HeartHandshake, Share2, Plus, TrendingUp, Users, Calendar, X, Copy, CheckCircle, Link as LinkIcon } from 'lucide-react';
import { MOCK_CONTRIBUTION_REQUESTS } from '../constants';
import { ContributionRequest } from '../types';

const Contribution = () => {
  const [activeTab, setActiveTab] = useState<'explore' | 'my-requests'>('explore');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const handleShare = (id: string) => {
    const link = `https://savora.app/support/${id}`;
    // Simple clipboard copy
    navigator.clipboard.writeText(link).then(() => {
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 3000);
    }).catch(() => {
        // Fallback if clipboard API fails or is denied
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 3000);
    });
  };

  return (
    <div className="p-4 md:p-8 pb-24 relative min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
           <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Raise & Support</h1>
           <p className="text-gray-500 dark:text-gray-400">Crowdfund for goals or support your community</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-gold-500/20"
        >
          <Plus size={20} /> Start a Request
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl w-fit mb-8">
        <button 
          onClick={() => setActiveTab('explore')}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'explore' ? 'bg-white dark:bg-slate-700 text-navy-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-navy-900 dark:hover:text-white'
          }`}
        >
          Explore
        </button>
        <button 
          onClick={() => setActiveTab('my-requests')}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'my-requests' ? 'bg-white dark:bg-slate-700 text-navy-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-navy-900 dark:hover:text-white'
          }`}
        >
          My Requests
        </button>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_CONTRIBUTION_REQUESTS
            .filter(req => activeTab === 'explore' ? !req.isMyRequest : req.isMyRequest)
            .map((req) => (
            <ContributionCard key={req.id} request={req} onShare={() => handleShare(req.id)} />
        ))}
      </div>
      
      {/* Empty State */}
      {activeTab === 'my-requests' && MOCK_CONTRIBUTION_REQUESTS.filter(r => r.isMyRequest).length === 0 && (
         <div className="text-center py-12 text-gray-400 dark:text-gray-500 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-gray-100 dark:border-slate-700">
             <HeartHandshake size={48} className="mx-auto mb-4 opacity-50" />
             <p className="font-medium">You haven't created any requests yet.</p>
         </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-navy-900 dark:text-white">Create Request</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-50 dark:bg-slate-700 p-2 rounded-full">
                <X size={24} />
              </button>
            </div>

            <form className="space-y-4" onSubmit={(e) => { 
                e.preventDefault(); 
                setShowCreateModal(false); 
                handleShare('new-created-id'); // Simulate sharing the new request
            }}>
              <div>
                <label className="block text-sm font-bold text-navy-900 dark:text-white mb-2">What are you raising money for?</label>
                <input type="text" placeholder="e.g. Final Year School Fees" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-gold-500/50" required />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-navy-900 dark:text-white mb-2">Description</label>
                <textarea rows={3} placeholder="Tell your story..." className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-gold-500/50 resize-none" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-bold text-navy-900 dark:text-white mb-2">Target (GHS)</label>
                    <input type="number" placeholder="1000" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-gold-500/50" required />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-navy-900 dark:text-white mb-2">Category</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-gold-500/50">
                        <option>Education</option>
                        <option>Medical</option>
                        <option>Business</option>
                        <option>Emergency</option>
                        <option>Other</option>
                    </select>
                 </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-navy-900 dark:text-white mb-2">Deadline</label>
                <input type="date" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-gold-500/50" required />
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-navy-900 hover:bg-navy-800 dark:bg-gold-500 dark:hover:bg-gold-600 dark:text-navy-900 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                    <LinkIcon size={20} /> Create & Copy Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showShareToast && (
          <div className="fixed bottom-24 md:bottom-10 left-1/2 transform -translate-x-1/2 bg-navy-900 dark:bg-gold-500 text-white dark:text-navy-900 px-6 py-3 rounded-full shadow-lg flex items-center gap-2 z-[110] animate-in slide-in-from-bottom-5 fade-in duration-300">
              <CheckCircle size={20} className="text-green-400 dark:text-navy-900" />
              <span className="font-medium">Link copied to clipboard!</span>
          </div>
      )}
    </div>
  );
};

const ContributionCard: React.FC<{ request: ContributionRequest; onShare: () => void }> = ({ request, onShare }) => {
  const percentage = Math.min((request.currentAmount / request.targetAmount) * 100, 100);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all flex flex-col h-full group">
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
            ${request.category === 'Medical' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 
              request.category === 'Education' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
              request.category === 'Business' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-300'
            }`}>
            {request.category}
        </span>
        <button 
            onClick={onShare} 
            className="text-gray-400 hover:text-navy-900 dark:hover:text-gold-500 p-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-full transition-colors"
            title="Copy Link"
        >
            <Share2 size={18} />
        </button>
      </div>

      <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-2 group-hover:text-gold-600 transition-colors">{request.title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-1 line-clamp-3">{request.description}</p>
      
      {!request.isMyRequest && (
         <div className="flex items-center gap-2 mb-4">
             <div className="w-6 h-6 rounded-full bg-navy-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-navy-900 dark:text-white">
                {request.creatorName.charAt(0)}
             </div>
             <span className="text-xs text-gray-500 dark:text-gray-400">by {request.creatorName}</span>
         </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
            <span className="font-bold text-navy-900 dark:text-white">GHS {request.currentAmount.toLocaleString()}</span>
            <span className="text-gray-500 dark:text-gray-400">of GHS {request.targetAmount.toLocaleString()}</span>
        </div>
        <div className="h-2 w-full bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gold-500 rounded-full" style={{ width: `${percentage}%` }}></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Users size={12}/> {request.supportersCount} supporters</span>
            <span className="flex items-center gap-1"><Calendar size={12}/> Due {request.deadline}</span>
        </div>
      </div>

      <div className="flex gap-2">
          {request.isMyRequest ? (
             <button className="flex-1 py-3 rounded-xl font-bold transition-colors bg-gray-100 dark:bg-slate-700 text-navy-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600">
                 Manage Request
             </button>
          ) : (
             <button className="flex-1 py-3 rounded-xl font-bold transition-colors bg-navy-900 hover:bg-navy-800 dark:bg-gold-500 dark:hover:bg-gold-600 text-white dark:text-navy-900">
                 Contribute Now
             </button>
          )}
          
          <button 
            onClick={onShare}
            className="px-4 py-3 rounded-xl font-bold transition-colors border border-gray-200 dark:border-slate-600 text-navy-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700"
            title="Copy Link"
          >
             <LinkIcon size={20} />
          </button>
      </div>
    </div>
  );
};

export default Contribution;