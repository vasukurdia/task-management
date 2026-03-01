import api from './api';
import { Task, TaskFilters, TasksResponse } from '@/types';

export const taskService = {
  async getAll(filters: TaskFilters = {}): Promise<TasksResponse> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.status) params.set('status', filters.status);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.search) params.set('search', filters.search);

    const res = await api.get(`/tasks?${params.toString()}`);
    return res.data;
  },

  async getById(id: string): Promise<Task> {
    const res = await api.get(`/tasks/${id}`);
    return res.data;
  },

  async create(data: Partial<Task>): Promise<Task> {
    const res = await api.post('/tasks', data);
    return res.data;
  },

  async update(id: string, data: Partial<Task>): Promise<Task> {
    const res = await api.patch(`/tasks/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  async toggle(id: string): Promise<Task> {
    const res = await api.post(`/tasks/${id}/toggle`);
    return res.data;
  },
};
