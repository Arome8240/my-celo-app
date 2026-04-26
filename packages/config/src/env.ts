import { z } from "zod";
import {
  webEnvSchema,
  contractsEnvSchema,
  type WebEnv,
  type ContractsEnv,
} from "./schemas";

/**
 * Validation error class
 */
export class EnvValidationError extends Error {
  constructor(
    message: string,
    public errors: z.ZodError
  ) {
    super(message);
    this.name = "EnvValidationError";
  }
}

/**
 * Format Zod errors for better readability
 */
function formatZodErrors(error: z.ZodError): string {
  return error.errors
    .map((err) => {
      const path = err.path.join(".");
      return `  - ${path}: ${err.message}`;
    })
    .join("\n");
}

/**
 * Validate and parse environment variables
 */
function validateEnv<T>(
  schema: z.ZodSchema<T>,
  env: Record<string, string | undefined>,
  context: string
): T {
  try {
    return schema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = formatZodErrors(error);
      const errorMessage = `❌ Invalid ${context} environment variables:\n${formattedErrors}`;

      console.error(errorMessage);
      console.error("\n💡 Tip: Check your .env file and ensure all required variables are set correctly.\n");

      throw new EnvValidationError(errorMessage, error);
    }
    throw error;
  }
}

/**
 * Validate web application environment variables
 */
export function validateWebEnv(env: Record<string, string | undefined> = process.env): WebEnv {
  return validateEnv(webEnvSchema, env, "web application");
}

/**
 * Validate smart contracts environment variables
 */
export function validateContractsEnv(
  env: Record<string, string | undefined> = process.env
): ContractsEnv {
  return validateEnv(contractsEnvSchema, env, "smart contracts");
}

/**
 * Get validated web environment (cached)
 */
let cachedWebEnv: WebEnv | null = null;

export function getWebEnv(): WebEnv {
  if (!cachedWebEnv) {
    cachedWebEnv = validateWebEnv();
  }
  return cachedWebEnv;
}

/**
 * Get validated contracts environment (cached)
 */
let cachedContractsEnv: ContractsEnv | null = null;

export function getContractsEnv(): ContractsEnv {
  if (!cachedContractsEnv) {
    cachedContractsEnv = validateContractsEnv();
  }
  return cachedContractsEnv;
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

/**
 * Check if running in test
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === "test";
}

/**
 * Get current environment
 */
export function getEnvironment(): "development" | "staging" | "production" {
  const env = process.env.NODE_ENV;
  if (env === "production") return "production";
  if (env === "staging") return "staging";
  return "development";
}
