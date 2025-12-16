'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWallet } from '@/hooks/wallet';
import { openContractCall } from '@stacks/connect';
import { 
  RISK_TIERS, 
  getRiskTierName, 
  getRiskTierDescription,
  MIN_DEPOSIT,
  stxToMicro,
  microToStx,
  calculateFee,
  FEES,
} from '@/lib/contracts/constants';
import { Shield, TrendingUp, Zap } from 'lucide-react';

export function CreateVault() {
  const { isConnected, data } = useWallet();
  const [selectedRisk, setSelectedRisk] = useState<number>(RISK_TIERS.BALANCED);
  const [loading, setLoading] = useState(false);

  const handleCreateVault = async () => {
    if (!isConnected || !data?.address) return;

    setLoading(true);
    try {
      await openContractCall({
        contractAddress: 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F',
        contractName: 'vault-manager',
        functionName: 'create-vault',
        functionArgs: [`u${selectedRisk}`],
        onFinish: (data) => {
          console.log('Transaction submitted:', data);
          alert('Vault creation submitted! Check your wallet for confirmation.');
        },
        onCancel: () => {
          console.log('Transaction cancelled');
        },
      });
    } catch (error) {
      console.error('Error creating vault:', error);
      alert('Failed to create vault. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const riskTiers = [
    { 
      id: RISK_TIERS.CONSERVATIVE, 
      name: 'Conservative', 
      icon: Shield,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    { 
      id: RISK_TIERS.BALANCED, 
      name: 'Balanced', 
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    { 
      id: RISK_TIERS.AGGRESSIVE, 
      name: 'Aggressive', 
      icon: Zap,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
    },
  ];

  return (
    <Card className="p-6 bg-gray-900/50 border-gray-800">
      <h2 className="text-2xl font-bold mb-4">Create New Vault</h2>
      <p className="text-gray-400 mb-6">
        Select your risk tier to create a new yield optimization vault.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {riskTiers.map((tier) => {
          const Icon = tier.icon;
          const isSelected = selectedRisk === tier.id;
          
          return (
            <button
              key={tier.id}
              onClick={() => setSelectedRisk(tier.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? `${tier.bgColor} ${tier.borderColor}`
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
              }`}
            >
              <Icon className={`w-8 h-8 mb-2 ${isSelected ? tier.color : 'text-gray-400'}`} />
              <h3 className="font-semibold mb-1">{tier.name}</h3>
              <p className="text-sm text-gray-400">
                {getRiskTierDescription(tier.id)}
              </p>
            </button>
          );
        })}
      </div>

      <Button
        onClick={handleCreateVault}
        disabled={!isConnected || loading}
        className="w-full"
      >
        {loading ? 'Creating...' : 'Create Vault'}
      </Button>

      {!isConnected && (
        <p className="text-sm text-gray-400 text-center mt-4">
          Connect your wallet to create a vault
        </p>
      )}
    </Card>
  );
}
