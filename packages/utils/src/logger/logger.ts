import pino from "pino";
import { createLoggerConfig, getPinoTransport } from "./config";
import type { Logger, LogContext, LoggerConfig } from "./types";

/**
 * Pino logger wrapper implementing our Logger interface
 */
class PinoLogger implements Logger {
  private pinoInstance: pino.Logger;

  constructor(config?: Partial<LoggerConfig>) {
    const loggerConfig = createLoggerConfig(config);
    
    this.pinoInstance = pino(
      {
        level: loggerConfig.level,
        name: loggerConfig.name,
        redact: loggerConfig.redact,
        base: loggerConfig.base,
        timestamp: pino.stdTimeFunctions.isoTime,
        formatters: {
          level: (label) => {
            return { level: label };
          },
        },
      },
      loggerConfig.pretty ? pino.transport(getPinoTransport()) : undefined
    );
  }

  debug(message: string, context?: LogContext): void {
    this.pinoInstance.debug(context || {}, message);
  }

  info(message: string, context?: LogContext): void {
    this.pinoInstance.info(context || {}, message);
  }

  warn(message: string, context?: LogContext): void {
    this.pinoInstance.warn(context || {}, message);
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext = this.formatError(error);
    this.pinoInstance.error({ ...context, ...errorContext }, message);
  }

  fatal(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext = this.formatError(error);
    this.pinoInstance.fatal({ ...context, ...errorContext }, message);
  }

  child(context: LogContext): Logger {
    const childPino = this.pinoInstance.child(context);
    const childLogger = Object.create(PinoLogger.prototype);
    childLogger.pinoInstance = childPino;
    return childLogger;
  }

  /**
   * Format error object for logging
   */
  private formatError(error?: Error | unknown): LogContext {
    if (!error) return {};

    if (error instanceof Error) {
      return {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
          ...(error.cause && { cause: error.cause }),
        },
      };
    }

    // Handle non-Error objects
    return {
      error: {
        message: String(error),
        raw: error,
      },
    };
  }
}

/**
 * Create a new logger instance
 */
export function createLogger(config?: Partial<LoggerConfig>): Logger {
  return new PinoLogger(config);
}

/**
 * Default logger instance
 */
let defaultLogger: Logger | null = null;

/**
 * Get the default logger instance (singleton)
 */
export function getLogger(): Logger {
  if (!defaultLogger) {
    defaultLogger = createLogger();
  }
  return defaultLogger;
}

/**
 * Set a custom default logger
 */
export function setLogger(logger: Logger): void {
  defaultLogger = logger;
}

/**
 * Create a child logger with additional context
 */
export function createChildLogger(context: LogContext): Logger {
  return getLogger().child(context);
}
