import {
  callReadOnlyFunction,
  broadcastTransaction,
  makeContractCall,
  AnchorMode,
  PostConditionMode,
  standardPrincipalCV,
  uintCV,
  listCV,
  bufferCV,
} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { CONTRACTS } from './constants';
import config from '@/lib/config/client';

const network = config.stacksNetwork;

// Vault Manager Contract Calls

export async function createVault(senderAddress: string, riskTier: number) {
  const txOptions = {
    contractAddress: CONTRACTS.VAULT_MANAGER.split('.')[0],
    contractName: CONTRACTS.VAULT_MANAGER.split('.')[1],
    functionName: 'create-vault',
    functionArgs: [uintCV(riskTier)],
    senderKey: senderAddress,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
  };

  return makeContractCall(txOptions);
}

export async function depositToVault(
  senderAddress: string,
  vaultId: number,
  amount: number
) {
  const txOptions = {
    contractAddress: CONTRACTS.VAULT_MANAGER.split('.')[0],
    contractName: CONTRACTS.VAULT_MANAGER.split('.')[1],
    functionName: 'deposit',
    functionArgs: [uintCV(vaultId), uintCV(amount)],
    senderKey: senderAddress,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
  };

  return makeContractCall(txOptions);
}

export async function withdrawFromVault(
  senderAddress: string,
  vaultId: number,
  shares: number
) {
  const txOptions = {
    contractAddress: CONTRACTS.VAULT_MANAGER.split('.')[0],
    contractName: CONTRACTS.VAULT_MANAGER.split('.')[1],
    functionName: 'withdraw',
    functionArgs: [uintCV(vaultId), uintCV(shares)],
    senderKey: senderAddress,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
  };

  return makeContractCall(txOptions);
}

export async function compoundRewards(senderAddress: string, vaultId: number) {
  const txOptions = {
    contractAddress: CONTRACTS.VAULT_MANAGER.split('.')[0],
    contractName: CONTRACTS.VAULT_MANAGER.split('.')[1],
    functionName: 'compound-rewards',
    functionArgs: [uintCV(vaultId)],
    senderKey: senderAddress,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
  };

  return makeContractCall(txOptions);
}

// Reward Distributor Contract Calls

export async function claimRewards(senderAddress: string) {
  const txOptions = {
    contractAddress: CONTRACTS.REWARD_DISTRIBUTOR.split('.')[0],
    contractName: CONTRACTS.REWARD_DISTRIBUTOR.split('.')[1],
    functionName: 'claim-rewards',
    functionArgs: [],
    senderKey: senderAddress,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
  };

  return makeContractCall(txOptions);
}

export async function lockRewards(
  senderAddress: string,
  amount: number,
  lockupPeriod: number
) {
  const txOptions = {
    contractAddress: CONTRACTS.REWARD_DISTRIBUTOR.split('.')[0],
    contractName: CONTRACTS.REWARD_DISTRIBUTOR.split('.')[1],
    functionName: 'lock-rewards',
    functionArgs: [uintCV(amount), uintCV(lockupPeriod)],
    senderKey: senderAddress,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
  };

  return makeContractCall(txOptions);
}

export async function unlockRewards(senderAddress: string, lockId: number) {
  const txOptions = {
    contractAddress: CONTRACTS.REWARD_DISTRIBUTOR.split('.')[0],
    contractName: CONTRACTS.REWARD_DISTRIBUTOR.split('.')[1],
    functionName: 'unlock-rewards',
    functionArgs: [uintCV(lockId)],
    senderKey: senderAddress,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
  };

  return makeContractCall(txOptions);
}

// Read-only Functions

export async function getVaultInfo(vaultId: number) {
  const contractAddress = CONTRACTS.VAULT_MANAGER.split('.')[0];
  const contractName = CONTRACTS.VAULT_MANAGER.split('.')[1];

  try {
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: 'get-vault-info',
      functionArgs: [uintCV(vaultId)],
      network,
      senderAddress: contractAddress,
    });

    return result;
  } catch (error) {
    console.error('Error fetching vault info:', error);
    return null;
  }
}

export async function getUserPosition(userAddress: string, vaultId: number) {
  const contractAddress = CONTRACTS.VAULT_MANAGER.split('.')[0];
  const contractName = CONTRACTS.VAULT_MANAGER.split('.')[1];

  try {
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: 'get-user-position',
      functionArgs: [standardPrincipalCV(userAddress), uintCV(vaultId)],
      network,
      senderAddress: contractAddress,
    });

    return result;
  } catch (error) {
    console.error('Error fetching user position:', error);
    return null;
  }
}

export async function getUserRewards(userAddress: string) {
  const contractAddress = CONTRACTS.REWARD_DISTRIBUTOR.split('.')[0];
  const contractName = CONTRACTS.REWARD_DISTRIBUTOR.split('.')[1];

  try {
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: 'get-user-rewards',
      functionArgs: [standardPrincipalCV(userAddress)],
      network,
      senderAddress: contractAddress,
    });

    return result;
  } catch (error) {
    console.error('Error fetching user rewards:', error);
    return null;
  }
}

export async function getTotalTVL() {
  const contractAddress = CONTRACTS.VAULT_MANAGER.split('.')[0];
  const contractName = CONTRACTS.VAULT_MANAGER.split('.')[1];

  try {
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: 'get-total-tvl',
      functionArgs: [],
      network,
      senderAddress: contractAddress,
    });

    return result;
  } catch (error) {
    console.error('Error fetching TVL:', error);
    return null;
  }
}

export async function calculateWithdrawableAmount(
  userAddress: string,
  vaultId: number
) {
  const contractAddress = CONTRACTS.VAULT_MANAGER.split('.')[0];
  const contractName = CONTRACTS.VAULT_MANAGER.split('.')[1];

  try {
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: 'calculate-withdrawable-amount',
      functionArgs: [standardPrincipalCV(userAddress), uintCV(vaultId)],
      network,
      senderAddress: contractAddress,
    });

    return result;
  } catch (error) {
    console.error('Error calculating withdrawable amount:', error);
    return null;
  }
}
