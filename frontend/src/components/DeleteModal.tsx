'use client';

import { Trash2, X } from 'lucide-react';

interface DeleteModalProps {
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
}

export default function DeleteModal({ onConfirm, onClose, loading }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Background Overlay (fade-in) */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Box (scale-in pop) */}
      <div
        className="relative bg-white/90 backdrop-blur-md border border-white/40 
                   rounded-2xl shadow-2xl w-full max-w-sm p-7
                   animate-popIn"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-500 
                     hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">

          {/* Icon pulse animation */}
          <div className="w-14 h-14 bg-red-200 rounded-full flex items-center justify-center mb-4 shadow-md animate-pulseSlow">
            <Trash2 className="w-7 h-7 text-red-700" />
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Delete Task?
          </h3>

          <p className="text-sm text-gray-600 mb-6">
            Are you sure? This action cannot be undone.
          </p>

          {/* Buttons */}
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-gray-300 bg-white
                         text-gray-700 font-medium hover:bg-gray-100 transition shadow-sm"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-medium shadow-lg
                         hover:bg-red-700 active:bg-red-800 transition disabled:opacity-60"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}