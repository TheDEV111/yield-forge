// Contract addresses on mainnet
export const CONTRACTS = {
  VAULT_MANAGER: 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.vault-manager',
  STRATEGY_ROUTER: 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.strategy-router',
  REWARD_DISTRIBUTOR: 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.reward-distributor',
} as const;

// Risk tiers
export const RISK_TIERS = {
  CONSERVATIVE: 1,
  BALANCED: 2,
  AGGRESSIVE: 3,
} as const;

// Minimum deposit (100 STX)
export const MIN_DEPOSIT = 100_000_000; // in microSTX

// Fee constants (in basis points)
export const FEES = {
  DEPOSIT: 30, // 0.3%
  WITHDRAWAL: 50, // 0.5%
  PERFORMANCE: 1500, // 15%
  CLAIM: 100, // 1%
} as const;

// Lockup periods (in blocks)
export const LOCKUP_PERIODS = {
  NONE: 0,
  THREE_MONTHS: 13140,
  SIX_MONTHS: 26280,
  TWELVE_MONTHS: 52560,
} as const;

// Multipliers
export const MULTIPLIERS = {
  NONE: '1x',
  THREE_MONTHS: '1.5x',
  SIX_MONTHS: '2x',
  TWELVE_MONTHS: '3x',
} as const;

// Helper functions
export function microToStx(micro: number): number {
  return micro / 1_000_000;
}

export function stxToMicro(stx: number): number {
  return Math.floor(stx * 1_000_000);
}

export function formatStx(micro: number): string {
  return `${microToStx(micro).toLocaleString(undefined, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 6 
  })} STX`;
}

export function calculateFee(amount: number, feeBp: number): number {
  const fee = Math.floor((amount * feeBp) / 10000);
  return Math.max(fee, 1_000_000); // Minimum 1 STX
}

export function getRiskTierName(tier: number): string {
  switch (tier) {
    case RISK_TIERS.CONSERVATIVE:
      return 'Conservative';
    case RISK_TIERS.BALANCED:
      return 'Balanced';
    case RISK_TIERS.AGGRESSIVE:
      return 'Aggressive';
    default:
      return 'Unknown';
  }
}

export function getRiskTierDescription(tier: number): string {
  switch (tier) {
    case RISK_TIERS.CONSERVATIVE:
      return 'Lower risk, stable returns. Focus on established protocols.';
    case RISK_TIERS.BALANCED:
      return 'Moderate risk, balanced returns. Mix of stable and growth strategies.';
    case RISK_TIERS.AGGRESSIVE:
      return 'Higher risk, maximum returns. Active rebalancing across protocols.';
    default:
      return '';
  }
}
