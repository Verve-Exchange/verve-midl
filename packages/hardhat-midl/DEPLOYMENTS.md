# MIDL Perpetual Exchange - Contract Deployments

## Network: MIDL Regtest (Staging)
**Chain ID:** TBD  
**RPC URL:** https://rpc.staging.midl.xyz  
**Explorer:** https://mempool.staging.midl.xyz  
**Deployment Date:** February 2026

---

## Core Contracts

### SimpleStorage (Test Contract)
- **Address:** `0x784a7627BE8f69CD16AE701fFCa242f9A5a2EF9D`
- **TX ID:** `0x4b3bbb7808ae668c05660f3cdacbd6e1065afab1ddffc04a5cfa1a840c14925e`
- **BTC TX ID:** `870f7b8bfd5f5f46be49eddec0eca0fa567736f0e49745f7e07f6292ff666142`
- **Purpose:** Test contract to verify deployment system

### PerpetualExchange
- **Address:** `0xB6de03a50D0cfed70B5687c9461Cbf56545481cb`
- **TX ID:** `0x9709da2a9fe29ccf0b5a38cd42fd80be2b58fa9f80890ad2173c99db06261a18`
- **BTC TX ID:** `e2cab30316ec775556947be1821a03c906d3a8f50a7b3c6100a5eff22170ad50`
- **Purpose:** Main perpetual futures trading contract
- **Features:**
  - Open/close positions with leverage
  - Long/short positions
  - Deposit/withdraw functionality
  - Position tracking and PnL calculation

### MarginAccount
- **Address:** `0x425A2E54f9eec665cfFf7c6F87fE69A90B800d7c`
- **TX ID:** `0x60b01208c0efcf7b2a4fe8435323898846e16a6668b7dd4c549dc1792a06a3d6`
- **BTC TX ID:** `2201aba2d991ad97666d167c237f7cac6e7d6dd2c0565e288bfd1406763d6b3f`
- **Purpose:** Manages user margin accounts
- **Features:**
  - Deposit/withdraw margin
  - Lock/unlock margin for positions
  - Track locked margins per user

### Token (Base ERC20)
- **Address:** `0x6A8A491C81Ff46954C4eD22D91a633Aa2063F70C`
- **TX ID:** `0x023d20b551ae70c3dfe5acf9f298a5741e70b9805bc6edfd84406ee29ef6486e`
- **BTC TX ID:** `d512e144eb99b0623e2cc558e8af248ac82f5bbe172cb460cfb4aa2fb70f98f3`
- **Purpose:** Base ERC20 token implementation

### TokenFactory
- **Address:** `0x99fB32Dd45f43B5585bc86cB06c54aA56e519347`
- **TX ID:** `0x8a7083701257a518703d5db4a37a1880786f5907ea5b5496aa2aa66b783719c2`
- **BTC TX ID:** `4e355c86c45be94ead8dd87a6a52fde4c1b5a3d5e8c16aecce52a86c41bae0fe`
- **Purpose:** Factory for creating meme tokens with bonding curve
- **Features:**
  - Create new meme tokens
  - Buy tokens with bonding curve pricing
  - Automatic Uniswap liquidity provision
  - Track all created tokens

---

## Uniswap V2 DEX Infrastructure

### WETH9 (Wrapped ETH)
- **Address:** `0x78123C7a9523226543bAF753A2c53bd716d02452`
- **TX ID:** `0x15cec210589c4462b9256110f7651a4ee46a24d54a29f2c63a73d6adceabcfef`
- **BTC TX ID:** `931cd577e39e9664eeacc4d901b0d9acb64a6b794da3f4aec9925f438b687943`
- **Purpose:** Wrapped native token for DEX trading
- **Standard:** WETH9 (18 decimals)

### UniswapV2Factory
- **Address:** `0xa615c9f5B2555344658Ec5A4e499B171984010e4`
- **TX ID:** `0xc884d416e2ad2fb334c5c3a7c874d92c04483dd625d9d281b3237ae006a95259`
- **BTC TX ID:** `931cd577e39e9664eeacc4d901b0d9acb64a6b794da3f4aec9925f438b687943`
- **Purpose:** Creates Uniswap V2 trading pairs
- **Features:**
  - Create new trading pairs
  - Track all pairs
  - Fee management

### UniswapV2Router02
- **Address:** `0xFB5D8eE9aD10a0e24aa23750B0D71e9Ce4a83887`
- **TX ID:** `0x6f8f87081aa170d442d2dd0a2ef35f849484fb2025bb4672a83702eabbd90419`
- **BTC TX ID:** `1194cf32df18008ae097e194b8cac1ea8da1dc03dbf5df29c9d428553ccb9179`
- **Purpose:** Router for swaps and liquidity management
- **Features:**
  - Token swaps (exact input/output)
  - Add/remove liquidity
  - ETH/token swaps
  - Price quotes and calculations

---

## Wrapped Tokens (Multi-Asset Support)

### WrappedBTC (WBTC)
- **Address:** `0x79939104589669c632264909dfF99E5A7ab99cd8`
- **TX ID:** `0x5699fe11c55650f1c7b5490375778c31215d79c177bf061fdb22458bda209034`
- **BTC TX ID:** `96c4c97feb31aeb84208f5fbcb2819e5386c35171da9e0e87cdfe92abafb1a5b`
- **Decimals:** 8
- **Purpose:** Wrapped Bitcoin for perpetual trading
- **Features:**
  - Mint/burn by owner
  - Standard ERC20 interface

### WrappedETH (WETH)
- **Address:** `0xBA35a3207b893fd01C29f50CE5c8504a5Df5E0ad`
- **TX ID:** `0x559488e6f69a6650b14996d43ad864d4364cbc44e73c6951474d1da27b64f26d`
- **BTC TX ID:** `96c4c97feb31aeb84208f5fbcb2819e5386c35171da9e0e87cdfe92abafb1a5b`
- **Decimals:** 18
- **Purpose:** Wrapped Ethereum for perpetual trading
- **Features:**
  - Mint/burn by owner
  - Standard ERC20 interface

### WrappedSOL (WSOL)
- **Address:** `0xfE78ca3296a6b8356c6A566ef56B6831178085cf`
- **TX ID:** `0x4eb806e07b48be158cb4d9f3a049c2c0ebcdab3c7beda7641f71e90bee4e60e5`
- **BTC TX ID:** `96c4c97feb31aeb84208f5fbcb2819e5386c35171da9e0e87cdfe92abafb1a5b`
- **Decimals:** 9
- **Purpose:** Wrapped Solana for perpetual trading
- **Features:**
  - Mint/burn by owner
  - Standard ERC20 interface

---

## Contract Interactions

### For Perpetual Trading:
1. **Deposit Margin:** Call `MarginAccount.deposit()` with ETH
2. **Open Position:** Call `PerpetualExchange.openPosition(size, price, leverage, isLong)`
3. **Close Position:** Call `PerpetualExchange.closePosition(positionId, exitPrice)`
4. **Withdraw:** Call `MarginAccount.withdraw(amount)`

### For Token Swaps (Uniswap):
1. **Approve Tokens:** Call `token.approve(UniswapV2Router02, amount)`
2. **Swap Tokens:** Call `UniswapV2Router02.swapExactTokensForTokens(...)`
3. **Add Liquidity:** Call `UniswapV2Router02.addLiquidity(...)`

### For Wrapped Tokens:
1. **Mint (Owner Only):** Call `WrappedBTC/ETH/SOL.mint(to, amount)`
2. **Burn:** Call `WrappedBTC/ETH/SOL.burn(amount)`
3. **Transfer:** Standard ERC20 `transfer(to, amount)`

---

## Integration Guide

### Frontend Configuration
```typescript
export const CONTRACTS = {
  // Core
  PerpetualExchange: "0xB6de03a50D0cfed70B5687c9461Cbf56545481cb",
  MarginAccount: "0x425A2E54f9eec665cfFf7c6F87fE69A90B800d7c",
  TokenFactory: "0x99fB32Dd45f43B5585bc86cB06c54aA56e519347",
  
  // Uniswap DEX
  WETH9: "0x78123C7a9523226543bAF753A2c53bd716d02452",
  UniswapV2Factory: "0xa615c9f5B2555344658Ec5A4e499B171984010e4",
  UniswapV2Router02: "0xFB5D8eE9aD10a0e24aa23750B0D71e9Ce4a83887",
  
  // Wrapped Tokens
  WrappedBTC: "0x79939104589669c632264909dfF99E5A7ab99cd8",
  WrappedETH: "0xBA35a3207b893fd01C29f50CE5c8504a5Df5E0ad",
  WrappedSOL: "0xfE78ca3296a6b8356c6A566ef56B6831178085cf",
};

export const NETWORK = {
  chainId: "regtest",
  rpcUrl: "https://rpc.staging.midl.xyz",
  explorerUrl: "https://mempool.staging.midl.xyz",
};
```

### Web3 Provider Setup
```typescript
import { createPublicClient, http } from 'viem';

const client = createPublicClient({
  transport: http('https://rpc.staging.midl.xyz'),
});
```

---

## Verification

All contracts have been deployed and verified on MIDL Regtest. You can view transactions on the explorer:
- **Explorer:** https://mempool.staging.midl.xyz

### Deployment Files Location
- JSON files: `packages/hardhat-midl/deployments/*.json`
- Each file contains: address, txId, btcTxId, and full ABI

---

## Next Steps

1. ✅ All core contracts deployed
2. ✅ Uniswap V2 infrastructure deployed
3. ✅ Multi-asset wrapped tokens deployed
4. 🔄 Create trading pairs on Uniswap
5. 🔄 Mint initial wrapped token supply
6. 🔄 Add liquidity to trading pairs
7. 🔄 Integrate with frontend dashboard
8. 🔄 Deploy price oracles (Chainlink)
9. 🔄 Test full trading flow

---

## Support

For issues or questions:
- Check deployment JSON files for full ABIs
- Review contract source code in `packages/hardhat-midl/contracts/`
- Test on regtest before mainnet deployment
