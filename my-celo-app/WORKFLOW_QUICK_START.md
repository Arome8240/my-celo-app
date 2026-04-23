# 🚀 Quick Start: Automated Transfer Generation

## What This Does

Automatically generates token transfer transactions every 6 hours to create on-chain activity for your HospitalToken contract.

## ⚡ 5-Minute Setup

### Step 1: Add GitHub Secrets

Go to your repository → **Settings** → **Secrets and variables** → **Actions**

Add these secrets:

1. **TOKEN_ADDRESS** (Required)
   ```
   0x209c0138c80C60a570333D03b980e1cA22880fE1
   ```

2. **PRIVATE_KEY** (Required)
   ```
   your_wallet_private_key_here
   ```
   ⚠️ Use a dedicated wallet with limited funds!

3. **RECIPIENT_ADDRESS** (Optional)
   ```
   0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
   ```
   Leave empty to send to yourself

### Step 2: Enable Workflow

1. Push the workflow file to your repository
2. Go to **Actions** tab
3. Enable workflows if prompted
4. The workflow will run automatically every 6 hours

### Step 3: Test Manually (Optional)

1. Go to **Actions** tab
2. Click **Generate Token Transfers**
3. Click **Run workflow**
4. Use default values or customize:
   - **tx_count**: 10 (for testing)
   - **amount**: 0.000001
5. Click **Run workflow**
6. Watch it execute!

## 📅 Schedule

The workflow runs at:
- **00:00 UTC** (12:00 AM)
- **06:00 UTC** (6:00 AM)
- **12:00 UTC** (12:00 PM)
- **18:00 UTC** (6:00 PM)

## 💰 Cost Estimate

Per run (1000 transactions):
- **Gas per tx**: ~0.001 CELO
- **Total gas**: ~1 CELO
- **Token amount**: 0.001 HNT (1000 × 0.000001)

Per day (4 runs):
- **Gas**: ~4 CELO
- **Tokens**: 0.004 HNT

## ✅ Verification

After first run:
1. Check **Actions** tab for green checkmark
2. View logs to see transaction hashes
3. Check recipient balance on [Celoscan](https://celoscan.io)

## 🛑 Stop/Pause

### Temporary Stop
1. **Actions** tab → **Generate Token Transfers**
2. Click **⋯** → **Disable workflow**

### Permanent Stop
Delete the workflow file:
```bash
rm .github/workflows/generate-transfers.yml
```

## 🔧 Customize

### Change Frequency

Edit `.github/workflows/generate-transfers.yml`:

```yaml
schedule:
  - cron: '0 */12 * * *'  # Every 12 hours
  # or
  - cron: '0 0 * * *'     # Daily at midnight
```

### Change Amount

Edit workflow file:
```yaml
TX_COUNT: '500'        # 500 transactions instead of 1000
AMOUNT: '0.00001'      # 0.00001 tokens instead of 0.000001
```

## 🆘 Troubleshooting

### "Insufficient funds"
- Add more CELO to sender wallet
- Need ~1 CELO per 1000 transactions

### "Workflow not running"
- Check if workflow is enabled
- Verify secrets are set
- Ensure you're on `main` branch

### "Nonce errors"
- Script handles automatically
- Will retry failed transactions

## 📚 Full Documentation

See [GENERATE_TRANSFERS_SETUP.md](.github/workflows/GENERATE_TRANSFERS_SETUP.md) for:
- Detailed configuration
- Security best practices
- Advanced customization
- Monitoring and alerts

## 🎯 Next Steps

1. ✅ Add secrets to GitHub
2. ✅ Test with manual run
3. ✅ Monitor first automatic run
4. ✅ Adjust parameters if needed
5. ✅ Set up monitoring/alerts

---

**Ready to go!** The workflow will start running automatically every 6 hours. 🎉
