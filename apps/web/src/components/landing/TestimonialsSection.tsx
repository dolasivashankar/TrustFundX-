'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  { name: 'Sarah Mitchell', role: 'Donor from Texas', quote: 'I donated 50 ALGO to the Kerala floods campaign and could see exactly where my money went on the Algorand blockchain. TrustFundX has restored my faith in online donations.', rating: 5, initials: 'SM' },
  { name: 'Dr. Rahul Mehta', role: 'Relief Coordinator, Red Cross India', quote: 'The AI verification system is impressive. It flagged two fake campaigns that traditional systems would have missed. This technology is changing disaster relief.', rating: 5, initials: 'RM' },
  { name: 'Carlos Esperanza', role: 'Blockchain Developer', quote: 'As someone who works in crypto, I appreciate the technical implementation. The Algorand integration is solid, and the x402 payment flow is seamless.', rating: 5, initials: 'CE' },
  { name: 'Emma Watson', role: 'Regular Donor', quote: 'Finally a platform where I trust my donations actually reach people in need. The blockchain transparency is a game-changer for humanitarian aid.', rating: 5, initials: 'EW' },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-[#0A0A0A] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Trusted Worldwide</h2>
        <p className="text-gray-400 text-lg">Hear from our community of donors and organizers.</p>
      </div>

      {/* Scrolling Container */}
      <div className="flex gap-6 px-4 md:px-8 overflow-x-auto pb-8 hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
        {testimonials.map((t, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="min-w-[350px] max-w-[400px] bg-[#111] p-8 rounded-2xl border border-[#222] flex flex-col shrink-0"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
              ))}
            </div>
            <p className="text-gray-300 italic mb-8 flex-1 leading-relaxed">
              "{t.quote}"
            </p>
            <div className="flex items-center gap-4 mt-auto">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] flex items-center justify-center text-black font-bold text-lg">
                {t.initials}
              </div>
              <div>
                <h4 className="text-white font-bold">{t.name}</h4>
                <p className="text-gray-500 text-sm">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
}
