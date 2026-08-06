import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Users, FileText, Archive, Share2, Activity, Trash2, Cpu, RefreshCw } from 'lucide-react';
import { adminService } from '../services/adminService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ConfirmModal } from '../components/ConfirmModal';

export const AdminPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  // Fetch System Statistics
  const { data: statsData, isLoading: isStatsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => adminService.getStats(),
  });

  // Fetch Users List
  const { data: usersData, isLoading: isUsersLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => adminService.getUsers(),
  });

  // Delete User Mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => adminService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });

  const stats = statsData?.data;
  const users = usersData?.data || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Shield size={24} className="text-amber-500" />
            <span>Admin Portal & Telemetry</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            System overview metrics, user administration, and platform health monitoring.
          </p>
        </div>

        <button
          onClick={() => refetchStats()}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition"
        >
          <RefreshCw size={14} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* System Telemetry Metric Cards */}
      {isStatsLoading ? (
        <LoadingSpinner label="Loading telemetry stats..." size={28} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center gap-4">
            <div className="p-3 bg-brand-500/10 text-brand-500 rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Registered Users</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{stats?.totalUsers || 0}</h3>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Notes Created</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{stats?.totalNotes || 0}</h3>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
              <Archive size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Archived Notes</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{stats?.archivedNotes || 0}</h3>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 text-cyan-500 rounded-xl">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">System Uptime</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                {stats?.systemUptimeSeconds ? `${Math.floor(stats.systemUptimeSeconds / 60)}m` : '0m'}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* DevOps Endpoints Banner */}
      <div className="glass-panel p-4 rounded-2xl border border-brand-500/20 bg-brand-950/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-brand-400 font-bold">
          <Cpu size={18} />
          <span>DevOps Observability Status: ACTIVE</span>
        </div>
        <div className="flex gap-3 font-mono text-[11px]">
          <a
            href="/metrics"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 bg-brand-500/20 text-brand-300 rounded-lg hover:underline"
          >
            Prometheus Metrics (/metrics)
          </a>
          <a
            href="/health"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg hover:underline"
          >
            Health Probe (/health)
          </a>
        </div>
      </div>

      {/* Users Management Table */}
      <div className="glass-panel rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden space-y-4 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Users size={18} className="text-brand-500" />
          <span>User Administration</span>
        </h2>

        {isUsersLoading ? (
          <LoadingSpinner label="Loading user directory..." size={28} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
              <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-800/60 text-gray-400 font-semibold border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Joined Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition">
                    <td className="px-4 py-3.5 flex items-center gap-3 font-semibold text-gray-900 dark:text-white">
                      <img
                        src={u.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                        alt={u.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{u.name}</span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs">{u.email}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            : 'bg-brand-500/10 text-brand-500 border border-brand-500/20'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => setDeletingUserId(u._id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deletingUserId}
        title="Delete User Account"
        message="Are you sure you want to delete this user and all their associated notes? This action cannot be reversed."
        confirmLabel="Delete User"
        confirmVariant="danger"
        isLoading={deleteUserMutation.isPending}
        onConfirm={async () => {
          if (deletingUserId) {
            await deleteUserMutation.mutateAsync(deletingUserId);
            setDeletingUserId(null);
          }
        }}
        onCancel={() => setDeletingUserId(null)}
      />
    </div>
  );
};
