import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { NoteModal } from '../components/NoteModal';
import { DemoBanner } from '../components/DemoBanner';
import { useAuth } from '../context/AuthContext';
import { noteService } from '../services/noteService';
import { useQueryClient } from '@tanstack/react-query';

export const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleCreateNote = async (noteData: any) => {
    await noteService.createNote(noteData);
    queryClient.invalidateQueries({ queryKey: ['notes'] });
    queryClient.invalidateQueries({ queryKey: ['categories'] });
    queryClient.invalidateQueries({ queryKey: ['tags'] });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100">
      {user?.isDemo && <DemoBanner />}
      <Navbar onOpenCreateNote={() => setIsNoteModalOpen(true)} />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <Outlet context={{ openCreateNote: () => setIsNoteModalOpen(true) }} />
        </main>
      </div>

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSubmit={handleCreateNote}
      />
    </div>
  );
};
