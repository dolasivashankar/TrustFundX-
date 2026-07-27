'use client';

import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { DollarSign, Activity, Users, Globe2 } from 'lucide-react';

const StatCard = ({ icon: Icon, value, label, suffix = '', prefix = '' }: any) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-2xl bg-[#111] border border-[#222] hover:border-[#B8860B]/50 hover:shadow-[0_0_20px_rgba(184,134,11,0.2)] transition-all group"
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className="p-4 rounded-full bg-[#B8860B]/10 group-hover:bg-[#B8860B]/20 transition-colors">
          <Icon className="w-8 h-8 text-[#FFD700]" />
        </div>
        <div>
          <h3 className="text-4xl font-black text-white mb-2">
            {prefix}{value}{suffix}
          </h3>
          <p className="text-gray-400 font-medium">{label}</p>
        </div>
      </div>
    </motion.div>
  );
};

export function StatsSection() {
  const stats = [
    { icon: DollarSign, value: '2.3', suffix: 'M+', prefix: '$', label: 'Total Raised' },
    { icon: Activity, value: '124', label: 'Active Campaigns' },
    { icon: Users, value: '50,000', suffix: '+', label: 'Lives Impacted' },
    { icon: Globe2, value: '47', label: 'Countries Reached' },
  ];

  return (
    <section className="py-20 bg-[#0A0A0A] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
