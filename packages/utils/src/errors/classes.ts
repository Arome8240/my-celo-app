import { ErrorCategory, ErrorSeverity, type ErrorContext, type ErrorMetadata } from "./types";

/**
 * Base application error class
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly category: ErrorCategory;
  public readonly severity: ErrorSeverity;
  public readonly userMessage?: string;
  public readonly context?: ErrorContext;
  public readonly recoverable: boolean;
  public readonly retryable: boolean;
  public readonly timestamp: string;

  constructor(metadata: ErrorMetadata) {
    super(metadata.message);
    this.name = "AppError";
    this.code = metadata.code;
    this.category = metadata.category;
    this.severity = metadata.severity;
    this.userMessage = metadata.userMessage;
    this.context = metadata.context;
    this.recoverable = metadata.recoverable ?? false;
    this.retryable = metadata.retryable ?? false;
    this.timestamp = new Date().toISOString();

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    // Set the cause if provided
    if (metadata.cause) {
      this.cause = metadata.cause;
    }
  }

  /**
   * Convert error to JSON for logging
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      category: this.category,
      severity: this.severity,
      message: this.message,
      userMessage: this.userMessage,
      context: this.context,
      recoverable: this.recoverable,
      retryable: this.retryable,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }
}

/**
 * Validation error - for input validation failures
 */
export class ValidationError extends AppError {
  constructor(message: string, context?: ErrorContext, cause?: Error) {
    super({
      code: "VALIDATION_ERROR",
      category: ErrorCategory.VALIDATION,
      severity: ErrorSeverity.LOW,
      message,
      userMessage: "Please check your input and try again.",
      context,
      cause,
      recoverable: true,
      retryable: false,
    });
    this.name = "ValidationError";
  }
}

/**
 * Network error - for network-related failures
 */
export class NetworkError extends AppError {
  constructor(message: string, context?: ErrorContext, cause?: Error) {
    super({
      code: "NETWORK_ERROR",
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.MEDIUM,
      message,
      userMessage: "Network error. Please check your connection and try again.",
      context,
      cause,
      recoverable: true,
      retryable: true,
    });
    this.name = "NetworkError";
  }
}

/**
 * Blockchain error - for blockchain transaction failures
 */
export class BlockchainError extends AppError {
  constructor(
    message: string,
    code: string = "BLOCKCHAIN_ERROR",
    context?: ErrorContext,
    cause?: Error
  ) {
    super({
      code,
      category: ErrorCategory.BLOCKCHAIN,
      severity: ErrorSeverity.HIGH,
      message,
      userMessage: "Transaction failed. Please try again.",
      context,
      cause,
      recoverable: true,
      retryable: true,
    });
    this.name = "BlockchainError";
  }
}

/**
 * Transaction rejected error
 */
export class TransactionRejectedError extends BlockchainError {
  constructor(context?: ErrorContext, cause?: Error) {
    super(
      "Transaction was rejected by user",
      "TRANSACTION_REJECTED",
      context,
      cause
    );
    this.name = "TransactionRejectedError";
    this.userMessage = "Transaction was cancelled.";
    this.recoverable = true;
    this.retryable = false;
  }
}

/**
 * Insufficient funds error
 */
export class InsufficientFundsError extends BlockchainError {
  constructor(context?: ErrorContext, cause?: Error) {
    super(
      "Insufficient funds for transaction",
      "INSUFFICIENT_FUNDS",
      context,
      cause
    );
    this.name = "InsufficientFundsError";
    this.userMessage = "Insufficient funds. Please add more tokens to your wallet.";
    this.recoverable = true;
    this.retryable = false;
  }
}

/**
 * Gas estimation error
 */
export class GasEstimationError extends BlockchainError {
  constructor(context?: ErrorContext, cause?: Error) {
    super(
      "Failed to estimate gas for transaction",
      "GAS_ESTIMATION_FAILED",
      context,
      cause
    );
    this.name = "GasEstimationError";
    this.userMessage = "Unable to estimate transaction cost. Please try again.";
    this.recoverable = true;
    this.retryable = true;
  }
}

/**
 * Authentication error
 */
export class AuthenticationError extends AppError {
  constructor(message: string, context?: ErrorContext, cause?: Error) {
    super({
      code: "AUTHENTICATION_ERROR",
      category: ErrorCategory.AUTHENTICATION,
      severity: ErrorSeverity.MEDIUM,
      message,
      userMessage: "Authentication failed. Please connect your wallet.",
      context,
      cause,
      recoverable: true,
      retryable: false,
    });
    this.name = "AuthenticationError";
  }
}

/**
 * Authorization error - for permission/access control failures
 */
export class AuthorizationError extends AppError {
  constructor(message: string, context?: ErrorContext, cause?: Error) {
    super({
      code: "AUTHORIZATION_ERROR",
      category: ErrorCategory.AUTHORIZATION,
      severity: ErrorSeverity.MEDIUM,
      message,
      userMessage: "You don't have permission to perform this action.",
      context,
      cause,
      recoverable: false,
      retryable: false,
    });
    this.name = "AuthorizationError";
  }
}

/**
 * Not found error
 */
export class NotFoundError extends AppError {
  constructor(resource: string, context?: ErrorContext, cause?: Error) {
    super({
      code: "NOT_FOUND",
      category: ErrorCategory.NOT_FOUND,
      severity: ErrorSeverity.LOW,
      message: `${resource} not found`,
      userMessage: `The requested ${resource.toLowerCase()} was not found.`,
      context,
      cause,
      recoverable: false,
      retryable: false,
    });
    this.name = "NotFoundError";
  }
}

/**
 * Rate limit error
 */
export class RateLimitError extends AppError {
  constructor(context?: ErrorContext, cause?: Error) {
    super({
      code: "RATE_LIMIT_EXCEEDED",
      category: ErrorCategory.RATE_LIMIT,
      severity: ErrorSeverity.MEDIUM,
      message: "Rate limit exceeded",
      userMessage: "Too many requests. Please wait a moment and try again.",
      context,
      cause,
      recoverable: true,
      retryable: true,
    });
    this.name = "RateLimitError";
  }
}

/**
 * Internal server error
 */
export class InternalError extends AppError {
  constructor(message: string, context?: ErrorContext, cause?: Error) {
    super({
      code: "INTERNAL_ERROR",
      category: ErrorCategory.INTERNAL,
      severity: ErrorSeverity.CRITICAL,
      message,
      userMessage: "An unexpected error occurred. Please try again later.",
      context,
      cause,
      recoverable: false,
      retryable: true,
    });
    this.name = "InternalError";
  }
}

/**
 * External service error
 */
export class ExternalServiceError extends AppError {
  constructor(service: string, context?: ErrorContext, cause?: Error) {
    super({
      code: "EXTERNAL_SERVICE_ERROR",
      category: ErrorCategory.EXTERNAL,
      severity: ErrorSeverity.HIGH,
      message: `External service error: ${service}`,
      userMessage: "A service is temporarily unavailable. Please try again later.",
      context: { ...context, service },
      cause,
      recoverable: true,
      retryable: true,
    });
    this.name = "ExternalServiceError";
  }
}
