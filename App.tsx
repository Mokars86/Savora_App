import React from 'react';
import { HashRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Wallet, BookOpen, User as UserIcon, HeartHandshake, Sparkles } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Groups from './pages/Groups';
import Savings from './pages/Savings';
import WalletPage from './pages/Wallet';
import Learn from './pages/Learn';
import Profile from './pages/Profile';
import Contribution from './pages/Contribution';
import Assistant from './pages/Assistant';
import Auth from './pages/Auth';
import SplashScreen from './components/SplashScreen';
import { AppProvider, useApp } from './context/AppContext';

// Navigation Component
const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/' },
    { icon: Users, label: 'Groups', path: '/groups' },
    { icon: HeartHandshake, label: 'Raise', path: '/contributions' },
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
    { icon: UserIcon, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 py-2 px-6 flex justify-between items-center z-40 md:hidden transition-colors duration-200">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center w-full space-y-1 ${
              isActive ? 'text-navy-900 dark:text-gold-500' : 'text-gray-400 dark:text-slate-500'
            }`}
          >
            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Susu Groups', path: '/groups' },
    { icon: HeartHandshake, label: 'Raise Funds', path: '/contributions' },
    { icon: Wallet, label: 'My Wallet', path: '/wallet' },
    { icon: BookOpen, label: 'Education', path: '/learn' },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-navy-900 dark:bg-slate-950 text-white h-screen fixed left-0 top-0 p-6 shadow-xl z-50 border-r border-navy-800 dark:border-slate-800">
      <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center font-bold text-navy-900">S</div>
        <h1 className="text-2xl font-display font-bold text-white tracking-wide">Savora</h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-gold-500 text-navy-900 font-semibold shadow-lg shadow-gold-500/20' 
                  : 'text-gray-300 hover:bg-navy-800 dark:hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-navy-800 dark:border-slate-800">
         <button 
           onClick={() => navigate('/profile')}
           className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${
            location.pathname === '/profile'
              ? 'bg-navy-800 dark:bg-slate-800 text-white font-semibold'
              : 'text-gray-300 hover:text-white'
           }`}
         >
            <UserIcon size={20} />
            <span>Profile</span>
         </button>
      </div>
    </div>
  );
};

const FloatingAIButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on assistant page itself
  if (location.pathname === '/assistant') return null;

  return (
    <button
      onClick={() => navigate('/assistant')}
      className="fixed bottom-24 md:bottom-10 right-4 md:right-10 w-14 h-14 bg-navy-900 dark:bg-gold-500 text-white dark:text-navy-900 rounded-full shadow-xl shadow-navy-900/30 flex items-center justify-center z-40 hover:scale-110 transition-transform active:scale-95 group"
      aria-label="Open AI Assistant"
    >
      <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-0 group-hover:opacity-100 duration-1000"></div>
      <Sparkles size={24} strokeWidth={2.5} />
    </button>
  );
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20 md:pb-0 md:pl-64 transition-colors duration-200">
      <Sidebar />
      <main className="max-w-5xl mx-auto min-h-screen">
        {children}
      </main>
      <FloatingAIButton />
      <BottomNav />
    </div>
  );
};

const AppContent = () => {
  const { isLoading, isAuthenticated } = useApp();

  if (isLoading) {
    return <SplashScreen />;
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/savings" element={<Savings />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contributions" element={<Contribution />} />
        <Route path="/assistant" element={<Assistant />} />
      </Routes>
    </AppLayout>
  );
};

const App = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AppProvider>
  );
};

export default App;