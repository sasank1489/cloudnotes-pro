import { api } from './api';
import { ApiResponse, Note, NoteFilters } from '../types';
import { demoNoteService } from './demoNoteService';

const isDemoActive = () => sessionStorage.getItem('cloudnotes_demo_session') === 'true';

export const noteService = {
  async getNotes(filters?: Partial<NoteFilters> & { isArchived?: boolean; page?: number; limit?: number }) {
    if (isDemoActive()) {
      return demoNoteService.getNotes(filters);
    }
    const response = await api.get<ApiResponse<Note[]>>('/notes', { params: filters });
    return response.data;
  },

  async getSharedNotes() {
    if (isDemoActive()) {
      return demoNoteService.getSharedNotes();
    }
    const response = await api.get<ApiResponse<Note[]>>('/notes/shared');
    return response.data;
  },

  async getCategories() {
    if (isDemoActive()) {
      return demoNoteService.getCategories();
    }
    const response = await api.get<ApiResponse<string[]>>('/notes/categories');
    return response.data;
  },

  async getTags() {
    if (isDemoActive()) {
      return demoNoteService.getTags();
    }
    const response = await api.get<ApiResponse<string[]>>('/notes/tags');
    return response.data;
  },

  async getNoteById(id: string) {
    if (isDemoActive()) {
      return demoNoteService.getNoteById(id);
    }
    const response = await api.get<ApiResponse<Note>>(`/notes/${id}`);
    return response.data;
  },

  async createNote(data: Partial<Note>) {
    if (isDemoActive()) {
      return demoNoteService.createNote(data);
    }
    const response = await api.post<ApiResponse<Note>>('/notes', data);
    return response.data;
  },

  async updateNote(id: string, data: Partial<Note>) {
    if (isDemoActive()) {
      return demoNoteService.updateNote(id, data);
    }
    const response = await api.put<ApiResponse<Note>>(`/notes/${id}`, data);
    return response.data;
  },

  async deleteNote(id: string) {
    if (isDemoActive()) {
      return demoNoteService.deleteNote(id);
    }
    const response = await api.delete<ApiResponse>(`/notes/${id}`);
    return response.data;
  },

  async togglePin(id: string) {
    if (isDemoActive()) {
      return demoNoteService.togglePin(id);
    }
    const response = await api.patch<ApiResponse<Note>>(`/notes/${id}/pin`);
    return response.data;
  },

  async toggleArchive(id: string) {
    if (isDemoActive()) {
      return demoNoteService.toggleArchive(id);
    }
    const response = await api.patch<ApiResponse<Note>>(`/notes/${id}/archive`);
    return response.data;
  },

  async shareNote(id: string, email: string) {
    if (isDemoActive()) {
      return demoNoteService.shareNote(id, email);
    }
    const response = await api.post<ApiResponse<Note>>(`/notes/${id}/share`, { email });
    return response.data;
  },
};
