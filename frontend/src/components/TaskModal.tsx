'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Task } from '@/types';
import { X, Loader2 } from 'lucide-react';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface TaskModalProps {
  task?: Task | null;
  onClose: () => void;
  onSave: (data: Partial<Task>) => Promise<void>;
  loading?: boolean;
}

export default function TaskModal({ task, onClose, onSave, loading }: TaskModalProps) {
  const isEditing = !!task;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      status: 'PENDING',
      priority: 'MEDIUM',
      dueDate: '',
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    }
  }, [task, reset]);

  const onSubmit = async (data: FormData) => {
    await onSave({
      ...data,
      dueDate: data.dueDate || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* BG Fade */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* MODAL */}
      <div
        className="relative bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl 
                   rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-popIn"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Task' : 'New Task'}
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 
                       active:scale-90 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 animate-slideUp">

          {/* TITLE */}
          <div>
            <label className="label font-medium text-gray-700">Title *</label>
            <input
              {...register('title')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white 
                         focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
              placeholder="Task title"
            />
            {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="label font-medium text-gray-700">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Optional description..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white 
                         resize-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
            />
          </div>

          {/* STATUS + PRIORITY */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label font-medium text-gray-700">Status</label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white 
                           focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div>
              <label className="label font-medium text-gray-700">Priority</label>
              <select
                {...register('priority')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white 
                           focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          {/* DUE DATE */}
          <div>
            <label className="label font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              {...register('dueDate')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white 
                         focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 
                         font-medium hover:bg-gray-100 active:scale-95 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium 
                         hover:bg-blue-700 active:scale-95 disabled:opacity-60 
                         flex items-center justify-center gap-2 transition"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Saving...' : isEditing ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}