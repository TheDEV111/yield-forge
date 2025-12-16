'use client';

import { useWallet } from '@/hooks/wallet';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut } from 'lucide-react';

export function WalletConnect() {
  const { isConnected, data, connect, disconnect } = useWallet();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  if (isConnected && data?.address) {
    return (
      <div className="flex items-center gap-2">
        <div className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-sm font-mono text-green-400">
            {data.address.slice(0, 6)}...{data.address.slice(-4)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Button onClick={handleConnect} className="gap-2">
      <Wallet className="w-4 h-4" />
      Connect Wallet
    </Button>
  );
}
