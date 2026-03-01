import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TaskStatus, Priority } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const statusConfig: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Pending', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  IN_PROGRESS: { label: 'In Progress', color: 'text-blue-700', bg: 'bg-blue-100' },
  COMPLETED: { label: 'Completed', color: 'text-green-700', bg: 'bg-green-100' },
};

export const priorityConfig: Record<Priority, { label: string; color: string; bg: string }> = {
  LOW: { label: 'Low', color: 'text-gray-600', bg: 'bg-gray-100' },
  MEDIUM: { label: 'Medium', color: 'text-orange-700', bg: 'bg-orange-100' },
  HIGH: { label: 'High', color: 'text-red-700', bg: 'bg-red-100' },
};

export const formatDate = (date?: string | null): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getAxiosError = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response: { data: { message: string } } };
    return axiosError.response?.data?.message || 'An error occurred';
  }
  return 'An error occurred';
};
