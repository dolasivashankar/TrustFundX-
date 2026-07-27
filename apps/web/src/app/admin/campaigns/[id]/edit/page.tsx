"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Save, ArrowLeft, Bot, Upload, ImagePlus, X } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const DISASTER_CATEGORIES = [
  { value: 'EARTHQUAKE', label: '🌍 Earthquake' },
  { value: 'FLOOD', label: '🌊 Flood' },
  { value: 'WILDFIRE', label: '🔥 Wildfire' },
  { value: 'CYCLONE', label: '🌀 Cyclone / Hurricane' },
  { value: 'TSUNAMI', label: '🌏 Tsunami' },
  { value: 'LANDSLIDE', label: '⛰️ Landslide' },
  { value: 'DROUGHT', label: '☀️ Drought / Famine' },
  { value: 'PANDEMIC', label: '🦠 Pandemic' },
  { value: 'MEDICAL', label: '🏥 Medical Emergency' },
  { value: 'REFUGEE', label: '🏕️ Refugee Crisis' },
];

const DEFAULT_BANNER = 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800';

export default function EditCampaignPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [disasterType, setDisasterType] = useState('EARTHQUAKE');
  const [country, setCountry] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [beneficiaryAddress, setBeneficiaryAddress] = useState('');
  const [bannerPreview, setBannerPreview] = useState<string>(DEFAULT_BANNER);
  const [bannerBase64, setBannerBase64] = useState<string>('');
  const [status, setStatus] = useState('ACTIVE');

  useEffect(() => {
    const stored = localStorage.getItem('trustfundx_custom_campaigns');
    if (stored && id) {
      try {
        const list = JSON.parse(stored);
        const target = list.find((c: any) => c.id === id);
        if (target) {
          setName(target.name || '');
          setShortDescription(target.shortDescription || '');
          setDescription(target.description || '');
          setDisasterType(target.disasterType || target.type || 'EARTHQUAKE');
          setCountry(target.country || '');
          setGoalAmount(String(target.goalAmount || target.goal || ''));
          setExpiryDate(target.expiryDate || target.endDate || '2026-12-31');
          setBeneficiaryAddress(target.beneficiaryAddress || target.beneficiaryWallet || '');
          
          const rawImg = target.bannerImage || target.imageUrl;
          if (rawImg && typeof rawImg === 'string' && rawImg.startsWith('data:image/')) {
            setBannerPreview(rawImg);
            setBannerBase64(rawImg);
          } else if (rawImg && typeof rawImg === 'string' && rawImg.startsWith('http')) {
            setBannerPreview(rawImg);
            setBannerBase64(rawImg);
          } else {
            setBannerPreview(DEFAULT_BANNER);
            setBannerBase64(DEFAULT_BANNER);
          }

          setStatus(target.status || 'ACTIVE');
        }
      } catch (err) {
        console.error(err);
      }
    }
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setBannerBase64(base64);
      setBannerPreview(base64);
      toast.success('Updated banner image!');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setBannerPreview(DEFAULT_BANNER);
    setBannerBase64(DEFAULT_BANNER);
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast.success('Reset to default banner');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const stored = localStorage.getItem('trustfundx_custom_campaigns');
      const list = stored ? JSON.parse(stored) : [];
      const updatedList = list.map((c: any) => {
        if (c.id === id) {
          return {
            ...c,
            name,
            shortDescription,
            description,
            type: disasterType,
            disasterType,
            country,
            goalAmount: Number(goalAmount) || c.goalAmount,
            goal: Number(goalAmount) || c.goal,
            expiryDate,
            endDate: expiryDate,
            beneficiaryAddress,
            beneficiaryWallet: beneficiaryAddress,
            bannerImage: bannerBase64 || DEFAULT_BANNER,
            imageUrl: bannerBase64 || DEFAULT_BANNER,
            status,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      });

      localStorage.setItem('trustfundx_custom_campaigns', JSON.stringify(updatedList));
      window.dispatchEvent(new Event('trustfundx_data_updated'));
      toast.success('✅ Campaign updated successfully!');
      router.push('/admin/campaigns');
    } catch (err) {
      toast.error('Failed to update campaign');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all text-sm";

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="flex items-center gap-4">
        <Link href="/admin/campaigns" className="p-2 bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white rounded-xl transition-colors border border-gray-800">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Campaign</h1>
          <p className="text-gray-400 text-sm mt-0.5">Modify campaign parameters & details</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* BANNER IMAGE */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-800 pb-2">
            <h2 className="text-base font-bold text-white">Campaign Banner Image</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                <Upload size={14} /> Upload New Image
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                <X size={14} /> Reset Image
              </button>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-gray-700 bg-gray-950 h-52 flex items-center justify-center">
            <img
              src={bannerPreview}
              alt="Campaign banner"
              onError={() => setBannerPreview(DEFAULT_BANNER)}
              className="w-full h-52 object-cover"
            />
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* DETAILS */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white border-b border-gray-800 pb-2">Campaign Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-300">Campaign Title *</label>
              <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-300">Short Summary</label>
              <input type="text" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className={inputClass} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-300">Full Description</label>
              <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputClass} resize-none`} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Disaster Category</label>
              <select value={disasterType} onChange={(e) => setDisasterType(e.target.value)} className={inputClass}>
                {DISASTER_CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Country *</label>
              <input required type="text" value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Goal Amount (ALGO) *</label>
              <input required type="number" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} className={inputClass} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="PAUSED">PAUSED</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-300">Beneficiary Algorand Wallet Address</label>
              <input required type="text" value={beneficiaryAddress} onChange={(e) => setBeneficiaryAddress(e.target.value)} className={`${inputClass} font-mono`} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/admin/campaigns" className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors text-sm">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-950 font-bold rounded-xl transition-all shadow-lg shadow-yellow-500/20 text-sm cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
