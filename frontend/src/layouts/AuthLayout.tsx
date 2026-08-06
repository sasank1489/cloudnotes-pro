import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Cloud, ShieldCheck, Zap, Lock, Layers } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 dark:bg-[#0b0f19]">
      {/* Left Hero Feature Branding Panel */}
      <div className="lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-brand-900 via-indigo-950 to-slate-950 p-8 lg:p-16 flex flex-col justify-between text-white border-b lg:border-b-0 lg:border-r border-brand-500/20">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse-slow" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-500 text-white rounded-xl shadow-lg shadow-brand-500/30">
              <Cloud size={24} className="stroke-[2.5]" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">CloudNotes Pro</span>
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2.5 text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md transition"
          >
            {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-300" />}
          </button>
        </div>

        {/* Hero Copy */}
        <div className="relative z-10 my-12 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck size={14} />
            <span>DevOps-First Note Infrastructure</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight">
            Organize & share your thoughts at <span className="bg-gradient-to-r from-brand-400 to-cyan-300 bg-clip-text text-transparent">cloud speed.</span>
          </h1>

          <p className="text-gray-300 text-base leading-relaxed">
            Secure multi-tenant note platform with real-time tags, category indexing, Prometheus telemetry monitoring, and containerized DevOps architecture.
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-start gap-3">
              <Zap className="text-brand-400 mt-1" size={20} />
              <div>
                <h4 className="font-bold text-sm">Instant Search</h4>
                <p className="text-xs text-gray-400">Indexed keyword filtering</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-start gap-3">
              <Lock className="text-brand-400 mt-1" size={20} />
              <div>
                <h4 className="font-bold text-sm">JWT Encryption</h4>
                <p className="text-xs text-gray-400">Password hashing & HTTP-only protection</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-gray-400 flex items-center justify-between">
          <span>© 2026 CloudNotes Pro Inc.</span>
          <span className="flex items-center gap-1"><Layers size={14} /> DevOps Ready</span>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
