import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAlgo(amount: number): string {
  return `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ALGO`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

export function truncateAddress(address: string, start = 6, end = 4): string {
  if (!address || address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export function getDaysRemaining(expiryDate: string | Date): number {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diff = expiry.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getProgressPercent(raised: number, goal: number): number {
  return Math.min(100, Math.round((raised / goal) * 100));
}

export function getDisasterEmoji(type: string): string {
  const map: Record<string, string> = {
    FLOOD: '🌊', EARTHQUAKE: '🏚️', CYCLONE: '🌀', WILDFIRE: '🔥',
    TSUNAMI: '🌊', LANDSLIDE: '⛰️', PANDEMIC: '🦠', DROUGHT: '☀️',
    VOLCANO: '🌋', HURRICANE: '🌪️', TORNADO: '🌪️', OTHER: '🆘',
  };
  return map[type] || '🆘';
}

export function getDisasterColor(type: string): string {
  const colors: Record<string, string> = {
    FLOOD: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    EARTHQUAKE: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    CYCLONE: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    WILDFIRE: 'text-red-400 bg-red-400/10 border-red-400/20',
    TSUNAMI: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    LANDSLIDE: 'text-yellow-600 bg-yellow-600/10 border-yellow-600/20',
    PANDEMIC: 'text-green-400 bg-green-400/10 border-green-400/20',
    DROUGHT: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    VOLCANO: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
    HURRICANE: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
    TORNADO: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
    OTHER: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
  };
  return colors[type] || colors.OTHER;
}
