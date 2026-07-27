"use client";

import React from "react";
import { Download, Search, ExternalLink, ShieldCheck } from "lucide-react";

export default function AdminDonationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Donations Ledger</h1>
          <p className="text-gray-400 mt-1">Track all Algorand + x402 donations</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg border border-gray-700 transition-all">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-950/50 border border-gray-800 rounded-lg px-3 py-2 w-full max-w-md">
            <Search className="w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search by Wallet or TX ID..." 
              className="bg-transparent border-none outline-none text-white text-sm w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-950/50 text-gray-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Donor Wallet</th>
                <th className="p-4 font-medium">Campaign</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">x402 Verified</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium text-right">TX ID</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="p-4 font-mono text-gray-300">
                    A7X9...3K2P
                  </td>
                  <td className="p-4 text-gray-200">
                    Kerala Flood Relief
                  </td>
                  <td className="p-4 font-medium text-yellow-500">
                    {Math.floor(Math.random() * 500) + 10} ALGO
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-green-400 bg-green-500/10 w-fit px-2 py-1 rounded-md border border-green-500/20">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-xs font-medium">Yes</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-400">
                    {new Date().toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <a href="#" className="inline-flex items-center gap-1 text-yellow-500 hover:text-yellow-400 font-mono text-xs">
                      TX...9F2A <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
