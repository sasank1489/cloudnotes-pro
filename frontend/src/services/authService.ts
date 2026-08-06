import { api } from './api';
import { ApiResponse, User } from '../types';

export const authService = {
  async register(data: { name: string; email: string; password: string }) {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', data);
    return response.data;
  },

  async login(data: { email: string; password: string }) {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', data);
    return response.data;
  },

  async logout() {
    const response = await api.post<ApiResponse>('/auth/logout');
    return response.data;
  },

  async getProfile() {
    const response = await api.get<ApiResponse<User>>('/auth/profile');
    return response.data;
  },

  async updateProfile(data: { name?: string; profileImage?: string }) {
    const response = await api.put<ApiResponse<User>>('/auth/profile', data);
    return response.data;
  },
};
