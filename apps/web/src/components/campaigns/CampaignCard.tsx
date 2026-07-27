'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { GoldButton } from '@/components/ui/GoldButton';
import { formatAlgo, getProgressPercent, getDaysRemaining, getDisasterColor, getDisasterEmoji } from '@/lib/utils';
import { useState } from 'react';
import { DonationModal } from './DonationModal';

interface CampaignCardProps {
  campaign: any;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [imgSrc, setImgSrc] = useState(
    campaign.imageUrl || campaign.bannerImage || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800'
  );

  const percent = getProgressPercent(campaign.raisedAmount, campaign.goalAmount);
  const daysLeft = getDaysRemaining(campaign.endDate || campaign.expiryDate || '2026-12-31');
  const typeColorClass = getDisasterColor(campaign.type || campaign.disasterType);

  const handleCardClick = () => {
    router.push(`/campaigns/${campaign.id}`);
  };

  const handleDonateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group bg-[#111] border border-[#222] hover:border-[#B8860B]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#B8860B]/10 flex flex-col h-full cursor-pointer"
      >
        <div className="relative h-48 w-full overflow-hidden bg-zinc-950">
          <img
            src={imgSrc}
            alt={campaign.name}
            onError={() => setImgSrc('https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800')}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
          
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${typeColorClass} backdrop-blur-md flex items-center gap-1 w-fit`}>
              {getDisasterEmoji(campaign.type || campaign.disasterType)} {campaign.type || campaign.disasterType}
            </span>
          </div>

          {(campaign.isAiVerified || campaign.aiVerified) && (
            <div className="absolute top-3 right-3 bg-blue-500/90 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg backdrop-blur-md">
              <ShieldCheck size={14} /> AI Verified
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-1 text-zinc-400 text-sm mb-2">
            <MapPin size={14} /> {campaign.country}
          </div>
          
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight">
            {campaign.name}
          </h3>
          
          <div className="mt-auto pt-4">
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="text-xl font-bold text-[#FFD700]">{formatAlgo(campaign.raisedAmount)}</span>
                <span className="text-zinc-500 text-xs ml-1">raised</span>
              </div>
              <span className="text-zinc-400 text-sm">{percent}%</span>
            </div>
            
            <div className="w-full bg-[#222] rounded-full h-2 mb-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#B8860B] to-[#FFD700] h-2 rounded-full transition-all duration-500" 
                style={{ width: `${percent}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-zinc-400 text-sm mb-6">
              <div className="flex items-center gap-1">
                <Users size={14} /> {campaign.donorCount || campaign.donorsCount || 0} donors
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} /> {daysLeft} days left
              </div>
            </div>

            <div className="flex gap-3">
              <GoldButton variant="outline" className="flex-1 text-sm">
                View Details
              </GoldButton>
              <GoldButton className="flex-1 text-sm cursor-pointer" onClick={handleDonateClick}>
                Donate
              </GoldButton>
            </div>
          </div>
        </div>
      </div>
      
      <DonationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} campaign={campaign} />
    </>
  );
}
