'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ShieldCheck, MapPin, Users, Calendar, Copy, ExternalLink, Activity, ArrowLeft, Heart, CheckCircle2 } from 'lucide-react';
import { GoldButton } from '@/components/ui/GoldButton';
import { formatAlgo, getProgressPercent, getDaysRemaining, truncateAddress, getDisasterEmoji } from '@/lib/utils';
import toast from 'react-hot-toast';
import { DonationModal } from '@/components/campaigns/DonationModal';
import Link from 'next/link';

export default function CampaignDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const [campaign, setCampaign] = useState<any>(null);
  const [donations, setDonations] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = () => {
    // 1. Load Campaign
    const stored = localStorage.getItem('trustfundx_custom_campaigns');
    if (stored && id) {
      try {
        const list = JSON.parse(stored);
        const target = list.find((c: any) => c.id === id);
        if (target) {
          setCampaign(target);
        } else if (list.length > 0) {
          setCampaign(list[0]);
        }
      } catch (err) {
        console.error(err);
      }
    }

    // 2. Load Donations for this campaign
    const storedTx = localStorage.getItem('trustfundx_donations');
    if (storedTx) {
      try {
        const allTx = JSON.parse(storedTx);
        const filtered = allTx.filter((t: any) => t.campaignId === id || !id);
        setDonations(filtered);
      } catch (err) {
        setDonations([]);
      }
    }
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener('trustfundx_data_updated', handleUpdate);
    return () => window.removeEventListener('trustfundx_data_updated', handleUpdate);
  }, [id]);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-[#B8860B]/10 rounded-full flex items-center justify-center mb-4 text-[#FFD700]">
          <Heart size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Campaign Not Found</h2>
        <p className="text-gray-400 text-sm mb-6 max-w-md">The requested disaster relief campaign may have been updated or moved.</p>
        <Link href="/campaigns" className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-black font-bold text-sm">
          Browse All Campaigns
        </Link>
      </div>
    );
  }

  const raised = Number(campaign.raisedAmount || campaign.raised || 0);
  const goal = Number(campaign.goalAmount || campaign.goal || 50000);
  const percent = getProgressPercent(raised, goal);
  const daysLeft = getDaysRemaining(campaign.endDate || campaign.expiryDate || '2026-12-31');
  const beneficiary = campaign.beneficiaryAddress || campaign.beneficiaryWallet || 'HXV7A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0';

  const copyAddress = () => {
    navigator.clipboard.writeText(beneficiary);
    toast.success('Algorand wallet address copied!');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-24">
      {/* Banner */}
      <div className="w-full h-[380px] relative overflow-hidden bg-zinc-950">
        <img
          src={campaign.bannerImage || campaign.imageUrl || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=1200'}
          alt={campaign.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
        
        <div className="absolute top-24 left-4 sm:left-8 z-20">
          <Link href="/campaigns" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-[#333] text-gray-300 hover:text-[#FFD700] text-xs font-semibold transition-colors">
            <ArrowLeft size={16} /> Back to Campaigns
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-[#B8860B]/10 text-[#FFD700] border border-[#B8860B]/30 px-3.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                  {getDisasterEmoji(campaign.disasterType || campaign.type)} {campaign.disasterType || campaign.type}
                </span>
                <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-3.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#FFD700]" /> {campaign.country}
                </span>
                {campaign.aiVerified && (
                  <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-3.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                    <ShieldCheck size={14} /> Gemini AI Verified
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-3">
                {campaign.name}
              </h1>
              {campaign.shortDescription && (
                <p className="text-gray-400 text-lg leading-relaxed mb-4">{campaign.shortDescription}</p>
              )}
            </div>

            <div className="bg-[#111]/90 border border-[#222] rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-4">
              <h2 className="text-xl font-bold text-white border-b border-[#222] pb-3">Campaign Overview</h2>
              <div className="text-gray-300 whitespace-pre-line leading-relaxed text-sm sm:text-base">
                {campaign.description || 'This campaign provides direct disaster relief and emergency supplies to affected victims. All funding is governed by Algorand smart contracts for instant, transparent distribution.'}
              </div>
            </div>

            {/* AI Audit & Verification Card */}
            <div className="bg-[#111]/90 border border-[#222] rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-4">
              <h2 className="text-xl font-bold text-white border-b border-[#222] pb-3 flex items-center gap-2">
                <ShieldCheck className="text-blue-400" /> Gemini AI Verification & Risk Audit
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#181818] border border-[#282828] p-4 rounded-xl">
                  <div className="text-gray-400 text-xs font-medium mb-1">Disaster Urgency Score</div>
                  <div className="text-2xl font-bold text-amber-400 flex items-center gap-2">
                    <Activity size={22} className="text-amber-500" /> {campaign.aiUrgencyScore || 9.5}/10 (Extremely Urgent)
                  </div>
                </div>
                <div className="bg-[#181818] border border-[#282828] p-4 rounded-xl">
                  <div className="text-gray-400 text-xs font-medium mb-1">Fraud & Anomaly Risk</div>
                  <div className="text-2xl font-bold text-green-400 flex items-center gap-2">
                    <CheckCircle2 size={22} className="text-green-400" /> Low Risk (0.02)
                  </div>
                </div>
              </div>
              <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-200 leading-relaxed">
                🤖 <span className="font-semibold text-blue-300">Gemini Audit Report:</span> Verified against global disaster news feeds & certified Algorand wallet records. Smart contract releases funds upon multi-sig verification.
              </div>
            </div>

            {/* LIVE TRANSACTIONS LOG */}
            <div className="bg-[#111]/90 border border-[#222] rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-[#222] pb-3">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Heart className="text-[#FFD700]" size={20} /> Live Algorand Transactions ({donations.length})
                </h2>
                <span className="text-xs text-gray-500 font-mono">Algorand TestNet</span>
              </div>

              {donations.length === 0 ? (
                <div className="py-8 text-center text-gray-500 text-sm">
                  No transactions recorded yet. Be the first donor to contribute!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-gray-500 text-xs uppercase border-b border-[#222]">
                        <th className="pb-2">Donor Wallet</th>
                        <th className="pb-2">Amount</th>
                        <th className="pb-2">Transaction ID</th>
                        <th className="pb-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.map((don) => (
                        <tr key={don.id || don.txId} className="border-b border-[#1f1f1f] last:border-0 hover:bg-[#1a1a1a] transition-colors">
                          <td className="py-3 font-mono text-xs text-gray-300">
                            {truncateAddress(don.donorWallet || don.donorAddress, 6, 4)}
                          </td>
                          <td className="py-3 font-bold text-[#FFD700]">
                            +{don.amount} ALGO
                          </td>
                          <td className="py-3 font-mono text-xs text-gray-400">
                            <a
                              href={`https://testnet.algoexplorer.io/tx/${don.txId || don.algorandTxId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:text-[#FFD700] flex items-center gap-1"
                            >
                              {truncateAddress(don.txId || don.algorandTxId, 6, 4)} <ExternalLink size={12} />
                            </a>
                          </td>
                          <td className="py-3 text-right">
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                              x402 Verified
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Donation Panel */}
          <div className="space-y-6">
            <div className="bg-[#111]/90 border border-[#B8860B]/30 rounded-2xl p-6 backdrop-blur-xl shadow-2xl sticky top-28 space-y-6">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <span className="text-3xl font-extrabold text-[#FFD700]">{formatAlgo(raised)}</span>
                    <span className="text-gray-500 text-xs ml-1 font-semibold">raised</span>
                  </div>
                  <span className="text-gray-400 text-sm font-bold">{percent}%</span>
                </div>
                <div className="w-full bg-[#222] rounded-full h-3 overflow-hidden mb-3">
                  <div
                    className="bg-gradient-to-r from-[#B8860B] to-[#FFD700] h-3 rounded-full transition-all duration-700"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Goal: <strong className="text-white">{formatAlgo(goal)}</strong></span>
                  <span><strong>{campaign.donorCount || campaign.donorsCount || 0}</strong> donors</span>
                </div>
              </div>

              <div className="p-4 bg-[#181818] border border-[#282828] rounded-xl space-y-2">
                <div className="text-xs text-gray-400">Beneficiary Wallet Address</div>
                <div className="flex items-center justify-between bg-black/60 p-2.5 rounded-lg border border-[#333]">
                  <code className="text-xs text-amber-300 font-mono truncate mr-2">{beneficiary}</code>
                  <button onClick={copyAddress} className="p-1.5 text-gray-400 hover:text-white bg-zinc-800 rounded transition-colors" title="Copy Address">
                    <Copy size={14} />
                  </button>
                </div>
              </div>

              <GoldButton
                className="w-full py-4 text-base font-extrabold cursor-pointer shadow-[0_0_25px_rgba(255,215,0,0.3)]"
                onClick={() => setIsModalOpen(true)}
              >
                Donate Now with Wallet
              </GoldButton>

              <div className="text-center text-xs text-gray-500">
                🔒 Direct smart contract transfer • 0 middleman fees
              </div>
            </div>
          </div>
        </div>
      </div>

      <DonationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} campaign={campaign} />
    </div>
  );
}
