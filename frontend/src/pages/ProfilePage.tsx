import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User as UserIcon, Mail, Shield, Calendar, Image, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  profileImage: z.string().url('Must be a valid image URL').optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const AVATAR_PRESETS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
];

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      profileImage: user?.profileImage || '',
    },
  });

  const currentAvatar = watch('profileImage') || user?.profileImage;

  const onSubmit = async (data: ProfileFormData) => {
    setStatusMsg(null);
    try {
      const response = await authService.updateProfile(data);
      if (response.success && response.data) {
        updateUser(response.data);
        setStatusMsg({ type: 'success', text: 'Profile details updated successfully!' });
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to update profile.';
      setStatusMsg({ type: 'error', text: msg });
    }
  };

  if (!user) return null;

  const createdDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
          <UserIcon size={24} className="text-brand-500" />
          <span>User Profile</span>
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Manage your personal account settings, profile image, and credentials.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-500/20'
          }`}
        >
          {statusMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-6">
        {/* Header User Preview */}
        <div className="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
          <img
            src={currentAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
            alt={user.name}
            className="w-16 h-16 rounded-full ring-4 ring-brand-500/30 object-cover bg-brand-50"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
              <Mail size={13} /> {user.email}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 border border-brand-500/20 uppercase">
                <Shield size={11} /> {user.role}
              </span>
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <Calendar size={11} /> Joined {createdDate}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Profile Avatar URL
            </label>
            <div className="relative">
              <Image className="absolute left-3.5 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="https://api.dicebear.com/..."
                {...register('profileImage')}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            {errors.profileImage && <p className="mt-1 text-xs text-red-500">{errors.profileImage.message}</p>}
          </div>

          {/* Quick Preset Avatars Picker */}
          <div>
            <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Choose Preset Avatar:
            </span>
            <div className="flex gap-3">
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setValue('profileImage', preset)}
                  className="p-1 rounded-full border-2 border-transparent hover:border-brand-500 transition hover:scale-110"
                >
                  <img src={preset} alt="preset" className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md shadow-brand-500/20 transition hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              <Save size={16} />
              <span>{isSubmitting ? 'Saving Profile...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
