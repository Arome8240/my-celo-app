import { getEnvironment, isProduction, isDevelopment } from "@my-celo-app/config";
import type { LoggerConfig, LogLevel } from "./types";

/**
 * Get log level from environment or default
 */
function getLogLevel(): LogLevel {
  const envLevel = process.env.LOG_LEVEL?.toLowerCase();
  
  if (envLevel && ["debug", "info", "warn", "error", "fatal"].includes(envLevel)) {
    return envLevel as LogLevel;
  }
  
  // Default log levels by environment
  if (isProduction()) return "info";
  if (isDevelopment()) return "debug";
  return "info";
}

/**
 * Sensitive fields to redact from logs
 */
const REDACT_FIELDS = [
  "password",
  "privateKey",
  "secret",
  "token",
  "apiKey",
  "authorization",
  "cookie",
  "sessionId",
  "creditCard",
  "ssn",
  "*.password",
  "*.privateKey",
  "*.secret",
  "*.token",
  "*.apiKey",
  "req.headers.authorization",
  "req.headers.cookie",
];

/**
 * Create logger configuration
 */
export function createLoggerConfig(overrides?: Partial<LoggerConfig>): LoggerConfig {
  const environment = getEnvironment();
  const level = overrides?.level || getLogLevel();
  const pretty = overrides?.pretty ?? !isProduction();

  return {
    level,
    pretty,
    name: overrides?.name || "my-celo-app",
    redact: overrides?.redact || REDACT_FIELDS,
    base: {
      environment,
      pid: process.pid,
      hostname: process.env.HOSTNAME || "unknown",
      ...overrides?.base,
    },
  };
}

/**
 * Pino transport configuration for pretty printing
 */
export function getPinoTransport() {
  return {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
      singleLine: false,
      messageFormat: "{levelLabel} - {msg}",
    },
  };
}
