/**
 * @my-celo-app/utils/logger
 * 
 * Production-grade structured logging system using Pino.
 * 
 * Features:
 * - Structured JSON logging
 * - Multiple log levels (debug, info, warn, error, fatal)
 * - Request ID tracking
 * - Performance monitoring
 * - Sensitive data redaction
 * - Pretty printing in development
 * - Child loggers with context
 * 
 * @example
 * ```typescript
 * import { getLogger, logTransaction } from '@my-celo-app/utils/logger';
 * 
 * const logger = getLogger();
 * logger.info('Application started');
 * 
 * logTransaction('Token transfer', {
 *   txHash: '0x...',
 *   from: '0x...',
 *   to: '0x...',
 * });
 * ```
 */

// Core logger
export { createLogger, getLogger, setLogger, createChildLogger } from "./logger";

// Configuration
export { createLoggerConfig, getPinoTransport } from "./config";

// Helpers
export {
  logRequest,
  logTransaction,
  logTransactionSuccess,
  logTransactionFailure,
  logError,
  logWarning,
  logDebug,
  logStartup,
  logShutdown,
  logPerformance,
  createPerformanceTimer,
  logUserAction,
  logSecurityEvent,
} from "./helpers";

// Middleware
export { loggerMiddleware, createRequestLogger, withLogging } from "./middleware";

// Types
export type {
  Logger,
  LogLevel,
  LogContext,
  LoggerConfig,
  RequestContext,
  TransactionContext,
  ErrorContext,
} from "./types";
