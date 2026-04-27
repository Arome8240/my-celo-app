/**
 * @my-celo-app/utils/errors
 * 
 * Comprehensive error handling system for the Hospital Network Token application.
 * 
 * Features:
 * - Custom error classes for different error types
 * - React Error Boundary for UI error handling
 * - Error formatting and sanitization
 * - Automatic error recovery strategies
 * - Integration with logging system
 * - Retry logic for transient failures
 * 
 * @example
 * ```typescript
 * import { ValidationError, handleError, ErrorBoundary } from '@my-celo-app/utils/errors';
 * 
 * // Throw custom error
 * throw new ValidationError('Invalid address', { address: '0x...' });
 * 
 * // Handle error
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   handleError(error, { logError: true, notifyUser: true });
 * }
 * 
 * // Use Error Boundary
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */

// Error classes
export {
  AppError,
  ValidationError,
  NetworkError,
  BlockchainError,
  TransactionRejectedError,
  InsufficientFundsError,
  GasEstimationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  RateLimitError,
  InternalError,
  ExternalServiceError,
} from "./classes";

// Error handlers
export {
  handleError,
  handleAsyncError,
  withErrorHandling,
  ErrorRecoveryManager,
  errorRecoveryManager,
} from "./handlers";

// Error formatters
export {
  formatErrorForUser,
  formatErrorForLogging,
  getErrorCode,
  isRetryableError,
  isRecoverableError,
  sanitizeErrorForClient,
  parseBlockchainError,
  createErrorContext,
} from "./formatters";

// React components
export { ErrorBoundary, useErrorHandler } from "./boundary";

// Types
export {
  ErrorSeverity,
  ErrorCategory,
  type ErrorContext,
  type ErrorMetadata,
  type ErrorHandlerOptions,
  type ErrorRecoveryStrategy,
} from "./types";
