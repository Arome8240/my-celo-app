/**
 * @my-celo-app/config
 *
 * Type-safe configuration and environment validation for the Hospital Network Token application.
 *
 * This package provides:
 * - Runtime environment variable validation using Zod
 * - Type-safe configuration objects
 * - Centralized configuration management
 * - Environment-specific settings
 *
 * @example
 * ```typescript
 * import { getWebEnv, validateContractsEnv } from '@my-celo-app/config';
 *
 * // Get validated web environment
 * const env = getWebEnv();
 * console.log(env.NEXT_PUBLIC_HOSPITAL_TOKEN_ADDRESS);
 *
 * // Validate contracts environment
 * const contractsEnv = validateContractsEnv();
 * ```
 */

// Export schemas
export {
  webEnvSchema,
  contractsEnvSchema,
  sharedConfigSchema,
  environmentSchema,
  logLevelSchema,
  type WebEnv,
  type ContractsEnv,
  type SharedConfig,
  type Environment,
  type LogLevel,
} from "./schemas";

// Export environment utilities
export {
  validateWebEnv,
  validateContractsEnv,
  getWebEnv,
  getContractsEnv,
  isProduction,
  isDevelopment,
  isTest,
  getEnvironment,
  EnvValidationError,
} from "./env";

// Export types
export type { WebEnv as WebEnvironment, ContractsEnv as ContractsEnvironment } from "./schemas";
