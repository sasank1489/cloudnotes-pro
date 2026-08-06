import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC<{ size?: number; label?: string }> = ({ size = 24, label }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-3">
      <Loader2 size={size} className="animate-spin text-brand-500" />
      {label && <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>}
    </div>
  );
};
