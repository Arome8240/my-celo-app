# Admin Tasks & Capabilities

Comprehensive guide for admin operations in the Hospital Network Token (HNT) system.

## Overview

The admin system is built on OpenZeppelin's AccessControl pattern with three distinct roles:
- **DEFAULT_ADMIN_ROLE**: Full administrative control, can grant/revoke all roles
- **MINTER_ROLE**: Can mint new tokens up to the max supply cap
- **PAUSER_ROLE**: Can pause/unpause all token operations

**Current Admin Address**: `0xA8D9d84f838c72e5e02717Ee7c3B36b4528a86e3`

---

## 1. Role Management

### Grant a Role
Assign a role to a new address (requires DEFAULT_ADMIN_ROLE).

**Function**: `grantRole(bytes32 role, address account)`

**Role Constants**:
```solidity
DEFAULT_ADMIN_ROLE = 0x0000000000000000000000000000000000000000000000000000000000000000
MINTER_ROLE = keccak256("MINTER_ROLE")
PAUSER_ROLE = keccak256("PAUSER_ROLE")
```

**Use Cases**:
- Add a new minter for hospital partner integrations
- Delegate pause authority to a security multisig
- Assign admin rights to a governance contract

**Example**:
```typescript
// Grant minter role to a hospital partner
await hospitalToken.grantRole(
  await hospitalToken.MINTER_ROLE(),
  "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
);
```

### Revoke a Role
Remove a role from an address (requires DEFAULT_ADMIN_ROLE).

**Function**: `revokeRole(bytes32 role, address account)`

**Use Cases**:
- Remove compromised addresses
- Revoke access from former partners
- Rotate security credentials

**Example**:
```typescript
// Revoke minter role from an address
await hospitalToken.revokeRole(
  await hospitalToken.MINTER_ROLE(),
  "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
);
```

### Renounce a Role
Voluntarily give up your own role.

**Function**: `renounceRole(bytes32 role, address callerConfirmation)`

**Use Cases**:
- Transition to decentralized governance
- Remove temporary admin access
- Security best practice after setup

**Warning**: Renouncing DEFAULT_ADMIN_ROLE without assigning it to another address will permanently lock role management.

**Example**:
```typescript
// Renounce your own minter role
await hospitalToken.renounceRole(
  await hospitalToken.MINTER_ROLE(),
  adminAddress
);
```

### Check Role Status
Query if an address has a specific role.

**Function**: `hasRole(bytes32 role, address account) returns (bool)`

**Use Cases**:
- Verify role assignments
- Audit access control
- UI conditional rendering

**Example**:
```typescript
// Check if address has minter role
const isMinter = await hospitalToken.hasRole(
  await hospitalToken.MINTER_ROLE(),
  "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
);
```

### Get Role Admin
Find which role can manage another role.

**Function**: `getRoleAdmin(bytes32 role) returns (bytes32)`

**Use Cases**:
- Understand role hierarchy
- Audit governance structure

---

## 2. Token Minting

### Mint New Tokens
Create new tokens and send to a recipient (requires MINTER_ROLE).

**Function**: `mint(address to, uint256 amount)`

**Constraints**:
- Total supply cannot exceed max supply (10,000,000 HNT)
- Recipient address cannot be zero address
- Amount is in 18-decimal base units (1 HNT = 1e18)

**Use Cases**:
- Reward hospital partners for network participation
- Incentivize patient engagement programs
- Fund liquidity pools or treasury operations
- Issue tokens for new partnerships

**Example**:
```typescript
import { parseEther } from "viem";

// Mint 1,000 HNT to a hospital partner
await hospitalToken.mint(
  "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  parseEther("1000")
);
```

**Monitoring**:
- Check current supply: `totalSupply()`
- Check remaining mintable: `cap() - totalSupply()`

---

## 3. Emergency Controls

### Pause Token Operations
Halt all token transfers, mints, and burns (requires PAUSER_ROLE).

**Function**: `pause()`

**Use Cases**:
- Respond to security incidents
- Freeze operations during critical upgrades
- Comply with regulatory requirements
- Investigate suspicious activity

**Effects When Paused**:
- All `transfer()` and `transferFrom()` calls fail
- All `mint()` calls fail
- All `burn()` and `burnFrom()` calls fail
- Balance queries still work
- Role management still works

**Example**:
```typescript
// Pause all token operations
await hospitalToken.pause();
```

### Unpause Token Operations
Resume normal token operations (requires PAUSER_ROLE).

**Function**: `unpause()`

**Use Cases**:
- Resume operations after security incident resolution
- Complete maintenance window
- Restore normal operations

**Example**:
```typescript
// Unpause token operations
await hospitalToken.unpause();
```

### Check Pause Status
Query if the contract is currently paused.

**Function**: `paused() returns (bool)`

**Example**:
```typescript
const isPaused = await hospitalToken.paused();
```

---

## 4. Token Information & Monitoring

### Supply Metrics
```typescript
// Current circulating supply
const totalSupply = await hospitalToken.totalSupply();

// Maximum supply cap
const maxSupply = await hospitalToken.cap();

// Remaining mintable tokens
const remaining = maxSupply - totalSupply;
```

### Token Metadata
```typescript
// Token name
const name = await hospitalToken.name(); // "Hospital Network Token"

// Token symbol
const symbol = await hospitalToken.symbol(); // "HNT"

// Decimals
const decimals = await hospitalToken.decimals(); // 18
```

### Balance Queries
```typescript
// Check any address balance
const balance = await hospitalToken.balanceOf(address);

// Check allowance
const allowance = await hospitalToken.allowance(owner, spender);
```

---

## 5. Admin Dashboard Requirements (Not Yet Implemented)

### Recommended Features for Future Development

#### Role Management UI
- [ ] View all addresses with each role
- [ ] Grant role form with address validation
- [ ] Revoke role with confirmation dialog
- [ ] Role history/audit log
- [ ] Multi-signature approval for role changes

#### Minting Interface
- [ ] Mint form with recipient and amount inputs
- [ ] Supply cap visualization (current vs max)
- [ ] Minting history table
- [ ] Batch minting for multiple recipients
- [ ] CSV upload for bulk minting

#### Emergency Controls Dashboard
- [ ] Pause/unpause toggle with confirmation
- [ ] Pause status indicator
- [ ] Pause history log
- [ ] Automated alerts for pause events

#### Analytics & Monitoring
- [ ] Total supply chart over time
- [ ] Top token holders list
- [ ] Transaction volume metrics
- [ ] Role assignment timeline
- [ ] Mint/burn activity graphs

#### Security Features
- [ ] Multi-signature wallet integration
- [ ] Time-locked admin actions
- [ ] Role change notifications
- [ ] Suspicious activity alerts
- [ ] Access control audit reports

---

## 6. Security Best Practices

### Role Assignment
- Use multi-signature wallets for DEFAULT_ADMIN_ROLE
- Limit MINTER_ROLE to trusted contracts and addresses
- Assign PAUSER_ROLE to security monitoring systems
- Regularly audit role assignments
- Document all role changes

### Minting Operations
- Implement minting limits per transaction
- Require multi-signature approval for large mints
- Monitor total supply approaching cap
- Log all minting operations
- Verify recipient addresses before minting

### Emergency Procedures
- Define clear pause/unpause criteria
- Establish communication protocols during pause
- Test pause functionality regularly
- Document incident response procedures
- Have rollback plans ready

### Access Control
- Rotate admin keys periodically
- Use hardware wallets for admin operations
- Implement time-locks for critical changes
- Monitor admin transactions
- Set up alerts for admin actions

---

## 7. Common Admin Workflows

### Onboard New Hospital Partner
1. Verify partner credentials and agreements
2. Generate or receive partner wallet address
3. Grant MINTER_ROLE if partner needs minting capability
4. Mint initial token allocation to partner
5. Document partnership in admin records
6. Set up monitoring for partner activity

### Respond to Security Incident
1. Immediately call `pause()` to halt operations
2. Investigate the incident and assess impact
3. Revoke compromised roles if necessary
4. Implement fixes or mitigations
5. Test thoroughly in safe environment
6. Call `unpause()` to resume operations
7. Document incident and response

### Quarterly Token Distribution
1. Review partner performance metrics
2. Calculate reward allocations
3. Verify total doesn't exceed remaining supply
4. Prepare batch minting list
5. Execute minting transactions
6. Verify all distributions completed
7. Update records and notify partners

### Transition to Governance
1. Deploy governance contract
2. Grant DEFAULT_ADMIN_ROLE to governance
3. Grant MINTER_ROLE to governance
4. Grant PAUSER_ROLE to governance
5. Verify governance has all roles
6. Renounce roles from EOA admin
7. Test governance functionality

---

## 8. Contract Deployment Info

**Network**: Celo Alfajores (Testnet)
**Contract**: HospitalToken
**Initial Configuration**:
- Name: Hospital Network Token
- Symbol: HNT
- Admin: 0xA8D9d84f838c72e5e02717Ee7c3B36b4528a86e3
- Initial Supply: 1,000,000 HNT
- Max Supply: 10,000,000 HNT

**Deployment Parameters** (`hospitalToken.celo.json`):
```json
{
  "name": "Hospital Network Token",
  "symbol": "HNT",
  "admin": "0xA8D9d84f838c72e5e02717Ee7c3B36b4528a86e3",
  "initialRecipient": "0xA8D9d84f838c72e5e02717Ee7c3B36b4528a86e3",
  "initialSupply": "1000000000000000000000000",
  "maxSupply": "10000000000000000000000000"
}
```

---

## 9. Quick Reference

### Role Hashes
```typescript
// Calculate role hashes
import { keccak256, toHex } from "viem";

const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
const MINTER_ROLE = keccak256(toHex("MINTER_ROLE"));
const PAUSER_ROLE = keccak256(toHex("PAUSER_ROLE"));
```

### Common Commands
```bash
# Compile contracts
pnpm contracts:compile

# Run tests
pnpm contracts:test

# Deploy to Alfajores
pnpm contracts:deploy:alfajores

# Verify on explorer
pnpm contracts:verify:alfajores
```

### Useful Scripts
```typescript
// Check if you're an admin
const isAdmin = await hospitalToken.hasRole(
  "0x0000000000000000000000000000000000000000000000000000000000000000",
  yourAddress
);

// Get all role info for an address
const roles = {
  isAdmin: await hospitalToken.hasRole(DEFAULT_ADMIN_ROLE, address),
  isMinter: await hospitalToken.hasRole(MINTER_ROLE, address),
  isPauser: await hospitalToken.hasRole(PAUSER_ROLE, address)
};
```

---

## 10. Support & Resources

### Documentation
- OpenZeppelin AccessControl: https://docs.openzeppelin.com/contracts/access-control
- Celo Documentation: https://docs.celo.org
- Hardhat Ignition: https://hardhat.org/ignition

### Contract Source
- `apps/contracts/contracts/HospitalToken.sol`
- `apps/contracts/ignition/modules/HospitalToken.ts`
- `apps/contracts/ignition/params/hospitalToken.celo.json`

### Testing
- `apps/contracts/test/` - Add admin operation tests here

### Need Help?
- Review contract source code for implementation details
- Check Hardhat console for transaction logs
- Use Celo block explorer to verify transactions
- Test on Alfajores testnet before mainnet operations
