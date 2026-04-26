import { NextRequest, NextResponse } from "next/server";
import { createChildLogger } from "./logger";
import { nanoid } from "nanoid";

/**
 * Generate a unique request ID
 */
function generateRequestId(): string {
  return nanoid();
}

/**
 * Extract client IP from request
 */
function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Next.js middleware for request logging
 * 
 * Usage in middleware.ts:
 * ```typescript
 * import { loggerMiddleware } from '@my-celo-app/utils/logger';
 * 
 * export function middleware(request: NextRequest) {
 *   return loggerMiddleware(request);
 * }
 * ```
 */
export function loggerMiddleware(request: NextRequest): NextResponse {
  const requestId = generateRequestId();
  const startTime = Date.now();

  // Create child logger with request context
  const logger = createChildLogger({
    requestId,
    method: request.method,
    url: request.url,
    userAgent: request.headers.get("user-agent") || "unknown",
    ip: getClientIp(request),
  });

  // Log incoming request
  logger.info("Incoming request");

  // Continue with the request
  const response = NextResponse.next();

  // Add request ID to response headers
  response.headers.set("x-request-id", requestId);

  // Log response (in a real implementation, this would be in a response handler)
  const duration = Date.now() - startTime;
  logger.info("Request completed", {
    statusCode: response.status,
    durationMs: duration,
  });

  return response;
}

/**
 * Create a request logger for API routes
 * 
 * Usage in API route:
 * ```typescript
 * import { createRequestLogger } from '@my-celo-app/utils/logger';
 * 
 * export async function GET(request: NextRequest) {
 *   const logger = createRequestLogger(request);
 *   logger.info("Processing request");
 *   // ... handle request
 * }
 * ```
 */
export function createRequestLogger(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") || generateRequestId();
  
  return createChildLogger({
    requestId,
    method: request.method,
    url: request.url,
    userAgent: request.headers.get("user-agent") || "unknown",
    ip: getClientIp(request),
  });
}

/**
 * Log API route handler
 * Higher-order function to wrap API routes with logging
 * 
 * Usage:
 * ```typescript
 * import { withLogging } from '@my-celo-app/utils/logger';
 * 
 * export const GET = withLogging(async (request, logger) => {
 *   logger.info("Handling GET request");
 *   return NextResponse.json({ data: "..." });
 * });
 * ```
 */
export function withLogging<T extends NextRequest>(
  handler: (request: T, logger: ReturnType<typeof createRequestLogger>) => Promise<NextResponse>
) {
  return async (request: T): Promise<NextResponse> => {
    const logger = createRequestLogger(request);
    const startTime = Date.now();

    try {
      logger.info("API route handler started");
      const response = await handler(request, logger);
      const duration = Date.now() - startTime;

      logger.info("API route handler completed", {
        statusCode: response.status,
        durationMs: duration,
      });

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error("API route handler failed", error, {
        durationMs: duration,
      });
      throw error;
    }
  };
}
