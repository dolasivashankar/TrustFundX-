import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconColor?: string;
  change?: number;
  prefix?: string;
  suffix?: string;
}

export default function MetricCard({ title, value, icon, iconColor = "text-yellow-500", change, prefix = "", suffix = "" }: MetricCardProps) {
  const isPositive = change && change > 0;
  
  return (
    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-5 hover:border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/5 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-lg bg-gray-950/80 border border-gray-800 group-hover:border-yellow-500/30 transition-colors ${iconColor}`}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div>
        <div className="text-sm font-medium text-gray-400 mb-1">{title}</div>
        <div className="text-2xl font-bold text-white tracking-tight">
          {prefix}{value}{suffix}
        </div>
      </div>
    </div>
  );
}
