// src/app/(auth)/register/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { getAxiosError } from '@/lib/utils';
import { CheckSquare, Loader2 } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await registerUser(data.name, data.email, data.password);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(getAxiosError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 to-indigo-200 p-4">
  <div className="w-full max-w-sm"> 
    {/* Logo */}
    <div className="text-center mb-6">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-2xl mb-3 shadow-lg shadow-blue-200/50">
        <CheckSquare className="w-6 h-6 text-white" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
      <p className="text-gray-600 mt-1 text-sm">Create your free account</p>
    </div>

    {/* Card */}
    <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-lg rounded-xl p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Full Name */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            {...register('name')}
            type="text"
            placeholder="John Doe"
            className="w-full px-3 py-2 border border-gray-300 rounded-md
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                       bg-white/90 backdrop-blur-sm transition"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="you@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                       bg-white/90 backdrop-blur-sm transition"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            {...register('password')}
            type="password"
            placeholder="At least 6 characters"
            className="w-full px-3 py-2 border border-gray-300 rounded-md
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                       bg-white/90 backdrop-blur-sm transition"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            {...register('confirmPassword')}
            type="password"
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-gray-300 rounded-md
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                       bg-white/90 backdrop-blur-sm transition"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 
                     bg-blue-600 text-white font-medium py-2 rounded-md
                     hover:bg-blue-700 active:bg-blue-800 transition 
                     disabled:opacity-60 text-sm"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-5">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  </div>
</div>
  );
}
