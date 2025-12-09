
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, Bell, ChevronRight, LogOut, CreditCard, Settings, HelpCircle, Moon, Sun, Save, X, Smartphone, Trash2, CheckCircle, Building, Plus, Lock, KeyRound, Fingerprint, ChevronDown, ChevronUp, Gift, Copy, Share2 } from 'lucide-react';
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

  // Security Modal State
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [securityState, setSecurityState] = useState({
    biometrics: false,
    showPasswordChange: false,
    showPinSetup: false
  });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [pinForm, setPinForm] = useState({ pin: '', confirm: '' });

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

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      alert("New passwords do not match!");
      return;
    }
    // Simulate API call
    alert("Password updated successfully!");
    setSecurityState(prev => ({ ...prev, showPasswordChange: false }));
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  const handlePinChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinForm.pin.length !== 4) {
      alert("PIN must be 4 digits");
      return;
    }
    if (pinForm.pin !== pinForm.confirm) {
        alert("PINs do not match!");
        return;
    }
    // Simulate API call
    alert("Transaction PIN set successfully!");
    setSecurityState(prev => ({ ...prev, showPinSetup: false }));
    setPinForm({ pin: '', confirm: '' });
  };

  const handleCopyReferral = () => {
      if(user?.referralCode) {
          navigator.clipboard.writeText(user.referralCode);
          alert("Referral code copied!");
      }
  };

  const handleShareReferral = async () => {
    if (!user?.referralCode) return;
    
    const shareData = {
      title: 'Join Savora!',
      text: `Join me on Savora to save smart and grow together! Use my code ${user.referralCode} to get started.`,
      url: 'https://savora.app'
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      handleCopyReferral();
    }
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

      {/* REFERRAL CARD */}
      <div className="bg-gradient-to-r from-gold-500 to-gold-600 rounded-3xl p-6 text-navy-900 mb-8 relative overflow-hidden shadow-lg shadow-gold-500/20">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-xl flex items-center gap-2">
                    <Gift size={24} className="text-navy-900" /> Refer & Earn
                </h3>
                <p className="text-navy-900/80 text-sm mt-1">Invite friends and earn GHS 10 for each active user!</p>
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 flex justify-between items-center mb-4 shadow-sm">
              <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Your Code</span>
                  <span className="font-mono font-bold tracking-widest text-lg text-navy-900">{user.referralCode}</span>
              </div>
              <div className="flex gap-2">
                  <button 
                    onClick={handleCopyReferral}
                    className="p-2 hover:bg-gold-100 rounded-lg transition-colors text-navy-900" 
                    title="Copy Code"
                  >
                      <Copy size={20}/>
                  </button>
                  <button 
                    onClick={handleShareReferral}
                    className="p-2 hover:bg-gold-100 rounded-lg transition-colors text-navy-900" 
                    title="Share"
                  >
                      <Share2 size={20}/>
                  </button>
              </div>
            </div>

            <div className="flex gap-6 text-sm font-bold bg-navy-900/10 p-3 rounded-xl w-fit">
              <span>🎉 {user.referralsCount} Invited</span>
              <span>💰 GHS {user.referralEarnings} Earned</span>
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

      {/* Security Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
                <Shield size={24} className="text-gold-500" /> Security & Privacy
              </h3>
              <button onClick={() => setShowSecurityModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              
              {/* Change Password */}
              <div className="border border-gray-100 dark:border-slate-700 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setSecurityState(prev => ({ ...prev, showPasswordChange: !prev.showPasswordChange }))}
                  className="w-full p-4 flex items-center justify-between bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <Lock size={16} />
                    </div>
                    <span className="font-semibold text-navy-900 dark:text-white">Change Password</span>
                  </div>
                  {securityState.showPasswordChange ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                
                {securityState.showPasswordChange && (
                  <form onSubmit={handlePasswordChange} className="p-4 bg-white dark:bg-slate-800 space-y-3">
                    <input 
                      type="password" 
                      placeholder="Current Password"
                      value={passwordForm.current}
                      onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-gold-500"
                      required
                    />
                    <input 
                      type="password" 
                      placeholder="New Password"
                      value={passwordForm.new}
                      onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-gold-500"
                      required
                    />
                    <input 
                      type="password" 
                      placeholder="Confirm New Password"
                      value={passwordForm.confirm}
                      onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-gold-500"
                      required
                    />
                    <button type="submit" className="w-full bg-navy-900 dark:bg-gold-500 dark:text-navy-900 text-white font-bold py-3 rounded-xl mt-2">
                      Update Password
                    </button>
                  </form>
                )}
              </div>

              {/* Transaction PIN */}
              <div className="border border-gray-100 dark:border-slate-700 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setSecurityState(prev => ({ ...prev, showPinSetup: !prev.showPinSetup }))}
                  className="w-full p-4 flex items-center justify-between bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <KeyRound size={16} />
                    </div>
                    <span className="font-semibold text-navy-900 dark:text-white">Transaction PIN</span>
                  </div>
                  {securityState.showPinSetup ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                
                {securityState.showPinSetup && (
                  <form onSubmit={handlePinChange} className="p-4 bg-white dark:bg-slate-800 space-y-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Set a 4-digit PIN for withdrawals and transfers.</div>
                    <div className="flex gap-4">
                        <input 
                        type="password" 
                        placeholder="Enter PIN"
                        maxLength={4}
                        value={pinForm.pin}
                        onChange={(e) => setPinForm({...pinForm, pin: e.target.value.replace(/\D/g, '')})}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-gold-500 text-center tracking-widest font-bold text-lg"
                        required
                        />
                        <input 
                        type="password" 
                        placeholder="Confirm"
                        maxLength={4}
                        value={pinForm.confirm}
                        onChange={(e) => setPinForm({...pinForm, confirm: e.target.value.replace(/\D/g, '')})}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-gold-500 text-center tracking-widest font-bold text-lg"
                        required
                        />
                    </div>
                    <button type="submit" className="w-full bg-navy-900 dark:bg-gold-500 dark:text-navy-900 text-white font-bold py-3 rounded-xl mt-2">
                      Set PIN
                    </button>
                  </form>
                )}
              </div>

              {/* Biometrics */}
              <div className="border border-gray-100 dark:border-slate-700 rounded-xl overflow-hidden">
                <div className="w-full p-4 flex items-center justify-between bg-gray-50 dark:bg-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                      <Fingerprint size={16} />
                    </div>
                    <div>
                        <span className="font-semibold text-navy-900 dark:text-white block">Biometric Login</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Enable Face ID / Fingerprint</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSecurityState(prev => ({ ...prev, biometrics: !prev.biometrics }))}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${securityState.biometrics ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${securityState.biometrics ? 'translate-x-6' : ''}`}></div>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SettingItem = ({ icon: Icon, title, subtitle, onClick }: { icon: any, title: string, subtitle: string, onClick?: () => void }) => (
  <button onClick={onClick} className="w-full p-4 flex items-center gap-4 border-b border-gray-50 dark:border-slate-700 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-left">
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
