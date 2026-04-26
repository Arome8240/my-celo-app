# @my-celo-app/config

Type-safe configuration and environment validation for the Hospital Network Token application.

## Features

- ✅ Runtime environment variable validation using Zod
- ✅ Type-safe configuration objects
- ✅ Centralized configuration management
- ✅ Environment-specific settings
- ✅ Helpful error messages
- ✅ Caching for performance

## Installation

```bash
pnpm add @my-celo-app/config
```

## Usage

### Web Application

```typescript
import { getWebEnv, validateWebEnv } from '@my-celo-app/config';

// Get validated environment (cached)
const env = getWebEnv();
console.log(env.NEXT_PUBLIC_HOSPITAL_TOKEN_ADDRESS);

// Or validate manually
try {
  const env = validateWebEnv();
  // Use env...
} catch (error) {
  console.error('Invalid environment configuration:', error);
}
```

### Smart Contracts

```typescript
import { getContractsEnv, validateContractsEnv } from '@my-celo-app/config';

// Get validated environment (cached)
const env = getContractsEnv();
console.log(env.TOKEN_ADDRESS);

// Or validate manually
const env = validateContractsEnv();
```

### Environment Helpers

```typescript
import { isProduction, isDevelopment, getEnvironment } from '@my-celo-app/config';

if (isProduction()) {
  // Production-only code
}

if (isDevelopment()) {
  // Development-only code
}

const env = getEnvironment(); // 'development' | 'staging' | 'production'
```

## Environment Variables

### Web Application (.env.local)

```bash
# Required
NEXT_PUBLIC_HOSPITAL_TOKEN_ADDRESS=0x209c0138c80C60a570333D03b980e1cA22880fE1

# Optional (with defaults)
NODE_ENV=development
NEXT_PUBLIC_CELO_RPC_URL=https://forno.celo.org
NEXT_PUBLIC_CELO_SEPOLIA_RPC_URL=https://forno.celo-sepolia.celo-testnet.org/
NEXT_PUBLIC_CELO_CHAIN_ID=42220
NEXT_PUBLIC_CELO_SEPOLIA_CHAIN_ID=11142220
NEXT_PUBLIC_ENABLE_TESTNET=false

# Monitoring (optional)
NEXT_PUBLIC_SENTRY_DSN=https://...
NEXT_PUBLIC_ANALYTICS_ID=G-...
SENTRY_AUTH_TOKEN=...
```

### Smart Contracts (.env)

```bash
# Required for deployments
PRIVATE_KEY=your_private_key_here

# Optional
TOKEN_ADDRESS=0x209c0138c80C60a570333D03b980e1cA22880fE1
CELO_RPC_URL=https://forno.celo.org
CELO_SEPOLIA_RPC_URL=https://forno.celo-sepolia.celo-testnet.org/
ETHERSCAN_API_KEY=...
REPORT_GAS=true
RECIPIENT_ADDRESS=0x...
TX_COUNT=1000
AMOUNT=0.000001
```

## Validation

The package validates:

- ✅ Ethereum addresses (0x + 40 hex characters)
- ✅ Private keys (64 hex characters, with or without 0x)
- ✅ URLs (valid HTTP/HTTPS URLs)
- ✅ Chain IDs (positive integers)
- ✅ Numbers (positive values where required)
- ✅ Enums (environment, log level)

## Error Handling

When validation fails, you'll get helpful error messages:

```
❌ Invalid web application environment variables:
  - NEXT_PUBLIC_HOSPITAL_TOKEN_ADDRESS: Invalid Ethereum address format
  - NEXT_PUBLIC_CELO_RPC_URL: Invalid URL format

💡 Tip: Check your .env file and ensure all required variables are set correctly.
```

## Type Safety

All environment variables are fully typed:

```typescript
import type { WebEnv, ContractsEnv } from '@my-celo-app/config';

function useConfig(env: WebEnv) {
  // env.NEXT_PUBLIC_HOSPITAL_TOKEN_ADDRESS is typed as string
  // env.NEXT_PUBLIC_CELO_CHAIN_ID is typed as number
  // env.NEXT_PUBLIC_ENABLE_TESTNET is typed as boolean
}
```

## Best Practices

1. **Validate early**: Call validation functions at app startup
2. **Use caching**: Use `getWebEnv()` and `getContractsEnv()` for cached access
3. **Never commit secrets**: Keep `.env` and `.env.local` in `.gitignore`
4. **Use examples**: Maintain `.env.example` files for documentation
5. **Rotate credentials**: Change private keys and API keys regularly

## Security

- ⚠️ Never commit `.env` or `.env.local` files
- ⚠️ Use `NEXT_PUBLIC_` prefix only for client-safe variables
- ⚠️ Keep private keys in server-side variables only
- ⚠️ Use hardware wallets for production deployments
- ⚠️ Rotate credentials regularly

## License

MIT
