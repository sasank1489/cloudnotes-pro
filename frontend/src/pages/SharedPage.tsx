import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, UserCheck } from 'lucide-react';
import { noteService } from '../services/noteService';
import { NoteCard } from '../components/NoteCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

export const SharedPage: React.FC = () => {
  const { user } = useAuth();
  const { data: notesData, isLoading } = useQuery({
    queryKey: ['sharedNotes', user?._id],
    queryFn: () => noteService.getSharedNotes(),
  });

  const sharedNotes = notesData?.data || [];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
          <Users size={24} className="text-indigo-500" />
          <span>Shared With Me</span>
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Notes that other registered platform users have shared with you.
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner label="Fetching shared notes..." size={36} />
      ) : sharedNotes.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto border border-gray-200 dark:border-gray-800">
          <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-full w-fit mx-auto">
            <UserCheck size={36} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Shared Notes Yet</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            When teammates or collaborators share notes with your registered email, they will automatically populate here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sharedNotes.map((note) => (
            <div key={note._id} className="space-y-1">
              <div className="flex items-center gap-2 px-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
                <span>Shared by:</span>
                <span className="font-bold text-brand-600 dark:text-brand-400">
                  {typeof note.owner === 'object' ? note.owner.name : 'Teammate'}
                </span>
              </div>
              <NoteCard note={note} readOnly />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
