# Codebase Index

Monorepo for a Celo dApp template using Turborepo, Next.js, and Hardhat.

## Workspace Overview

- `apps/web`: Next.js 14 frontend (App Router, Tailwind, wallet integration)
- `apps/contracts`: Hardhat smart contract workspace for Celo
- `package.json`: root scripts that orchestrate all apps via Turbo
- `turbo.json`: Turborepo pipeline config
- `pnpm-workspace.yaml`: workspace package boundaries

## Root Commands

- `pnpm dev`: run all app dev servers
- `pnpm build`: build all workspaces
- `pnpm lint`: lint all workspaces
- `pnpm type-check`: run TypeScript checks
- `pnpm contracts:compile|test|deploy*`: delegate contract workflows to `apps/contracts`

## Frontend (`apps/web`)

### Key Config Files

- `apps/web/package.json`: Next scripts and web dependencies
- `apps/web/next.config.js`: Next configuration
- `apps/web/tailwind.config.js`: Tailwind configuration
- `apps/web/postcss.config.js`: PostCSS setup
- `apps/web/tsconfig.json`: TypeScript config for frontend
- `apps/web/.env.template`: environment variable template

### App Entry Points

- `apps/web/src/app/layout.tsx`: global shell (`WalletProvider`, `Navbar`, page container)
- `apps/web/src/app/page.tsx`: landing page/hero and user balance UI
- `apps/web/src/app/globals.css`: global styles

### Components

- `apps/web/src/components/wallet-provider.tsx`: wallet and chain context provider
- `apps/web/src/components/connect-button.tsx`: wallet connect UI
- `apps/web/src/components/user-balance.tsx`: connected account balance display
- `apps/web/src/components/navbar.tsx`: app-wide navigation header
- `apps/web/src/components/ui/*`: reusable UI primitives (`button`, `card`, `sheet`)

### Utility Modules

- `apps/web/src/lib/app-utils.ts`: app helpers (currency, address formatting/validation, sleep)
- `apps/web/src/lib/utils.ts`: shared utility helpers

## Contracts (`apps/contracts`)

### Key Config Files

- `apps/contracts/package.json`: Hardhat scripts
- `apps/contracts/hardhat.config.ts`: compiler, Celo networks, explorer config
- `apps/contracts/tsconfig.json`: TypeScript config for contracts
- `apps/contracts/.env.example`: required env vars (`PRIVATE_KEY`, `ETHERSCAN_API_KEY`)
- `apps/contracts/README.md`: contract workflow and network docs

### Contract Source + Runtime Artifacts

- `apps/contracts/contracts/Lock.sol`: sample timelock contract
- `apps/contracts/test/Lock.ts`: contract tests
- `apps/contracts/ignition/modules/Lock.ts`: deployment module

## Suggested Navigation Path (First Read)

1. `README.md` (root)
2. `apps/web/src/app/layout.tsx`
3. `apps/web/src/app/page.tsx`
4. `apps/web/src/components/wallet-provider.tsx`
5. `apps/contracts/hardhat.config.ts`
6. `apps/contracts/contracts/Lock.sol`

