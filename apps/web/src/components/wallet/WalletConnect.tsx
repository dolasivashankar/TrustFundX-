'use client';
import { useState, useEffect, useRef } from 'react';
import { Wallet, LogOut, Copy, ExternalLink, ChevronDown } from 'lucide-react';
import { GoldButton } from '@/components/ui/GoldButton';
import { formatAlgo, truncateAddress } from '@/lib/utils';
import toast from 'react-hot-toast';

export function WalletConnect() {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(150.75);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const syncWalletState = () => {
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress) {
      setAddress(storedAddress);
      const storedBal = localStorage.getItem('walletBalance');
      if (storedBal) {
        setBalance(Number(storedBal));
      } else {
        localStorage.setItem('walletBalance', '150.75');
        setBalance(150.75);
      }
    } else {
      setAddress(null);
    }
  };

  useEffect(() => {
    syncWalletState();

    const handleUpdate = () => syncWalletState();
    window.addEventListener('trustfundx_data_updated', handleUpdate);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('trustfundx_data_updated', handleUpdate);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const connectWallet = () => {
    const mockAddress = 'HXV7A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0';
    setAddress(mockAddress);
    const initialBal = Number(localStorage.getItem('walletBalance') || '150.75');
    setBalance(initialBal);
    localStorage.setItem('walletAddress', mockAddress);
    localStorage.setItem('walletBalance', initialBal.toString());
    window.dispatchEvent(new Event('trustfundx_data_updated'));
    toast.success('Algorand wallet connected!');
  };

  const disconnectWallet = () => {
    setAddress(null);
    setBalance(0);
    localStorage.removeItem('walletAddress');
    setIsOpen(false);
    window.dispatchEvent(new Event('trustfundx_data_updated'));
    toast.success('Wallet disconnected');
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success('Address copied');
      setIsOpen(false);
    }
  };

  if (!address) {
    return (
      <GoldButton onClick={connectWallet} variant="outline" className="w-full flex items-center justify-center gap-2 text-xs font-bold py-2.5">
        <Wallet size={16} /> Connect Algorand Wallet
      </GoldButton>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2 bg-zinc-900/90 border border-amber-500/30 hover:border-amber-500/60 rounded-xl text-white transition-colors gap-3 cursor-pointer shadow-sm"
      >
        <div className="flex items-center gap-2">
          <Wallet size={16} className="text-amber-400" />
          <span className="font-mono text-xs font-semibold">{truncateAddress(address)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-amber-300">{balance.toFixed(2)} ALGO</span>
          <ChevronDown size={14} className="text-zinc-400" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 w-72 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="p-4 border-b border-zinc-800 bg-black/40">
            <p className="text-xs text-zinc-400 mb-1 font-semibold">Connected Algorand Account</p>
            <div className="flex items-center justify-between">
              <code className="text-xs text-amber-300 font-mono truncate mr-2">{address}</code>
              <div className="flex shrink-0 gap-1">
                <button onClick={copyAddress} className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800 rounded transition-colors" title="Copy">
                  <Copy size={14} />
                </button>
                <a href={`https://testnet.algoexplorer.io/address/${address}`} target="_blank" rel="noreferrer" className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800 rounded transition-colors" title="View on Explorer">
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-zinc-800 flex justify-between items-center text-xs">
              <span className="text-zinc-400">TestNet Balance</span>
              <span className="text-amber-400 font-bold text-sm">{balance.toFixed(2)} ALGO</span>
            </div>
          </div>
          
          <button
            onClick={disconnectWallet}
            className="w-full flex items-center gap-2 px-4 py-3 text-xs text-red-400 hover:bg-zinc-800 transition-colors font-semibold cursor-pointer"
          >
            <LogOut size={16} /> Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
}
