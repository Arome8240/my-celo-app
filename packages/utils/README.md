# @my-celo-app/utils

Shared utilities for the Hospital Network Token application.

## Packages

### Logger

Production-grade structured logging system using Pino.

#### Features

- ✅ Structured JSON logging
- ✅ Multiple log levels (debug, info, warn, error, fatal)
- ✅ Request ID tracking
- ✅ Performance monitoring
- ✅ Sensitive data redaction
- ✅ Pretty printing in development
- ✅ Child loggers with context
- ✅ Next.js middleware support

#### Installation

```bash
pnpm add @my-celo-app/utils
```

#### Basic Usage

```typescript
import { getLogger } from '@my-celo-app/utils/logger';

const logger = getLogger();

logger.debug('Debug message', { userId: '123' });
logger.info('User logged in', { userId: '123', method: 'wallet' });
logger.warn('Rate limit approaching', { userId: '123', requests: 95 });
logger.error('Transaction failed', error, { txHash: '0x...' });
logger.fatal('Critical system error', error);
```

#### Child Loggers

Create child loggers with persistent context:

```typescript
import { createChildLogger } from '@my-celo-app/utils/logger';

const userLogger = createChildLogger({ userId: '123', walletAddress: '0x...' });

userLogger.info('Action performed'); // Automatically includes userId and walletAddress
```

#### Transaction Logging

```typescript
import { logTransaction, logTransactionSuccess, logTransactionFailure } from '@my-celo-app/utils/logger';

// Log transaction attempt
logTransaction('Token transfer initiated', {
  from: '0x...',
  to: '0x...',
  value: '100',
  network: 'celo',
});

// Log success
logTransactionSuccess('0xtxhash...', {
  gasUsed: '21000',
  blockNumber: 12345,
});

// Log failure
logTransactionFailure('0xtxhash...', error, {
  reason: 'Insufficient balance',
});
```

#### Performance Monitoring

```typescript
import { createPerformanceTimer, logPerformance } from '@my-celo-app/utils/logger';

// Using timer
const timer = createPerformanceTimer('database_query');
await performDatabaseQuery();
timer.end({ query: 'SELECT * FROM users' });

// Manual logging
logPerformance('api_call', 150, { endpoint: '/api/users' });
```

#### Request Logging (Next.js)

Create `middleware.ts` in your Next.js app:

```typescript
import { NextRequest } from 'next/server';
import { loggerMiddleware } from '@my-celo-app/utils/logger';

export function middleware(request: NextRequest) {
  return loggerMiddleware(request);
}

export const config = {
  matcher: '/api/:path*',
};
```

Or use in API routes:

```typescript
import { createRequestLogger, withLogging } from '@my-celo-app/utils/logger';
import { NextRequest, NextResponse } from 'next/server';

// Option 1: Manual logger
export async function GET(request: NextRequest) {
  const logger = createRequestLogger(request);
  logger.info('Processing GET request');
  
  try {
    const data = await fetchData();
    logger.info('Data fetched successfully');
    return NextResponse.json(data);
  } catch (error) {
    logger.error('Failed to fetch data', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// Option 2: With logging wrapper
export const POST = withLogging(async (request, logger) => {
  logger.info('Processing POST request');
  const body = await request.json();
  // ... handle request
  return NextResponse.json({ success: true });
});
```

#### Security Event Logging

```typescript
import { logSecurityEvent } from '@my-celo-app/utils/logger';

logSecurityEvent('unauthorized_access_attempt', 'high', {
  userId: '123',
  ip: '192.168.1.1',
  resource: '/admin',
});

logSecurityEvent('suspicious_transaction', 'critical', {
  txHash: '0x...',
  reason: 'Unusual amount',
});
```

#### User Action Logging

```typescript
import { logUserAction } from '@my-celo-app/utils/logger';

logUserAction('token_transfer', '123', {
  amount: '100',
  recipient: '0x...',
});

logUserAction('role_granted', '123', {
  role: 'MINTER_ROLE',
  grantedTo: '0x...',
});
```

#### Application Lifecycle

```typescript
import { logStartup, logShutdown } from '@my-celo-app/utils/logger';

// On startup
logStartup('my-celo-app', '1.0.0');

// On shutdown
process.on('SIGTERM', () => {
  logShutdown('SIGTERM received');
  process.exit(0);
});
```

#### Configuration

Set log level via environment variable:

```bash
LOG_LEVEL=debug  # debug, info, warn, error, fatal
```

Or programmatically:

```typescript
import { createLogger } from '@my-celo-app/utils/logger';

const logger = createLogger({
  level: 'debug',
  pretty: true,
  name: 'my-service',
});
```

#### Sensitive Data Redaction

The logger automatically redacts sensitive fields:

```typescript
logger.info('User data', {
  username: 'john',
  password: 'secret123',  // Will be redacted
  privateKey: '0x...',    // Will be redacted
  apiKey: 'key123',       // Will be redacted
});

// Output: { username: 'john', password: '[Redacted]', privateKey: '[Redacted]', apiKey: '[Redacted]' }
```

Redacted fields:
- password
- privateKey
- secret
- token
- apiKey
- authorization
- cookie
- sessionId
- creditCard
- ssn

#### Log Output

**Development (pretty):**
```
[2024-04-26 10:30:45] INFO - User logged in
  userId: "123"
  method: "wallet"
  requestId: "abc123"
```

**Production (JSON):**
```json
{
  "level": "info",
  "time": "2024-04-26T10:30:45.123Z",
  "msg": "User logged in",
  "userId": "123",
  "method": "wallet",
  "requestId": "abc123",
  "environment": "production",
  "pid": 1234,
  "hostname": "server-1"
}
```

#### Best Practices

1. **Use appropriate log levels:**
   - `debug`: Detailed debugging information
   - `info`: General informational messages
   - `warn`: Warning messages for potentially harmful situations
   - `error`: Error messages for failures
   - `fatal`: Critical errors that cause application termination

2. **Add context:**
   ```typescript
   logger.info('Operation completed', {
     operation: 'mint_tokens',
     duration: 150,
     userId: '123',
   });
   ```

3. **Use child loggers for persistent context:**
   ```typescript
   const requestLogger = createChildLogger({ requestId: '...' });
   // All logs from requestLogger will include requestId
   ```

4. **Log errors with stack traces:**
   ```typescript
   try {
     await riskyOperation();
   } catch (error) {
     logger.error('Operation failed', error, { operation: 'mint' });
   }
   ```

5. **Monitor performance:**
   ```typescript
   const timer = createPerformanceTimer('expensive_operation');
   await expensiveOperation();
   timer.end();
   ```

6. **Log security events:**
   ```typescript
   logSecurityEvent('failed_login', 'medium', { userId, attempts: 3 });
   ```

## License

MIT
