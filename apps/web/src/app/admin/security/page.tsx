"use client";

import React from "react";
import { ShieldCheck, Smartphone, Key } from "lucide-react";

export default function AdminSecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Security Settings</h1>
        <p className="text-gray-400 mt-1">Manage 2FA, active sessions, and security logs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Two-Factor Auth</h2>
                <p className="text-sm text-gray-400">Currently Disabled</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-950 font-bold rounded-lg transition-colors">
              Enable 2FA
            </button>
          </div>
          <div className="p-4 bg-gray-950/50 border border-gray-800 rounded-lg flex items-start gap-4">
            <Smartphone className="w-6 h-6 text-gray-500 mt-1" />
            <div>
              <h3 className="text-white font-medium">Authenticator App</h3>
              <p className="text-sm text-gray-400 mt-1">Use an app like Google Authenticator or Authy to scan a QR code and generate verification codes.</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Active Sessions</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-950/50 border border-yellow-500/30 rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">Windows • Chrome</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-yellow-500 text-gray-950 rounded-full">CURRENT</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">IP: 192.168.1.1 • Last Active: Just now</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
