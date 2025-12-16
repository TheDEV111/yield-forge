#!/bin/bash

# YieldForge MAINNET Deployment Script
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo -e "${RED}=================================="
echo "⚠️  MAINNET DEPLOYMENT WARNING ⚠️"
echo -e "==================================${NC}"
echo ""
echo -e "${YELLOW}You are about to deploy to STACKS MAINNET with REAL STX${NC}"
echo ""

# Get deployer address from mainnet config
DEPLOYER_ADDRESS=$(grep -A 10 "\[accounts.deployer\]" settings/Mainnet.toml | grep "mnemonic" | head -1)

echo -e "${BLUE}Pre-Deployment Checklist:${NC}"
echo "  ⚠️  Security audit completed?"
echo "  ⚠️  All testnet tests passing?"
echo "  ⚠️  You have 5-10 STX for deployment?"
echo "  ⚠️  Mainnet wallet properly secured?"
echo "  ⚠️  Emergency procedures documented?"
echo "  ⚠️  Multi-sig setup ready?"
echo ""

echo -e "${BLUE}Deployment Details:${NC}"
echo "  Network: Stacks Mainnet"
echo "  Estimated Cost: ~5-10 STX"
echo "  Contracts: 3 (vault-manager, strategy-router, reward-distributor)"
echo ""

echo -e "${RED}THIS WILL USE REAL STX AND CANNOT BE UNDONE${NC}"
echo ""

read -p "Type 'DEPLOY TO MAINNET' to confirm: " CONFIRMATION

if [ "$CONFIRMATION" != "DEPLOY TO MAINNET" ]; then
    echo ""
    echo -e "${YELLOW}Deployment cancelled. Good choice to be cautious!${NC}"
    exit 0
fi

echo ""
echo -e "${YELLOW}Final confirmation...${NC}"
read -p "Are you ABSOLUTELY sure? (yes/no): " FINAL_CONFIRM

if [ "$FINAL_CONFIRM" != "yes" ]; then
    echo ""
    echo -e "${YELLOW}Deployment cancelled.${NC}"
    exit 0
fi

echo ""
echo -e "${GREEN}Proceeding with mainnet deployment...${NC}"
echo ""

# Check if deployment plan exists
if [ ! -f "deployments/default.mainnet-plan.yaml" ]; then
    echo -e "${YELLOW}Generating mainnet deployment plan...${NC}"
    clarinet deployments generate --mainnet --medium-cost
fi

# Execute deployment
echo -e "${YELLOW}Deploying to mainnet...${NC}"
clarinet deployments apply -p deployments/default.mainnet-plan.yaml

echo ""
echo -e "${GREEN}=================================="
echo "✅ MAINNET DEPLOYMENT COMPLETE!"
echo -e "==================================${NC}"
echo ""
echo -e "${BLUE}IMPORTANT: Save these contract identifiers!${NC}"
echo ""
echo "View your contracts on the explorer:"
echo "https://explorer.hiro.so/?chain=mainnet"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Verify contracts on explorer"
echo "  2. Initialize with production parameters"
echo "  3. Set up monitoring and alerts"
echo "  4. Test with small amounts first"
echo "  5. Gradually increase limits"
echo ""
