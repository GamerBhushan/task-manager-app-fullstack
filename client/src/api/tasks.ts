import api from './client';
import type { Task } from '../types/task';

// We allow filtering by status or priority
interface TaskFilters {
  status?: string;
  priority?: string;
}

export const getTasks = async (filters?: TaskFilters) => {
  const { data } = await api.get<Task[]>('/tasks', { params: filters });
  return data;
};

export const createTask = async (taskData: Partial<Task>) => {
  const { data } = await api.post<Task>('/tasks', taskData);
  return data;
};

export const updateTask = async (id: string, taskData: Partial<Task>) => {
  const { data } = await api.patch<Task>(`/tasks/${id}`, taskData);
  return data;
};

export const deleteTask = async (id: string) => {
  await api.delete(`/tasks/${id}`);
};