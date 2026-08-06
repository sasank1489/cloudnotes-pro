import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isDemo: boolean;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  startDemoSession: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_DEMO_USER: User = {
  _id: 'demo-guest-user',
  name: 'Demo Guest',
  email: 'guest@cloudnotes.pro',
  role: 'user',
  isDemo: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('cloudnotes_token'));
  const [isDemo, setIsDemo] = useState<boolean>(() => sessionStorage.getItem('cloudnotes_demo_session') === 'true');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const isDemoActive = sessionStorage.getItem('cloudnotes_demo_session') === 'true';
      if (isDemoActive) {
        setIsDemo(true);
        setUser(MOCK_DEMO_USER);
        setToken('demo-mock-token');
      } else if (token) {
        try {
          const res = await authService.getProfile();
          if (res.success && res.data) {
            setUser(res.data);
          } else {
            setToken(null);
            localStorage.removeItem('cloudnotes_token');
          }
        } catch (error) {
          console.error('Failed to restore auth session:', error);
          setToken(null);
          localStorage.removeItem('cloudnotes_token');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    sessionStorage.removeItem('cloudnotes_demo_session');
    sessionStorage.removeItem('cloudnotes_demo_notes');
    setIsDemo(false);
    localStorage.setItem('cloudnotes_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const startDemoSession = () => {
    localStorage.removeItem('cloudnotes_token');
    sessionStorage.setItem('cloudnotes_demo_session', 'true');
    setIsDemo(true);
    setUser(MOCK_DEMO_USER);
    setToken('demo-mock-token');
  };

  const logout = async () => {
    if (!isDemo) {
      try {
        await authService.logout();
      } catch (e) {
        console.warn('Logout API failed, cleaning local state anyway');
      }
    }
    localStorage.removeItem('cloudnotes_token');
    sessionStorage.removeItem('cloudnotes_demo_session');
    sessionStorage.removeItem('cloudnotes_demo_notes');
    setIsDemo(false);
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isDemo, login, logout, startDemoSession, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
