import React from 'react';
import Link from 'next/link';
import { Zap, Twitter, Github, MessageCircle, Send } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#050505] pt-20 pb-10 border-t border-[#222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group mb-6">
              <Zap className="w-8 h-8 text-[#FFD700]" />
              <span className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#B8860B] bg-clip-text text-transparent">
                TrustFundX
              </span>
            </Link>
            <p className="text-gray-400 mb-8 max-w-sm">
              Empowering global disaster relief with AI-verified campaigns and transparent blockchain donations on Algorand.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-[#111] border border-[#333] flex items-center justify-center text-gray-400 hover:text-[#FFD700] hover:border-[#FFD700] transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#111] border border-[#333] flex items-center justify-center text-gray-400 hover:text-[#FFD700] hover:border-[#FFD700] transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#111] border border-[#333] flex items-center justify-center text-gray-400 hover:text-[#FFD700] hover:border-[#FFD700] transition-all">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#111] border border-[#333] flex items-center justify-center text-gray-400 hover:text-[#FFD700] hover:border-[#FFD700] transition-all">
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Cols */}
          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-gray-400 hover:text-[#FFD700] transition-colors">Campaigns</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#FFD700] transition-colors">How it Works</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#FFD700] transition-colors">AI Features</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#FFD700] transition-colors">Algorand Integration</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-gray-400 hover:text-[#FFD700] transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#FFD700] transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#FFD700] transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#FFD700] transition-colors">Press</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-gray-400 hover:text-[#FFD700] transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#FFD700] transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#FFD700] transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#B8860B]/30 to-transparent mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} TrustFundX. All rights reserved.
          </p>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#111] border border-[#222]">
            <span className="text-gray-400 text-sm">Built on</span>
            <span className="text-white font-bold text-sm">Algorand</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
