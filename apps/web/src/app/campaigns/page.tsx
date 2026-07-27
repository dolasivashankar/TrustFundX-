'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, PlusCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { CampaignCard } from '@/components/campaigns/CampaignCard';
import Link from 'next/link';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('trustfundx_custom_campaigns');
    if (stored) {
      try {
        setCampaigns(JSON.parse(stored));
      } catch (err) {
        setCampaigns([]);
      }
    }
  }, []);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || campaign.type === typeFilter || campaign.disasterType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white rounded-xl border border-gray-800 transition-colors text-xs font-semibold">
            <ArrowLeft className="w-4 h-4 text-[#FFD700]" /> Back to Home
          </Link>
        </div>

        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#FFD700] via-amber-300 to-[#B8860B] text-transparent bg-clip-text mb-4">
            Active Disaster Relief Campaigns
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Support verified disaster relief efforts worldwide with direct Algorand smart contract donations.
          </p>
        </div>

        <div className="bg-[#111]/80 border border-[#B8860B]/20 rounded-2xl p-4 mb-10 flex flex-col md:flex-row gap-4 items-center backdrop-blur-md shadow-xl">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search campaigns by name or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              suppressHydrationWarning
              className="w-full bg-[#1a1a1a] border border-[#333] focus:border-[#FFD700] rounded-xl pl-10 pr-4 py-3 text-white text-sm outline-none transition-colors"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              suppressHydrationWarning
              className="w-full md:w-48 bg-[#1a1a1a] border border-[#333] focus:border-[#FFD700] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
            >
              <option value="">All Types</option>
              <option value="EARTHQUAKE">Earthquake</option>
              <option value="FLOOD">Flood</option>
              <option value="WILDFIRE">Wildfire</option>
              <option value="CYCLONE">Cyclone</option>
              <option value="PANDEMIC">Pandemic</option>
            </select>
          </div>
        </div>

        {filteredCampaigns.length === 0 ? (
          <div className="bg-[#111]/80 border border-[#B8860B]/30 rounded-3xl p-12 text-center backdrop-blur-xl shadow-2xl my-8">
            <div className="w-20 h-20 bg-[#B8860B]/10 border border-[#B8860B]/30 rounded-full flex items-center justify-center mx-auto mb-6 text-[#FFD700]">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No Active Campaigns</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-8 text-sm leading-relaxed">
              All hardcoded campaigns have been removed. Administrators can create and publish new disaster relief campaigns using the Admin Portal.
            </p>
            <Link
              href="/admin/campaigns/create"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-black font-bold text-sm hover:opacity-90 transition-all shadow-[0_0_25px_rgba(255,215,0,0.3)]"
            >
              <PlusCircle className="w-5 h-5" /> Create Campaign (Admin Portal)
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
