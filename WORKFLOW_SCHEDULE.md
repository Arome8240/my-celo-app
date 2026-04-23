# 📅 Workflow Schedule

## Generate Token Transfers

### Schedule: Every 6 Hours Starting at 8:15 UTC

```
Cron: '15 2,8,14,20 * * *'
```

### Run Times (UTC)

| Time (UTC) | Time (EST) | Time (PST) | Description |
|------------|------------|------------|-------------|
| **02:15** | 21:15 (prev day) | 18:15 (prev day) | Night run |
| **08:15** | 03:15 | 00:15 | Early morning |
| **14:15** | 09:15 | 06:15 | Morning |
| **20:15** | 15:15 | 12:15 | Afternoon |

### Daily Summary

- **4 runs per day**
- **6 hours between each run**
- **1000 transactions per run** (default)
- **4000 transactions per day** (total)

### Cost Per Day

- **Gas**: ~4 CELO (1 CELO per run)
- **Tokens**: 0.004 HNT (0.001 HNT per run)

### Manual Trigger

You can also trigger the workflow manually anytime from the GitHub Actions tab with custom parameters.

---

## Time Zone Conversions

### For Different Time Zones

**UTC → Your Local Time:**

| UTC Time | GMT+0 | GMT+1 | GMT+2 | GMT+3 | GMT+8 | GMT-5 (EST) | GMT-8 (PST) |
|----------|-------|-------|-------|-------|-------|-------------|-------------|
| 02:15 | 02:15 | 03:15 | 04:15 | 05:15 | 10:15 | 21:15 (prev) | 18:15 (prev) |
| 08:15 | 08:15 | 09:15 | 10:15 | 11:15 | 16:15 | 03:15 | 00:15 |
| 14:15 | 14:15 | 15:15 | 16:15 | 17:15 | 22:15 | 09:15 | 06:15 |
| 20:15 | 20:15 | 21:15 | 22:15 | 23:15 | 04:15 (next) | 15:15 | 12:15 |

---

## Next Run Calculator

To find when the next run will occur:

1. Check current UTC time
2. Find the next scheduled time (02:15, 08:15, 14:15, or 20:15)
3. Calculate hours until next run

**Example:**
- Current time: 10:00 UTC
- Next run: 14:15 UTC
- Time until next run: 4 hours 15 minutes

---

## Monitoring

### View Workflow Runs
1. Go to **Actions** tab in GitHub
2. Select **Generate Token Transfers**
3. See all past and scheduled runs

### Check Next Scheduled Run
GitHub Actions will show the next scheduled run time in the workflow page.

---

## Customization

### Change Schedule

Edit `.github/workflows/generate-transfers.yml`:

```yaml
# Every 12 hours starting at 8:15
- cron: '15 8,20 * * *'

# Every 8 hours starting at 8:15
- cron: '15 0,8,16 * * *'

# Every 4 hours starting at 8:15
- cron: '15 0,4,8,12,16,20 * * *'

# Daily at 8:15
- cron: '15 8 * * *'

# Twice daily at 8:15 and 20:15
- cron: '15 8,20 * * *'
```

### Cron Syntax Reference

```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
│ │ │ │ │
* * * * *
```

**Examples:**
- `15 8 * * *` - Daily at 8:15
- `15 */6 * * *` - Every 6 hours at :15 minutes
- `15 2,8,14,20 * * *` - At 2:15, 8:15, 14:15, 20:15
- `0 0 * * 0` - Weekly on Sunday at midnight

---

## Testing

### Test Immediately

1. Go to **Actions** tab
2. Click **Generate Token Transfers**
3. Click **Run workflow**
4. Click **Run workflow** button
5. Watch it execute in real-time

### Test with Custom Parameters

```yaml
tx_count: 10           # Test with just 10 transactions
amount: 0.000001       # Keep default amount
recipient: [optional]  # Leave empty for self-transfer
```

---

## Troubleshooting

### Workflow Not Running at Expected Time

**Possible causes:**
1. GitHub Actions queue delay (can be 5-15 minutes late)
2. Workflow disabled
3. Repository Actions disabled
4. Secrets not configured

**Solution:**
- Check workflow is enabled
- Verify secrets are set
- Wait 15 minutes past scheduled time
- Check Actions tab for errors

### Want to Change Start Time

Edit the cron schedule in the workflow file:

```yaml
# Start at 9:30 instead of 8:15
- cron: '30 3,9,15,21 * * *'

# Start at 12:00 instead of 8:15
- cron: '0 0,6,12,18 * * *'
```

---

## Summary

✅ **Schedule**: Every 6 hours starting at 8:15 UTC
✅ **Run times**: 02:15, 08:15, 14:15, 20:15 UTC
✅ **Frequency**: 4 times per day
✅ **Transactions**: 1000 per run (4000 per day)
✅ **Manual trigger**: Available anytime

The workflow will run automatically at these times without any manual intervention! 🎉
