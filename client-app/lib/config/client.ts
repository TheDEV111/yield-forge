import z from "zod";

export const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("Stacks dApp"),
  NEXT_PUBLIC_STACKS_NETWORK: z.enum(["mainnet", "testnet", "devnet"]).default("testnet")
});

export type AppConfig = {
  appName: string;
  stacksNetwork: "mainnet" | "testnet" | "devnet"
};

export const unparsedEnv = {
  appName: process.env.NEXT_PUBLIC_APP_NAME,
  stacksNetwork: process.env.NEXT_PUBLIC_STACKS_NETWORK
};

const parsed = envSchema.safeParse(unparsedEnv);

if (!parsed.success) {
  let message = "Invalid environment variables:";
  for (const issue of parsed.error.issues) {
    message += `\n${issue.path.join(".")}: ${issue.message}`;
  }
  throw new Error(message);
}

const config: AppConfig = {
  appName: parsed.data.NEXT_PUBLIC_APP_NAME,
  stacksNetwork: parsed.data.NEXT_PUBLIC_STACKS_NETWORK
};

export default config;
