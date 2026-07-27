'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Lock, Leaf, ExternalLink } from 'lucide-react';

export function AlgorandSection() {
  return (
    <section className="py-24 bg-[#0A0A0A] relative border-y border-[#B8860B]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            {/* Simple Algorand Logo approximation */}
            <div className="w-10 h-10 rounded-full bg-black border-2 border-white flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-6 h-6 text-white fill-current">
                <path d="M50 10L10 90H30L50 50L70 90H90L50 10Z" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Powered by Algorand
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            Leveraging the world's most secure, scalable, and decentralized blockchain to ensure every donation is transparent and immutable.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: Zap, title: 'Lightning Fast', desc: '4.5s transaction finality means aid arrives instantly.' },
            { icon: Lock, title: 'Near-Zero Fees', desc: 'Fractions of a cent per transaction. More money goes to the cause.' },
            { icon: Leaf, title: 'Carbon Neutral', desc: 'Environmentally sustainable blockchain technology.' }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#111] p-8 rounded-2xl border border-[#222] text-center group hover:border-[#FFD700]/30 transition-colors"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-[#1A1A1A] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <item.icon className="w-8 h-8 text-[#FFD700]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <a
            href="https://algoexplorer.io"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-[#B8860B] text-[#FFD700] hover:bg-[#B8860B]/10 font-bold transition-all hover:gap-4"
          >
            View on Explorer <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
