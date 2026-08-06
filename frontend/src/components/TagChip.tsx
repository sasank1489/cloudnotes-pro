import React from 'react';
import { Tag } from 'lucide-react';

interface TagChipProps {
  label: string;
  onClick?: () => void;
  onRemove?: () => void;
  active?: boolean;
}

export const TagChip: React.FC<TagChipProps> = ({ label, onClick, onRemove, active }) => {
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full transition-all cursor-pointer ${
        active
          ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/30'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-brand-950/40 hover:text-brand-600 dark:hover:text-brand-400'
      }`}
    >
      <Tag size={12} className="opacity-70" />
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 font-bold"
        >
          ×
        </button>
      )}
    </span>
  );
};
