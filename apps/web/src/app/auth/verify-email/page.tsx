'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { api } from '@/lib/api';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing verification token.');
      return;
    }

    const verifyEmail = async () => {
      try {
        await api.auth.verifyEmail(token);
        setStatus('success');
        setMessage('Email verified successfully! Redirecting to login...');
        setTimeout(() => router.push('/auth/login'), 3000);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed. Token may be invalid or expired.');
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="text-center">
      {status === 'loading' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center"
        >
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Verifying...</h2>
          <p className="text-zinc-400">{message}</p>
        </motion.div>
      )}

      {status === 'success' && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Verified!</h2>
          <p className="text-zinc-400">{message}</p>
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Verification Failed</h2>
          <p className="text-zinc-400">{message}</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="mt-6 text-amber-500 hover:text-amber-400 transition-colors"
          >
            Go to Login
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-black to-black" />
      
      <div className="w-full max-w-md relative z-10 bg-zinc-900/50 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-8 shadow-2xl shadow-amber-900/20">
        <Suspense fallback={<div className="text-center text-white"><Loader2 className="animate-spin mx-auto text-amber-500" /></div>}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
