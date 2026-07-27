'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, ArrowRight, PlusCircle, AlertCircle, Eye } from 'lucide-react';
import Link from 'next/link';
import { DonationModal } from '@/components/campaigns/DonationModal';

export function CampaignShowcase() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  const loadCampaigns = () => {
    const stored = localStorage.getItem('trustfundx_custom_campaigns');
    if (stored) {
      try {
        setCampaigns(JSON.parse(stored));
      } catch (err) {
        setCampaigns([]);
      }
    } else {
      setCampaigns([]);
    }
  };

  useEffect(() => {
    loadCampaigns();

    const handleUpdate = () => loadCampaigns();
    window.addEventListener('trustfundx_data_updated', handleUpdate);
    return () => window.removeEventListener('trustfundx_data_updated', handleUpdate);
  }, []);

  return (
    <section className="py-20 bg-[#0A0A0A]" id="campaigns">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#B8860B]/30 bg-[#B8860B]/10 text-xs font-bold text-[#FFD700] mb-3">
              LIVE DISASTER RELIEF
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Active Relief Campaigns</h2>
            <p className="text-gray-400 text-sm md:text-base mt-1">Direct cryptographic funding to verified disaster zones on Algorand.</p>
          </div>
          {campaigns.length > 0 && (
            <Link href="/campaigns" className="hidden md:flex items-center gap-2 text-[#FFD700] hover:text-white transition-colors text-sm font-semibold">
              View All Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {campaigns.length === 0 ? (
          <div className="bg-[#111]/80 border border-[#B8860B]/30 rounded-3xl p-12 text-center backdrop-blur-xl shadow-2xl">
            <div className="w-16 h-16 bg-[#B8860B]/10 border border-[#B8860B]/30 rounded-full flex items-center justify-center mx-auto mb-4 text-[#FFD700]">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Active Campaigns</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6 text-xs sm:text-sm leading-relaxed">
              There are currently no active disaster relief campaigns. Platform administrators can publish new campaigns directly via the Admin Portal.
            </p>
            <Link
              href="/admin/campaigns/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-black font-bold text-xs sm:text-sm hover:opacity-90 transition-all shadow-[0_0_25px_rgba(255,215,0,0.3)]"
            >
              <PlusCircle className="w-4 h-4" /> Create New Campaign (Admin)
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign, idx) => {
              const raised = Number(campaign.raisedAmount || campaign.raised || 0);
              const goal = Number(campaign.goalAmount || campaign.goal || 50000);
              const progress = Math.min(100, Math.round((raised / goal) * 100));

              return (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-[#111] rounded-2xl overflow-hidden border border-[#222] hover:border-[#B8860B]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#B8860B]/10 flex flex-col h-full group"
                >
                  <div className="relative h-48 overflow-hidden bg-zinc-950">
                    <img src={campaign.bannerImage || campaign.imageUrl || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800'} alt={campaign.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-[#333] text-[11px] font-bold text-[#FFD700] uppercase tracking-wider">
                      {campaign.disasterLabel || campaign.disasterType || campaign.type}
                    </div>
                    {campaign.aiVerified && (
                      <div className="absolute top-4 right-4 bg-blue-500/20 backdrop-blur-md px-3 py-1 rounded-full border border-blue-500/50 flex items-center gap-1 text-[11px] font-bold text-blue-400">
                        <ShieldCheck className="w-3.5 h-3.5" /> AI VERIFIED
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-white leading-tight mb-2 line-clamp-2">{campaign.name}</h3>
                    <p className="text-gray-400 text-xs mb-6 flex items-center gap-2">
                      {campaign.country} • <Clock className="w-3.5 h-3.5 text-amber-500" /> 30 days left
                    </p>

                    <div className="mt-auto">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-[#FFD700] font-bold">{raised.toLocaleString('en-US')} ALGO</span>
                        <span className="text-gray-500">of {goal.toLocaleString('en-US')} ALGO ({progress}%)</span>
                      </div>
                      <div className="h-2 w-full bg-[#222] rounded-full overflow-hidden mb-6">
                        <div
                          className="h-full bg-gradient-to-r from-[#B8860B] to-[#FFD700] rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="flex gap-3">
                        <Link href={`/campaigns/${campaign.id}`} className="flex-1">
                          <button className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-gray-200 font-bold text-xs border border-zinc-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                            <Eye size={14} /> Details
                          </button>
                        </Link>
                        <button
                          onClick={() => setSelectedCampaign(campaign)}
                          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#B8860B] hover:opacity-90 text-black font-extrabold text-xs transition-all shadow-[0_0_15px_rgba(255,215,0,0.2)] cursor-pointer"
                        >
                          Donate Now
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {selectedCampaign && (
        <DonationModal
          isOpen={!!selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
          campaign={selectedCampaign}
        />
      )}
    </section>
  );
}
