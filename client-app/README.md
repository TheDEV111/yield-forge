# Stacks Next.js Template

A modern Next.js 15 template for building Stacks blockchain applications with TypeScript, Tailwind CSS, and comprehensive tooling.

## 🚀 Features

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
