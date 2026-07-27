"use client";

import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import AnalyticsCharts from "@/components/admin/AnalyticsCharts";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Platform Analytics</h1>
          <p className="text-gray-400 mt-1">Deep dive into platform metrics and trends</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-gray-300">
          <CalendarIcon className="w-4 h-4 text-yellow-500" />
          <select className="bg-transparent outline-none border-none">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>1 Year</option>
          </select>
        </div>
      </div>

      <AnalyticsCharts />
    </div>
  );
}
