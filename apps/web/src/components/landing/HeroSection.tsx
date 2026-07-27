'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Globe, Quote } from 'lucide-react';
import Link from 'next/link';


export function HeroSection() {
  const [campaignCount, setCampaignCount] = useState(0);
  const [totalRaised, setTotalRaised] = useState(0);


  useEffect(() => {
    const stored = localStorage.getItem('trustfundx_custom_campaigns');
    if (stored) {
      try {
        const list = JSON.parse(stored);
        setCampaignCount(list.length);
        const sum = list.reduce((acc: number, c: any) => acc + (Number(c.raisedAmount || c.raised) || 0), 0);
        setTotalRaised(sum);
      } catch {
        setCampaignCount(0);
        setTotalRaised(0);
      }
    }
  }, []);


  const scrollToCampaigns = () => {
    const target = document.getElementById('campaigns');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden bg-[#0A0A0A]">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#B8860B]/20 to-[#FFD700]/10 rounded-full blur-[120px] pointer-events-none"></div>
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#B8860B]/30 bg-[#B8860B]/10 backdrop-blur-sm mb-8"
        >
          <Globe className="w-3.5 h-3.5 text-[#FFD700]" />
          <span className="text-xs font-semibold text-gray-300">
            {totalRaised.toLocaleString('en-US')} ALGO raised • {campaignCount} {campaignCount === 1 ? 'campaign' : 'campaigns'} active • Algorand TestNet
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight"
        >
          Powering Disaster Relief <br /> with{' '}
          <span className="bg-gradient-to-r from-[#FFD700] via-amber-200 to-[#B8860B] bg-clip-text text-transparent">
            AI + Blockchain
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-2xl mx-auto text-base md:text-lg text-gray-400 mb-8 leading-relaxed"
        >
          Transparent, fast, and verified disaster donations. Empowering global communities with direct crypto funding and Gemini AI validation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={scrollToCampaigns}
            suppressHydrationWarning
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-black font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,215,0,0.3)] cursor-pointer"
          >
            Explore Campaigns <ArrowRight className="w-5 h-5" />
          </button>
          <Link
            href="/campaigns"
            suppressHydrationWarning
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-[#B8860B] text-[#FFD700] font-bold text-lg hover:bg-[#B8860B]/10 transition-colors text-center"
          >
            All Relief Funds
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        onClick={scrollToCampaigns}
      >
        <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-1 h-8 bg-gradient-to-b from-[#FFD700] to-transparent rounded-full"
        />
      </motion.div>
    </section>
  );
}
