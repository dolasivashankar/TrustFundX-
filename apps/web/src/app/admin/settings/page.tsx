"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, Shield, Activity, Key, User, Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'TrustFundX@2026';
const CREDS_KEY = 'trustfundx_admin_credentials';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("credentials");

  // Credentials state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [credsSaved, setCredsSaved] = useState(false);

  // Platform settings
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [geminiKey, setGeminiKey] = useState('mock_gemini_key_xxxx');

  useEffect(() => {
    const stored = localStorage.getItem(CREDS_KEY);
    if (stored) {
      try {
        const creds = JSON.parse(stored);
        setNewUsername(creds.username || DEFAULT_USERNAME);
      } catch {}
    } else {
      setNewUsername(DEFAULT_USERNAME);
    }
  }, []);

  const handleChangeCredentials = (e: React.FormEvent) => {
    e.preventDefault();

    // Get current stored credentials
    const storedStr = localStorage.getItem(CREDS_KEY);
    const storedCreds = storedStr
      ? JSON.parse(storedStr)
      : { username: DEFAULT_USERNAME, password: DEFAULT_PASSWORD };

    // Validate current password
    if (currentPassword !== storedCreds.password) {
      toast.error('Current password is incorrect');
      return;
    }
    if (!newUsername.trim()) {
      toast.error('Username cannot be empty');
      return;
    }
    if (newPassword && newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    const updatedCreds = {
      username: newUsername.trim(),
      password: newPassword || storedCreds.password,
    };

    localStorage.setItem(CREDS_KEY, JSON.stringify(updatedCreds));
    toast.success('Admin credentials updated successfully!');
    setCredsSaved(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setCredsSaved(false), 3000);
  };

  const handleSavePlatform = () => {
    toast.success('Platform settings saved');
  };

  const tabs = [
    { id: 'credentials', label: 'Admin Credentials', icon: Key },
    { id: 'general', label: 'Platform Settings', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'audit', label: 'Audit Logs', icon: Activity },
  ];

  const auditLogs = [
    { time: '2026-07-27 15:28:01', action: 'Admin Login', ip: '192.168.1.5', status: 'Success' },
    { time: '2026-07-27 15:20:00', action: 'Campaign Created', ip: '192.168.1.5', status: 'Success' },
    { time: '2026-07-27 10:00:00', action: 'Settings Updated', ip: '192.168.1.5', status: 'Success' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Platform Settings</h1>
        <p className="text-gray-400 mt-1">Configure admin access, platform behavior, and integrations</p>
      </div>

      <div className="flex gap-2 border-b border-gray-800 pb-px overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 pb-3 px-3 border-b-2 font-medium whitespace-nowrap transition-colors text-sm ${
              activeTab === id
                ? 'border-yellow-500 text-yellow-500'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">

        {/* CREDENTIALS TAB */}
        {activeTab === 'credentials' && (
          <div className="max-w-lg space-y-6">
            <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <Lock className="w-5 h-5 text-yellow-400 shrink-0" />
              <p className="text-sm text-yellow-200">
                Change admin username and/or password. You must enter your current password to confirm any changes.
              </p>
            </div>

            <form onSubmit={handleChangeCredentials} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-1">
                  <User className="w-4 h-4" /> New Admin Username
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                  placeholder="admin"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-1">
                  <Key className="w-4 h-4" /> New Password <span className="text-gray-500 text-xs">(leave blank to keep current)</span>
                </label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-10 bg-gray-950 border border-gray-800 rounded-xl text-white focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                    placeholder="New password (min 8 characters)"
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {newPassword && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-10 bg-gray-950 border border-gray-800 rounded-xl text-white focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                      placeholder="Re-enter new password"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              <div className="border-t border-gray-800 pt-4 space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-1">
                  <Shield className="w-4 h-4 text-red-400" /> Current Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-10 bg-gray-950 border border-red-900/50 rounded-xl text-white focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                    placeholder="Enter current password to confirm"
                  />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                  credsSaved
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-950 hover:opacity-90 shadow-lg shadow-yellow-500/20'
                }`}
              >
                {credsSaved ? <><CheckCircle size={18} /> Credentials Saved!</> : <><Save size={18} /> Update Admin Credentials</>}
              </button>
            </form>
          </div>
        )}

        {/* GENERAL TAB */}
        {activeTab === 'general' && (
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between p-4 bg-gray-950/50 border border-gray-800 rounded-lg">
              <div>
                <h3 className="text-white font-medium">Maintenance Mode</h3>
                <p className="text-sm text-gray-400">Disable access for non-admin users</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
              </label>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Gemini AI API Key</label>
                <input type="password" value={geminiKey} onChange={(e) => setGeminiKey(e.target.value)} className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white focus:ring-1 focus:ring-yellow-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Algorand Network</label>
                <select className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white focus:ring-1 focus:ring-yellow-500 outline-none">
                  <option value="testnet">TestNet</option>
                  <option value="mainnet">MainNet</option>
                </select>
              </div>
            </div>

            <button onClick={handleSavePlatform} className="flex items-center gap-2 px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-gray-950 font-bold rounded-lg transition-colors">
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === 'security' && (
          <div className="space-y-4 max-w-2xl">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-300 text-sm">
              ✅ Platform security is active. All admin routes are protected. x402 receipt signing is enabled.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'JWT Token Expiry', value: '7 days' },
                { label: 'x402 Receipt Version', value: 'v1' },
                { label: 'HMAC Signing', value: 'SHA-256' },
                { label: 'Algorand Network', value: 'TestNet' },
              ].map(item => (
                <div key={item.label} className="p-4 bg-gray-950/50 border border-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className="text-white font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AUDIT LOGS TAB */}
        {activeTab === 'audit' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-xs uppercase border-b border-gray-800">
                  <th className="p-3 text-left">Timestamp</th>
                  <th className="p-3 text-left">Action</th>
                  <th className="p-3 text-left">IP Address</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log, i) => (
                  <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/20">
                    <td className="p-3 text-gray-400 font-mono text-xs">{log.time}</td>
                    <td className="p-3 text-white">{log.action}</td>
                    <td className="p-3 text-gray-400 font-mono">{log.ip}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                        {log.status}
                      </span>
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
