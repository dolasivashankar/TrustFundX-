'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Award, User, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Comment {
  id: string;
  name: string;
  avatar: string;
  text: string;
  isDonor: boolean;
  walletAddr?: string;
  createdAt: string;
}

const AVATARS = [
  '🦊', '🦁', '🦉', '🐨', '🐼', '🦄', '🦖', '🐝', '🐙', '🐬'
];

export function FrontCommentsSection() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🦊');
  const [text, setText] = useState('');
  
  const [isConnected, setIsConnected] = useState(false);
  const [isDonor, setIsDonor] = useState(false);
  const [userWallet, setUserWallet] = useState('');

  const loadData = () => {
    // 1. Load Comments
    const stored = localStorage.getItem('trustfundx_comments');
    if (stored) {
      try {
        setComments(JSON.parse(stored));
      } catch {
        setComments([]);
      }
    } else {
      const defaultComments: Comment[] = [
        {
          id: 'c1',
          name: 'Satoshi NGO Coordinator',
          avatar: '🦁',
          text: 'Thanks to the TrustFundX platform, our relief funds for the earthquake arrived in less than 30 seconds! Blockchain donation is a game changer.',
          isDonor: true,
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          id: 'c2',
          name: 'Alex Rivera',
          avatar: '🐼',
          text: 'Verified my donation on the Algorand explorer instantly. No hidden fees or middleman delays. Highly recommend supporting these funds!',
          isDonor: true,
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        }
      ];
      localStorage.setItem('trustfundx_comments', JSON.stringify(defaultComments));
      setComments(defaultComments);
    }

    // 2. Check connected wallet status
    const addr = localStorage.getItem('walletAddress');
    if (addr) {
      setIsConnected(true);
      setUserWallet(addr);
      // Check if they have made at least one donation
      const storedTx = localStorage.getItem('trustfundx_donations');
      if (storedTx) {
        try {
          const list = JSON.parse(storedTx);
          const hasDonated = list.some((tx: any) => tx.donorWallet === addr || tx.donorAddress === addr);
          setIsDonor(hasDonated);
        } catch {
          setIsDonor(false);
        }
      }
    } else {
      setIsConnected(false);
      setIsDonor(false);
      setUserWallet('');
    }
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener('trustfundx_data_updated', handleUpdate);
    return () => window.removeEventListener('trustfundx_data_updated', handleUpdate);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter a display name');
      return;
    }
    if (!text.trim()) {
      toast.error('Please type your comment');
      return;
    }

    const newComment: Comment = {
      id: 'comm-' + Date.now(),
      name: name.trim(),
      avatar,
      text: text.trim(),
      isDonor: isDonor,
      walletAddr: isConnected ? userWallet : undefined,
      createdAt: new Date().toISOString(),
    };

    const updated = [newComment, ...comments];
    localStorage.setItem('trustfundx_comments', JSON.stringify(updated));
    setComments(updated);
    setText('');
    toast.success('Comment posted successfully!');
  };

  return (
    <section className="py-20 bg-[#0A0A0A]/90 border-t border-[#B8860B]/15" id="discussion">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#B8860B]/30 bg-[#B8860B]/10 text-xs font-bold text-[#FFD700] mb-3">
            COMMUNITY DISCUSSION
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Public Support & Forum</h2>
          <p className="text-gray-400 text-sm md:text-base mt-1">Leave a message of encouragement, verify donations, and discuss ongoing projects.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Post Comment Form */}
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 h-fit shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="text-[#FFD700] w-5 h-5" /> Say Something
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Hopeful Donor"
                  className="w-full px-3 py-2 bg-black/40 border border-zinc-800 focus:border-[#FFD700] rounded-xl text-white outline-none text-sm transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400">Choose Avatar</label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-black/35 rounded-xl border border-zinc-800">
                  {AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setAvatar(av)}
                      className={`text-lg p-1.5 rounded-lg transition-transform ${avatar === av ? 'bg-amber-500/20 scale-110 border border-amber-500/30' : 'hover:scale-105 opacity-60'}`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400">Your Message</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={3}
                  placeholder="Leave a message of support..."
                  className="w-full px-3 py-2.5 bg-black/40 border border-zinc-800 focus:border-[#FFD700] rounded-xl text-white outline-none text-sm transition-colors resize-none"
                  required
                />
              </div>

              {isConnected && (
                <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-gray-400" />
                    <span className="text-[11px] text-gray-400 truncate w-32 font-mono">
                      {userWallet.slice(0, 6)}...{userWallet.slice(-4)}
                    </span>
                  </div>
                  {isDonor ? (
                    <span className="text-[10px] font-extrabold text-green-400 flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                      <Award size={10} /> Verified Donor
                    </span>
                  ) : (
                    <span className="text-[10px] text-zinc-500">No Donation Yet</span>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#FFD700] to-[#B8860B] hover:opacity-90 text-black font-extrabold rounded-xl transition-all shadow-[0_0_20px_rgba(255,215,0,0.15)] text-xs cursor-pointer"
              >
                <Send size={14} /> Post Message
              </button>
            </form>
          </div>

          {/* Comments List */}
          <div className="lg:col-span-2 space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {comments.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-sm">
                No discussion entries yet. Be the first to share your support message!
              </div>
            ) : (
              <AnimatePresence>
                {comments.map((comm) => (
                  <motion.div
                    key={comm.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex gap-4 backdrop-blur-sm"
                  >
                    <div className="text-3xl shrink-0 select-none bg-zinc-950 w-12 h-12 rounded-xl border border-zinc-800 flex items-center justify-center">
                      {comm.avatar}
                    </div>
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{comm.name}</span>
                          {comm.isDonor && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-green-500/10 text-green-400 border border-green-500/20" title="Verified Algorand donor">
                              <CheckCircle2 size={10} /> Donor
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {new Date(comm.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{comm.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
