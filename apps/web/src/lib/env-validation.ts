/**
 * Environment validation for web application
 * 
 * This file validates environment variables at build time and runtime.
 * Import this file early in your application to ensure configuration is valid.
 */

import { validateWebEnv, EnvValidationError } from "@my-celo-app/config";
import { getLogger } from "@my-celo-app/utils/logger";

const logger = getLogger();

/**
 * Validate environment variables
 * Throws an error if validation fails
 */
export function validateEnvironment(): void {
  try {
    validateWebEnv();
    logger.info("Environment variables validated successfully");
  } catch (error) {
    if (error instanceof EnvValidationError) {
      logger.fatal("Environment validation failed", error, {
        errors: error.errors.errors.map(err => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });
      
      // In production, fail fast
      if (process.env.NODE_ENV === "production") {
        logger.fatal("Cannot start application with invalid configuration");
        process.exit(1);
      }
      
      throw error;
    }
    throw error;
  }
}

// Validate on module load (build time and server startup)
if (typeof window === "undefined") {
  // Server-side only
  validateEnvironment();
}
