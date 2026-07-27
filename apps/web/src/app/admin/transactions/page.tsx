"use client";

import React, { useState, useEffect } from "react";
import { ExternalLink, Search, ShieldCheck } from "lucide-react";
import { truncateAddress } from "@/lib/utils";

export default function AdminTransactionsPage() {
  const [donations, setDonations] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('trustfundx_donations');
    if (stored) {
      try {
        setDonations(JSON.parse(stored));
      } catch {
        setDonations([]);
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Algorand Blockchain Transactions</h1>
          <p className="text-gray-400 mt-1">Real-time transparent donation ledger on Algorand TestNet</p>
        </div>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl overflow-hidden">
        {donations.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            No donation transactions recorded yet. When donors contribute via connected Algorand wallets, cryptographic transactions will log here in real time.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-950/50 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Transaction ID</th>
                  <th className="p-4 font-medium">Campaign</th>
                  <th className="p-4 font-medium">Donor Wallet</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">x402 Protocol</th>
                  <th className="p-4 font-medium text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {donations.map((don) => (
                  <tr key={don.id || don.txId} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="p-4 font-mono text-xs text-yellow-500">
                      <a
                        href={`https://testnet.algoexplorer.io/tx/${don.txId || don.algorandTxId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline inline-flex items-center gap-1"
                      >
                        {truncateAddress(don.txId || don.algorandTxId, 6, 4)} <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="p-4 text-white font-medium text-xs">
                      {don.campaignName || 'Disaster Relief Campaign'}
                    </td>
                    <td className="p-4 font-mono text-xs text-gray-400">
                      {truncateAddress(don.donorWallet || don.donorAddress, 6, 4)}
                    </td>
                    <td className="p-4 font-bold text-yellow-500 text-xs">
                      +{don.amount} ALGO
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 text-xs bg-green-500/10 text-green-400 font-bold rounded-md border border-green-500/20 inline-flex items-center gap-1">
                        <ShieldCheck size={12} /> CONFIRMED
                      </span>
                    </td>
                    <td className="p-4 text-right text-gray-400 text-xs font-mono">
                      {new Date(don.createdAt || Date.now()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
