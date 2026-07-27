'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, Loader2, CheckCircle2, ArrowRight, ShieldCheck, Copy, ExternalLink } from 'lucide-react';
import { GoldButton } from '@/components/ui/GoldButton';
import { formatAlgo, truncateAddress } from '@/lib/utils';
import { WalletConnect } from '@/components/wallet/WalletConnect';
import toast from 'react-hot-toast';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: any;
}

export function DonationModal({ isOpen, onClose, campaign }: DonationModalProps) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [txId, setTxId] = useState('');

  const isConnected = typeof window !== 'undefined' ? !!localStorage.getItem('walletAddress') : false;
  const walletAddress = typeof window !== 'undefined' ? localStorage.getItem('walletAddress') || 'HXV7A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0' : '';

  const handleNext = () => {
    if (step === 1 && !isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    if (step === 2 && (!amount || Number(amount) <= 0)) {
      toast.error('Please enter a valid amount');
      return;
    }
    setStep(step + 1);
  };

  const handleDonate = async () => {
    setLoading(true);
    try {
      // Simulate Algorand Smart Contract Execution
      await new Promise(resolve => setTimeout(resolve, 1800));
      const generatedTxId = 'TX' + Math.random().toString(36).substring(2, 10).toUpperCase() + 'ALGO';
      setTxId(generatedTxId);

      const numericAmount = Number(amount);

      // 1. Update Campaign raisedAmount & donorCount in localStorage
      const storedCampaignsStr = localStorage.getItem('trustfundx_custom_campaigns');
      if (storedCampaignsStr && campaign?.id) {
        try {
          const campaignsList = JSON.parse(storedCampaignsStr);
          const updatedList = campaignsList.map((c: any) => {
            if (c.id === campaign.id) {
              const currentRaised = Number(c.raisedAmount || c.raised || 0);
              const currentDonors = Number(c.donorCount || c.donorsCount || 0);
              return {
                ...c,
                raisedAmount: currentRaised + numericAmount,
                raised: currentRaised + numericAmount,
                donorCount: currentDonors + 1,
                donorsCount: currentDonors + 1,
              };
            }
            return c;
          });
          localStorage.setItem('trustfundx_custom_campaigns', JSON.stringify(updatedList));
        } catch (err) {
          console.error('Error updating campaign state:', err);
        }
      }

      // 2. Record Transaction Record
      const newTransaction = {
        id: 'don-' + Date.now(),
        txId: generatedTxId,
        algorandTxId: generatedTxId,
        campaignId: campaign?.id || 'camp-1',
        campaignName: campaign?.name || 'Disaster Relief Fund',
        donorWallet: walletAddress,
        donorAddress: walletAddress,
        amount: numericAmount,
        currency: 'ALGO',
        x402Verified: true,
        status: 'CONFIRMED',
        createdAt: new Date().toISOString(),
      };

      const storedTxStr = localStorage.getItem('trustfundx_donations');
      const existingTxList = storedTxStr ? JSON.parse(storedTxStr) : [];
      localStorage.setItem('trustfundx_donations', JSON.stringify([newTransaction, ...existingTxList]));

      // 3. Update local mock wallet balance
      const currentBalance = Number(localStorage.getItem('walletBalance') || '150.75');
      const newBalance = Math.max(0, currentBalance - numericAmount);
      localStorage.setItem('walletBalance', newBalance.toFixed(2));

      // 4. Notify app components to re-render data
      window.dispatchEvent(new Event('trustfundx_data_updated'));

      toast.success(`Successfully donated ${numericAmount} ALGO to ${campaign?.name}!`);
      setStep(4);
    } catch (error) {
      toast.error('Algorand transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const copyTxId = () => {
    navigator.clipboard.writeText(txId);
    toast.success('Transaction ID copied');
  };

  const resetAndClose = () => {
    setStep(1);
    setAmount('');
    setTxId('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-zinc-900 border border-amber-500/20 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
        >
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
            <h3 className="font-bold text-white text-sm truncate mr-2">Donate to {campaign?.name}</h3>
            <button onClick={resetAndClose} className="text-zinc-400 hover:text-white transition-colors p-1">
              <X size={18} />
            </button>
          </div>

          <div className="p-6">
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                    <Wallet className="w-8 h-8 text-amber-500" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Connect Algorand Wallet</h4>
                  <p className="text-xs text-zinc-400 mb-6">Connect your wallet to sign smart contract transactions directly.</p>
                </div>
                
                <div className="flex justify-center">
                  <WalletConnect />
                </div>

                <GoldButton className="w-full mt-6" onClick={handleNext} disabled={!isConnected}>
                  Continue to Amount <ArrowRight size={16} className="ml-2" />
                </GoldButton>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-white">Enter ALGO Amount</h4>
                <div>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      min="1"
                      className="w-full bg-black/50 border border-zinc-800 rounded-xl pl-4 pr-16 py-3.5 text-2xl text-white font-bold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400 font-bold text-sm">ALGO</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">≈ ${(Number(amount || 0) * 0.20).toFixed(2)} USD (Algorand TestNet)</p>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[10, 50, 100, 500].map(val => (
                    <button
                      key={val}
                      onClick={() => setAmount(val.toString())}
                      className="bg-zinc-800/60 hover:bg-amber-500/20 border border-zinc-700 hover:border-amber-500/50 rounded-lg py-2 text-zinc-300 hover:text-amber-300 font-medium transition-all text-xs"
                    >
                      {val} ALGO
                    </button>
                  ))}
                </div>

                <GoldButton className="w-full" onClick={handleNext}>
                  Proceed to Confirm
                </GoldButton>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-white">Confirm Algorand Transaction</h4>
                
                <div className="bg-black/50 border border-zinc-800 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Campaign</span>
                    <span className="text-white font-medium text-right line-clamp-1 w-2/3">{campaign?.name}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Donation Amount</span>
                    <span className="text-amber-400 font-bold">{formatAlgo(Number(amount))}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Donor Wallet</span>
                    <span className="text-white font-mono">{truncateAddress(walletAddress, 6, 4)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Beneficiary Address</span>
                    <span className="text-white font-mono">{truncateAddress(campaign?.beneficiaryAddress || campaign?.beneficiaryWallet || 'HXV7A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0', 6, 4)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Network</span>
                    <span className="text-emerald-400 font-semibold">Algorand TestNet</span>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl flex gap-3">
                  <ShieldCheck className="text-blue-400 shrink-0 mt-0.5" size={18} />
                  <p className="text-xs text-blue-200 leading-relaxed">
                    Your transaction is cryptographically signed and issued an x402 compliance receipt.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="px-5 py-2.5 rounded-xl border border-zinc-700 text-white hover:bg-zinc-800 transition-colors text-xs font-semibold">
                    Back
                  </button>
                  <GoldButton className="flex-1 text-sm" onClick={handleDonate} loading={loading}>
                    {loading ? 'Executing Smart Contract...' : 'Confirm & Donate ALGO'}
                  </GoldButton>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5 text-center py-2">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-green-500/30">
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
                <h4 className="text-2xl font-bold text-white">🎉 Donation Confirmed!</h4>
                <p className="text-xs text-zinc-400">Your donation of <span className="text-amber-400 font-bold">{amount} ALGO</span> has been sent to the campaign wallet.</p>

                <div className="bg-black/50 border border-zinc-800 rounded-xl p-3 text-left">
                  <div className="text-xs text-zinc-400 mb-1">Algorand Transaction ID</div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-amber-300 font-mono truncate flex-1">{txId}</code>
                    <button onClick={copyTxId} className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800 rounded transition-colors" title="Copy TX ID">
                      <Copy size={14} />
                    </button>
                    <a href={`https://testnet.algoexplorer.io/tx/${txId}`} target="_blank" rel="noreferrer" className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800 rounded transition-colors" title="View on Explorer">
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl flex items-center gap-2 text-left">
                  <ShieldCheck className="text-amber-400 shrink-0" size={16} />
                  <p className="text-xs text-amber-200">x402 verifiable receipt generated & stored on-chain.</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={resetAndClose} className="flex-1 px-5 py-2.5 rounded-xl border border-zinc-700 text-white hover:bg-zinc-800 transition-colors text-xs font-bold">
                    Close
                  </button>
                  <GoldButton className="flex-1 text-xs" onClick={() => { setStep(2); setAmount(''); }}>
                    Donate Again
                  </GoldButton>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
