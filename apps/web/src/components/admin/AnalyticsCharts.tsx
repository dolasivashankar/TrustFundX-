"use client";

import React from "react";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";

const dailyData = [
  { name: 'Mon', amount: 4000 },
  { name: 'Tue', amount: 3000 },
  { name: 'Wed', amount: 5000 },
  { name: 'Thu', amount: 2780 },
  { name: 'Fri', amount: 8900 },
  { name: 'Sat', amount: 2390 },
  { name: 'Sun', amount: 3490 },
];

const categoryData = [
  { name: 'Flood', value: 400 },
  { name: 'Earthquake', value: 300 },
  { name: 'Wildfire', value: 300 },
  { name: 'Medical', value: 200 },
];

const COLORS = ['#FFD700', '#F5DEB3', '#DAA520', '#B8860B'];

export default function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6 h-[400px]">
        <h3 className="text-lg font-bold text-white mb-4">Daily Donations (ALGO)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }} />
            <Line type="monotone" dataKey="amount" stroke="#FFD700" strokeWidth={3} dot={{ fill: '#FFD700', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6 h-[400px]">
        <h3 className="text-lg font-bold text-white mb-4">Disaster Categories</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }} />
            <Legend wrapperStyle={{ color: '#9CA3AF' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
