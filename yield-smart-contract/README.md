# YieldForge - Decentralized Yield Optimization Protocol

A comprehensive Stacks blockchain DeFi protocol that automates yield farming strategies across multiple DeFi protocols with algorithmic rebalancing and fee-efficient routing.

## 🚀 Features

- **Multi-Strategy Vaults**: Support for Conservative, Balanced, and Aggressive risk tiers
- **Automated Rebalancing**: Algorithmic optimization based on APY thresholds
- **Gas-Optimized Routing**: Efficient capital routing across 10+ DeFi protocols
- **Merit-Based Rewards**: Fair distribution based on TVL, activity, and loyalty scores
- **Lockup Multipliers**: Up to 3x rewards for 12-month lockups
- **Referral Program**: 5% bonus on referred user fees
- **Emergency Controls**: Multi-sig pause functionality and emergency withdrawals

## 📋 Smart Contracts

### 1. Vault Manager (`vault-manager.clar`)

Core vault logic managing deposits, withdrawals, and strategy allocation.

**Key Functions:**
- `create-vault` - Initialize a new vault with specified risk tier
- `deposit` - Deposit STX into vault (min 100 STX)
- `withdraw` - Withdraw funds with proportional share calculation
- `compound-rewards` - Auto-reinvest earnings (0.2 STX gas fee)
- `rebalance-vault` - Owner-controlled strategy rebalancing
- `add-strategy` - Register new DeFi strategies (admin only)

**Clarity 4 Features Used:**
- `to-consensus-buff?` for cross-contract communication validation
- Enhanced precision share calculations with optimized arithmetic
- Advanced fold operations for strategy aggregation

**Fee Structure:**
- Deposit fee: 0.3% (minimum 1 STX)
- Withdrawal fee: 0.5% (minimum 1 STX)
- Performance fee: 15% on profits
- Management fee: 2% annually (prorated by blocks)

### 2. Strategy Router (`strategy-router.clar`)

Routes capital to optimal yield sources with gas-optimized execution paths.

**Key Functions:**
- `register-protocol` - Whitelist new DeFi protocols
- `create-route` - Define routing paths between protocols
- `route-capital` - Execute capital rebalancing
- `propose-strategy` - Governance strategy proposals (10 STX stake)
- `vote-on-strategy` - Community voting on strategies
- `request-emergency-withdrawal` - Emergency fund recovery

**Clarity 4 Features Used:**
- `principal-destruct?` for protocol address validation
- `slice?` for efficient data parsing in route optimization
- Multi-trait implementations for protocol integrations

**Fee Structure:**
- Rebalancing fee: 0.1% of moved capital
- Keeper rewards: 0.05% of vault TVL per rebalance
- Flash loan fee: 0.3% for strategy liquidity

### 3. Reward Distributor (`reward-distributor.clar`)

Manages protocol incentives, airdrops, and governance token distribution.

**Key Functions:**
- `distribute-rewards` - Admin reward allocation
- `claim-rewards` - User reward claiming (1% fee)
- `lock-rewards` - Lock tokens for multiplier boost
- `unlock-rewards` / `unlock-early` - Unlock with/without penalty
- `register-referral` - Join referral program
- `claim-airdrop` - Merkle-proof based airdrop claims
- `update-merit-score` - Update user merit calculations

**Clarity 4 Features Used:**
- `buff-to-int-be` concepts for high-precision reward calculations
- `element-at?` for efficient merkle proof verification
- Enhanced map operations for bulk distributions

**Lockup Multipliers:**
- No lockup: 1x rewards
- 3 months: 1.5x rewards
- 6 months: 2x rewards
- 12 months: 3x rewards

**Fee Structure:**
- Claim fee: 1% of distributed rewards
- Early unlock penalty: 30% of locked rewards
- Referral bonus: 5% of referred user fees

## 🧪 Testing

Comprehensive test suites for all three contracts covering:
- Vault creation and management
- Deposit/withdrawal flows
- Fee calculations
- Access control
- Emergency scenarios
- Clarity 4 feature validation

**Run Tests:**
```bash
npm install
npm test
```

## 🔧 Setup & Deployment

### Prerequisites
- [Clarinet](https://github.com/hirosystems/clarinet) v1.0.0+
- Node.js v16+
- Stacks CLI

### Installation

```bash
# Clone the repository
git clone https://github.com/TheDEV111/yield-forge.git
cd yield-forge/yield-smart-contract

# Install dependencies
npm install

# Check contract syntax
clarinet check

# Run tests
clarinet test

# Start local development environment
clarinet integrate
```

### Contract Configuration

Contracts are configured in `Clarinet.toml`:
```toml
[contracts.vault-manager]
path = "contracts/vault-manager.clar"
epoch = "3.0"

[contracts.strategy-router]
path = "contracts/strategy-router.clar"
epoch = "3.0"

[contracts.reward-distributor]
path = "contracts/reward-distributor.clar"
epoch = "3.0"
```

## 📊 Revenue Model

### Target Metrics (Year 1)
- **Users**: 5,000 depositors
- **TVL**: $50M
- **Average APY**: 12%

### Projected Annual Revenue
- Deposit/withdrawal fees: ~200,000 STX
- Performance fees: ~750,000 STX (15% on $5M profit)
- Management fees: ~100,000 STX (2% of TVL)
- **Total**: ~1,050,000 STX annually

## 🔐 Security Features

1. **Multi-sig Governance**: Owner-controlled admin functions
2. **Emergency Pause**: Circuit breaker for all operations
3. **Input Validation**: Comprehensive checks on all user inputs
4. **Reentrancy Protection**: Safe transfer patterns
5. **Minimum Deposits**: 100 STX minimum to prevent spam
6. **Rate Limiting**: Cooldown periods on sensitive operations

## 🎯 Roadmap

### Phase 1 (Q1 2024)
- ✅ Core contracts development
- ✅ Comprehensive test coverage
- ✅ Clarinet compliance
- 🔄 Security audits

### Phase 2 (Q2 2024)
- 🔄 Mainnet deployment
- 🔄 Protocol integrations (10+ DeFi protocols)
- 🔄 Frontend dApp launch
- 🔄 Governance token launch

### Phase 3 (Q3 2024)
- Cross-chain expansion
- Advanced strategies
- Insurance fund
- DAO formation

## 📚 Documentation

### Clarity 4 Features Implemented

1. **to-consensus-buff?** - Used in vault-manager for cross-contract validation
2. **principal-destruct?** - Used in strategy-router for protocol address validation
3. **Enhanced arithmetic operations** - Optimized share and reward calculations
4. **element-at?** - Used in reward-distributor for merkle proof verification
5. **slice?** - Used in strategy-router for data parsing optimization

### Architecture Diagram

```
┌─────────────────────┐
│   User Interface    │
└──────────┬──────────┘
           │
    ┌──────▼──────┐
    │ Vault Mgr   │ ◄──┐
    └──────┬──────┘    │
           │           │
    ┌──────▼──────┐    │
    │ Strategy    │ ───┤
    │ Router      │    │
    └──────┬──────┘    │
           │           │
    ┌──────▼──────┐    │
    │ Reward      │ ───┘
    │ Distributor │
    └─────────────┘
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow Clarity best practices
- Add tests for new features
- Update documentation
- Run `clarinet check` before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Stacks Foundation for the blockchain infrastructure
- Clarity language developers
- DeFi community for inspiration
- Open source contributors

## 📞 Contact

- **Project**: YieldForge
- **Repository**: [github.com/TheDEV111/yield-forge](https://github.com/TheDEV111/yield-forge)
- **Documentation**: [docs.yieldforge.io](https://docs.yieldforge.io)
- **Twitter**: [@YieldForge](https://twitter.com/YieldForge)
- **Discord**: [YieldForge Community](https://discord.gg/yieldforge)

## ⚠️ Disclaimer

This software is provided "as is" without warranty of any kind. Use at your own risk. Always do your own research before interacting with any DeFi protocol.

---

**Built with ❤️ for the Stacks ecosystem**
