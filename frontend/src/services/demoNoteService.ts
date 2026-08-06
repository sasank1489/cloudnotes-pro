import { ApiResponse, Note, NoteFilters } from '../types';

const DEMO_STORAGE_KEY = 'cloudnotes_demo_notes';

const INITIAL_DEMO_NOTES: Note[] = [
  {
    _id: 'demo-note-1',
    title: '🚀 Welcome to CloudNotes Pro Sandbox Demo',
    content: `This is a temporary live demo session. Notes you create or edit here are stored locally in your browser's sessionStorage and will never touch our MongoDB production database.

Key Features to Try:
- Create, Edit, & Delete Notes
- Pin important notes to top
- Filter by Category or Tag
- Search notes instantly with real-time filtering`,
    category: 'Work',
    tags: ['Demo', 'Welcome', 'Features'],
    isPinned: true,
    isArchived: false,
    owner: 'demo-guest-user',
    sharedWith: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo-note-2',
    title: '💡 Project Architecture & Tech Stack',
    content: `CloudNotes Pro features full RBAC, JWT security, responsive Tailwind styling, dark mode, and MongoDB Atlas cloud database synchronization for registered accounts.`,
    category: 'Ideas',
    tags: ['Architecture', 'React', 'MongoDB'],
    isPinned: false,
    isArchived: false,
    owner: 'demo-guest-user',
    sharedWith: [],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: 'demo-note-3',
    title: '📝 Quick Grocery & Shopping List',
    content: `- Almond Milk\n- Fresh Roasted Coffee Beans\n- Organic Avocados\n- Dark Chocolate (85%)`,
    category: 'Personal',
    tags: ['Shopping', 'Personal'],
    isPinned: false,
    isArchived: false,
    owner: 'demo-guest-user',
    sharedWith: [],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

const getStoredDemoNotes = (): Note[] => {
  const raw = sessionStorage.getItem(DEMO_STORAGE_KEY);
  if (!raw) {
    sessionStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_NOTES));
    return INITIAL_DEMO_NOTES;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    sessionStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_NOTES));
    return INITIAL_DEMO_NOTES;
  }
};

const saveDemoNotes = (notes: Note[]) => {
  sessionStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(notes));
};

export const demoNoteService = {
  async getNotes(filters?: Partial<NoteFilters> & { isArchived?: boolean; page?: number; limit?: number }): Promise<ApiResponse<Note[]>> {
    let notes = getStoredDemoNotes();

    const isArchived = filters?.isArchived ?? false;
    notes = notes.filter((n) => !!n.isArchived === isArchived);

    if (filters?.category) {
      notes = notes.filter((n) => n.category.toLowerCase() === filters.category!.toLowerCase());
    }

    if (filters?.tag) {
      notes = notes.filter((n) => n.tags.some((t) => t.toLowerCase() === filters.tag!.toLowerCase()));
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      notes = notes.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
    }

    if (filters?.sort === 'oldest') {
      notes.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else {
      notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Pinned notes first
    notes.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

    return {
      success: true,
      data: notes,
      meta: {
        total: notes.length,
        page: 1,
        limit: 100,
        totalPages: 1,
      },
    };
  },

  async getSharedNotes(): Promise<ApiResponse<Note[]>> {
    return {
      success: true,
      data: [],
    };
  },

  async getCategories(): Promise<ApiResponse<string[]>> {
    const notes = getStoredDemoNotes();
    const categories = Array.from(new Set(notes.map((n) => n.category).filter(Boolean)));
    return {
      success: true,
      data: categories,
    };
  },

  async getTags(): Promise<ApiResponse<string[]>> {
    const notes = getStoredDemoNotes();
    const tags = Array.from(new Set(notes.flatMap((n) => n.tags).filter(Boolean)));
    return {
      success: true,
      data: tags,
    };
  },

  async getNoteById(id: string): Promise<ApiResponse<Note>> {
    const notes = getStoredDemoNotes();
    const note = notes.find((n) => n._id === id);
    if (!note) {
      return { success: false, error: 'Note not found' };
    }
    return { success: true, data: note };
  },

  async createNote(data: Partial<Note>): Promise<ApiResponse<Note>> {
    const notes = getStoredDemoNotes();
    const newNote: Note = {
      _id: `demo-note-${Date.now()}`,
      title: data.title || 'Untitled Note',
      content: data.content || '',
      category: data.category || 'General',
      tags: data.tags || [],
      isPinned: data.isPinned || false,
      isArchived: false,
      owner: 'demo-guest-user',
      sharedWith: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    notes.unshift(newNote);
    saveDemoNotes(notes);
    return { success: true, data: newNote, message: 'Demo note created locally' };
  },

  async updateNote(id: string, data: Partial<Note>): Promise<ApiResponse<Note>> {
    const notes = getStoredDemoNotes();
    const index = notes.findIndex((n) => n._id === id);
    if (index === -1) {
      return { success: false, error: 'Note not found' };
    }
    notes[index] = {
      ...notes[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    saveDemoNotes(notes);
    return { success: true, data: notes[index], message: 'Demo note updated locally' };
  },

  async deleteNote(id: string): Promise<ApiResponse> {
    let notes = getStoredDemoNotes();
    notes = notes.filter((n) => n._id !== id);
    saveDemoNotes(notes);
    return { success: true, message: 'Demo note deleted locally' };
  },

  async togglePin(id: string): Promise<ApiResponse<Note>> {
    const notes = getStoredDemoNotes();
    const note = notes.find((n) => n._id === id);
    if (!note) return { success: false, error: 'Note not found' };
    note.isPinned = !note.isPinned;
    note.updatedAt = new Date().toISOString();
    saveDemoNotes(notes);
    return { success: true, data: note };
  },

  async toggleArchive(id: string): Promise<ApiResponse<Note>> {
    const notes = getStoredDemoNotes();
    const note = notes.find((n) => n._id === id);
    if (!note) return { success: false, error: 'Note not found' };
    note.isArchived = !note.isArchived;
    note.updatedAt = new Date().toISOString();
    saveDemoNotes(notes);
    return { success: true, data: note };
  },

  async shareNote(id: string, _email: string): Promise<ApiResponse<Note>> {
    const notes = getStoredDemoNotes();
    const note = notes.find((n) => n._id === id);
    if (!note) return { success: false, error: 'Note not found' };
    return { success: true, data: note, message: 'Simulated note sharing in demo mode' };
  },
};
