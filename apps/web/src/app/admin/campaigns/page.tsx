"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Filter, Edit, Bot, PlusCircle, AlertCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-500/10 text-green-400 border-green-500/20",
  DRAFT: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  PAUSED: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  COMPLETED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  ARCHIVED: "bg-red-500/10 text-red-400 border-red-500/20",
};

const aiStatusColors: Record<string, string> = {
  VERIFIED: "text-green-400",
  PENDING: "text-yellow-400",
  FLAGGED: "text-red-400",
};

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('trustfundx_custom_campaigns');
    if (stored) {
      try {
        setCampaigns(JSON.parse(stored));
      } catch (err) {
        setCampaigns([]);
      }
    }
  }, []);

  const handleDelete = (id: string) => {
    const updated = campaigns.filter(c => c.id !== id);
    setCampaigns(updated);
    localStorage.setItem('trustfundx_custom_campaigns', JSON.stringify(updated));
    toast.success('Campaign removed');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Campaign Management</h1>
          <p className="text-gray-400 mt-1">Manage, verify and monitor all disaster funding campaigns</p>
        </div>
        <Link 
          href="/admin/campaigns/create"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-950 font-bold rounded-lg transition-all shadow-lg shadow-yellow-500/20 cursor-pointer"
        >
          <Plus className="w-5 h-5" /> Create New Campaign
        </Link>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2 bg-gray-950/50 border border-gray-800 rounded-lg px-3 py-2 w-full max-w-md focus-within:border-yellow-500/50 focus-within:ring-1 focus-within:ring-yellow-500/50 transition-all">
            <Search className="w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search campaigns..." 
              className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-gray-600"
            />
          </div>
        </div>

        {campaigns.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-500">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Campaigns Created Yet</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
              All hardcoded mock campaigns have been removed. Create your first campaign below to publish it live to the platform network.
            </p>
            <Link
              href="/admin/campaigns/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-950 font-bold text-sm rounded-lg hover:opacity-90 transition-all shadow-lg shadow-yellow-500/20"
            >
              <PlusCircle className="w-4 h-4" /> Create First Campaign
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-gray-950/50 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Campaign</th>
                  <th className="p-4 font-medium">Location & Type</th>
                  <th className="p-4 font-medium">Funding Goal</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">AI Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {campaigns.map((camp, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={camp.id} 
                    className="border-b border-gray-800/50 last:border-0 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-medium text-gray-200">{camp.name}</div>
                      <div className="text-xs text-gray-500 mt-1">ID: {camp.id}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-300">{camp.disasterType || camp.type}</div>
                      <div className="text-xs text-gray-500">{camp.country}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-yellow-500">{(camp.raisedAmount || 0).toLocaleString('en-US')} ALGO</div>
                      <div className="text-xs text-gray-500 mt-1">of {(camp.goalAmount || camp.goal).toLocaleString('en-US')} ALGO</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[11px] font-medium rounded-md border ${statusColors[camp.status || 'ACTIVE']}`}>
                        {camp.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <Bot className={`w-4 h-4 ${aiStatusColors[camp.aiStatus || 'VERIFIED']}`} />
                        <span className={`text-xs font-medium ${aiStatusColors[camp.aiStatus || 'VERIFIED']}`}>{camp.aiStatus || 'VERIFIED'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/campaigns/${camp.id}/edit`}
                          className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-semibold rounded-lg text-xs transition-colors"
                          title="Edit Campaign"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(camp.id)}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                          title="Delete Campaign"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
