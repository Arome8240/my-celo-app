# 📅 Workflow Schedule

## Generate Token Transfers

### Trigger: Push to Main Branch

The workflow runs automatically whenever you push commits to the main branch.

```yaml
on:
  push:
    branches:
      - main
```

### How It Works

- **Automatic**: Runs on every push to main
- **No schedule**: Triggered by your deployments
- **Manual trigger**: Also available via workflow_dispatch

### Daily Summary

- **Runs**: As many times as you push to main
- **1000 transactions per run** (default)
- **Customizable**: Can adjust via manual trigger

### Cost Per Run

- **Gas**: ~1 CELO per run
- **Tokens**: 0.001 HNT per run

### Manual Trigger

You can also trigger the workflow manually anytime from the GitHub Actions tab with custom parameters:

- `tx_count`: Number of transactions (default: 1000)
- `amount`: Amount per transaction (default: 0.000001)
- `recipient`: Recipient address (optional)

---

## Monitoring

### View Workflow Runs
1. Go to **Actions** tab in GitHub
2. Select **Generate Token Transfers**
3. See all past runs triggered by your pushes

### Check Latest Run
The workflow will appear in the Actions tab after each push to main.

---

## Testing

### Test Immediately

1. Go to **Actions** tab
2. Click **Generate Token Transfers**
3. Click **Run workflow**
4. Select branch: main
5. (Optional) Customize parameters
6. Click **Run workflow** button
7. Watch it execute in real-time

### Test with Custom Parameters

```yaml
tx_count: 10           # Test with just 10 transactions
amount: 0.000001       # Keep default amount
recipient: [optional]  # Leave empty for self-transfer
```

---

## Troubleshooting

### Workflow Not Running After Push

**Possible causes:**
1. Push was not to main branch
2. Workflow disabled
3. Repository Actions disabled
4. Secrets not configured

**Solution:**
- Verify you pushed to main branch
- Check workflow is enabled in Actions tab
- Verify secrets are set (TOKEN_ADDRESS, PRIVATE_KEY)
- Check Actions tab for errors

### Want to Run on Schedule Instead

Edit the workflow file to add a schedule trigger:

```yaml
on:
  push:
    branches:
      - main
  schedule:
    - cron: '15 */6 * * *'  # Every 6 hours at :15 minutes
```

---

## Summary

✅ **Trigger**: Push to main branch
✅ **Automatic**: Runs on every deployment
✅ **Transactions**: 1000 per run (default)
✅ **Manual trigger**: Available anytime
✅ **Customizable**: Adjust parameters via manual trigger

The workflow will run automatically whenever you push to main! 🎉
