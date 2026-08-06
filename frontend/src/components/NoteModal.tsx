import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus, Pin, Folder, Tag as TagIcon, Sparkles } from 'lucide-react';
import { Note } from '../types';
import { TagChip } from './TagChip';

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(120, 'Title must be under 120 characters'),
  content: z.string(),
  category: z.string().min(1, 'Category is required'),
  isPinned: z.boolean().default(false),
});

type NoteFormData = z.infer<typeof noteSchema>;

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Note>) => Promise<void>;
  initialNote?: Note | null;
  existingCategories?: string[];
}

export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialNote,
  existingCategories = ['Work', 'Personal', 'Ideas', 'DevOps', 'Study'],
}) => {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      content: '',
      category: 'Work',
      isPinned: false,
    },
  });

  const isPinned = watch('isPinned');

  useEffect(() => {
    if (initialNote) {
      reset({
        title: initialNote.title,
        content: initialNote.content,
        category: initialNote.category || 'Work',
        isPinned: initialNote.isPinned || false,
      });
      setTags(initialNote.tags || []);
    } else {
      reset({
        title: '',
        content: '',
        category: 'Work',
        isPinned: false,
      });
      setTags([]);
    }
  }, [initialNote, reset, isOpen]);

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleFormSubmit = async (data: NoteFormData) => {
    const finalCategory = isCustomCategory && customCategory.trim() ? customCategory.trim() : data.category;
    await onSubmit({
      ...data,
      category: finalCategory,
      tags,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2">
            <Sparkles className="text-brand-500" size={20} />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {initialNote ? 'Edit Note' : 'Create New Note'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Title Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Title *
            </label>
            <input
              type="text"
              placeholder="Note title..."
              {...register('title')}
              className="w-full px-4 py-2.5 rounded-xl text-base font-semibold border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition"
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
          </div>

          {/* Category & Pin Options Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              {!isCustomCategory ? (
                <div className="flex gap-2">
                  <select
                    {...register('category')}
                    className="w-full px-3.5 py-2 rounded-xl text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    {Array.from(new Set([...existingCategories, 'Work', 'Personal', 'Ideas', 'DevOps'])).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsCustomCategory(true)}
                    className="px-3 py-2 text-xs font-medium text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 rounded-xl hover:bg-brand-100 transition whitespace-nowrap"
                  >
                    + New
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Category name"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustomCategory(false)}
                    className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Pin Toggle */}
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => setValue('isPinned', !isPinned)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition ${
                  isPinned
                    ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                    : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <Pin size={16} className={isPinned ? 'fill-brand-500 text-brand-500' : ''} />
                <span>{isPinned ? 'Pinned to Top' : 'Pin Note'}</span>
              </button>
            </div>
          </div>

          {/* Tags Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add tag and press Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="w-full px-3.5 py-2 rounded-xl text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl transition"
              >
                Add
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <TagChip key={tag} label={tag} onRemove={() => handleRemoveTag(tag)} />
                ))}
              </div>
            )}
          </div>

          {/* Content Body */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Content
            </label>
            <textarea
              rows={8}
              placeholder="Write your note content here..."
              {...register('content')}
              className="w-full px-4 py-3 rounded-xl text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition leading-relaxed resize-y"
            ></textarea>
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md shadow-brand-500/20 transition hover:scale-[1.02] active:scale-95"
            >
              {isSubmitting ? 'Saving...' : initialNote ? 'Save Changes' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
