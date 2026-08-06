import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, User as UserIcon, Shield, Cloud, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onOpenCreateNote?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreateNote }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
          <div className="p-2 bg-gradient-to-tr from-brand-600 to-indigo-500 text-white rounded-xl shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Cloud size={22} className="stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-brand-700 to-indigo-600 dark:from-white dark:via-brand-300 dark:to-indigo-400 bg-clip-text text-transparent">
            CloudNotes <span className="text-brand-500 text-xs uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-brand-500/10 font-bold border border-brand-500/20">Pro</span>
          </span>
        </Link>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Create Note Button */}
          {user && onOpenCreateNote && (
            <button
              onClick={onOpenCreateNote}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Plus size={18} />
              <span>New Note</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
          >
            {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-600" />}
          </button>

          {/* Authenticated User Menu */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-800">
              <Link
                to="/profile"
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <img
                  src={user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-8 h-8 rounded-full ring-2 ring-brand-500/30 object-cover"
                />
                <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user.name}
                </span>
              </Link>

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  title="Admin Dashboard"
                  className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-xl transition"
                >
                  <Shield size={20} />
                </Link>
              )}

              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-brand-600 dark:hover:text-brand-400 transition"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md shadow-brand-500/20 transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
