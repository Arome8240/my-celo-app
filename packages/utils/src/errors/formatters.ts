import { AppError } from "./classes";
import type { ErrorContext } from "./types";

/**
 * Format error for user display
 */
export function formatErrorForUser(error: Error | AppError): string {
  if (error instanceof AppError && error.userMessage) {
    return error.userMessage;
  }

  // Handle common error patterns
  if (error.message.includes("user rejected")) {
    return "Transaction was cancelled.";
  }

  if (error.message.includes("insufficient funds")) {
    return "Insufficient funds. Please add more tokens to your wallet.";
  }

  if (error.message.includes("network")) {
    return "Network error. Please check your connection and try again.";
  }

  if (error.message.includes("timeout")) {
    return "Request timed out. Please try again.";
  }

  // Default message
  return "An unexpected error occurred. Please try again.";
}

/**
 * Format error for logging
 */
export function formatErrorForLogging(error: Error | AppError): {
  message: string;
  stack?: string;
  code?: string;
  category?: string;
  severity?: string;
  context?: ErrorContext;
} {
  if (error instanceof AppError) {
    return {
      message: error.message,
      stack: error.stack,
      code: error.code,
      category: error.category,
      severity: error.severity,
      context: error.context,
    };
  }

  return {
    message: error.message,
    stack: error.stack,
  };
}

/**
 * Extract error code from error
 */
export function getErrorCode(error: Error | AppError): string {
  if (error instanceof AppError) {
    return error.code;
  }

  // Try to extract code from error name or message
  if (error.name && error.name !== "Error") {
    return error.name.toUpperCase().replace(/ERROR$/, "");
  }

  return "UNKNOWN_ERROR";
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: Error | AppError): boolean {
  if (error instanceof AppError) {
    return error.retryable;
  }

  // Check for common retryable error patterns
  const retryablePatterns = [
    "network",
    "timeout",
    "ECONNREFUSED",
    "ETIMEDOUT",
    "ENOTFOUND",
    "rate limit",
    "too many requests",
    "503",
    "502",
    "504",
  ];

  const errorString = error.message.toLowerCase();
  return retryablePatterns.some((pattern) =>
    errorString.includes(pattern.toLowerCase())
  );
}

/**
 * Check if error is recoverable
 */
export function isRecoverableError(error: Error | AppError): boolean {
  if (error instanceof AppError) {
    return error.recoverable;
  }

  // Most errors are potentially recoverable
  return true;
}

/**
 * Sanitize error for client
 * Removes sensitive information before sending to client
 */
export function sanitizeErrorForClient(error: Error | AppError): {
  message: string;
  code: string;
  retryable: boolean;
} {
  return {
    message: formatErrorForUser(error),
    code: getErrorCode(error),
    retryable: isRetryableError(error),
  };
}

/**
 * Parse blockchain error
 * Extracts useful information from blockchain errors
 */
export function parseBlockchainError(error: Error): {
  reason?: string;
  code?: string;
  method?: string;
  transaction?: string;
} {
  const result: {
    reason?: string;
    code?: string;
    method?: string;
    transaction?: string;
  } = {};

  // Try to extract reason
  const reasonMatch = error.message.match(/reason="([^"]+)"/);
  if (reasonMatch) {
    result.reason = reasonMatch[1];
  }

  // Try to extract code
  const codeMatch = error.message.match(/code=([A-Z_]+)/);
  if (codeMatch) {
    result.code = codeMatch[1];
  }

  // Try to extract method
  const methodMatch = error.message.match(/method="([^"]+)"/);
  if (methodMatch) {
    result.method = methodMatch[1];
  }

  // Try to extract transaction hash
  const txMatch = error.message.match(/transaction="(0x[a-fA-F0-9]+)"/);
  if (txMatch) {
    result.transaction = txMatch[1];
  }

  return result;
}

/**
 * Create error context from request
 */
export function createErrorContext(
  additionalContext?: Record<string, unknown>
): ErrorContext {
  return {
    timestamp: new Date().toISOString(),
    ...additionalContext,
  };
}
