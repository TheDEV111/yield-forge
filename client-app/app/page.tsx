import { WalletConnect } from '@/components/wallet-connect';
import { CreateVault } from '@/components/create-vault';
import { VaultActions } from '@/components/vault-actions';
import { RewardsPanel } from '@/components/rewards-panel';
import { Logo } from '@/components/logo';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo className="w-10 h-10" />
              <div>
                <h1 className="text-2xl font-bold text-white">
                  YieldForge
                </h1>
                <p className="text-sm text-gray-400">DeFi Yield Optimization</p>
              </div>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create Vault */}
          <div className="lg:col-span-2">
            <CreateVault />
          </div>

          {/* Vault Operations */}
          <div>
            <VaultActions />
          </div>

          {/* Rewards Management */}
          <div>
            <RewardsPanel />
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">About YieldForge</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
            <div>
              <p className="font-medium text-white mb-1">Risk Tiers</p>
              <p>Choose Conservative (5-8%), Balanced (8-15%), or Aggressive (15%+) strategies</p>
            </div>
            <div>
              <p className="font-medium text-white mb-1">Lockup Multipliers</p>
              <p>Lock rewards for 3/6/12 months to earn 1.5x/2x/3x multipliers</p>
            </div>
            <div>
              <p className="font-medium text-white mb-1">Fees</p>
              <p>0.3% deposit, 0.5% withdrawal, 15% performance, 2% annual management</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-400">
          <p>YieldForge v1.0 - Deployed on Stacks Mainnet</p>
          <p className="mt-1">Contract: SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F</p>
        </div>
      </footer>
    </div>
  );
}
