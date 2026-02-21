# Deployment Configuration Fixes

## Date: 2026-02-22

## Summary
Fixed TypeScript configuration issues and dependency version mismatches that were preventing contract deployment on MIDL chain.

## Changes Made

### 1. Fixed Package Dependencies (`packages/hardhat-midl/package.json`)
**Problem**: Version mismatches between standard npm packages and MIDL-specific forks causing runtime errors.

**Solution**: Updated to use MIDL-compatible package versions:
- Changed `viem` from `^2.46.2` to `npm:@midl/viem@2.45.0` (aliased)
- Changed `ethers` to `npm:@midl/ethers@6.13.0-4` (aliased)
- Updated `@midl/core` from `^3.0.3` to `3.0.2` (exact version)
- Updated `@midl/executor` from `^3.0.3` to `3.0.2` (exact version)
- Updated `@midl/hardhat-deploy` from `^3.0.3` to `3.0.2` (exact version)
- Added `@midl/ethers@6.13.0-5` as devDependency
- Added `@midl/logger@^3.0.2` for proper logging support
- Updated `hardhat` from `2.28.3` to `^2.28.5`
- Updated `hardhat-deploy` from `^0.12.4` to `^1.0.4`
- Added `hardhat-deploy-ethers@^0.4.2` for ethers integration
- Removed incompatible packages: `@midl/satoshi-kit`, `@nomicfoundation/hardhat-ignition`, `@nomicfoundation/hardhat-toolbox-viem`, `forge-std`

### 2. Fixed Root Package Dependencies (`package.json`)
**Problem**: Root package had outdated @midl/core version.

**Solution**: 
- Updated `@midl/core` from `^3.0.3` to `3.0.2` (exact version for consistency)

### 3. Fixed TypeScript Configuration (`packages/hardhat-midl/hardhat.config.ts`)
**Problem**: TypeScript error - `'midl' does not exist in type 'HardhatUserConfig'`

**Solution**: 
- Added `as any` type assertion to config export to bypass TypeScript strict typing
- This is necessary because `@midl/hardhat-deploy` extends HardhatUserConfig with custom properties

### 4. Created Test Contract (`packages/hardhat-midl/contracts/SimpleStorage.sol`)
**Purpose**: Simple contract to verify deployment pipeline works before deploying complex contracts.

**Features**:
- Basic string storage contract
- Constructor accepts initial message
- Getter and setter functions
- Uses Solidity 0.8.24

### 5. Created Deployment Script (`packages/hardhat-midl/deploy/00_deploy_SimpleStorage.ts`)
**Purpose**: Test deployment using MIDL's deployment system.

**Features**:
- Uses MIDL's `midl.initialize()`, `midl.deploy()`, and `midl.execute()` pattern
- Tagged as "SimpleStorage" for selective deployment
- Logs deployment address for verification

## Key Insights

### Why These Changes Were Necessary

1. **MIDL Fork Compatibility**: MIDL maintains forks of `viem` and `ethers` with Bitcoin-specific functionality. Using standard versions causes runtime errors like `estimateGasMulti is not a function`.

2. **Version Pinning**: MIDL packages require exact version matching across the dependency tree. Using `^` (caret) ranges can cause incompatibilities.

3. **TypeScript Limitations**: The `@midl/hardhat-deploy` plugin extends Hardhat's config with custom properties that aren't in the base TypeScript types. The `as any` assertion is a pragmatic solution.

## Verification

### Compilation
```bash
cd packages/hardhat-midl
pnpm exec hardhat compile
```
Result: ✅ Successfully compiled 6 Solidity files

### Deployment (In Progress)
```bash
pnpm exec hardhat deploy --network regtest --tags SimpleStorage
```
Status: Deployment initiated successfully

## Next Steps

1. Complete SimpleStorage deployment verification
2. Deploy Uniswap V2 infrastructure (Factory, Router, WETH9)
3. Deploy wrapped tokens (WBTC, WETH, WSOL)
4. Deploy core perpetual exchange contracts
5. Set up Chainlink oracles for price feeds

## References

- MIDL Documentation: https://docs.midl.xyz
- MIDL Example Repo: https://github.com/midl-xyz/midl-solidity-on-bitcoin-example
- Hardhat Deploy: https://github.com/wighawag/hardhat-deploy
