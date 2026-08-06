import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage(null);
    try {
      const response = await authService.login(data);
      if (response.success && response.data) {
        login(response.data.token, response.data.user);
        navigate('/dashboard');
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to log in. Please check your credentials.';
      setErrorMessage(msg);
    }
  };

  const handleFillDemoUser = () => {
    setValue('email', 'admin@cloudnotes.pro');
    setValue('password', 'AdminPassword123!');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Welcome back</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter your email and password to access your secure note workspace.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-medium flex items-center gap-2.5">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="user@cloudnotes.pro"
              {...register('email')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition"
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 text-gray-400" size={18} />
            <input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition"
            />
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-lg shadow-brand-500/25 transition duration-150 hover:scale-[1.01] active:scale-95 disabled:opacity-50"
        >
          <LogIn size={18} />
          <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Workspace'}</span>
        </button>
      </form>

      {/* Demo Credentials Quick Fill Button */}
      {/* <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={handleFillDemoUser}
          className="w-full flex items-center justify-center gap-2 p-2.5 text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 hover:bg-brand-100 dark:hover:bg-brand-900/50 rounded-xl transition"
        >
          <ShieldCheck size={16} />
          <span>Auto-fill Admin Demo Credentials</span>
        </button>
      </div> */}

      <p className="text-center text-xs text-gray-500 dark:text-gray-400">
        Don't have an account yet?{' '}
        <Link to="/register" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
          Create Account
        </Link>
      </p>
    </div>
  );
};
