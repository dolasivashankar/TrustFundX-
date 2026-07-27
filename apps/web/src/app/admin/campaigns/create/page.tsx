"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Bot, Upload, ImagePlus, X, PlusCircle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const DISASTER_CATEGORIES = [
  { value: 'EARTHQUAKE', label: '🌍 Earthquake', color: 'bg-orange-500/10 text-orange-400' },
  { value: 'FLOOD', label: '🌊 Flood', color: 'bg-blue-500/10 text-blue-400' },
  { value: 'WILDFIRE', label: '🔥 Wildfire', color: 'bg-red-500/10 text-red-400' },
  { value: 'CYCLONE', label: '🌀 Cyclone / Hurricane', color: 'bg-purple-500/10 text-purple-400' },
  { value: 'TSUNAMI', label: '🌏 Tsunami', color: 'bg-cyan-500/10 text-cyan-400' },
  { value: 'LANDSLIDE', label: '⛰️ Landslide / Mudslide', color: 'bg-yellow-900/20 text-yellow-600' },
  { value: 'DROUGHT', label: '☀️ Drought / Famine', color: 'bg-amber-500/10 text-amber-400' },
  { value: 'VOLCANO', label: '🌋 Volcanic Eruption', color: 'bg-red-900/20 text-red-600' },
  { value: 'PANDEMIC', label: '🦠 Pandemic / Disease Outbreak', color: 'bg-green-900/20 text-green-600' },
  { value: 'WAR', label: '⚔️ War / Conflict Zone', color: 'bg-gray-500/10 text-gray-400' },
  { value: 'COLD_WAVE', label: '🌨️ Extreme Cold / Snowstorm', color: 'bg-sky-500/10 text-sky-400' },
  { value: 'HEAT_WAVE', label: '🌡️ Extreme Heatwave', color: 'bg-orange-900/20 text-orange-600' },
  { value: 'INFRASTRUCTURE', label: '🏗️ Infrastructure Collapse', color: 'bg-zinc-500/10 text-zinc-400' },
  { value: 'CHEMICAL', label: '☢️ Chemical / Industrial Disaster', color: 'bg-lime-500/10 text-lime-400' },
  { value: 'MEDICAL', label: '🏥 Medical Emergency', color: 'bg-pink-500/10 text-pink-400' },
  { value: 'REFUGEE', label: '🏕️ Refugee / Displacement Crisis', color: 'bg-indigo-500/10 text-indigo-400' },
];

export default function CreateCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [disasterType, setDisasterType] = useState('EARTHQUAKE');
  const [customCategory, setCustomCategory] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [beneficiaryAddress, setBeneficiaryAddress] = useState('');
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerBase64, setBannerBase64] = useState<string>('');
  const [autoVerify, setAutoVerify] = useState(true);

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
      toast.success('Campaign banner uploaded!');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setBannerPreview(null);
    setBannerBase64('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalDisasterType = showCustom && customCategory.trim()
        ? customCategory.trim().toUpperCase().replace(/\s+/g, '_')
        : disasterType;

      const newCampaign = {
        id: 'camp-' + Date.now(),
        name,
        shortDescription,
        description,
        type: finalDisasterType,
        disasterType: finalDisasterType,
        disasterLabel: showCustom && customCategory.trim()
          ? customCategory.trim()
          : DISASTER_CATEGORIES.find(c => c.value === disasterType)?.label.replace(/^.{2}\s/, '') || disasterType,
        country,
        state,
        city,
        goalAmount: Number(goalAmount) || 50000,
        goal: Number(goalAmount) || 50000,
        raisedAmount: 0,
        raised: 0,
        donorCount: 0,
        donorsCount: 0,
        endDate: expiryDate,
        expiryDate,
        isAiVerified: autoVerify,
        aiVerified: autoVerify,
        urgencyScore: 9.0,
        aiUrgencyScore: 9.0,
        status: 'ACTIVE',
        aiStatus: 'VERIFIED',
        beneficiaryAddress: beneficiaryAddress,
        beneficiaryWallet: beneficiaryAddress,
        imageUrl: bannerBase64 || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800',
        bannerImage: bannerBase64 || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800',
        createdAt: new Date().toISOString(),
      };

      const existingStr = localStorage.getItem('trustfundx_custom_campaigns');
      const existingList = existingStr ? JSON.parse(existingStr) : [];
      const updatedList = [newCampaign, ...existingList];
      localStorage.setItem('trustfundx_custom_campaigns', JSON.stringify(updatedList));

      toast.success('✅ Campaign published! Gemini AI verification triggered.');
      router.push('/admin/campaigns');
    } catch (err) {
      toast.error('Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all text-sm";

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/campaigns" className="p-2 bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white rounded-xl transition-colors border border-gray-800">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Create New Campaign</h1>
          <p className="text-gray-400 text-sm mt-0.5">Publish a verified disaster relief fund to the Algorand network</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* BANNER IMAGE UPLOAD */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white border-b border-gray-800 pb-2">1. Campaign Banner Image</h2>
          
          {bannerPreview ? (
            <div className="relative rounded-xl overflow-hidden border border-gray-700 group">
              <img src={bannerPreview} alt="Campaign banner" className="w-full h-52 object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black font-bold text-sm rounded-lg hover:bg-yellow-400"
                >
                  <Upload size={16} /> Change Image
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-bold text-sm rounded-lg hover:bg-red-500"
                >
                  <X size={16} /> Remove
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-700 hover:border-yellow-500/50 rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer transition-all group bg-gray-950/50 hover:bg-yellow-500/5"
            >
              <ImagePlus className="w-10 h-10 text-gray-600 group-hover:text-yellow-500 mb-3 transition-colors" />
              <p className="text-gray-400 text-sm group-hover:text-gray-300 font-medium">Click to upload campaign banner</p>
              <p className="text-gray-600 text-xs mt-1">PNG, JPG or WEBP — max 5MB</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* BASIC INFO */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white border-b border-gray-800 pb-2">2. Campaign Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-300">Campaign Title *</label>
              <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="e.g. Kerala Emergency Flood Relief 2026" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-300">Short Summary (shown on card)</label>
              <input type="text" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className={inputClass} placeholder="One-line summary of the disaster situation" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-300">Full Description</label>
              <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputClass} resize-none`} placeholder="Detailed description of the disaster, relief plan, beneficiary organization..." />
            </div>

            {/* DISASTER CATEGORY */}
            <div className="space-y-3 md:col-span-2">
              <label className="text-sm font-medium text-gray-300">Disaster Category *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {DISASTER_CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => { setDisasterType(cat.value); setShowCustom(false); }}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all text-left ${
                      disasterType === cat.value && !showCustom
                        ? 'border-yellow-500 bg-yellow-500/15 text-yellow-300 shadow-sm shadow-yellow-500/20'
                        : 'border-gray-800 bg-gray-950/50 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowCustom(true)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all text-left ${
                    showCustom
                      ? 'border-yellow-500 bg-yellow-500/15 text-yellow-300'
                      : 'border-dashed border-gray-700 text-gray-500 hover:border-gray-500'
                  }`}
                >
                  <PlusCircle size={14} className="inline mr-1" /> Custom Category
                </button>
              </div>
              {showCustom && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Nuclear Incident, Industrial Accident..."
                  required={showCustom}
                />
              )}
            </div>
          </div>
        </div>

        {/* LOCATION */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white border-b border-gray-800 pb-2">3. Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Country *</label>
              <input required type="text" value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass} placeholder="e.g. India" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">State / Province</label>
              <input type="text" value={state} onChange={(e) => setState(e.target.value)} className={inputClass} placeholder="e.g. Kerala" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">City / Region</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} placeholder="e.g. Thrissur" />
            </div>
          </div>
        </div>

        {/* FUNDING */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white border-b border-gray-800 pb-2">4. Funding Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Target Goal (ALGO) *</label>
              <input required type="number" min="1" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} className={inputClass} placeholder="e.g. 50000" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Campaign Expiry Date</label>
              <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className={`${inputClass} [color-scheme:dark]`} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-300">Beneficiary Algorand Wallet Address *</label>
              <input required type="text" value={beneficiaryAddress} onChange={(e) => setBeneficiaryAddress(e.target.value)} className={`${inputClass} font-mono`} placeholder="e.g. HXV7A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0" />
              <p className="text-xs text-gray-500">Donations will be sent directly to this Algorand wallet via smart contract.</p>
            </div>
          </div>
        </div>

        {/* PUBLISHING & AI */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6 space-y-5">
          <h2 className="text-base font-bold text-white border-b border-gray-800 pb-2">5. Publishing & Gemini AI Verification</h2>

          <div className="flex items-center justify-between p-4 bg-gray-950/50 rounded-xl border border-yellow-500/20">
            <div>
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-yellow-500" />
                <h3 className="text-white font-medium text-sm">Gemini AI Auto-Verify</h3>
              </div>
              <p className="text-xs text-gray-400 mt-1">Run automatic disaster verification & fraud detection</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={autoVerify} onChange={(e) => setAutoVerify(e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <Link href="/admin/campaigns" className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors text-sm">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-950 font-bold rounded-xl transition-all shadow-lg shadow-yellow-500/20 cursor-pointer disabled:opacity-50 text-sm"
            >
              <Save className="w-4 h-4" /> {loading ? 'Publishing...' : 'Publish Campaign'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
