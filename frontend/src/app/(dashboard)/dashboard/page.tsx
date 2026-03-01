// src/app/(dashboard)/dashboard/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Task, TaskFilters, PaginationMeta } from '@/types';
import { taskService } from '@/lib/tasks';
import { getAxiosError } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import TaskCard from '@/components/TaskCard';
import TaskModal from '@/components/TaskModal';
import DeleteModal from '@/components/DeleteModal';
import {
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Loader2,
} from 'lucide-react';

const LIMIT = 9;

export default function DashboardPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [filters, setFilters] = useState<TaskFilters>({ page: 1, limit: LIMIT });
  const [searchInput, setSearchInput] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Stats
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await taskService.getAll(filters);
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (error) {
      toast.error(getAxiosError(error));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const [all, pending, inProgress, completed] = await Promise.all([
        taskService.getAll({ limit: 1 }),
        taskService.getAll({ status: 'PENDING', limit: 1 }),
        taskService.getAll({ status: 'IN_PROGRESS', limit: 1 }),
        taskService.getAll({ status: 'COMPLETED', limit: 1 }),
      ]);
      setStats({
        total: all.pagination.total,
        pending: pending.pagination.total,
        inProgress: inProgress.pagination.total,
        completed: completed.pagination.total,
      });
    } catch {}
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput || undefined, page: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleCreate = async (data: Partial<Task>) => {
    setActionLoading(true);
    try {
      await taskService.create(data);
      toast.success('Task created!');
      setModalOpen(false);
      fetchTasks();
      fetchStats();
    } catch (error) {
      toast.error(getAxiosError(error));
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (data: Partial<Task>) => {
    if (!editTask) return;
    setActionLoading(true);
    try {
      await taskService.update(editTask.id, data);
      toast.success('Task updated!');
      setEditTask(null);
      fetchTasks();
      fetchStats();
    } catch (error) {
      toast.error(getAxiosError(error));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setActionLoading(true);
    try {
      await taskService.delete(deleteId);
      toast.success('Task deleted');
      setDeleteId(null);
      fetchTasks();
      fetchStats();
    } catch (error) {
      toast.error(getAxiosError(error));
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const updated = await taskService.toggle(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      fetchStats();
    } catch (error) {
      toast.error(getAxiosError(error));
    }
  };

  const handleFilterChange = (key: keyof TaskFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined, page: 1 }));
  };

  const statCards = [
    { label: 'Total Tasks', value: stats.total, color: 'bg-blue-50 text-blue-700', border: 'border-blue-100' },
    { label: 'Pending', value: stats.pending, color: 'bg-yellow-50 text-yellow-700', border: 'border-yellow-100' },
    { label: 'In Progress', value: stats.inProgress, color: 'bg-indigo-50 text-indigo-700', border: 'border-indigo-100' },
    { label: 'Completed', value: stats.completed, color: 'bg-green-50 text-green-700', border: 'border-green-100' },
  ];

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-300 to-indigo-200 p-4">
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-10 transition-all">
        <h1 className="text-3xl font-bold text-gray-900 drop-shadow-sm">
          Good{" "}
          {new Date().getHours() < 12
            ? "morning"
            : new Date().getHours() < 17
            ? "afternoon"
            : "evening"}
          , {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-800 mt-1 text-sm font-medium">
          Here's a quick overview of your productivity today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {statCards.map((s) => (
          <div
            key={s.label}
            className={`p-4 rounded-xl border shadow-md bg-white/80 backdrop-blur hover:scale-[1.02] hover:shadow-lg transition cursor-pointer ${s.border}`}
          >
            <p className="text-xs text-gray-600 font-semibold">{s.label}</p>
            <p className="text-3xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">

        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-11 pr-4 py-2 w-full bg-white/80 backdrop-blur border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition text-gray-700"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 items-center">
          <Filter className="w-5 h-5 text-gray-600" />

          <select
            value={filters.status || ""}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-3 py-2 bg-white/80 backdrop-blur border rounded-xl text-sm shadow-sm focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select
            value={filters.priority || ""}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            className="px-3 py-2 bg-white/80 backdrop-blur border rounded-xl text-sm shadow-sm focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">All Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        {/* New Task Button */}
        <button
          onClick={() => { setEditTask(null); setModalOpen(true); }}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition shadow text-white font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Tasks */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="w-10 h-10 animate-spin text-white drop-shadow-lg" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 bg-white/60 rounded-3xl shadow flex items-center justify-center mb-4">
            <ClipboardList className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No tasks found</h3>
          <p className="text-gray-700 text-sm mt-1">
            {filters.search || filters.status || filters.priority
              ? "Try adjusting your filters"
              : "Start by creating your first task!"}
          </p>

          {!filters.search && !filters.status && !filters.priority && (
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white mt-4 transition shadow"
            >
              <Plus className="w-4 h-4 inline-block" /> Create Task
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(t: Task) => { setEditTask(t); setModalOpen(true); }}
                onDelete={(id: string) => setDeleteId(id)}
                onToggle={handleToggle}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-8">
              <p className="text-sm text-gray-800 font-medium">
                Showing {(pagination.page - 1) * pagination.limit + 1}–
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                {pagination.total}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setFilters((p) => ({ ...p, page: p.page! - 1 }))}
                  disabled={pagination.page <= 1}
                  className="px-3 py-2 bg-white/70 backdrop-blur border rounded-xl shadow hover:bg-white transition disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-gray-900 font-medium px-3 py-2">
                  {pagination.page} / {pagination.totalPages}
                </span>

                <button
                  onClick={() => setFilters((p) => ({ ...p, page: p.page! + 1 }))}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3 py-2 bg-white/70 backdrop-blur border rounded-xl shadow hover:bg-white transition disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {modalOpen && (
        <TaskModal
          task={editTask}
          onClose={() => { setModalOpen(false); setEditTask(null); }}
          onSave={editTask ? handleUpdate : handleCreate}
          loading={actionLoading}
        />
      )}

      {deleteId && (
        <DeleteModal
          onConfirm={handleDelete}
          onClose={() => setDeleteId(null)}
          loading={actionLoading}
        />
      )}

    </div>
  </div>
);
}
