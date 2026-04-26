import { z } from "zod";

/**
 * Ethereum address validation
 */
const ethereumAddressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format");

/**
 * Private key validation (with or without 0x prefix)
 */
const privateKeySchema = z
  .string()
  .regex(/^(0x)?[a-fA-F0-9]{64}$/, "Invalid private key format")
  .transform((key) => (key.startsWith("0x") ? key : `0x${key}`));

/**
 * URL validation
 */
const urlSchema = z.string().url("Invalid URL format");

/**
 * Positive number validation
 */
const positiveNumberSchema = z.coerce.number().positive("Must be a positive number");

/**
 * Chain ID validation
 */
const chainIdSchema = z.coerce.number().int().positive("Invalid chain ID");

/**
 * Environment enum
 */
export const environmentSchema = z.enum(["development", "staging", "production"]);

/**
 * Log level enum
 */
export const logLevelSchema = z.enum(["debug", "info", "warn", "error"]);

/**
 * Web application environment variables schema
 */
export const webEnvSchema = z.object({
  // Node environment
  NODE_ENV: environmentSchema.default("development"),

  // Next.js
  NEXT_PUBLIC_APP_URL: urlSchema.optional(),

  // Contract addresses
  NEXT_PUBLIC_HOSPITAL_TOKEN_ADDRESS: ethereumAddressSchema,

  // RPC URLs
  NEXT_PUBLIC_CELO_RPC_URL: urlSchema.default("https://forno.celo.org"),
  NEXT_PUBLIC_CELO_SEPOLIA_RPC_URL: urlSchema.default(
    "https://forno.celo-sepolia.celo-testnet.org/"
  ),

  // Chain IDs
  NEXT_PUBLIC_CELO_CHAIN_ID: chainIdSchema.default(42220),
  NEXT_PUBLIC_CELO_SEPOLIA_CHAIN_ID: chainIdSchema.default(11142220),

  // Feature flags
  NEXT_PUBLIC_ENABLE_TESTNET: z
    .string()
    .transform((val) => val === "true")
    .default("false"),

  // Analytics & Monitoring (optional)
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),

  // API Keys (server-side only)
  SENTRY_AUTH_TOKEN: z.string().optional(),
});

/**
 * Smart contracts environment variables schema
 */
export const contractsEnvSchema = z.object({
  // Private key (required for deployments)
  PRIVATE_KEY: privateKeySchema.optional(),

  // Contract addresses
  TOKEN_ADDRESS: ethereumAddressSchema.optional(),

  // RPC URLs
  CELO_RPC_URL: urlSchema.default("https://forno.celo.org"),
  CELO_SEPOLIA_RPC_URL: urlSchema.default(
    "https://forno.celo-sepolia.celo-testnet.org/"
  ),

  // Etherscan API key for verification
  ETHERSCAN_API_KEY: z.string().optional(),

  // Gas reporting
  REPORT_GAS: z
    .string()
    .transform((val) => val === "true")
    .optional(),

  // Transaction generation
  RECIPIENT_ADDRESS: z
    .string()
    .optional()
    .transform((val) => (val && val.trim() !== "" ? val : undefined))
    .pipe(ethereumAddressSchema.optional()),
  TX_COUNT: positiveNumberSchema.default(1000),
  AMOUNT: z.string().default("0.000001"),
});

/**
 * Shared configuration schema
 */
export const sharedConfigSchema = z.object({
  // Environment
  environment: environmentSchema,

  // Logging
  logLevel: logLevelSchema.default("info"),

  // Network configuration
  networks: z.object({
    celo: z.object({
      chainId: z.number().default(42220),
      rpcUrl: urlSchema,
      name: z.string().default("Celo Mainnet"),
    }),
    celoSepolia: z.object({
      chainId: z.number().default(11142220),
      rpcUrl: urlSchema,
      name: z.string().default("Celo Sepolia Testnet"),
    }),
  }),

  // Contract addresses
  contracts: z.object({
    hospitalToken: ethereumAddressSchema,
  }),
});

/**
 * Type exports
 */
export type WebEnv = z.infer<typeof webEnvSchema>;
export type ContractsEnv = z.infer<typeof contractsEnvSchema>;
export type SharedConfig = z.infer<typeof sharedConfigSchema>;
export type Environment = z.infer<typeof environmentSchema>;
export type LogLevel = z.infer<typeof logLevelSchema>;
