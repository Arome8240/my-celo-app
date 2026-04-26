/**
 * Log level type
 */
export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

/**
 * Log context - additional metadata for logs
 */
export interface LogContext {
  [key: string]: unknown;
}

/**
 * Logger interface
 */
export interface Logger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, error?: Error | unknown, context?: LogContext): void;
  fatal(message: string, error?: Error | unknown, context?: LogContext): void;
  child(context: LogContext): Logger;
}

/**
 * Logger configuration
 */
export interface LoggerConfig {
  level: LogLevel;
  pretty?: boolean;
  name?: string;
  redact?: string[];
  base?: Record<string, unknown>;
}

/**
 * Request context for logging
 */
export interface RequestContext {
  requestId?: string;
  method?: string;
  url?: string;
  userAgent?: string;
  ip?: string;
  userId?: string;
  walletAddress?: string;
}

/**
 * Transaction context for blockchain operations
 */
export interface TransactionContext {
  txHash?: string;
  from?: string;
  to?: string;
  value?: string;
  gasUsed?: string;
  blockNumber?: number;
  network?: string;
}

/**
 * Error context for error logging
 */
export interface ErrorContext {
  errorCode?: string;
  errorType?: string;
  stack?: string;
  statusCode?: number;
}
