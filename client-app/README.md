# YieldForge Frontend

Minimalistic DeFi yield optimization interface for the YieldForge protocol on Stacks blockchain.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the interface.

## 📦 Features

### Wallet Connection
- Connect Hiro/Leather wallet via Stacks Connect
- View connected wallet address
- Persistent session with localStorage

### Vault Management
- **Create Vault**: Choose from 3 risk tiers
  - Conservative: 5-8% APY (stable protocols)
  - Balanced: 8-15% APY (mixed strategies)
  - Aggressive: 15%+ APY (high-yield opportunities)
  
- **Deposit**: Add STX to vault (min 100 STX)
  - 0.3% deposit fee
  - Receive vault shares proportionally
  
- **Withdraw**: Remove shares from vault
  - 0.5% withdrawal fee
  - Returns STX based on current vault value

- **Compound**: Auto-reinvest rewards
  - 0.2 STX gas fee
  - Increases vault position

### Rewards System
- **Claim Rewards**: Withdraw earned yields (1% fee)
- **Lock Rewards**: Earn multiplier bonuses
  - 3 months: 1.5x multiplier (13,140 blocks)
  - 6 months: 2x multiplier (26,280 blocks)
  - 12 months: 3x multiplier (52,560 blocks)
- **Unlock Rewards**: Withdraw after lockup period expires

## 🔗 Deployed Contracts

**Mainnet**: `SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F`
- `vault-manager`: Core vault operations
- `strategy-router`: Protocol routing & governance
- `reward-distributor`: Rewards, lockups, referrals

**Testnet**: `STVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2BKDND68`

## 🏗️ Architecture

```
client-app/
├── app/
│   ├── layout.tsx         # Root layout with AuthSessionProvider
│   └── page.tsx           # Main dashboard page
├── components/
│   ├── wallet-connect.tsx    # Wallet connection button
│   ├── create-vault.tsx      # Vault creation interface
│   ├── vault-actions.tsx     # Deposit/withdraw/compound
│   └── rewards-panel.tsx     # Rewards claim/lock/unlock
├── hooks/
│   └── wallet.ts          # useWallet() hook
├── lib/
│   └── contracts/
│       ├── constants.ts   # Contract addresses, fees, helpers
│       └── transactions.ts # Contract interaction wrappers
└── providers/
    └── auth-session-provider.tsx # Session management
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.4 with App Router
- **Blockchain**: Stacks (Clarity smart contracts)
- **Wallet**: @stacks/connect 8.2.0
- **UI**: Tailwind CSS 4, Radix UI
- **Icons**: lucide-react

## 📝 Usage Examples

### Create a Vault
1. Connect your Stacks wallet
2. Select risk tier (Conservative/Balanced/Aggressive)
3. Click "Create Vault"
4. Confirm transaction in wallet

### Deposit to Vault
1. Enter Vault ID (starts at 1)
2. Input deposit amount (min 100 STX)
3. Review fees (0.3%)
4. Click "Deposit" and confirm

### Lock Rewards for Multiplier
1. Check claimable rewards amount
2. Choose lockup period (3/6/12 months)
3. Enter amount to lock
4. Click "Lock Rewards"
5. Earn multiplied rewards (1.5x-3x)

## 🔐 Security Notes

- Always verify contract addresses before transactions
- Review transaction details in wallet popup
- Start with small amounts for testing
- Minimum deposit: 100 STX
- Lockup periods are enforced on-chain (no early unlock)

## 📊 Fees Summary

| Operation | Fee |
|-----------|-----|
| Deposit | 0.3% |
| Withdrawal | 0.5% |
| Performance | 15% |
| Management | 2% annual |
| Claim Rewards | 1% |
| Referral Bonus | 5% |

## 🐛 Troubleshooting

**"Connect your wallet" error**
- Ensure Hiro/Leather wallet extension is installed
- Check wallet is on correct network (mainnet/testnet)

**Transaction fails**
- Verify sufficient STX balance (+ 0.1 STX for fees)
- Check minimum deposit requirement (100 STX)
- Ensure vault ID exists

**Rewards not showing**
- Wait for 1 block confirmation
- Refresh page to update balances
- Check transaction status on explorer

## 📚 Resources

- [Stacks Explorer](https://explorer.hiro.so)
- [Stacks Connect Docs](https://docs.stacks.co/build-apps/connect)
- [YieldForge Contracts](../yield-smart-contract)

## 📄 License

MIT


- **Next.js 15** with App Router and Turbopack
- **TypeScript** with strict configuration
- **Tailwind CSS** for styling
- **Stacks Integration** with wallet connection
- **Component Library** built on Radix UI
- **Biome** for linting and formatting
- **Environment Configuratin** with Zod validation

## 📦 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + CVA
- **Blockchain**: Stacks Connect
- **Linting**: Biome

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Git

### Installation

1. **Clone the template**
   ```bash
   git clone <your-repo-url>
   cd stacks-next-template
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_APP_NAME="Your App Name"
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   └── ui/               # Base UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configuration
│   └── config/          # Environment configuration
├── providers/           # React context providers
└── .cursor/rules/       # Cursor AI rules
```

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run Biome linter
pnpm format       # Format code with Biome
```

### Wallet Integration

The template includes a complete wallet integration system:

```typescript
// Use the wallet hook in your components
import { useWallet } from "@/hooks/wallet";

export function WalletButton() {
  const { data, isConnected, connect, disconnect } = useWallet();
  
  if (isConnected) {
    return (
      <div>
        <p>Connected: {data?.address}</p>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    );
  }
  
  return <button onClick={connect}>Connect Wallet</button>;
}
```

### Session Management

Authentication state is managed through React Context:

```typescript
import { useAuthSession } from "@/providers/auth-session-provider";

export function UserProfile() {
  const { session, loading } = useAuthSession();
  
  if (loading) return <div>Loading...</div>;
  if (!session) return <div>Please connect your wallet</div>;
  
  return <div>Welcome, {session.user.walletAddress}</div>;
}
```

## 🎨 UI Components

The template includes a comprehensive component library:

```typescript
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function ExampleComponent() {
  return (
    <Card>
      <Input placeholder="Enter your name" />
      <Button variant="default">Submit</Button>
    </Card>
  );
}
```

### Available Components

- **Button** - Multiple variants (default, destructive, outline, etc.)
- **Card** - Container component
- **Input** - Form input component

## 🌐 Environment Configuration

The template uses Zod for environment variable validation:

### Client Configuration
```typescript
// lib/config/client.ts
export const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("Stacks Next Template"),
});
```

### Server Configuration
```typescript
// lib/config/server.ts
const envSchema = z.object({}).extend(clientEnvSchema.shape);
```

## 🎯 Best Practices

### Code Quality
- Use TypeScript strict mode
- Follow the established patterns in the codebase
- Run `pnpm lint` before committing
- Use proper error handling

### Component Development
- Use functional components with hooks
- Implement proper TypeScript interfaces
- Follow the component library patterns
- Include accessibility attributes

### Wallet Integration
- Always check connection state before transactions
- Implement proper error handling
- Use the provided session management
- Validate wallet responses

## 🚀 Deployment

### Build for Production

```bash
pnpm build
```

### Deploy to Vercel

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

### Deploy to Other Platforms

The template works with any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Stacks Documentation](https://docs.stacks.co)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

**Happy building! 🚀**
