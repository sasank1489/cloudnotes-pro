import { api } from './api';
import { ApiResponse, SystemStats, User } from '../types';

export const adminService = {
  async getStats() {
    const response = await api.get<ApiResponse<SystemStats>>('/admin/stats');
    return response.data;
  },

  async getUsers(page = 1, limit = 10) {
    const response = await api.get<ApiResponse<User[]>>('/admin/users', { params: { page, limit } });
    return response.data;
  },

  async deleteUser(userId: string) {
    const response = await api.delete<ApiResponse>(`/admin/users/${userId}`);
    return response.data;
  },
};
