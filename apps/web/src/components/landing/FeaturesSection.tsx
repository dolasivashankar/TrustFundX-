'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Link as LinkIcon, Zap, CreditCard, BarChart, Wallet } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'AI Verification',
    description: 'AI analyzes campaigns for fraud detection and risk assessment.',
  },
  {
    icon: LinkIcon,
    title: 'Blockchain Transparency',
    description: 'Every donation recorded immutably on the Algorand blockchain.',
  },
  {
    icon: Zap,
    title: 'Instant Funding',
    description: 'Donations reach beneficiaries directly without delays.',
  },
  {
    icon: CreditCard,
    title: 'x402 Payments',
    description: 'Native HTTP payment protocol integration for seamless transactions.',
  },
  {
    icon: BarChart,
    title: 'Real-time Tracking',
    description: 'Monitor campaign progress live with detailed analytics.',
  },
  {
    icon: Wallet,
    title: 'Multi-wallet Support',
    description: 'Connect securely using Pera, Defly, or WalletConnect.',
  },
];

export function FeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-24 bg-[#0A0A0A] relative" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white mb-6"
          >
            Revolutionizing Relief with Technology
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            Combining the power of artificial intelligence and blockchain to ensure your donations are secure, transparent, and impactful.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-gradient-to-b from-[#111] to-[#0A0A0A] border border-[#222] hover:border-[#B8860B]/40 transition-colors group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="w-14 h-14 rounded-2xl bg-[#B8860B]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-[#FFD700]" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
