
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USER } from '../constants';
import { User } from '../types';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  theme: 'light' | 'dark';
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  toggleTheme: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Initial Load Effect (Splash + Theme Check)
  useEffect(() => {
    // Check Theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }

    // Check Auth (Mock) & Simulate Loading
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 2500)); // 2.5s Splash Screen
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const login = async (email: string, pass: string) => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // In a real app, we would validate credentials here.
        // For prototype, we load the mock user but update email to match input if needed,
        // or check local storage for a matching user.
        const savedUserStr = localStorage.getItem('user');
        let userToLoad = MOCK_USER;
        
        if (savedUserStr) {
           const savedUser = JSON.parse(savedUserStr);
           if (savedUser.email === email) {
             userToLoad = savedUser;
           }
        }
        
        // If sticking to mock for demo:
        const user = { ...userToLoad, email }; 
        
        setUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(user));
        resolve();
      }, 1000);
    });
  };

  const signup = async (name: string, email: string, pass: string) => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Generate unique referral code
        const firstName = name.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '');
        const rand = Math.floor(1000 + Math.random() * 9000);
        const referralCode = `SAVORA-${firstName}-${rand}`;

        const newUser: User = {
          ...MOCK_USER, // Inherit structure
          id: Date.now().toString(),
          name,
          email,
          balance: 0, // Start with 0
          savingsBalance: 0,
          referralCode,
          referralEarnings: 0,
          referralsCount: 0,
          transactions: [],
          savingsGoals: [],
          linkedAccounts: [],
          notifications: [
            {
              id: 'welcome',
              title: 'Welcome to Savora!',
              message: 'Your journey to financial freedom starts here. Create a savings goal or join a Susu group!',
              date: 'Just now',
              read: false,
              type: 'success'
            }
          ]
        };
        
        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(newUser));
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      theme, 
      login, 
      signup, 
      logout, 
      toggleTheme,
      updateUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
