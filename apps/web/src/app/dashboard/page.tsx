'use client';
import { useAuthStore } from '@/store/authStore';
import { Heart, Activity, Wallet, Target } from 'lucide-react';
import Link from 'next/link';
import { GoldButton } from '@/components/ui/GoldButton';
import { formatAlgo, truncateAddress } from '@/lib/utils';
import { WalletConnect } from '@/components/wallet/WalletConnect';

export default function DashboardPage() {
  const { user } = useAuthStore();
  
  // Mock data for dashboard
  const stats = {
    totalDonated: 1250,
    campaignsSupported: 5,
    activeCampaigns: 12,
    walletBalance: 450.5
  };

  const recentDonations = [
    { id: '1', campaign: 'Turkey Earthquake Relief', amount: 500, txId: 'X9F2...K1A', date: '2023-11-01' },
    { id: '2', campaign: 'California Wildfire Fund', amount: 250, txId: 'M3B1...Z8P', date: '2023-10-15' },
    { id: '3', campaign: 'Global Water Initiative', amount: 100, txId: 'A7V9...L4E', date: '2023-09-22' },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back, {user?.firstName}!</h1>
          <p className="text-zinc-400 mt-1">Here is the impact you're making globally.</p>
        </div>
        <Link href="/campaigns">
          <GoldButton>Browse Campaigns</GoldButton>
        </Link>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 border border-amber-500/20 p-6 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500">
              <Heart size={24} />
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Total Donated</p>
              <h3 className="text-2xl font-bold text-white">{formatAlgo(stats.totalDonated)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-amber-500/20 p-6 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500">
              <Target size={24} />
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Campaigns Supported</p>
              <h3 className="text-2xl font-bold text-white">{stats.campaignsSupported}</h3>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-amber-500/20 p-6 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Active Campaigns</p>
              <h3 className="text-2xl font-bold text-white">{stats.activeCampaigns}</h3>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-amber-500/20 p-6 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Wallet Balance</p>
              <h3 className="text-2xl font-bold text-white">{formatAlgo(stats.walletBalance)}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Recent Donations</h2>
              <Link href="/dashboard/donations" className="text-sm text-amber-500 hover:text-amber-400">
                View All
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-zinc-400 border-b border-zinc-800">
                    <th className="pb-3 font-medium">Campaign</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">TX ID</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {recentDonations.map((d) => (
                    <tr key={d.id} className="text-zinc-300">
                      <td className="py-4">{d.campaign}</td>
                      <td className="py-4 font-medium text-amber-400">{d.amount} ALGO</td>
                      <td className="py-4">
                        <span className="font-mono text-zinc-500">{d.txId}</span>
                      </td>
                      <td className="py-4 text-zinc-400">{d.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4">Wallet Connection</h2>
            <WalletConnect />
            <div className="mt-4 text-sm text-zinc-400">
              <p>Connect your Algorand wallet to make donations and receive x402 receipts.</p>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex gap-3 text-sm">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-amber-500 shrink-0" />
                <div>
                  <p className="text-white">x402 Receipt Generated</p>
                  <p className="text-zinc-400">Your donation to Turkey Relief has been verified.</p>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0" />
                <div>
                  <p className="text-white">New Campaign Alert</p>
                  <p className="text-zinc-400">Flood relief in Pakistan needs urgent support.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
