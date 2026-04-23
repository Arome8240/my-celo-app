# Generate Transfers Workflow Setup

This workflow automatically runs the `generate-transfers.ts` script every 6 hours to create token transfer transactions.

## Schedule

- **Frequency**: Every 6 hours
- **Cron**: `0 */6 * * *` (runs at 00:00, 06:00, 12:00, 18:00 UTC)
- **Manual Trigger**: Available via GitHub Actions UI

## Required Secrets

You must configure these secrets in your GitHub repository:

### 1. TOKEN_ADDRESS (Required)
The deployed HospitalToken contract address.

```
TOKEN_ADDRESS=0x209c0138c80C60a570333D03b980e1cA22880fE1
```

### 2. PRIVATE_KEY (Required)
The private key of the wallet that will send the transfers.

⚠️ **SECURITY WARNING**: Never commit private keys to your repository!

```
PRIVATE_KEY=your_private_key_here
```

### 3. RECIPIENT_ADDRESS (Optional)
The address that will receive the tokens. If not set, defaults to the sender address.

```
RECIPIENT_ADDRESS=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

### 4. CELO_RPC_URL (Optional)
Custom RPC URL for Celo. Defaults to `https://forno.celo.org`.

```
CELO_RPC_URL=https://forno.celo.org
```

## How to Add Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with its name and value
5. Click **Add secret**

## Default Configuration

When running automatically (every 6 hours):
- **TX_COUNT**: 1000 transactions
- **AMOUNT**: 0.000001 tokens per transaction
- **RECIPIENT**: Sender address (if not specified)
- **NETWORK**: Celo Mainnet

## Manual Trigger

You can manually trigger the workflow with custom parameters:

1. Go to **Actions** tab in your repository
2. Select **Generate Token Transfers** workflow
3. Click **Run workflow**
4. Fill in optional parameters:
   - **tx_count**: Number of transactions (default: 1000)
   - **amount**: Amount per transaction (default: 0.000001)
   - **recipient**: Recipient address (optional)
5. Click **Run workflow**

## Workflow Features

### ✅ Automatic Execution
- Runs every 6 hours without manual intervention
- Continues running even if previous run failed

### 📊 Logging
- Detailed execution logs
- Transaction hashes for each transfer
- Nonce tracking and error handling

### 📦 Artifacts
- Execution logs saved for 7 days
- Accessible from workflow run page

### 🔔 Notifications
- Success/failure status in workflow summary
- Detailed execution report

### 🛡️ Safety Features
- Only runs on `main` branch
- Requires secrets to be configured
- Nonce error handling and retry logic
- Graceful error handling

## Monitoring

### View Workflow Runs
1. Go to **Actions** tab
2. Select **Generate Token Transfers**
3. View recent runs and their status

### Check Logs
1. Click on a workflow run
2. Click on **Generate Token Transfers** job
3. Expand steps to view detailed logs

### Download Artifacts
1. Scroll to bottom of workflow run page
2. Download **transfer-logs-{run_number}**

## Customization

### Change Schedule

Edit `.github/workflows/generate-transfers.yml`:

```yaml
schedule:
  - cron: '0 */6 * * *'  # Every 6 hours
  # - cron: '0 */12 * * *'  # Every 12 hours
  # - cron: '0 0 * * *'     # Daily at midnight
  # - cron: '0 0 * * 0'     # Weekly on Sunday
```

### Change Default Values

Edit the workflow file:

```yaml
TX_COUNT: ${{ github.event.inputs.tx_count || '1000' }}  # Change 1000
AMOUNT: ${{ github.event.inputs.amount || '0.000001' }}  # Change 0.000001
```

### Add Slack/Discord Notifications

Add a notification step:

```yaml
- name: Notify Slack
  if: always()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
    payload: |
      {
        "text": "Transfer generation ${{ job.status }}"
      }
```

## Troubleshooting

### Workflow Not Running

**Check:**
1. Workflow is enabled (Actions tab → Enable workflow)
2. Repository has Actions enabled
3. Secrets are configured correctly
4. You're on the `main` branch

### Insufficient Funds

**Error**: `insufficient funds for gas`

**Solution**:
- Ensure sender wallet has enough CELO for gas
- Each transaction requires ~0.001 CELO for gas
- For 1000 transactions, need ~1 CELO

### Nonce Errors

**Error**: `nonce too low` or `nonce too high`

**Solution**:
- Script automatically handles nonce errors
- Resyncs nonce and retries
- If persistent, check for pending transactions

### Rate Limiting

**Error**: `rate limit exceeded`

**Solution**:
- Reduce TX_COUNT
- Use custom RPC URL with higher limits
- Add delays between transactions (modify script)

### Contract Paused

**Error**: `Pausable: paused`

**Solution**:
- Check if contract is paused
- Unpause contract if you have PAUSER_ROLE
- Wait for contract to be unpaused

## Security Best Practices

### 1. Use Dedicated Wallet
- Create a separate wallet for automated transfers
- Only fund with necessary amount
- Don't use your main admin wallet

### 2. Limit Permissions
- Wallet only needs transfer capability
- No admin/minter/pauser roles needed
- Minimize risk if compromised

### 3. Monitor Activity
- Check workflow runs regularly
- Review transaction logs
- Set up alerts for failures

### 4. Rotate Keys
- Periodically rotate private keys
- Update GitHub secrets
- Test after rotation

### 5. Use Environment-Specific Secrets
- Different keys for testnet/mainnet
- Separate workflows for each environment

## Example Workflow Run

```
✅ Successfully generated transfers

Details:
- Transactions: 1000
- Amount: 0.000001 tokens
- Network: Celo Mainnet
- Run: #42
- Timestamp: 2026-04-22 12:00:00 UTC

Logs:
[1/1000] sent: 0xabc...123 (nonce: 100)
[2/1000] sent: 0xdef...456 (nonce: 101)
...
[1000/1000] sent: 0x789...xyz (nonce: 1099)

Completed 1000 transfer transactions.
```

## Disabling the Workflow

### Temporary Disable
1. Go to **Actions** tab
2. Select **Generate Token Transfers**
3. Click **⋯** (three dots)
4. Click **Disable workflow**

### Permanent Disable
Delete or rename the workflow file:
```bash
rm .github/workflows/generate-transfers.yml
```

## Testing

### Test on Testnet First

1. Create a testnet workflow:
   ```yaml
   name: Generate Transfers (Testnet)
   # ... same config but use celo-alfajores network
   ```

2. Configure testnet secrets:
   - `TESTNET_TOKEN_ADDRESS`
   - `TESTNET_PRIVATE_KEY`
   - `TESTNET_RPC_URL`

3. Test thoroughly before enabling mainnet workflow

### Manual Test

Run locally before deploying:
```bash
cd apps/contracts

# Set environment variables
export TOKEN_ADDRESS=0x209c0138c80C60a570333D03b980e1cA22880fE1
export PRIVATE_KEY=your_private_key
export TX_COUNT=10
export AMOUNT=0.000001

# Run script
npx hardhat run scripts/generate-transfers.ts --network celo
```

## Support

For issues or questions:
- Check workflow logs in Actions tab
- Review script output in artifacts
- Verify secrets are configured
- Test locally first
- Check Celo network status

## Changelog

### v1.0.0 (2026-04-22)
- Initial workflow creation
- Every 6 hours schedule
- Manual trigger support
- Artifact logging
- Error handling
