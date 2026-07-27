'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function CTASection() {
  const scrollToCampaigns = () => {
    const target = document.getElementById('campaigns');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#B8860B]/20 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-[#111] border border-[#B8860B]/30 rounded-3xl p-12 text-center relative overflow-hidden">
          {/* Animated border shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFD700]/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Ready to Make a Difference?
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
          >
            Join donors worldwide using blockchain transparency to ensure every contribution reaches those who need it most.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <button 
              onClick={scrollToCampaigns}
              suppressHydrationWarning
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-black font-extrabold text-lg hover:opacity-90 shadow-[0_0_20px_rgba(255,215,0,0.4)] cursor-pointer"
            >
              Start Donating Now
            </button>
          </motion.div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </section>
  );
}
