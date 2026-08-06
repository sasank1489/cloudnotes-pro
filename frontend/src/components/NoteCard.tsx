import React from 'react';
import { Pin, Archive, Trash2, Share2, Edit3, Calendar, Users, Folder } from 'lucide-react';
import { Note } from '../types';
import { TagChip } from './TagChip';

interface NoteCardProps {
  note: Note;
  onEdit?: (note: Note) => void;
  onDelete?: (id: string) => void;
  onTogglePin?: (id: string) => void;
  onToggleArchive?: (id: string) => void;
  onShare?: (note: Note) => void;
  readOnly?: boolean;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleArchive,
  onShare,
  readOnly = false,
}) => {
  const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className={`group relative glass-card rounded-2xl p-5 border flex flex-col justify-between transition-all duration-200 ${
        note.isPinned
          ? 'border-brand-500/50 shadow-md shadow-brand-500/10 dark:bg-brand-950/20'
          : 'border-gray-200 dark:border-gray-800'
      }`}
    >
      <div>
        {/* Top Header: Category & Action Icons */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            <Folder size={11} />
            {note.category || 'General'}
          </span>

          {!readOnly && (
            <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              {onTogglePin && (
                <button
                  onClick={() => onTogglePin(note._id)}
                  title={note.isPinned ? 'Unpin note' : 'Pin note'}
                  className={`p-1.5 rounded-lg transition ${
                    note.isPinned
                      ? 'text-brand-500 bg-brand-50 dark:bg-brand-950/50'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                  }`}
                >
                  <Pin size={16} className={note.isPinned ? 'fill-brand-500' : ''} />
                </button>
              )}

              {onShare && (
                <button
                  onClick={() => onShare(note)}
                  title="Share Note"
                  className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition"
                >
                  <Share2 size={16} />
                </button>
              )}

              {onToggleArchive && (
                <button
                  onClick={() => onToggleArchive(note._id)}
                  title={note.isArchived ? 'Unarchive note' : 'Archive note'}
                  className="p-1.5 text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg transition"
                >
                  <Archive size={16} />
                </button>
              )}

              {onEdit && (
                <button
                  onClick={() => onEdit(note)}
                  title="Edit Note"
                  className="p-1.5 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg transition"
                >
                  <Edit3 size={16} />
                </button>
              )}

              {onDelete && (
                <button
                  onClick={() => onDelete(note._id)}
                  title="Delete Note"
                  className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-snug">
          {note.title}
        </h3>

        {/* Content Snippet */}
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4 whitespace-pre-line leading-relaxed mb-4">
          {note.content}
        </p>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {note.tags.map((tag) => (
              <TagChip key={tag} label={tag} />
            ))}
          </div>
        )}
      </div>

      {/* Footer: Date & Shared Status */}
      <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
        <div className="flex items-center gap-1.5">
          <Calendar size={13} />
          <span>{formattedDate}</span>
        </div>

        {note.sharedWith && note.sharedWith.length > 0 && (
          <div className="flex items-center gap-1 text-indigo-500 dark:text-indigo-400 font-medium" title={`Shared with ${note.sharedWith.length} user(s)`}>
            <Users size={13} />
            <span>{note.sharedWith.length}</span>
          </div>
        )}
      </div>
    </div>
  );
};
