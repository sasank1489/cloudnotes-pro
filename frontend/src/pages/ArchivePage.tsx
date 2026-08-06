import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Archive, Inbox } from 'lucide-react';
import { noteService } from '../services/noteService';
import { NoteCard } from '../components/NoteCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ConfirmModal } from '../components/ConfirmModal';

export const ArchivePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  const { data: notesData, isLoading } = useQuery({
    queryKey: ['notes', { isArchived: true }],
    queryFn: () => noteService.getNotes({ isArchived: true }),
  });

  const toggleArchiveMutation = useMutation({
    mutationFn: (id: string) => noteService.toggleArchive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => noteService.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const archivedNotes = notesData?.data || [];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
          <Archive size={24} className="text-amber-500" />
          <span>Archived Notes</span>
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          View and restore notes that you have archived from your primary workspace.
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner label="Fetching archived notes..." size={36} />
      ) : archivedNotes.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto border border-gray-200 dark:border-gray-800">
          <div className="p-4 bg-amber-500/10 text-amber-500 rounded-full w-fit mx-auto">
            <Inbox size={36} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Archived Notes</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            You don't have any archived notes at the moment. Notes you archive will appear here safely.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {archivedNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onToggleArchive={(id) => toggleArchiveMutation.mutate(id)}
              onDelete={(id) => setDeletingNoteId(id)}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deletingNoteId}
        title="Delete Archived Note"
        message="Are you sure you want to permanently delete this archived note?"
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
