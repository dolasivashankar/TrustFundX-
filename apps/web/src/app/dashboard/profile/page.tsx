'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { GoldButton } from '@/components/ui/GoldButton';
import { WalletConnect } from '@/components/wallet/WalletConnect';
import { User } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

export default function ProfilePage() {
  const { user, setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mock API call to update profile
      // await api.put('/api/users/profile', formData);
      toast.success('Profile updated successfully');
      // In real app, update auth store user here
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (!user) return 'U';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
        <p className="text-zinc-400">Manage your account details and connected wallet.</p>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-zinc-800/50">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-amber-500/20">
            {getInitials()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.firstName} {user?.lastName}</h2>
            <p className="text-zinc-400">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">First Name</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Last Name</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Username</label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Email Address (Read-only)</label>
            <input
              value={user?.email || ''}
              disabled
              className="w-full bg-zinc-800/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-400 cursor-not-allowed"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <GoldButton type="submit" loading={loading}>
              Save Changes
            </GoldButton>
          </div>
        </form>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white mb-2">Wallet Connection</h2>
        <p className="text-zinc-400 mb-6">Connect a wallet to make donations and receive on-chain receipts.</p>
        <div className="max-w-md">
          <WalletConnect />
        </div>
      </div>
    </div>
  );
}
