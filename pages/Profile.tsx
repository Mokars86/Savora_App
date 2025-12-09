
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, Bell, ChevronRight, LogOut, CreditCard, Settings, HelpCircle, Moon, Sun, Save, X, Smartphone, Trash2, CheckCircle, Building, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LinkedAccount } from '../types';

const Profile = () => {
  const { user, logout, toggleTheme, theme, updateUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  // Linked Accounts State
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [newAccountData, setNewAccountData] = useState({
    provider: 'MTN Mobile Money',
    type: 'MOMO' as 'MOMO' | 'BANK',
    accountNumber: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone
      });
    }
  }, [user]);

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone
      });
    }
    setIsEditing(false);
  };

  const handleSetPrimaryAccount = (id: string) => {
    if (!user) return;
    const updatedAccounts = user.linkedAccounts.map(acc => ({
      ...acc,
      isPrimary: acc.id === id
    }));
    updateUser({ linkedAccounts: updatedAccounts });
  };

  const handleDeleteAccount = (id: string) => {
    if (!user) return;
    const accountToDelete = user.linkedAccounts.find(acc => acc.id === id);
    if (accountToDelete?.isPrimary) {
      alert("You cannot delete your primary account. Please set another account as primary first.");
      return;
    }
    const updatedAccounts = user.linkedAccounts.filter(acc => acc.id !== id);
    updateUser({ linkedAccounts: updatedAccounts });
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const newAccount: LinkedAccount = {
      id: Date.now().toString(),
      type: newAccountData.type,
      provider: newAccountData.provider,
      accountNumber: newAccountData.accountNumber,
      accountName: user.name, // Assuming same name for simplicity
      isPrimary: user.linkedAccounts.length === 0 // If it's the first account, make it primary
    };

    updateUser({ linkedAccounts: [...user.linkedAccounts, newAccount] });
    setShowAddAccountModal(false);
    setNewAccountData({ provider: 'MTN Mobile Money', type: 'MOMO', accountNumber: '' });
  };

  if (!user) return null;

  return (
    <div className="p-4 md:p-8 pb-24 dark:text-gray-100 relative">
      <h1 className="text-2xl font-bold text-navy-900 dark:text-white mb-8">My Profile</h1>

      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row items-center gap-6 mb-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-navy-900 dark:bg-slate-950 flex items-center justify-center text-2xl font-bold text-gold-500 border-4 border-gold-100 dark:border-gold-900/30">
            {user.avatar || user.name.charAt(0)}
          </div>
          <button className="absolute bottom-0 right-0 bg-gold-500 text-white p-2 rounded-full border-2 border-white dark:border-slate-800 hover:bg-gold-600 transition-colors">
            <Settings size={14} />
          </button>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-navy-900 dark:text-white">{user.name}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-2">Member since September 2023</p>
          <div className="flex items-center justify-center md:justify-start gap-2">
             <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold">Verified User</span>
             <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold">Level 2 Saver</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Account Details */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
             <h3 className="text-lg font-bold text-navy-900 dark:text-white">Personal Information</h3>
             {isEditing ? (
               <div className="flex gap-2">
                 <button onClick={handleCancel} className="text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-full hover:bg-red-100 transition-colors">
                   <X size={18} />
                 </button>
                 <button onClick={handleSave} className="text-green-500 bg-green-50 dark:bg-green-900/20 p-2 rounded-full hover:bg-green-100 transition-colors">
                   <Save size={18} />
                 </button>
               </div>
             ) : (
               <button onClick={() => setIsEditing(true)} className="text-gold-600 text-sm font-bold hover:text-gold-500">
                 Edit Details
               </button>
             )}
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
            <div className="p-4 flex items-center gap-4 border-b border-gray-50 dark:border-slate-700">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-500 dark:text-gray-300 flex-shrink-0">
                <User size={20} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs text-gray-400">Full Name</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-slate-700 rounded-lg text-sm border-none focus:ring-2 focus:ring-gold-500"
                  />
                ) : (
                  <p className="font-medium text-navy-900 dark:text-white truncate">{user.name}</p>
                )}
              </div>
            </div>
            
            <div className="p-4 flex items-center gap-4 border-b border-gray-50 dark:border-slate-700">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-500 dark:text-gray-300 flex-shrink-0">
                <Mail size={20} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs text-gray-400">Email Address</p>
                {isEditing ? (
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-slate-700 rounded-lg text-sm border-none focus:ring-2 focus:ring-gold-500"
                  />
                ) : (
                  <p className="font-medium text-navy-900 dark:text-white truncate">{user.email}</p>
                )}
              </div>
            </div>

            <div className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-500 dark:text-gray-300 flex-shrink-0">
                <Phone size={20} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs text-gray-400">Phone Number</p>
                {isEditing ? (
                  <input 
                    type="tel" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-slate-700 rounded-lg text-sm border-none focus:ring-2 focus:ring-gold-500"
                  />
                ) : (
                  <p className="font-medium text-navy-900 dark:text-white truncate">{user.phone}</p>
                )}
              </div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-navy-900 dark:text-white">Linked Accounts</h3>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
             
             {user.linkedAccounts && user.linkedAccounts.length > 0 ? (
               user.linkedAccounts.map((account) => (
                 <div key={account.id} className="p-4 flex items-center gap-4 border-b border-gray-50 dark:border-slate-700 last:border-0 relative group">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      account.type === 'MOMO' 
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' 
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                   }`}>
                     {account.type === 'MOMO' ? <Smartphone size={20} /> : <Building size={20} />}
                   </div>
                   <div className="flex-1">
                     <div className="flex items-center gap-2">
                        <p className="font-medium text-navy-900 dark:text-white">{account.provider}</p>
                        {account.isPrimary && (
                            <span className="text-[10px] bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full font-bold">Primary</span>
                        )}
                     </div>
                     <p className="text-xs text-gray-400">
                        {account.type === 'BANK' ? 'Account' : 'Phone'}: ••••{account.accountNumber.slice(-4)}
                     </p>
                   </div>
                   
                   <div className="flex items-center gap-2">
                       {!account.isPrimary && (
                           <>
                             <button 
                                onClick={() => handleSetPrimaryAccount(account.id)}
                                className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                                title="Set as Primary"
                             >
                                <CheckCircle size={18} />
                             </button>
                             <button 
                                onClick={() => handleDeleteAccount(account.id)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                title="Remove Account"
                             >
                                <Trash2 size={18} />
                             </button>
                           </>
                       )}
                   </div>
                 </div>
               ))
             ) : (
                 <div className="p-4 text-center text-gray-400 text-sm">No linked accounts found.</div>
             )}

             <div className="p-4 flex items-center justify-center bg-gray-50 dark:bg-slate-700/50">
                <button 
                  onClick={() => setShowAddAccountModal(true)}
                  className="flex items-center gap-2 text-navy-900 dark:text-white font-medium hover:text-gold-600 transition-colors"
                >
                   <Plus size={18} /> Add New Method
                </button>
             </div>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-6">
           <h3 className="text-lg font-bold text-navy-900 dark:text-white">App Settings</h3>
           <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
              {/* Appearance Toggle */}
              <button 
                onClick={toggleTheme}
                className="w-full p-4 flex items-center gap-4 border-b border-gray-50 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-navy-50 dark:bg-slate-700 flex items-center justify-center text-navy-900 dark:text-white">
                  {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-navy-900 dark:text-white">Appearance</p>
                  <p className="text-xs text-gray-400">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-gold-500' : 'bg-gray-200'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${theme === 'dark' ? 'translate-x-6' : ''}`}></div>
                </div>
              </button>

              <SettingItem icon={Bell} title="Notifications" subtitle="Push, Email, SMS" />
              <SettingItem icon={Shield} title="Security & Privacy" subtitle="PIN, Biometrics, Password" />
              <SettingItem icon={HelpCircle} title="Help & Support" subtitle="FAQs, Contact Us" />
           </div>

           <button 
            onClick={logout}
            className="w-full bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
           >
             <LogOut size={20} /> Sign Out
           </button>
        </div>
      </div>

      {/* Add Account Modal */}
      {showAddAccountModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-navy-900 dark:text-white">Add New Account</h3>
                    <button onClick={() => setShowAddAccountModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleAddAccount} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Type</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setNewAccountData({ ...newAccountData, type: 'MOMO', provider: 'MTN Mobile Money' })}
                                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                                    newAccountData.type === 'MOMO' 
                                    ? 'border-gold-500 bg-gold-50 dark:bg-gold-900/10 text-navy-900 dark:text-white' 
                                    : 'border-gray-200 dark:border-slate-600 text-gray-400'
                                }`}
                            >
                                <Smartphone size={24} />
                                <span className="text-sm font-bold">Mobile Money</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setNewAccountData({ ...newAccountData, type: 'BANK', provider: 'Ecobank' })}
                                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                                    newAccountData.type === 'BANK' 
                                    ? 'border-gold-500 bg-gold-50 dark:bg-gold-900/10 text-navy-900 dark:text-white' 
                                    : 'border-gray-200 dark:border-slate-600 text-gray-400'
                                }`}
                            >
                                <Building size={24} />
                                <span className="text-sm font-bold">Bank Account</span>
                            </button>
                        </div>
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Provider</label>
                         <select 
                            value={newAccountData.provider}
                            onChange={(e) => setNewAccountData({ ...newAccountData, provider: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-gold-500"
                         >
                            {newAccountData.type === 'MOMO' ? (
                                <>
                                    <option>MTN Mobile Money</option>
                                    <option>Telecel Cash</option>
                                    <option>AT Money</option>
                                </>
                            ) : (
                                <>
                                    <option>Ecobank</option>
                                    <option>GCB Bank</option>
                                    <option>Fidelity Bank</option>
                                    <option>Stanbic Bank</option>
                                </>
                            )}
                         </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {newAccountData.type === 'MOMO' ? 'Phone Number' : 'Account Number'}
                        </label>
                        <input 
                            type="text" 
                            placeholder={newAccountData.type === 'MOMO' ? '055 123 4567' : '144...'}
                            value={newAccountData.accountNumber}
                            onChange={(e) => setNewAccountData({ ...newAccountData, accountNumber: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-gold-500"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-navy-900 hover:bg-navy-800 dark:bg-gold-500 dark:hover:bg-gold-600 dark:text-navy-900 text-white font-bold py-3 rounded-xl transition-colors mt-2"
                    >
                        Save Account
                    </button>
                </form>
            </div>
          </div>
      )}
    </div>
  );
};

const SettingItem = ({ icon: Icon, title, subtitle }: { icon: any, title: string, subtitle: string }) => (
  <button className="w-full p-4 flex items-center gap-4 border-b border-gray-50 dark:border-slate-700 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-left">
    <div className="w-10 h-10 rounded-full bg-navy-50 dark:bg-slate-700 flex items-center justify-center text-navy-900 dark:text-white">
      <Icon size={20} />
    </div>
    <div className="flex-1">
      <p className="font-medium text-navy-900 dark:text-white">{title}</p>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </div>
    <ChevronRight size={20} className="text-gray-300 dark:text-slate-600" />
  </button>
);

export default Profile;
