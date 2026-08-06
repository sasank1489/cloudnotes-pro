import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, Archive, Users, Shield, Tag, Folder, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  categories?: string[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  tags?: string[];
  selectedTag?: string;
  onSelectTag?: (tag: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categories = [],
  selectedCategory = 'All',
  onSelectCategory,
  tags = [],
  selectedTag = '',
  onSelectTag,
}) => {
  const { user } = useAuth();

  const mainNavItems = [
    { label: 'All Notes', icon: FileText, to: '/dashboard' },
    { label: 'Archived Notes', icon: Archive, to: '/archive' },
    { label: 'Shared Notes', icon: Users, to: '/shared' },
  ];

  if (user?.role === 'admin') {
    mainNavItems.push({ label: 'Admin Dashboard', icon: Shield, to: '/admin' });
  }

  return (
    <aside className="w-64 flex-shrink-0 hidden md:block">
      <div className="sticky top-20 space-y-6 glass-panel rounded-2xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
        {/* Primary Navigation */}
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
            Workspace
          </p>
          {mainNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Categories Section */}
        {onSelectCategory && (
          <div className="space-y-1.5 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
              <span>Categories</span>
              <Folder size={14} />
            </div>

            <button
              onClick={() => onSelectCategory('All')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${selectedCategory === 'All'
                  ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
              <span>All Categories</span>
            </button>

            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${selectedCategory === cat
                    ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                <span className="truncate">{cat}</span>
              </button>
            ))}
          </div>
        )}

        {/* Tags Section */}
        {onSelectTag && tags.length > 0 && (
          <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              <span>Tags</span>
              <Tag size={14} />
            </div>

            <div className="flex flex-wrap gap-1.5 px-2 pt-1">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onSelectTag(selectedTag === tag ? '' : tag)}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${selectedTag === tag
                      ? 'bg-brand-500 text-white shadow-xs'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MongoDB Atlas Banner Widget */}
        {/* <div className="p-3 bg-gradient-to-br from-brand-900/40 to-indigo-900/40 rounded-xl border border-brand-500/20 text-xs text-brand-200 space-y-1">
          <div className="flex items-center gap-1.5 text-brand-400 font-bold">
            <Sparkles size={14} />
            <span>MongoDB Atlas</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-tight">
            Cloud Managed Cluster • Real-time Data Sync Active
          </p>
        </div> */}
      </div>
    </aside>
  );
};
