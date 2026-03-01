// src/app/(dashboard)/layout.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { CheckSquare, LogOut, LayoutDashboard, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
  <div className="min-h-screen flex bg-gradient-to-br from-blue-300 to-indigo-200">

    {/* Sidebar */}
    <aside className="w-64 hidden md:flex flex-col fixed h-full z-10
                      bg-white/20 backdrop-blur-xl border-r border-white/30
                      shadow-lg shadow-white/20 transition-all">

      {/* Logo */}
      <div className="p-6 border-b border-white/20">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-md
                          group-hover:scale-110 transition">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-gray-900 text-xl drop-shadow-sm">
            TaskFlow
          </span>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                     text-gray-700 hover:bg-white/70 hover:text-blue-700 shadow-sm
                     backdrop-blur transition-all hover:shadow-md"
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </Link>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-white/20 backdrop-blur">
        <div className="flex items-center gap-3 px-3 py-2 mb-2 hover:bg-white/60 rounded-xl transition">
          <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-700 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium
                     text-gray-700 rounded-xl hover:bg-red-100 hover:text-red-600
                     transition-all shadow-sm hover:shadow-md"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>

    {/* Mobile Navbar */}
    <div className="md:hidden fixed top-0 left-0 right-0 z-20 
                    bg-white/30 backdrop-blur-xl border-b border-white/30 
                    h-14 flex items-center justify-between px-4 shadow-lg">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
          <CheckSquare className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-gray-900 text-lg">TaskFlow</span>
      </Link>

      <button
        onClick={handleLogout}
        className="p-2 text-gray-700 hover:text-red-600 hover:scale-110 transition"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>

    {/* Main Content */}
    <main className="flex-1 md:ml-64 pt-16 md:pt-0">
      <div className="p-4 md:p-8 max-w-6xl mx-auto">{children}</div>
    </main>
  </div>
);
}
