'use client';
import { useState } from 'react';
import { Search, Download, ExternalLink, ShieldCheck } from 'lucide-react';
import { GoldButton } from '@/components/ui/GoldButton';
import { formatAlgo, truncateAddress } from '@/lib/utils';
import Link from 'next/link';

export default function DonationsHistoryPage() {
  const [filter, setFilter] = useState('ALL');

  const donations = [
    { id: '1', campaign: 'Turkey Earthquake Relief', amount: 500, txId: 'X9F2A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0', status: 'SUCCESS', verified: true, date: '2023-11-01' },
    { id: '2', campaign: 'California Wildfire Fund', amount: 250, txId: 'M3B1A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0', status: 'SUCCESS', verified: true, date: '2023-10-15' },
    { id: '3', campaign: 'Global Water Initiative', amount: 100, txId: 'A7V9A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0', status: 'SUCCESS', verified: true, date: '2023-09-22' },
    { id: '4', campaign: 'Maui Fire Recovery', amount: 300, txId: 'K9P2A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0', status: 'PENDING', verified: false, date: '2023-08-30' },
  ];

  const filteredDonations = filter === 'ALL' ? donations : donations.filter(d => d.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Donations</h1>
          <p className="text-zinc-400">View your contribution history and download x402 receipts.</p>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            {['ALL', 'SUCCESS', 'PENDING'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                    : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search campaigns..." 
              className="pl-9 pr-4 py-2 bg-black/50 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-zinc-400 border-b border-zinc-800">
                <th className="pb-4 font-medium px-4">Campaign</th>
                <th className="pb-4 font-medium px-4">Amount</th>
                <th className="pb-4 font-medium px-4">Status</th>
                <th className="pb-4 font-medium px-4">TX ID</th>
                <th className="pb-4 font-medium px-4">x402 Verified</th>
                <th className="pb-4 font-medium px-4">Date</th>
                <th className="pb-4 font-medium px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredDonations.map((d) => (
                <tr key={d.id} className="text-zinc-300 hover:bg-zinc-800/20 transition-colors">
                  <td className="py-4 px-4 font-medium text-white">{d.campaign}</td>
                  <td className="py-4 px-4 font-bold text-amber-400">{formatAlgo(d.amount)}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                      d.status === 'SUCCESS' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <a href={`https://testnet.algoexplorer.io/tx/${d.txId}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-mono text-amber-500/80 hover:text-amber-400">
                      {truncateAddress(d.txId, 6, 4)}
                      <ExternalLink size={12} />
                    </a>
                  </td>
                  <td className="py-4 px-4">
                    {d.verified ? (
                      <span className="flex items-center gap-1 text-green-400">
                        <ShieldCheck size={16} /> Verified
                      </span>
                    ) : (
                      <span className="text-zinc-500">-</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-zinc-400">{d.date}</td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/campaigns/${d.id}`} className="px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-white rounded transition-colors">
                        View
                      </Link>
                      {d.status === 'SUCCESS' && (
                        <button className="p-1.5 text-zinc-400 hover:text-amber-500 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors" title="Download Receipt">
                          <Download size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredDonations.length === 0 && (
            <div className="text-center py-12 text-zinc-500">
              No donations found matching the filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
