import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, ArrowRight, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DemoBanner: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div className="bg-gradient-to-r from-amber-500/15 via-brand-500/15 to-emerald-500/15 border-b border-amber-500/20 px-4 py-3 text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="flex items-center justify-center p-1 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold shrink-0">
            <Sparkles size={16} />
          </span>
          <div>
            <span className="font-bold text-gray-900 dark:text-white">Sandbox Live Demo Session:</span>{' '}
            <span className="text-gray-600 dark:text-gray-300">
              Notes created here are stored locally in your browser and erased when you exit. No data is stored on our MongoDB database.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/register"
            onClick={() => logout()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md transition hover:scale-105"
          >
            <ShieldCheck size={14} />
            <span>Create Free Account</span>
            <ArrowRight size={14} />
          </Link>
          <button
            onClick={() => logout()}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/80 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 font-medium text-xs transition"
            title="Exit Demo"
          >
            <LogOut size={14} />
            <span>Exit Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
