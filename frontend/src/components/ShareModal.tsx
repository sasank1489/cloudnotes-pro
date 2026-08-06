import React, { useState } from 'react';
import { Share2, X, Send, UserCheck, AlertCircle } from 'lucide-react';
import { Note } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
  onShare: (noteId: string, email: string) => Promise<void>;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, note, onShare }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen || !note) return null;

  const handleShareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setStatusMessage(null);

    try {
      await onShare(note._id, email.trim());
      setStatusMessage({ type: 'success', text: `Successfully shared note with ${email}` });
      setEmail('');
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to share note';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4 text-brand-500">
          <div className="p-2.5 bg-brand-500/10 rounded-xl">
            <Share2 size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Share Note</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[240px]">{note.title}</p>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`p-3 mb-4 rounded-xl text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-500/20'
            }`}
          >
            {statusMessage.type === 'success' ? <UserCheck size={16} /> : <AlertCircle size={16} />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleShareSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Recipient User Email *
            </label>
            <input
              type="email"
              placeholder="colleague@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* Currently Shared With List */}
          {note.sharedWith && note.sharedWith.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Already Shared With:</p>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {note.sharedWith.map((u: any) => (
                  <div
                    key={u._id || u.email}
                    className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-xs"
                  >
                    <img
                      src={u.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                      alt={u.name}
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="font-medium text-gray-700 dark:text-gray-300">{u.name || u.email}</span>
                    <span className="text-gray-400 text-[11px]">({u.email})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md shadow-brand-500/20 transition disabled:opacity-50"
            >
              <Send size={16} />
              <span>{isLoading ? 'Sharing...' : 'Send Access'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
