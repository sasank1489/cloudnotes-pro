import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100">
      <div className="glass-panel p-10 rounded-3xl max-w-md w-full text-center space-y-6 border border-gray-200 dark:border-gray-800 shadow-2xl">
        <div className="p-4 bg-brand-500/10 text-brand-500 rounded-full w-fit mx-auto animate-pulse">
          <FileQuestion size={48} />
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl font-black text-brand-600 dark:text-brand-400">404</h1>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Page Not Found</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            The page or note location you requested could not be located in our cloud system.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md transition"
          >
            <Home size={16} />
            <span>Return to Workspace</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
          >
            <ArrowLeft size={16} />
            <span>Back to Landing Page</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
