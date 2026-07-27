'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: "How does TrustFundX verify campaigns?", a: "We use advanced AI models to analyze campaign descriptions, images, and organizer backgrounds. This includes cross-referencing images for duplicates, analyzing risk factors, and assigning a trust score before any campaign goes live." },
  { q: "How do donations reach beneficiaries?", a: "Donations are processed via smart contracts on the Algorand blockchain. Once a campaign reaches its goal or milestones, funds are transferred directly to the verified beneficiary's wallet, completely bypassing intermediaries." },
  { q: "Which wallets are supported?", a: "Currently, we support popular Algorand wallets including Pera Wallet, Defly Wallet, and WalletConnect compatible options." },
  { q: "What is x402 protocol?", a: "x402 is an HTTP-native payment protocol that allows seamless, programmable micro-payments integrated directly into web requests, ensuring fast and frictionless donation flows." },
  { q: "What is the minimum donation amount?", a: "Thanks to Algorand's low fees, you can donate as little as 1 ALGO. There are virtually no limits, making micro-donations viable." },
  { q: "How can I track my donation?", a: "Every transaction is recorded on the Algorand blockchain. You can view your donation's exact path via our dashboard or any Algorand block explorer using your transaction ID." },
  { q: "Are donations tax-deductible?", a: "This depends on the campaign organizer's legal status (e.g., registered 501(c)(3) NGO) and your local tax laws. Verified NGO campaigns will provide necessary tax receipts." },
  { q: "What happens if a campaign doesn't reach its goal?", a: "Campaigns can be structured as 'Flexible' (keep what you raise) or 'All-or-Nothing'. For All-or-Nothing campaigns, funds are automatically refunded to donors via smart contract if the goal isn't met." }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-lg">Everything you need to know about the platform.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-[#222] rounded-xl overflow-hidden bg-[#111]"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="text-lg font-medium text-white">{faq.q}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-[#FFD700] transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-4 text-gray-400 border-t border-[#222] pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
