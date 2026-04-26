/**
 * Environment validation for web application
 * 
 * This file validates environment variables at build time and runtime.
 * Import this file early in your application to ensure configuration is valid.
 */

import { validateWebEnv, EnvValidationError } from "@my-celo-app/config";

/**
 * Validate environment variables
 * Throws an error if validation fails
 */
export function validateEnvironment(): void {
  try {
    validateWebEnv();
    console.log("✅ Environment variables validated successfully");
  } catch (error) {
    if (error instanceof EnvValidationError) {
      console.error("\n" + "=".repeat(80));
      console.error("❌ ENVIRONMENT VALIDATION FAILED");
      console.error("=".repeat(80));
      console.error(error.message);
      console.error("=".repeat(80) + "\n");
      
      // In production, fail fast
      if (process.env.NODE_ENV === "production") {
        console.error("🚨 Cannot start application with invalid configuration");
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
