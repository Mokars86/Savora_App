import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-slate-900 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700">
        
        {/* Header */}
        <div className="bg-navy-900 p-8 text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
           <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full -ml-10 -mb-10 blur-xl"></div>
           
           <div className="relative z-10">
             <div className="w-16 h-16 bg-gold-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-gold-500/20">
               <span className="text-3xl font-bold text-navy-900 font-display">S</span>
             </div>
             <h1 className="text-2xl font-bold text-white mb-1">Welcome to Savora</h1>
             <p className="text-gray-400 text-sm">Your financial growth partner</p>
           </div>
        </div>

        {/* Form */}
        <div className="p-8">
           <div className="flex gap-4 mb-8 bg-gray-100 dark:bg-slate-700 p-1 rounded-xl">
              <button 
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                  isLogin 
                  ? 'bg-white dark:bg-slate-600 text-navy-900 dark:text-white shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-navy-900 dark:hover:text-white'
                }`}
              >
                Login
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                  !isLogin 
                  ? 'bg-white dark:bg-slate-600 text-navy-900 dark:text-white shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-navy-900 dark:hover:text-white'
                }`}
              >
                Sign Up
              </button>
           </div>

           <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-gold-500 transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/50 transition-all placeholder:text-gray-400"
                    required
                  />
                </div>
              )}

              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-gold-500 transition-colors" size={20} />
                <input 
                  type="email" 
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/50 transition-all placeholder:text-gray-400"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-gold-500 transition-colors" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/50 transition-all placeholder:text-gray-400"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {isLogin && (
                <div className="flex justify-end">
                  <button type="button" className="text-xs font-medium text-gold-600 hover:text-gold-700">
                    Forgot Password?
                  </button>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    {isLogin ? 'Login' : 'Create Account'} <ArrowRight size={20} />
                  </>
                )}
              </button>
           </form>

           <div className="mt-8 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                By continuing, you agree to our <span className="text-navy-900 dark:text-white font-semibold">Terms</span> and <span className="text-navy-900 dark:text-white font-semibold">Privacy Policy</span>.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;