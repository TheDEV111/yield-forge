# YieldForge Testnet Deployment Plan

## Deployment Order
1. vault-manager.clar
2. strategy-router.clar  
3. reward-distributor.clar

## Deployment Requirements

### Prerequisites
- Testnet STX in deployer wallet
- Stacks CLI installed
- Network connectivity to testnet

### Deployer Address
Generate from mnemonic in settings/Testnet.toml

### Estimated Costs
- vault-manager: ~0.5-1 STX
- strategy-router: ~0.6-1.2 STX
- reward-distributor: ~0.7-1.5 STX
- **Total**: ~2-4 STX

## Deployment Commands

### Option 1: Using Clarinet Deploy
```bash
clarinet deployments generate --testnet
clarinet deployments apply -p deployments/default.testnet-plan.yaml
```

### Option 2: Manual Deployment
```bash
# Get deployer address
stx-cli keys --testnet

# Deploy contracts
clarinet deploy --testnet
```

## Post-Deployment Steps

1. **Verify Contracts**
   - Check on explorer: https://explorer.hiro.so/?chain=testnet
   - Verify contract addresses

2. **Initialize Contracts**
   - Fund reward pool
   - Register initial protocols
   - Set initial parameters

3. **Test Integration**
   - Create test vault
   - Execute test deposit
   - Verify functionality

## Contract Addresses (to be filled after deployment)
- vault-manager: 
- strategy-router: 
- reward-distributor: 
