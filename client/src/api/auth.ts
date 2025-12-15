import api from './client';
import type { User } from '../types/auth';

export const updateProfile = async (data: { name?: string; email?: string }) => {
  const response = await api.patch<User>('/auth/me', data);
  return response.data;
};

export const deleteAccount = async () => {
  await api.delete('/auth/me');
};

export const updatePassword = async (data: any) => {
  await api.patch('/auth/password', data);
};