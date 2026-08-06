import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cloud, Lock, Search, Share2, Tag, Shield, Terminal, ArrowRight, CheckCircle2, Cpu, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { user, startDemoSession } = useAuth();
  const navigate = useNavigate();

  const handleStartLiveDemo = () => {
    startDemoSession();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 w-full glass-panel border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-600 text-white rounded-xl shadow-md shadow-brand-500/20">
              <Cloud size={22} className="stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-brand-700 to-indigo-600 dark:from-white dark:via-brand-300 dark:to-indigo-400 bg-clip-text text-transparent">
              CloudNotes <span className="text-brand-500 text-xs uppercase px-1.5 py-0.5 rounded-full bg-brand-500/10 font-bold border border-brand-500/20">Pro</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md shadow-brand-500/20 transition"
              >
                <span>Go to Dashboard</span>
                <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-brand-600 dark:hover:text-brand-400 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-4.5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md shadow-brand-500/20 transition hover:scale-105"
                >
                  <span>Get Started</span>
                  <ArrowRight size={16} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden hero-gradient">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider animate-fadeIn">
            <Cpu size={14} />
            <span>Cloud Note Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.15] text-gray-900 dark:text-white">
            Secure, searchable notes for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-600 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">
              modern engineering teams.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
            CloudNotes Pro combines instant full-text search, multi-tag taxonomy, note sharing, and JWT authentication.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-2xl shadow-lg shadow-brand-500/25 transition hover:scale-105 active:scale-95"
            >
              <span>Create Free Account</span>
              <ArrowRight size={18} />
            </Link>
            <button
              onClick={handleStartLiveDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-base font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl transition hover:scale-105 active:scale-95 shadow-sm"
            >
              <Sparkles size={18} className="text-amber-500" />
              <span>Explore Live Sandbox Demo</span>
            </button>
          </div>

          {/* Feature Badges */}
          <div className="pt-8 flex flex-wrap justify-center gap-6 text-xs text-gray-500 dark:text-gray-400 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500" /> MongoDB Atlas Cloud Managed Database</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500" /> Real-time Full-Text Search</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500" /> Granular RBAC Permissions</span>
          </div>
        </div>

        {/* Mock App Window Graphic */}
        <div className="max-w-5xl mx-auto mt-14 p-3 glass-panel rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden group">
          <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 text-left font-sans space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 text-xs font-mono text-gray-400">cloudnotes-pro.dev/dashboard</span>
              </div>
              <span className="text-xs text-brand-400 font-mono">STATUS: 200 OK</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-gray-800/60 border border-gray-700/50 space-y-2">
                <div className="flex items-center justify-between text-xs text-brand-400 font-semibold">
                  <span>WORK</span>
                  <PinIcon />
                </div>
                <h4 className="font-bold text-white text-sm">Kubernetes Cluster Architecture</h4>
                <p className="text-xs text-gray-400 line-clamp-2">Deploy Helm chart with 3 replicas, ingress-nginx controller, and Loki agent...</p>
                <div className="flex gap-1 pt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300">#k8s</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300">#DevOps</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-800/60 border border-gray-700/50 space-y-2">
                <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold">
                  <span>IDEAS</span>
                </div>
                <h4 className="font-bold text-white text-sm">GraphQL API Schema RFC</h4>
                <p className="text-xs text-gray-400 line-clamp-2">Migrating note queries to federated GraphQL schemas for ultra-fast response times...</p>
                <div className="flex gap-1 pt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">#API</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-800/60 border border-gray-700/50 space-y-2">
                <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
                  <span>SHARED</span>
                </div>
                <h4 className="font-bold text-white text-sm">Sprint Release Checklist</h4>
                <p className="text-xs text-gray-400 line-clamp-2">Verify JWT refresh token invalidation, CORS origins, and Prometheus scrape config...</p>
                <div className="flex gap-1 pt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">#Release1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-gray-200 dark:border-gray-800">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Built for High-Velocity Teams</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Every feature is designed for speed, security, and developer productivity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-6 rounded-2xl space-y-3 border border-gray-200 dark:border-gray-800">
            <div className="p-3 bg-brand-500/10 text-brand-500 rounded-xl w-fit">
              <Search size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Instant Keyword Search</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Locate notes instantly using full-text MongoDB indexes with debounced search queries and live tag filters.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-3 border border-gray-200 dark:border-gray-800">
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl w-fit">
              <Share2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Granular Sharing</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Share individual notes with team members via email address without exposing your entire workspace.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-3 border border-gray-200 dark:border-gray-800">
            <div className="p-3 bg-cyan-500/10 text-cyan-500 rounded-xl w-fit">
              <Terminal size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Prometheus Telemetry</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Out-of-the-box `/metrics` endpoint built using `prom-client` for seamless Grafana dashboard integration.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 py-8 text-center text-xs text-gray-500">
        <p>© 2026 CloudNotes Pro. All rights reserved. Architected with DevOps excellence.</p>
      </footer>
    </div>
  );
};

const PinIcon = () => (
  <svg className="w-4 h-4 fill-brand-400" viewBox="0 0 24 24">
    <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2z" />
  </svg>
);
