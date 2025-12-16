'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWallet } from '@/hooks/wallet';
import { openContractCall } from '@stacks/connect';
import { 
  LOCKUP_PERIODS,
  MULTIPLIERS,
  microToStx,
  formatStx,
  FEES,
} from '@/lib/contracts/constants';
import { Gift, Lock, Unlock } from 'lucide-react';

export function RewardsPanel() {
  const { isConnected, data } = useWallet();
  const [loading, setLoading] = useState(false);
  const [lockAmount, setLockAmount] = useState('');
  const [lockPeriod, setLockPeriod] = useState(LOCKUP_PERIODS.THREE_MONTHS);
  const [unlockId, setUnlockId] = useState('');

  const handleClaimRewards = async () => {
    if (!isConnected || !data?.address) return;

    setLoading(true);
    try {
      await openContractCall({
        contractAddress: 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F',
        contractName: 'reward-distributor',
        functionName: 'claim-rewards',
        functionArgs: [],
        onFinish: (data) => {
          console.log('Claim transaction:', data);
          alert('Claim submitted! Check your wallet for confirmation.');
        },
        onCancel: () => {
          console.log('Transaction cancelled');
        },
      });
    } catch (error) {
      console.error('Error claiming rewards:', error);
      alert('Failed to claim. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLockRewards = async () => {
    if (!isConnected || !data?.address || !lockAmount) return;

    setLoading(true);
    try {
      await openContractCall({
        contractAddress: 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F',
        contractName: 'reward-distributor',
        functionName: 'lock-rewards',
        functionArgs: [`u${lockAmount}`, `u${lockPeriod}`],
        onFinish: (data) => {
          console.log('Lock transaction:', data);
          alert('Lock submitted! Check your wallet for confirmation.');
        },
        onCancel: () => {
          console.log('Transaction cancelled');
        },
      });
    } catch (error) {
      console.error('Error locking rewards:', error);
      alert('Failed to lock. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockRewards = async () => {
    if (!isConnected || !data?.address || !unlockId) return;

    setLoading(true);
    try {
      await openContractCall({
        contractAddress: 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F',
        contractName: 'reward-distributor',
        functionName: 'unlock-rewards',
        functionArgs: [`u${unlockId}`],
        onFinish: (data) => {
          console.log('Unlock transaction:', data);
          alert('Unlock submitted! Check your wallet for confirmation.');
        },
        onCancel: () => {
          console.log('Transaction cancelled');
        },
      });
    } catch (error) {
      console.error('Error unlocking rewards:', error);
      alert('Failed to unlock. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const lockupOptions = [
    { period: LOCKUP_PERIODS.THREE_MONTHS, label: '3 Months', multiplier: MULTIPLIERS.THREE_MONTHS },
    { period: LOCKUP_PERIODS.SIX_MONTHS, label: '6 Months', multiplier: MULTIPLIERS.SIX_MONTHS },
    { period: LOCKUP_PERIODS.TWELVE_MONTHS, label: '12 Months', multiplier: MULTIPLIERS.TWELVE_MONTHS },
  ];

  return (
    <Card className="p-6 bg-gray-900/50 border-gray-800">
      <h2 className="text-2xl font-bold mb-4">Rewards Management</h2>

      {/* Claim Rewards */}
      <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Gift className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold">Claim Rewards</h3>
        </div>
        
        <p className="text-sm text-gray-400 mb-3">
          Claim your earned rewards (1% fee applies)
        </p>

        <Button
          onClick={handleClaimRewards}
          disabled={!isConnected || loading}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {loading ? 'Processing...' : 'Claim Rewards'}
        </Button>
      </div>

      {/* Lock Rewards */}
      <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Lock className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold">Lock for Multiplier</h3>
        </div>
        
        <p className="text-sm text-gray-400 mb-3">
          Lock rewards to earn bonus multipliers
        </p>

        <label className="block text-sm font-medium mb-2">Amount (microSTX)</label>
        <Input
          type="number"
          value={lockAmount}
          onChange={(e) => setLockAmount(e.target.value)}
          placeholder="Enter amount"
          className="bg-gray-800 border-gray-700 mb-3"
        />

        <label className="block text-sm font-medium mb-2">Lockup Period</label>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {lockupOptions.map((option) => (
            <button
              key={option.period}
              onClick={() => setLockPeriod(option.period)}
              className={`p-2 rounded border-2 transition-all ${
                lockPeriod === option.period
                  ? 'bg-purple-500/20 border-purple-500/50'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="text-sm font-medium">{option.label}</div>
              <div className="text-xs text-purple-400">{option.multiplier}</div>
            </button>
          ))}
        </div>

        <Button
          onClick={handleLockRewards}
          disabled={!isConnected || loading || !lockAmount}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {loading ? 'Processing...' : 'Lock Rewards'}
        </Button>
      </div>

      {/* Unlock Rewards */}
      <div className="p-4 bg-gray-800/50 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Unlock className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-semibold">Unlock Rewards</h3>
        </div>
        
        <p className="text-sm text-gray-400 mb-3">
          Unlock rewards after lockup period expires
        </p>

        <label className="block text-sm font-medium mb-2">Lock ID</label>
        <Input
          type="number"
          value={unlockId}
          onChange={(e) => setUnlockId(e.target.value)}
          placeholder="Enter lock ID"
          className="bg-gray-800 border-gray-700 mb-3"
        />

        <Button
          onClick={handleUnlockRewards}
          disabled={!isConnected || loading || !unlockId}
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          {loading ? 'Processing...' : 'Unlock Rewards'}
        </Button>
      </div>

      {!isConnected && (
        <p className="text-sm text-gray-400 text-center mt-4">
          Connect your wallet to manage rewards
        </p>
      )}
    </Card>
  );
}
