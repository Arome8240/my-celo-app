import { getLogger } from "../logger";
import { AppError } from "./classes";
import { formatErrorForLogging, isRetryableError } from "./formatters";
import type { ErrorHandlerOptions, ErrorRecoveryStrategy } from "./types";

const logger = getLogger();

/**
 * Global error handler
 */
export function handleError(
  error: Error | AppError,
  options: ErrorHandlerOptions = {}
): void {
  const {
    logError = true,
    notifyUser = false,
    reportToSentry = true,
    rethrow = false,
  } = options;

  // Log error
  if (logError) {
    const errorData = formatErrorForLogging(error);
    logger.error("Error occurred", error, errorData);
  }

  // Report to Sentry (if configured)
  if (reportToSentry && typeof window !== "undefined") {
    // Sentry will be integrated in TASK-009
    // For now, just log that we would report it
    logger.debug("Would report to Sentry", { error: error.message });
  }

  // Notify user (if in browser context)
  if (notifyUser && typeof window !== "undefined") {
    // Toast notification will be added later
    logger.debug("Would show user notification", { error: error.message });
  }

  // Rethrow if requested
  if (rethrow) {
    throw error;
  }
}

/**
 * Handle async errors with automatic retry
 */
export async function handleAsyncError<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    retryDelay?: number;
    onRetry?: (attempt: number, error: Error) => void;
  } = {}
): Promise<T> {
  const { maxRetries = 3, retryDelay = 1000, onRetry } = options;

  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Check if error is retryable
      if (!isRetryableError(lastError) || attempt === maxRetries) {
        throw lastError;
      }

      // Log retry attempt
      logger.warn(`Retry attempt ${attempt}/${maxRetries}`, {
        error: lastError.message,
        attempt,
        maxRetries,
      });

      // Call onRetry callback
      if (onRetry) {
        onRetry(attempt, lastError);
      }

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, retryDelay * Math.pow(2, attempt - 1))
      );
    }
  }

  throw lastError!;
}

/**
 * Wrap function with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => any>(
  fn: T,
  options: ErrorHandlerOptions = {}
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    try {
      const result = fn(...args);

      // Handle async functions
      if (result instanceof Promise) {
        return result.catch((error) => {
          handleError(error, options);
          throw error;
        }) as ReturnType<T>;
      }

      return result;
    } catch (error) {
      handleError(error as Error, options);
      throw error;
    }
  }) as T;
}

/**
 * Error recovery manager
 */
export class ErrorRecoveryManager {
  private strategies: ErrorRecoveryStrategy[] = [];

  /**
   * Register a recovery strategy
   */
  registerStrategy(strategy: ErrorRecoveryStrategy): void {
    this.strategies.push(strategy);
  }

  /**
   * Attempt to recover from error
   */
  async attemptRecovery(error: Error): Promise<boolean> {
    for (const strategy of this.strategies) {
      if (strategy.canRecover(error)) {
        try {
          await strategy.recover(error);
          logger.info("Error recovery successful", {
            error: error.message,
            strategy: strategy.constructor.name,
          });
          return true;
        } catch (recoveryError) {
          logger.error("Error recovery failed", recoveryError as Error, {
            originalError: error.message,
            strategy: strategy.constructor.name,
          });
        }
      }
    }

    return false;
  }
}

/**
 * Global error recovery manager instance
 */
export const errorRecoveryManager = new ErrorRecoveryManager();

/**
 * Handle unhandled promise rejections
 */
if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", (event) => {
    logger.error("Unhandled promise rejection", event.reason, {
      promise: event.promise,
    });
    
    handleError(event.reason, {
      logError: true,
      reportToSentry: true,
      notifyUser: false,
      rethrow: false,
    });
  });
}

/**
 * Handle uncaught errors
 */
if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    logger.error("Uncaught error", event.error, {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });

    handleError(event.error, {
      logError: true,
      reportToSentry: true,
      notifyUser: false,
      rethrow: false,
    });
  });
}
