# Admin Dashboard

Mobile-responsive admin dashboard for managing the Hospital Network Token (HNT).

## Features

### 1. Overview Tab
- Real-time contract status (Active/Paused)
- Your assigned roles (Admin, Minter, Pauser)
- Supply metrics with visual progress bar
- Total supply, max supply, and remaining mintable tokens

### 2. Role Management Tab
- Grant roles to addresses (Admin, Minter, Pauser)
- Revoke roles from addresses
- Check role status for any address
- Visual role selection with descriptions
- Requires: DEFAULT_ADMIN_ROLE

### 3. Token Minting Tab
- Mint new HNT tokens to any address
- Supply cap validation
- Quick amount buttons (100, 1K, 10K, 100K)
- Real-time remaining supply tracking
- Minting guidelines and warnings
- Requires: MINTER_ROLE

### 4. Emergency Controls Tab
- Pause all token operations (transfers, mints, burns)
- Unpause to resume normal operations
- Confirmation dialogs for safety
- Emergency procedures documentation
- Requires: PAUSER_ROLE

## Setup

### 1. Deploy Contract
First, deploy the HospitalToken contract:

```bash
cd apps/contracts
pnpm contracts:deploy:alfajores
```

### 2. Configure Contract Address
Copy the deployed contract address and update your environment:

```bash
cd apps/web
cp .env.template .env.local
```

Edit `.env.local` and set:
```
NEXT_PUBLIC_HOSPITAL_TOKEN_ADDRESS=0xYourDeployedContractAddress
```

### 3. Run Development Server
```bash
pnpm dev
```

Navigate to `http://localhost:3000/admin`

## Mobile Responsive Design

The admin dashboard is fully optimized for mobile devices:

- Responsive grid layouts that stack on mobile
- Touch-friendly buttons and inputs
- Horizontal scrolling tabs on small screens
- Compact card layouts
- Mobile-optimized text sizes
- Collapsible sections for better space usage

### Breakpoints
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (sm-lg)
- Desktop: > 1024px (lg+)

## Access Control

The dashboard automatically checks your wallet's roles:

- **No roles**: View-only access to overview
- **MINTER_ROLE**: Can mint tokens
- **PAUSER_ROLE**: Can pause/unpause contract
- **DEFAULT_ADMIN_ROLE**: Full access to all features

## Security Best Practices

1. **Role Assignment**
   - Use multi-signature wallets for admin operations
   - Regularly audit role assignments
   - Document all role changes

2. **Minting**
   - Verify recipient addresses before minting
   - Monitor total supply approaching cap
   - Use batch operations for efficiency

3. **Emergency Controls**
   - Only pause in genuine emergencies
   - Document pause reasons
   - Communicate with stakeholders
   - Test unpause in safe environment first

## Contract Roles

### DEFAULT_ADMIN_ROLE
- Hash: `0x0000000000000000000000000000000000000000000000000000000000000000`
- Can grant and revoke all roles
- Full administrative control

### MINTER_ROLE
- Hash: `0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6`
- Can mint new tokens up to max supply
- Cannot exceed 10,000,000 HNT cap

### PAUSER_ROLE
- Hash: `0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a`
- Can pause and unpause all token operations
- Emergency control authority

## Troubleshooting

### "Admin Access Required"
- Your wallet doesn't have the required role
- Contact the contract admin to grant you access

### "Transaction Failed"
- Check you have enough CELO for gas
- Verify you're on the correct network (Alfajores/Mainnet)
- Ensure contract is not paused (for minting)
- Check you haven't exceeded supply cap

### Contract Address Not Set
- Verify `.env.local` has `NEXT_PUBLIC_HOSPITAL_TOKEN_ADDRESS`
- Restart the development server after changing env vars
- Check the address is valid and deployed

## Tech Stack

- **Next.js 14**: App Router with React Server Components
- **Wagmi v2**: React hooks for Ethereum
- **Viem**: TypeScript Ethereum library
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **Lucide Icons**: Beautiful icon set

## File Structure

```
apps/web/src/
├── app/
│   └── admin/
│       └── page.tsx              # Main admin page
├── components/
│   ├── admin/
│   │   ├── admin-overview.tsx    # Overview tab
│   │   ├── role-management.tsx   # Role management tab
│   │   ├── token-minting.tsx     # Minting tab
│   │   └── emergency-controls.tsx # Emergency tab
│   └── ui/                       # Reusable UI components
└── lib/
    └── contracts.ts              # Contract ABI and config
```

## Development

### Adding New Features

1. Create component in `components/admin/`
2. Add tab in `app/admin/page.tsx`
3. Update contract ABI if needed in `lib/contracts.ts`
4. Test on Alfajores testnet first

### Testing

1. Deploy contract to Alfajores
2. Grant yourself test roles
3. Test each feature thoroughly
4. Verify mobile responsiveness
5. Check error handling

## Support

For issues or questions:
- Review `ADMIN_TASKS.md` for detailed operations guide
- Check contract source in `apps/contracts/contracts/HospitalToken.sol`
- Test on Alfajores before mainnet operations
