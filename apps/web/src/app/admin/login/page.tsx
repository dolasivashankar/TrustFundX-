'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, Lock, User, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Load stored credentials (or fall back to defaults)
      const storedCredsStr = typeof window !== 'undefined' ? localStorage.getItem('trustfundx_admin_credentials') : null;
      const storedCreds = storedCredsStr
        ? JSON.parse(storedCredsStr)
        : { username: 'admin', password: 'TrustFundX@2026' };

      const validUsername = username === storedCreds.username || username === 'admin@trustfundx.com';
      const validPassword = password === storedCreds.password;

      if (validUsername && validPassword) {
        const mockAdminUser = {
          id: 'admin-1',
          email: 'admin@trustfundx.com',
          firstName: 'System',
          lastName: 'Administrator',
          role: 'ADMIN',
          walletAddress: 'HXV7A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0',
        };
        const mockToken = 'mock_admin_jwt_token_trustfundx_2026';
        
        setAuth(mockAdminUser as any, mockToken);
        localStorage.setItem('trustfundx_token', mockToken);
        localStorage.setItem('trustfundx_user', JSON.stringify(mockAdminUser));
        
        toast.success('Admin authentication successful!');
        router.push('/admin');
      } else {
        toast.error('Invalid credentials. Check your username & password.');
      }
    } catch (err: any) {
      toast.error('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#B8860B]/20 via-[#0A0A0A] to-[#0A0A0A]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:24px_24px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#111]/80 backdrop-blur-xl border border-[#B8860B]/30 rounded-3xl p-8 shadow-2xl shadow-[#B8860B]/10">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-[#B8860B]/10 border border-[#B8860B]/30 rounded-2xl text-[#FFD700] mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#FFD700] via-amber-300 to-[#B8860B] text-transparent bg-clip-text">
              TrustFundX Admin
            </h1>
            <p className="text-gray-400 text-sm mt-2">Executive Portal Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                Username / Email
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#333] focus:border-[#FFD700] rounded-xl pl-10 pr-4 py-3 text-white text-sm outline-none transition-colors"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                Master Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#333] focus:border-[#FFD700] rounded-xl pl-10 pr-10 py-3 text-white text-sm outline-none transition-colors"
                  placeholder="••••••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FFD700]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="bg-[#B8860B]/10 border border-[#B8860B]/20 rounded-xl p-3 text-xs text-amber-300/80 leading-relaxed">
              🔑 <span className="font-semibold text-amber-200">Default Credentials (if not changed):</span><br />
              Username: <code className="text-white font-mono bg-black/40 px-1 rounded">admin</code> &nbsp;
              Password: <code className="text-white font-mono bg-black/40 px-1 rounded">TrustFundX@2026</code>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-black font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.3)] cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Admin Portal'} <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#222] text-center">
            <Link href="/" className="text-xs text-gray-400 hover:text-[#FFD700] transition-colors">
              ← Return to TrustFundX Public Site
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
