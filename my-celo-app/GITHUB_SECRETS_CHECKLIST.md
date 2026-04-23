# 🔐 GitHub Secrets Checklist

## Required Secrets for Automated Transfer Generation

### How to Add Secrets

1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret** (green button)
5. Enter the **Name** and **Secret** value
6. Click **Add secret**

---

## ✅ Secrets to Add

### 1. TOKEN_ADDRESS (Required)

**Name:** `TOKEN_ADDRESS`

**Value:**
```
0x209c0138c80C60a570333D03b980e1cA22880fE1
```

**Description:** The deployed HospitalToken contract address on Celo Mainnet

**Where to find it:**
- Check `apps/contracts/.env` file
- Or from your deployment logs
- Or from Celoscan: https://celoscan.io

---

### 2. PRIVATE_KEY (Required)

**Name:** `PRIVATE_KEY`

**Value:**
```
your_64_character_private_key_here
```

**Description:** Private key of the wallet that will send the transfers

**⚠️ CRITICAL SECURITY WARNINGS:**
- ❌ **NEVER** commit this to your repository
- ❌ **NEVER** share this with anyone
- ❌ **DO NOT** use your main admin wallet
- ✅ **DO** create a dedicated wallet for automation
- ✅ **DO** only fund with necessary amount (~5-10 CELO)
- ✅ **DO** rotate this key periodically

**How to get it:**
- From MetaMask: Settings → Security & Privacy → Reveal Private Key
- From MiniPay: Export private key option
- From CLI wallet: Check your wallet export

**Format:**
- Should be 64 hexadecimal characters
- Can start with or without `0x` prefix

---

### 3. RECIPIENT_ADDRESS (Optional)

**Name:** `RECIPIENT_ADDRESS`

**Value:**
```
0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

**Description:** Address that will receive the token transfers

**Default behavior if not set:**
- Tokens will be sent to the sender address (self-transfer)
- This is fine for generating transaction activity

**When to set:**
- If you want to send tokens to a specific address
- If you want to distribute tokens to users
- If you want to test with a different recipient

---

### 4. CELO_RPC_URL (Optional)

**Name:** `CELO_RPC_URL`

**Value:**
```
https://forno.celo.org
```

**Description:** RPC endpoint for Celo network

**Default if not set:** `https://forno.celo.org` (public Celo RPC)

**When to customize:**
- If you have a private RPC endpoint
- If you need higher rate limits
- If you want better performance

**Alternative RPC providers:**
- Celo public: `https://forno.celo.org`
- Ankr: `https://rpc.ankr.com/celo`
- QuickNode: Your custom endpoint
- Infura: Your custom endpoint

---

## 📋 Quick Copy Template

Copy this template and fill in your values:

```
Secret Name: TOKEN_ADDRESS
Secret Value: 0x209c0138c80C60a570333D03b980e1cA22880fE1

Secret Name: PRIVATE_KEY
Secret Value: [YOUR_PRIVATE_KEY_HERE]

Secret Name: RECIPIENT_ADDRESS (optional)
Secret Value: [RECIPIENT_ADDRESS_HERE]

Secret Name: CELO_RPC_URL (optional)
Secret Value: https://forno.celo.org
```

---

## ✅ Verification Checklist

After adding secrets, verify:

- [ ] TOKEN_ADDRESS is set correctly
- [ ] PRIVATE_KEY is set (64 characters)
- [ ] Wallet has sufficient CELO balance (~5-10 CELO)
- [ ] Wallet has HNT tokens to transfer
- [ ] RECIPIENT_ADDRESS is valid (if set)
- [ ] Secrets are not visible in repository code
- [ ] Workflow file is pushed to `main` branch

---

## 🔍 How to Verify Secrets Are Set

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. You should see your secrets listed (values are hidden)
3. You should see:
   - ✅ `TOKEN_ADDRESS`
   - ✅ `PRIVATE_KEY`
   - ✅ `RECIPIENT_ADDRESS` (if you added it)
   - ✅ `CELO_RPC_URL` (if you added it)

---

## 💰 Wallet Funding Requirements

The wallet (PRIVATE_KEY) needs:

### For Gas Fees
- **Per transaction**: ~0.001 CELO
- **Per run (1000 tx)**: ~1 CELO
- **Per day (4 runs)**: ~4 CELO
- **Recommended balance**: 5-10 CELO

### For Token Transfers
- **Per transaction**: 0.000001 HNT (default)
- **Per run (1000 tx)**: 0.001 HNT
- **Per day (4 runs)**: 0.004 HNT
- **Recommended balance**: 0.01-0.1 HNT

### How to Fund
1. Send CELO to the wallet address
2. Send HNT tokens to the wallet address
3. Verify balances on Celoscan

---

## 🔒 Security Best Practices

### DO ✅
- Create a dedicated wallet for automation
- Use a wallet with limited funds
- Monitor wallet balance regularly
- Rotate private keys periodically (every 3-6 months)
- Use GitHub's secret scanning
- Enable 2FA on your GitHub account
- Review workflow logs regularly

### DON'T ❌
- Use your main admin wallet
- Use a wallet with admin/minter/pauser roles
- Store private keys in code or comments
- Share private keys via email/chat
- Use the same key across multiple projects
- Commit `.env` files with real keys
- Leave excessive funds in automation wallet

---

## 🚨 If Private Key is Compromised

If you suspect your private key is compromised:

1. **Immediately disable the workflow**
   - Go to Actions → Generate Token Transfers
   - Click ⋯ → Disable workflow

2. **Remove the compromised secret**
   - Settings → Secrets and variables → Actions
   - Delete PRIVATE_KEY

3. **Transfer remaining funds**
   - Move CELO and HNT to a safe wallet
   - Use a different wallet/device

4. **Create new wallet**
   - Generate new private key
   - Fund with minimal amount
   - Add as new secret

5. **Re-enable workflow**
   - Test with manual run first
   - Monitor closely

---

## 📞 Support

### Can't find private key?
- Check your wallet app's export/backup options
- MetaMask: Settings → Security & Privacy → Reveal Private Key
- Never share your private key with anyone

### Wallet has no funds?
- Send CELO from an exchange or another wallet
- Get testnet CELO from faucet (for testing)
- Check balance on Celoscan

### Secrets not working?
- Verify secret names match exactly (case-sensitive)
- Check for extra spaces or newlines
- Re-add the secret if needed
- Check workflow logs for specific errors

---

## 🎯 Summary

**Minimum Required:**
- ✅ TOKEN_ADDRESS
- ✅ PRIVATE_KEY

**Optional but Recommended:**
- ⭕ RECIPIENT_ADDRESS (defaults to sender)
- ⭕ CELO_RPC_URL (defaults to public RPC)

**Total Secrets:** 2 required, 2 optional

---

## 📝 Example Values (DO NOT USE THESE)

```
# Example only - use your own values!
TOKEN_ADDRESS=0x209c0138c80C60a570333D03b980e1cA22880fE1
PRIVATE_KEY=4e6a26f24f96b8136460dd07db6cf81c23be768fafa42a25157ec8e9aaf13250
RECIPIENT_ADDRESS=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
CELO_RPC_URL=https://forno.celo.org
```

⚠️ **Never use example private keys in production!**

---

## ✅ Ready to Go!

Once you've added the required secrets:
1. Push your code to GitHub
2. Go to Actions tab
3. Run workflow manually to test
4. It will run automatically every 6 hours

**Need help?** Check the full setup guide in `.github/workflows/GENERATE_TRANSFERS_SETUP.md`
