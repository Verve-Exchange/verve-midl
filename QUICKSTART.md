# Quick Start Guide - MIDL DeFi Exchange

Get up and running in 5 minutes!

## Prerequisites

✅ Node.js 18+ installed  
✅ pnpm installed (`npm install -g pnpm`)  
✅ Xverse wallet installed  
✅ 5 minutes of your time  

## Step 1: Clone & Install (1 min)

```bash
git clone <your-repo-url>
cd midl-defi-exchange
pnpm install
```

## Step 2: Configure Environment (1 min)

```bash
# Copy environment file
cp apps/dashboard/.env.example apps/dashboard/.env.local

# Set your mnemonic
npx hardhat vars set MNEMONIC
# Paste: test test test test test test test test test test test junk
```

## Step 3: Get Regtest BTC (1 min)

```bash
# Get your Bitcoin address
npx hardhat midl:address
# Output: bcrt1q...

# Visit faucet and claim BTC
# https://faucet.midl.xyz
```

## Step 4: Deploy Contract (1 min)

```bash
pnpm deploy:contracts
# Copy the contract address from output
```

Update `.env.local`:
```env
NEXT_PUBLIC_PERP_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

## Step 5: Run the App (1 min)

```bash
pnpm dev
# Visit http://localhost:3000
```

## First Trade

1. Click "Connect Wallet"
2. Approve Xverse connection
3. Add MIDL Regtest network (when prompted)
4. Enter trade details:
   - Size: `0.01` ETH
   - Leverage: `2x`
5. Click "Buy / Long"
6. Approve in Xverse
7. Wait for confirmation (~1-2 min)
8. 🎉 Position opened!

## Troubleshooting

### "Insufficient funds"
→ Claim more BTC from faucet

### "Network not found"
→ Click "Add Network" button in app

### "Transaction failed"
→ Check Bitcoin confirmations on mempool.staging.midl.xyz

### "Contract not found"
→ Verify contract address in `.env.local`

## Next Steps

- 📖 Read [README.md](README.md) for full documentation
- 🚀 Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- 🧪 See [TESTING.md](TESTING.md) for testing guide
- 🏗️ Review [ARCHITECTURE.md](ARCHITECTURE.md) for technical details

## Need Help?

💬 Join [VibeHack Discord](https://discord.gg/midl)  
📚 Read [MIDL Docs](https://docs.midl.xyz)  
🐛 Report issues on GitHub  

---

**Happy Trading! 🚀**
