/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

/**
 * Error categories
 */
export enum ErrorCategory {
  VALIDATION = "validation",
  NETWORK = "network",
  BLOCKCHAIN = "blockchain",
  AUTHENTICATION = "authentication",
  AUTHORIZATION = "authorization",
  NOT_FOUND = "not_found",
  RATE_LIMIT = "rate_limit",
  INTERNAL = "internal",
  EXTERNAL = "external",
  USER_INPUT = "user_input",
}

/**
 * Error context interface
 */
export interface ErrorContext {
  [key: string]: unknown;
  userId?: string;
  walletAddress?: string;
  txHash?: string;
  requestId?: string;
  timestamp?: string;
}

/**
 * Error metadata
 */
export interface ErrorMetadata {
  code: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: string;
  userMessage?: string;
  context?: ErrorContext;
  cause?: Error;
  recoverable?: boolean;
  retryable?: boolean;
}

/**
 * Error handler options
 */
export interface ErrorHandlerOptions {
  logError?: boolean;
  notifyUser?: boolean;
  reportToSentry?: boolean;
  rethrow?: boolean;
}

/**
 * Error recovery strategy
 */
export interface ErrorRecoveryStrategy {
  canRecover: (error: Error) => boolean;
  recover: (error: Error) => Promise<void> | void;
}
