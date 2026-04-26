import { getLogger } from "./logger";
import type { RequestContext, TransactionContext, ErrorContext, LogContext } from "./types";

/**
 * Log a request
 */
export function logRequest(
  message: string,
  context: RequestContext & LogContext
): void {
  getLogger().info(message, context);
}

/**
 * Log a blockchain transaction
 */
export function logTransaction(
  message: string,
  context: TransactionContext & LogContext
): void {
  getLogger().info(message, {
    ...context,
    type: "transaction",
  });
}

/**
 * Log a successful transaction
 */
export function logTransactionSuccess(
  txHash: string,
  context?: TransactionContext & LogContext
): void {
  getLogger().info("Transaction successful", {
    ...context,
    txHash,
    type: "transaction",
    status: "success",
  });
}

/**
 * Log a failed transaction
 */
export function logTransactionFailure(
  txHash: string | undefined,
  error: Error | unknown,
  context?: TransactionContext & LogContext
): void {
  getLogger().error(
    "Transaction failed",
    error,
    {
      ...context,
      txHash,
      type: "transaction",
      status: "failed",
    }
  );
}

/**
 * Log an error with context
 */
export function logError(
  message: string,
  error: Error | unknown,
  context?: ErrorContext & LogContext
): void {
  getLogger().error(message, error, context);
}

/**
 * Log a warning
 */
export function logWarning(message: string, context?: LogContext): void {
  getLogger().warn(message, context);
}

/**
 * Log debug information
 */
export function logDebug(message: string, context?: LogContext): void {
  getLogger().debug(message, context);
}

/**
 * Log application startup
 */
export function logStartup(appName: string, version?: string): void {
  getLogger().info("Application starting", {
    appName,
    version,
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
  });
}

/**
 * Log application shutdown
 */
export function logShutdown(reason?: string): void {
  getLogger().info("Application shutting down", { reason });
}

/**
 * Log a performance metric
 */
export function logPerformance(
  operation: string,
  durationMs: number,
  context?: LogContext
): void {
  getLogger().info("Performance metric", {
    ...context,
    operation,
    durationMs,
    type: "performance",
  });
}

/**
 * Create a performance timer
 */
export function createPerformanceTimer(operation: string) {
  const start = Date.now();
  
  return {
    end: (context?: LogContext) => {
      const duration = Date.now() - start;
      logPerformance(operation, duration, context);
      return duration;
    },
  };
}

/**
 * Log user action
 */
export function logUserAction(
  action: string,
  userId?: string,
  context?: LogContext
): void {
  getLogger().info("User action", {
    ...context,
    action,
    userId,
    type: "user_action",
  });
}

/**
 * Log security event
 */
export function logSecurityEvent(
  event: string,
  severity: "low" | "medium" | "high" | "critical",
  context?: LogContext
): void {
  const logger = getLogger();
  const logContext = {
    ...context,
    event,
    severity,
    type: "security",
  };

  if (severity === "critical" || severity === "high") {
    logger.error(`Security event: ${event}`, undefined, logContext);
  } else {
    logger.warn(`Security event: ${event}`, logContext);
  }
}
