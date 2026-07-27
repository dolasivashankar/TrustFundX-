'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, AlertTriangle, Fingerprint, Image as ImageIcon } from 'lucide-react';

export function AISection() {
  const aiFeatures = [
    'Disaster Image Analysis',
    'Fake Campaign Detection',
    'Duplicate Detection',
    'Risk Scoring & Prioritization',
  ];

  return (
    <section className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-[#B8860B]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              AI-Powered Verification <br />
              <span className="text-[#FFD700]">You Can Trust</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Our advanced AI models analyze every campaign submission in real-time, ensuring authenticity and protecting donors from fraud before a single token is transferred.
            </p>

            <ul className="space-y-4">
              {aiFeatures.map((feature, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 + 0.4 }}
                  className="flex items-center gap-3 text-white text-lg font-medium"
                >
                  <CheckCircle2 className="w-6 h-6 text-[#FFD700]" />
                  {feature}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/20 to-[#B8860B]/20 rounded-3xl blur-2xl transform rotate-3" />
            
            <div className="relative bg-[#111] border border-[#333] rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-8 border-b border-[#333] pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FFD700]/20 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-[#FFD700]" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">AI Analysis Report</h3>
                    <p className="text-xs text-gray-400">Campaign ID: #TX-9842</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30">
                  VERIFIED
                </span>
              </div>

              <div className="space-y-6">
                {/* Risk Score */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Trust Score</span>
                    <span className="text-[#FFD700] font-bold">98%</span>
                  </div>
                  <div className="h-2 w-full bg-[#222] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '98%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-[#B8860B] to-[#FFD700] rounded-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#222]">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-orange-400" />
                      <span className="text-sm text-gray-300">Urgency</span>
                    </div>
                    <span className="text-2xl font-bold text-white">High</span>
                  </div>
                  <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#222]">
                    <div className="flex items-center gap-2 mb-2">
                      <Fingerprint className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-300">Uniqueness</span>
                    </div>
                    <span className="text-2xl font-bold text-white">100%</span>
                  </div>
                </div>

                <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#222] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-300">Image Forensics</span>
                  </div>
                  <span className="text-sm text-green-400">Authentic</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
