'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWallet } from '@/hooks/wallet';
import { openContractCall } from '@stacks/connect';
import { 
  MIN_DEPOSIT,
  stxToMicro,
  microToStx,
  calculateFee,
  FEES,
  formatStx,
} from '@/lib/contracts/constants';
import { ArrowDown, ArrowUp, RefreshCw } from 'lucide-react';

export function VaultActions() {
  const { isConnected, data } = useWallet();
  const [vaultId, setVaultId] = useState('1');
  const [depositAmount, setDepositAmount] = useState('100');
  const [withdrawShares, setWithdrawShares] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    if (!isConnected || !data?.address) return;

    const amountMicro = stxToMicro(Number(depositAmount));
    
    if (amountMicro < MIN_DEPOSIT) {
      alert(`Minimum deposit is ${microToStx(MIN_DEPOSIT)} STX`);
      return;
    }

    setLoading(true);
    try {
      await openContractCall({
        contractAddress: 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F',
        contractName: 'vault-manager',
        functionName: 'deposit',
        functionArgs: [`u${vaultId}`, `u${amountMicro}`],
        postConditions: [],
        onFinish: (data) => {
          console.log('Deposit transaction:', data);
          alert('Deposit submitted! Check your wallet for confirmation.');
        },
        onCancel: () => {
          console.log('Transaction cancelled');
        },
      });
    } catch (error) {
      console.error('Error depositing:', error);
      alert('Failed to deposit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!isConnected || !data?.address) return;

    setLoading(true);
    try {
      await openContractCall({
        contractAddress: 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F',
        contractName: 'vault-manager',
        functionName: 'withdraw',
        functionArgs: [`u${vaultId}`, `u${withdrawShares}`],
        onFinish: (data) => {
          console.log('Withdraw transaction:', data);
          alert('Withdrawal submitted! Check your wallet for confirmation.');
        },
        onCancel: () => {
          console.log('Transaction cancelled');
        },
      });
    } catch (error) {
      console.error('Error withdrawing:', error);
      alert('Failed to withdraw. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompound = async () => {
    if (!isConnected || !data?.address) return;

    setLoading(true);
    try {
      await openContractCall({
        contractAddress: 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F',
        contractName: 'vault-manager',
        functionName: 'compound-rewards',
        functionArgs: [`u${vaultId}`],
        onFinish: (data) => {
          console.log('Compound transaction:', data);
          alert('Compound submitted! Check your wallet for confirmation.');
        },
        onCancel: () => {
          console.log('Transaction cancelled');
        },
      });
    } catch (error) {
      console.error('Error compounding:', error);
      alert('Failed to compound. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const depositFee = calculateFee(stxToMicro(Number(depositAmount) || 0), FEES.DEPOSIT);

  return (
    <Card className="p-6 bg-gray-900/50 border-gray-800">
      <h2 className="text-2xl font-bold mb-4">Vault Operations</h2>

      {/* Vault ID Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Vault ID</label>
        <Input
          type="number"
          value={vaultId}
          onChange={(e) => setVaultId(e.target.value)}
          placeholder="Enter vault ID"
          className="bg-gray-800 border-gray-700"
          min="1"
        />
      </div>

      {/* Deposit Section */}
      <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <ArrowDown className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold">Deposit</h3>
        </div>
        
        <label className="block text-sm font-medium mb-2">Amount (STX)</label>
        <Input
          type="number"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          placeholder="Min 100 STX"
          className="bg-gray-800 border-gray-700 mb-2"
          min="100"
          step="0.000001"
        />
        
        <div className="text-xs text-gray-400 mb-3">
          <p>Fee (0.3%): {formatStx(depositFee)}</p>
          <p>Net deposit: {formatStx(stxToMicro(Number(depositAmount) || 0) - depositFee)}</p>
        </div>

        <Button
          onClick={handleDeposit}
          disabled={!isConnected || loading}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {loading ? 'Processing...' : 'Deposit'}
        </Button>
      </div>

      {/* Withdraw Section */}
      <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <ArrowUp className="w-5 h-5 text-red-400" />
          <h3 className="text-lg font-semibold">Withdraw</h3>
        </div>
        
        <label className="block text-sm font-medium mb-2">Shares to Withdraw</label>
        <Input
          type="number"
          value={withdrawShares}
          onChange={(e) => setWithdrawShares(e.target.value)}
          placeholder="Enter share amount"
          className="bg-gray-800 border-gray-700 mb-3"
          min="1"
        />

        <Button
          onClick={handleWithdraw}
          disabled={!isConnected || loading || !withdrawShares}
          className="w-full bg-red-600 hover:bg-red-700"
        >
          {loading ? 'Processing...' : 'Withdraw'}
        </Button>
      </div>

      {/* Compound Section */}
      <div className="p-4 bg-gray-800/50 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <RefreshCw className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold">Compound Rewards</h3>
        </div>
        
        <p className="text-sm text-gray-400 mb-3">
          Auto-reinvest your earnings (0.2 STX gas fee)
        </p>

        <Button
          onClick={handleCompound}
          disabled={!isConnected || loading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {loading ? 'Processing...' : 'Compound'}
        </Button>
      </div>

      {!isConnected && (
        <p className="text-sm text-gray-400 text-center mt-4">
          Connect your wallet to perform operations
        </p>
      )}
    </Card>
  );
}
