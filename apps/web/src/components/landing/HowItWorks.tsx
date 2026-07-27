'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Cpu, Wallet, Send, HeartHandshake } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    { icon: PlusCircle, title: 'Create', desc: 'Admin creates a relief campaign.' },
    { icon: Cpu, title: 'Verify', desc: 'AI verifies authenticity and risk.' },
    { icon: Wallet, title: 'Connect', desc: 'Donor connects their Algorand wallet.' },
    { icon: Send, title: 'Donate', desc: 'Instant donation via x402 + ALGO.' },
    { icon: HeartHandshake, title: 'Impact', desc: 'Funds directly reach beneficiaries.' },
  ];

  return (
    <section className="py-24 bg-[#0A0A0A]" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white mb-4"
          >
            How It Works
          </motion.h2>
          <p className="text-gray-400 text-lg">A seamless, transparent journey from creation to impact.</p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-[#222] -translate-y-1/2" />
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-[#FFD700] to-[#B8860B] -translate-y-1/2 origin-left scale-x-0"
               style={{ animation: 'growWidth 3s ease-out forwards', animationTimeline: 'view()' }} />
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 rounded-full bg-[#111] border-4 border-[#0A0A0A] flex items-center justify-center relative mb-6 group-hover:scale-110 transition-transform z-10 shadow-[0_0_15px_rgba(255,215,0,0.2)] group-hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] bg-gradient-to-br from-[#111] to-[#222]">
                  <step.icon className="w-8 h-8 text-[#FFD700]" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#B8860B] text-black text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
