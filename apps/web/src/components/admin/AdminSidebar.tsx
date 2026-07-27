"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, Globe, Heart, ArrowLeftRight, 
  Brain, BarChart2, FileText, Wallet, Settings, 
  Shield, LogOut, X, ShieldAlert 
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  isMobile: boolean;
}

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Campaigns", href: "/admin/campaigns", icon: Globe },
  { name: "Donations", href: "/admin/donations", icon: Heart },
  { name: "Transactions", href: "/admin/transactions", icon: ArrowLeftRight },
  { name: "AI Dashboard", href: "/admin/ai", icon: Brain },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart2 },
  { name: "Reports", href: "/admin/reports", icon: FileText },
  { name: "Wallets", href: "/admin/wallets", icon: Wallet },
];

const bottomNavItems = [
  { name: "Security", href: "/admin/security", icon: ShieldAlert },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ isOpen, setIsOpen, isMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    router.push("/admin");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gray-950 border-r border-gray-800 w-64 shadow-2xl z-50">
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-yellow-500" />
          <span className="text-white font-bold text-lg tracking-tight">Admin Panel</span>
        </div>
        {isMobile && (
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Main Menu</div>
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                active 
                  ? "bg-yellow-500/10 text-yellow-500" 
                  : "text-gray-400 hover:bg-gray-900 hover:text-gray-200"
              }`}
            >
              <item.icon className={`w-5 h-5 ${active ? "text-yellow-500" : "group-hover:text-gray-200"}`} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}

        <div className="mt-8 mb-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">System</div>
        {bottomNavItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                active 
                  ? "bg-yellow-500/10 text-yellow-500" 
                  : "text-gray-400 hover:bg-gray-900 hover:text-gray-200"
              }`}
            >
              <item.icon className={`w-5 h-5 ${active ? "text-yellow-500" : "group-hover:text-gray-200"}`} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-800 shrink-0">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-gray-400 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors group"
        >
          <LogOut className="w-5 h-5 group-hover:text-red-500" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />
        )}
        <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <SidebarContent />
        </div>
      </>
    );
  }

  return isOpen ? <SidebarContent /> : null;
}
