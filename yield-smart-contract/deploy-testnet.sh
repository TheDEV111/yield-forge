#!/bin/bash

# YieldForge Testnet Deployment Script
set -e

echo "=================================="
echo "YieldForge Testnet Deployment"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

DEPLOYER_ADDRESS="STVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2BKDND68"

echo -e "${BLUE}Deployer Address:${NC} $DEPLOYER_ADDRESS"
echo ""

# Check if deployment plan exists
if [ ! -f "deployments/default.testnet-plan.yaml" ]; then
    echo -e "${YELLOW}Generating deployment plan...${NC}"
    clarinet deployments generate --testnet --medium-cost
    echo -e "${GREEN}✓ Deployment plan generated${NC}"
    echo ""
fi

# Display deployment summary
echo -e "${BLUE}Contracts to deploy:${NC}"
echo "  1. vault-manager.clar"
echo "  2. strategy-router.clar"
echo "  3. reward-distributor.clar"
echo ""

echo -e "${BLUE}Estimated Cost:${NC} ~0.5 STX"
echo ""

# Check if user wants to proceed
read -p "Ready to deploy to testnet? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${YELLOW}Deploying contracts...${NC}"
    echo ""
    
    # Deploy using Clarinet
    clarinet deployments apply -p deployments/default.testnet-plan.yaml
    
    echo ""
    echo -e "${GREEN}=================================="
    echo "Deployment Complete!"
    echo -e "==================================${NC}"
    echo ""
    echo -e "${BLUE}View your contracts on the explorer:${NC}"
    echo "https://explorer.hiro.so/address/$DEPLOYER_ADDRESS?chain=testnet"
    echo ""
    echo -e "${BLUE}Contract identifiers:${NC}"
    echo "  vault-manager: $DEPLOYER_ADDRESS.vault-manager"
    echo "  strategy-router: $DEPLOYER_ADDRESS.strategy-router"
    echo "  reward-distributor: $DEPLOYER_ADDRESS.reward-distributor"
    echo ""
else
    echo ""
    echo "Deployment cancelled."
    exit 0
fi
