# Deployment Guide - MIDL DeFi Exchange

Complete guide for deploying the MIDL DeFi Exchange to production.

## Prerequisites

1. **Xverse Wallet** with MIDL Regtest network added
2. **Regtest BTC** from faucet (minimum 0.01 BTC recommended)
3. **Node.js 18+** and **pnpm** installed
4. **Hardhat** configured with your mnemonic

## Step 1: Environment Setup

### 1.1 Clone and Install

```bash
git clone <your-repo>
cd midl-defi-exchange
pnpm install
```

### 1.2 Configure Environment

```bash
cp apps/dashboard/.env.example apps/dashboard/.env.local
```

Edit `apps/dashboard/.env.local`:

```env
NEXT_PUBLIC_MIDL_NETWORK=regtest
NEXT_PUBLIC_RPC_URL=https://rpc.staging.midl.xyz
NEXT_PUBLIC_INDEXER_URL=https://mempool.staging.midl.xyz
NEXT_PUBLIC_BLOCKSCOUT_URL=https://blockscout.staging.midl.xyz
NEXT_PUBLIC_CHAIN_ID=1337
NEXT_PUBLIC_APP_NAME="MIDL DeFi Exchange"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 2: Smart Contract Deployment

### 2.1 Set Mnemonic

```bash
npx hardhat vars set MNEMONIC
```

When prompted, paste your 12 or 24-word mnemonic phrase.

**SECURITY WARNING**: Never commit your mnemonic to version control!

### 2.2 Get Bitcoin Address

```bash
pnpm hardhat midl:address
```

Example output:
```
Bitcoin Address: bcrt1qf3r47tdpkn4rq6gq8kkfhw7l60q08lemmahgmf (p2wpkh)
EVM Address: 0x013dbbdb1116f4f5f8252a3bf016322f094fe8dd
```

### 2.3 Claim Regtest BTC

Visit [https://faucet.midl.xyz](https://faucet.midl.xyz) and enter your Bitcoin address.

Alternatively, request BTC in the VibeHack Discord channel.

### 2.4 Deploy Contract

```bash
pnpm deploy:contracts
```

Expected output:
```
🚀 Starting PerpetualExchange deployment...
Deploying PerpetualExchange...
✅ PerpetualExchange deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
✅ PerpetualExchange deployed successfully!
```

### 2.5 Update Environment

Add the contract address to `.env.local`:

```env
NEXT_PUBLIC_PERP_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### 2.6 Verify Contract

```bash
pnpm verify:contract 0x5FbDB2315678afecb367f032d93F642f64180aa3 --network regtest
```

Verification URL: [https://blockscout.staging.midl.xyz](https://blockscout.staging.midl.xyz)

## Step 3: Frontend Deployment

### 3.1 Build Application

```bash
cd apps/dashboard
pnpm build
```

### 3.2 Test Production Build

```bash
pnpm start
```

Visit [http://localhost:3000](http://localhost:3000) to test.

### 3.3 Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/dashboard
vercel
```

Follow the prompts:

1. Set up and deploy? **Y**
2. Which scope? Select your account
3. Link to existing project? **N**
4. Project name? **midl-defi-exchange**
5. Directory? **./apps/dashboard**
6. Override settings? **N**

### 3.4 Configure Vercel Environment Variables

In Vercel dashboard, add environment variables:

```
NEXT_PUBLIC_MIDL_NETWORK=regtest
NEXT_PUBLIC_RPC_URL=https://rpc.staging.midl.xyz
NEXT_PUBLIC_INDEXER_URL=https://mempool.staging.midl.xyz
NEXT_PUBLIC_BLOCKSCOUT_URL=https://blockscout.staging.midl.xyz
NEXT_PUBLIC_CHAIN_ID=1337
NEXT_PUBLIC_PERP_CONTRACT_ADDRESS=<your-contract-address>
NEXT_PUBLIC_APP_NAME="MIDL DeFi Exchange"
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 3.5 Redeploy

```bash
vercel --prod
```

## Step 4: Testing

### 4.1 Connect Wallet

1. Visit your deployed app
2. Click "Connect Wallet"
3. Select Xverse
4. Approve connection

### 4.2 Add MIDL Network

The app will prompt you to add MIDL Regtest to Xverse. Click "Add Network" and approve.

### 4.3 Test Deposit

1. Navigate to the trading interface
2. Click "Deposit"
3. Enter amount (e.g., 0.001 BTC)
4. Confirm transaction in Xverse
5. Wait for Bitcoin confirmation

### 4.4 Test Trading

1. Select market (e.g., BTC-USDC)
2. Choose Buy/Long or Sell/Short
3. Enter size and leverage
4. Click "Buy/Long" or "Sell/Short"
5. Confirm transaction
6. Wait for confirmation

## Step 5: Monitoring

### 5.1 Check Contract on Blockscout

Visit: `https://blockscout.staging.midl.xyz/address/<your-contract-address>`

Monitor:
- Transaction history
- Event logs
- Contract state

### 5.2 Check Bitcoin Transactions

Visit: `https://mempool.staging.midl.xyz`

Search for your Bitcoin address to see all transactions.

### 5.3 Application Logs

For Vercel deployments:
```bash
vercel logs
```

## Troubleshooting

### Issue: "Insufficient funds"

**Solution**: Claim more regtest BTC from the faucet.

### Issue: "Transaction failed"

**Solution**: 
1. Check Bitcoin confirmations
2. Verify contract address in `.env.local`
3. Ensure Xverse is connected to MIDL Regtest

### Issue: "Network not found"

**Solution**: Add MIDL Regtest to Xverse using the app's "Add Network" button.

### Issue: "Contract not verified"

**Solution**: Run verification command again:
```bash
pnpm verify:contract <address> --network regtest
```

## Mainnet Deployment (Future)

When MIDL mainnet launches:

1. Update network configuration in `hardhat.config.ts`
2. Update `.env.local` with mainnet URLs
3. Deploy contracts to mainnet
4. Verify contracts
5. Update frontend configuration
6. Comprehensive security audit
7. Gradual rollout with monitoring
