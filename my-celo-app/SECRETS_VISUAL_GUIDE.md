# 🎨 Visual Guide: GitHub Secrets Setup

## 📊 Secrets Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    GITHUB SECRETS NEEDED                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ✅ REQUIRED (2)                                             │
│  ├─ TOKEN_ADDRESS      → Contract address                   │
│  └─ PRIVATE_KEY        → Wallet private key                 │
│                                                              │
│  ⭕ OPTIONAL (2)                                             │
│  ├─ RECIPIENT_ADDRESS  → Where to send tokens               │
│  └─ CELO_RPC_URL       → Custom RPC endpoint                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 Secret #1: TOKEN_ADDRESS (Required)

```
┌──────────────────────────────────────────────────────┐
│ Secret Name: TOKEN_ADDRESS                           │
├──────────────────────────────────────────────────────┤
│ What it is:                                          │
│   The deployed HospitalToken contract address       │
│                                                      │
│ Value:                                               │
│   0x209c0138c80C60a570333D03b980e1cA22880fE1       │
│                                                      │
│ Where to find:                                       │
│   • apps/contracts/.env file                        │
│   • Deployment logs                                 │
│   • Celoscan.io                                     │
│                                                      │
│ Format:                                              │
│   • Starts with 0x                                  │
│   • 42 characters total                             │
│   • Hexadecimal (0-9, a-f)                          │
└──────────────────────────────────────────────────────┘
```

**Example:**
```
Name:  TOKEN_ADDRESS
Value: 0x209c0138c80C60a570333D03b980e1cA22880fE1
```

---

## 🔐 Secret #2: PRIVATE_KEY (Required)

```
┌──────────────────────────────────────────────────────┐
│ Secret Name: PRIVATE_KEY                             │
├──────────────────────────────────────────────────────┤
│ What it is:                                          │
│   Private key of wallet that sends transfers        │
│                                                      │
│ ⚠️  SECURITY CRITICAL:                               │
│   • NEVER share this key                            │
│   • NEVER commit to repository                      │
│   • Use dedicated wallet only                       │
│   • Fund with minimal amount                        │
│                                                      │
│ Format:                                              │
│   • 64 hexadecimal characters                       │
│   • Can start with or without 0x                    │
│                                                      │
│ Where to get:                                        │
│   • MetaMask: Settings → Security → Reveal Key     │
│   • MiniPay: Export private key                     │
│   • CLI wallet: Export command                      │
└──────────────────────────────────────────────────────┘
```

**Example Format (DO NOT USE THIS KEY):**
```
Name:  PRIVATE_KEY
Value: 4e6a26f24f96b8136460dd07db6cf81c23be768fafa42a25157ec8e9aaf13250
```

---

## 📬 Secret #3: RECIPIENT_ADDRESS (Optional)

```
┌──────────────────────────────────────────────────────┐
│ Secret Name: RECIPIENT_ADDRESS                       │
├──────────────────────────────────────────────────────┤
│ What it is:                                          │
│   Address that receives the token transfers         │
│                                                      │
│ Default if not set:                                  │
│   Sends to sender address (self-transfer)           │
│                                                      │
│ When to set:                                         │
│   • Want to send to specific address                │
│   • Testing with different recipient                │
│   • Distributing tokens to users                    │
│                                                      │
│ Format:                                              │
│   • Starts with 0x                                  │
│   • 42 characters total                             │
│   • Valid Celo address                              │
└──────────────────────────────────────────────────────┘
```

**Example:**
```
Name:  RECIPIENT_ADDRESS
Value: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

---

## 🌐 Secret #4: CELO_RPC_URL (Optional)

```
┌──────────────────────────────────────────────────────┐
│ Secret Name: CELO_RPC_URL                            │
├──────────────────────────────────────────────────────┤
│ What it is:                                          │
│   RPC endpoint for Celo blockchain                  │
│                                                      │
│ Default if not set:                                  │
│   https://forno.celo.org (public RPC)               │
│                                                      │
│ When to customize:                                   │
│   • Have private RPC endpoint                       │
│   • Need higher rate limits                         │
│   • Want better performance                         │
│                                                      │
│ Options:                                             │
│   • Celo: https://forno.celo.org                    │
│   • Ankr: https://rpc.ankr.com/celo                 │
│   • QuickNode: Your custom endpoint                 │
│   • Infura: Your custom endpoint                    │
└──────────────────────────────────────────────────────┘
```

**Example:**
```
Name:  CELO_RPC_URL
Value: https://forno.celo.org
```

---

## 📋 Step-by-Step Setup

```
Step 1: Go to GitHub Repository
   ↓
   https://github.com/your-username/your-repo
   
Step 2: Click "Settings" (top menu)
   ↓
   [Home] [Code] [Issues] [Pull requests] [Actions] [Settings] ← Click here
   
Step 3: Click "Secrets and variables" → "Actions"
   ↓
   Left sidebar:
   • General
   • Collaborators
   • Secrets and variables ← Click here
     └─ Actions ← Click here
   
Step 4: Click "New repository secret"
   ↓
   [New repository secret] ← Green button
   
Step 5: Add each secret
   ↓
   Name:   [TOKEN_ADDRESS                              ]
   Secret: [0x209c0138c80C60a570333D03b980e1cA22880fE1]
   
   [Add secret] ← Click to save
   
Step 6: Repeat for all secrets
   ↓
   • TOKEN_ADDRESS ✅
   • PRIVATE_KEY ✅
   • RECIPIENT_ADDRESS (optional) ⭕
   • CELO_RPC_URL (optional) ⭕
```

---

## 💰 Wallet Funding Guide

```
┌─────────────────────────────────────────────────────┐
│              WALLET FUNDING REQUIREMENTS             │
├─────────────────────────────────────────────────────┤
│                                                      │
│  CELO (for gas fees)                                │
│  ├─ Per transaction:  ~0.001 CELO                   │
│  ├─ Per run (1000):   ~1 CELO                       │
│  ├─ Per day (4 runs): ~4 CELO                       │
│  └─ Recommended:      5-10 CELO                     │
│                                                      │
│  HNT (for transfers)                                │
│  ├─ Per transaction:  0.000001 HNT                  │
│  ├─ Per run (1000):   0.001 HNT                     │
│  ├─ Per day (4 runs): 0.004 HNT                     │
│  └─ Recommended:      0.01-0.1 HNT                  │
│                                                      │
└─────────────────────────────────────────────────────┘

How to fund:
1. Get wallet address from private key
2. Send CELO from exchange or another wallet
3. Send HNT tokens to same address
4. Verify on Celoscan: https://celoscan.io
```

---

## ✅ Verification Checklist

```
Before running workflow:

□ TOKEN_ADDRESS added to GitHub secrets
□ PRIVATE_KEY added to GitHub secrets
□ Wallet has CELO balance (check Celoscan)
□ Wallet has HNT balance (check Celoscan)
□ Secrets are not in code/comments
□ Workflow file pushed to main branch
□ Actions enabled in repository

Optional:
□ RECIPIENT_ADDRESS added (if needed)
□ CELO_RPC_URL added (if custom)
```

---

## 🎯 Quick Reference Card

```
╔═══════════════════════════════════════════════════╗
║           GITHUB SECRETS QUICK REFERENCE          ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║  Required Secrets (2):                            ║
║  ┌─────────────────────────────────────────────┐ ║
║  │ TOKEN_ADDRESS                               │ ║
║  │ 0x209c0138c80C60a570333D03b980e1cA22880fE1 │ ║
║  └─────────────────────────────────────────────┘ ║
║  ┌─────────────────────────────────────────────┐ ║
║  │ PRIVATE_KEY                                 │ ║
║  │ [Your 64-character private key]             │ ║
║  └─────────────────────────────────────────────┘ ║
║                                                   ║
║  Optional Secrets (2):                            ║
║  ┌─────────────────────────────────────────────┐ ║
║  │ RECIPIENT_ADDRESS                           │ ║
║  │ [Recipient wallet address]                  │ ║
║  └─────────────────────────────────────────────┘ ║
║  ┌─────────────────────────────────────────────┐ ║
║  │ CELO_RPC_URL                                │ ║
║  │ https://forno.celo.org                      │ ║
║  └─────────────────────────────────────────────┘ ║
║                                                   ║
║  Wallet Needs:                                    ║
║  • 5-10 CELO (for gas)                            ║
║  • 0.01-0.1 HNT (for transfers)                   ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
```

---

## 🚨 Security Warnings

```
┌─────────────────────────────────────────────────────┐
│                  ⚠️  CRITICAL ⚠️                     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  NEVER:                                              │
│  ❌ Share private key with anyone                   │
│  ❌ Commit private key to repository                │
│  ❌ Use main admin wallet                           │
│  ❌ Store in code or comments                       │
│  ❌ Send via email or chat                          │
│                                                      │
│  ALWAYS:                                             │
│  ✅ Use dedicated automation wallet                 │
│  ✅ Fund with minimal amount only                   │
│  ✅ Monitor wallet regularly                        │
│  ✅ Rotate keys every 3-6 months                    │
│  ✅ Enable 2FA on GitHub                            │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 📞 Need Help?

```
Issue: Can't find private key
→ Check wallet app's export/backup options
→ MetaMask: Settings → Security & Privacy → Reveal Private Key

Issue: Wallet has no funds
→ Send CELO from exchange or another wallet
→ Check balance on Celoscan

Issue: Secrets not working
→ Verify secret names match exactly (case-sensitive)
→ Check for extra spaces or newlines
→ Re-add the secret if needed

Issue: Workflow not running
→ Check if workflow is enabled
→ Verify secrets are set
→ Ensure on main branch
```

---

## ✅ You're Ready!

Once all secrets are added:
1. ✅ Push code to GitHub
2. ✅ Go to Actions tab
3. ✅ Test with manual run
4. ✅ Workflow runs every 6 hours automatically

**Total setup time: ~5 minutes** ⏱️
