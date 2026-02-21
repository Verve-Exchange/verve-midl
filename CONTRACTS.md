# Deployed Contracts

This document tracks all deployed smart contract addresses across different networks.

## MIDL Regtest

### PerpetualExchange

**Status**: Pending Deployment

**Address**: `<to-be-deployed>`

**Deployment Date**: TBD

**Deployer Address**: TBD

**Transaction Hash**: TBD

**Verification**: [Blockscout](https://blockscout.staging.midl.xyz/address/<to-be-deployed>)

**Source Code**: [contracts/PerpetualExchange.sol](contracts/PerpetualExchange.sol)

### Contract Details

```solidity
// Contract: PerpetualExchange
// Compiler: Solidity 0.8.28
// Optimization: Enabled (200 runs)
// License: MIT
```

### Key Functions

- `deposit()` - Deposit funds to trading account
- `withdraw(uint256 amount)` - Withdraw funds from account
- `openPosition(uint256 size, uint256 price, uint256 leverage, bool isLong)` - Open leveraged position
- `closePosition(uint256 positionId, uint256 exitPrice)` - Close position and realize PnL
- `getPositions(address trader)` - View all positions for trader
- `getBalance(address user)` - View account balance

### Events

- `PositionOpened(address indexed trader, uint256 indexed positionId, ...)`
- `PositionClosed(address indexed trader, uint256 indexed positionId, int256 pnl)`
- `Deposit(address indexed user, uint256 amount)`
- `Withdrawal(address indexed user, uint256 amount)`

## Deployment Instructions

To deploy the contracts:

1. Ensure you have regtest BTC:
```bash
npx hardhat midl:address
# Claim BTC from https://faucet.midl.xyz
```

2. Deploy contracts:
```bash
pnpm deploy:contracts
```

3. Update this file with the deployed address

4. Verify on Blockscout:
```bash
npx hardhat verify --network regtest <CONTRACT_ADDRESS>
```

5. Update `.env.local`:
```env
NEXT_PUBLIC_PERP_CONTRACT_ADDRESS=<CONTRACT_ADDRESS>
```

## Network Configuration

### MIDL Regtest

- **RPC URL**: https://rpc.staging.midl.xyz
- **Chain ID**: 1337
- **Block Explorer**: https://blockscout.staging.midl.xyz
- **Bitcoin Explorer**: https://mempool.staging.midl.xyz
- **Faucet**: https://faucet.midl.xyz

## Verification Status

| Contract | Network | Address | Verified | Date |
|----------|---------|---------|----------|------|
| PerpetualExchange | Regtest | TBD | No | TBD |

## Upgrade History

No upgrades yet. Initial deployment pending.

## Notes

- All contracts are immutable (non-upgradeable)
- Contract addresses will be updated after deployment
- Verification on Blockscout is required for transparency
- Keep this file updated with each deployment

## Security

- Contracts have not undergone formal verification
- Use at your own risk
- Report any issues to the development team

## Related Documentation

- [Deployment Guide](DEPLOYMENT.md)
- [Architecture Documentation](ARCHITECTURE.md)
- [Smart Contract Source](contracts/PerpetualExchange.sol)
