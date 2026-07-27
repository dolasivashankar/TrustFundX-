"use client";

import React from "react";
import { Brain, AlertTriangle, ShieldAlert, Sparkles, Activity } from "lucide-react";
import MetricCard from "@/components/admin/MetricCard";

export default function AdminAIDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Brain className="w-8 h-8 text-yellow-500" /> AI Intelligence Dashboard
          </h1>
          <p className="text-gray-400 mt-1">Gemini AI verification and fraud detection insights</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-950 font-bold rounded-lg transition-all shadow-lg shadow-yellow-500/20">
          <Sparkles className="w-4 h-4" /> Analyze All Pending
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Campaigns Analyzed" value="1,204" icon={<Brain className="w-5 h-5" />} iconColor="text-blue-500" />
        <MetricCard title="Fraud Flags" value="42" icon={<AlertTriangle className="w-5 h-5" />} iconColor="text-red-500" />
        <MetricCard title="Duplicate Detections" value="18" icon={<ShieldAlert className="w-5 h-5" />} iconColor="text-orange-500" />
        <MetricCard title="Avg Risk Score" value="12%" icon={<Activity className="w-5 h-5" />} iconColor="text-green-500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent AI Analyses</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-sm border-b border-gray-800">
                  <th className="pb-3 font-medium">Target Campaign</th>
                  <th className="pb-3 font-medium">Risk Score</th>
                  <th className="pb-3 font-medium">Urgency</th>
                  <th className="pb-3 font-medium">Flags</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b border-gray-800/50 last:border-0">
                    <td className="py-3 text-gray-200">Wildfire Recovery Fund</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full w-[15%]" />
                        </div>
                        <span className="text-green-400 text-xs">15%</span>
                      </div>
                    </td>
                    <td className="py-3 text-yellow-500 font-medium">High (8/10)</td>
                    <td className="py-3 text-gray-500">None</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-4">Unresolved Alerts</h2>
          <div className="space-y-4 flex-1">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-red-500 mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-bold text-sm">CRITICAL RISK</span>
              </div>
              <p className="text-sm text-gray-300">Campaign "Help Local Dogs" has 98% image similarity with a known scam campaign.</p>
              <button className="mt-3 text-xs bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition-colors">Take Action</button>
            </div>
            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-orange-500 mb-1">
                <ShieldAlert className="w-4 h-4" />
                <span className="font-bold text-sm">HIGH RISK</span>
              </div>
              <p className="text-sm text-gray-300">Unusually large funding spike from new anonymous wallets.</p>
              <button className="mt-3 text-xs bg-orange-500 text-white px-3 py-1.5 rounded-md hover:bg-orange-600 transition-colors">Investigate</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
