export type UserRole = 'user' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  owner: User | string;
  sharedWith: User[];
  createdAt: string;
  updatedAt: string;
}

export interface SystemStats {
  totalUsers: number;
  totalNotes: number;
  archivedNotes: number;
  sharedNotes: number;
  systemUptimeSeconds: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

export interface NoteFilters {
  search: string;
  category: string;
  tag: string;
  sort: string;
}
