'use client';

import { Task } from '@/types';
import { statusConfig, priorityConfig, formatDate } from '@/lib/utils';
import { Calendar, MoreVertical, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function TaskCard({ task, onEdit, onDelete, onToggle }: any) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const status = statusConfig[task.status as keyof typeof statusConfig];
  const priority = priorityConfig[task.priority as keyof typeof priorityConfig];

  return (
    <div
      className={cn(
        'card p-4 rounded-xl border bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300',
        'hover:shadow-lg hover:scale-[1.015] active:scale-[0.99]',
        task.status === 'COMPLETED' && 'opacity-70'
      )}
    >
      <div className="flex items-start gap-3">

        {/* Toggle Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={cn(
            'mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-300 relative',
            'hover:scale-110 active:scale-95',
            task.status === 'COMPLETED'
              ? 'border-green-500 bg-green-500'
              : task.status === 'IN_PROGRESS'
                ? 'border-blue-500 bg-blue-100'
                : 'border-gray-300 hover:border-blue-400'
          )}
        >
          <span className="absolute inset-0 rounded-full animate-ripple pointer-events-none" />

          {task.status === 'COMPLETED' && (
            <svg
              className="w-3 h-3 text-white mx-auto animate-tickPop"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">

          {/* Title + Menu */}
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                'font-semibold text-gray-900 text-sm leading-snug transition-colors duration-300',
                'hover:text-blue-600 cursor-pointer',
                task.status === 'COMPLETED' && 'line-through text-gray-500 hover:text-gray-500'
              )}
            >
              {task.title}
            </h3>

            {/* Menu */}
            <div ref={menuRef} className="relative flex-shrink-0">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 active:scale-95 transition"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 top-7 bg-white border border-gray-200 rounded-lg shadow-xl z-20 
                             min-w-[150px] py-1 animate-menuScale"
                >
                  <button
                    onClick={() => {
                      onToggle(task.id);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 
                               hover:bg-gray-50 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Cycle status
                  </button>

                  <button
                    onClick={() => {
                      onEdit(task);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 
                               hover:bg-gray-50 transition"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>

                  <button
                    onClick={() => {
                      onDelete(task.id);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 
                               hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {task.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 animate-fadeIn">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span
              className={cn(
                'text-xs px-2 py-0.5 rounded-full font-medium animate-tagPop',
                status.bg,
                status.color
              )}
            >
              {status.label}
            </span>

            <span
              className={cn(
                'text-xs px-2 py-0.5 rounded-full font-medium animate-tagPop delay-75',
                priority.bg,
                priority.color
              )}
            >
              {priority.label}
            </span>

            {task.dueDate && (
              <span className="flex items-center gap-1 text-xs text-gray-600 animate-fadeIn delay-150">
                <Calendar className="w-3 h-3" />
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}