import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, Filter, ArrowUpDown, Pin, Sparkles, FolderX } from 'lucide-react';
import { noteService } from '../services/noteService';
import { Note } from '../types';
import { NoteCard } from '../components/NoteCard';
import { NoteModal } from '../components/NoteModal';
import { ShareModal } from '../components/ShareModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('');
  const [sort, setSort] = useState('newest');

  const debouncedSearch = useDebounce(search, 300);

  // Modal State
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [sharingNote, setSharingNote] = useState<Note | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  // Fetch Notes
  const { data: notesData, isLoading } = useQuery({
    queryKey: ['notes', user?._id, { search: debouncedSearch, category, tag: selectedTag, sort, isArchived: false }],
    queryFn: () =>
      noteService.getNotes({
        search: debouncedSearch,
        category: category === 'All' ? undefined : category,
        tag: selectedTag || undefined,
        sort,
        isArchived: false,
      }),
  });

  // Fetch Categories & Tags
  const { data: categoriesData } = useQuery({
    queryKey: ['categories', user?._id],
    queryFn: () => noteService.getCategories(),
  });

  const { data: tagsData } = useQuery({
    queryKey: ['tags', user?._id],
    queryFn: () => noteService.getTags(),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: Partial<Note>) => noteService.createNote(data),
    onSuccess: () => invalidateQueries(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Note> }) => noteService.updateNote(id, data),
    onSuccess: () => invalidateQueries(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => noteService.deleteNote(id),
    onSuccess: () => invalidateQueries(),
  });

  const togglePinMutation = useMutation({
    mutationFn: (id: string) => noteService.togglePin(id),
    onSuccess: () => invalidateQueries(),
  });

  const toggleArchiveMutation = useMutation({
    mutationFn: (id: string) => noteService.toggleArchive(id),
    onSuccess: () => invalidateQueries(),
  });

  const shareMutation = useMutation({
    mutationFn: ({ id, email }: { id: string; email: string }) => noteService.shareNote(id, email),
    onSuccess: () => invalidateQueries(),
  });

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['notes'] });
    queryClient.invalidateQueries({ queryKey: ['categories'] });
    queryClient.invalidateQueries({ queryKey: ['tags'] });
  };

  const handleSaveNote = async (data: Partial<Note>) => {
    if (editingNote) {
      await updateMutation.mutateAsync({ id: editingNote._id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const notes = notesData?.data || [];
  const pinnedNotes = notes.filter((n) => n.isPinned);
  const unpinnedNotes = notes.filter((n) => !n.isPinned);
  const categoriesList = categoriesData?.data || [];
  const tagsList = tagsData?.data || [];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <span>Notes Workspace</span>
            <Sparkles className="text-brand-500" size={20} />
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Organize, pin, search, and share your cloud notes seamlessly.
          </p>
        </div>

        {/* {<button
          onClick={() => {
            setEditingNote(null);
            setIsNoteModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md shadow-brand-500/20 transition hover:scale-[1.02] active:scale-95"
        >
          <Plus size={18} />
          <span>New Note</span>
        </button>} */}
      </div>

      {/* Search & Filtering Control Bar */}
      <div className="glass-panel p-4 rounded-2xl space-y-3 border border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search title, content, or #tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition"
            />
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3 flex items-center gap-2">
            <Filter size={16} className="text-gray-400 flex-shrink-0" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="All">All Categories</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-3 flex items-center gap-2">
            <ArrowUpDown size={16} className="text-gray-400 flex-shrink-0" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="updated">Recently Updated</option>
              <option value="title_asc">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Tag Filters Row */}
        {tagsList.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-gray-200 dark:border-gray-800/80">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-1">Tags:</span>
            <button
              onClick={() => setSelectedTag('')}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition ${!selectedTag
                ? 'bg-brand-500 text-white shadow-xs'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
            >
              All
            </button>
            {tagsList.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTag(selectedTag === t ? '' : t)}
                className={`text-xs px-2.5 py-1 rounded-full font-medium transition ${selectedTag === t
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                #{t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <LoadingSpinner label="Loading your note workspace..." size={36} />
      ) : notes.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto border border-gray-200 dark:border-gray-800">
          <div className="p-4 bg-brand-500/10 text-brand-500 rounded-full w-fit mx-auto">
            <FolderX size={36} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Notes Found</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {search || category !== 'All' || selectedTag
              ? 'No notes matched your search query or active filter settings.'
              : 'Your workspace is currently empty. Click below to create your first note!'}
          </p>
          <button
            onClick={() => {
              setEditingNote(null);
              setIsNoteModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md transition"
          >
            <Plus size={16} />
            <span>Create First Note</span>
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Pinned Section */}
          {pinnedNotes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-500 uppercase tracking-wider">
                <Pin size={14} className="fill-brand-500" />
                <span>Pinned Notes ({pinnedNotes.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pinnedNotes.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onEdit={(n) => {
                      setEditingNote(n);
                      setIsNoteModalOpen(true);
                    }}
                    onDelete={(id) => setDeletingNoteId(id)}
                    onTogglePin={(id) => togglePinMutation.mutate(id)}
                    onToggleArchive={(id) => toggleArchiveMutation.mutate(id)}
                    onShare={(n) => setSharingNote(n)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Unpinned / Other Notes Section */}
          {unpinnedNotes.length > 0 && (
            <div className="space-y-3">
              {pinnedNotes.length > 0 && (
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Other Notes ({unpinnedNotes.length})
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unpinnedNotes.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onEdit={(n) => {
                      setEditingNote(n);
                      setIsNoteModalOpen(true);
                    }}
                    onDelete={(id) => setDeletingNoteId(id)}
                    onTogglePin={(id) => togglePinMutation.mutate(id)}
                    onToggleArchive={(id) => toggleArchiveMutation.mutate(id)}
                    onShare={(n) => setSharingNote(n)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Note Create/Edit Modal */}
      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false);
          setEditingNote(null);
        }}
        onSubmit={handleSaveNote}
        initialNote={editingNote}
        existingCategories={categoriesList}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={!!sharingNote}
        onClose={() => setSharingNote(null)}
        note={sharingNote}
        onShare={async (id, email) => {
          await shareMutation.mutateAsync({ id, email });
          invalidateQueries();
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingNoteId}
        title="Delete Note"
        message="Are you sure you want to permanently delete this note? This action cannot be undone."
        confirmLabel="Delete Note"
        confirmVariant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (deletingNoteId) {
            await deleteMutation.mutateAsync(deletingNoteId);
            setDeletingNoteId(null);
          }
        }}
        onCancel={() => setDeletingNoteId(null)}
      />
    </div>
  );
};
