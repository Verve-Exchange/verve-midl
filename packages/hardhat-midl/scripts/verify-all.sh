#!/bin/bash

# Verify All Deployed Contracts on MIDL Regtest
# This script verifies all deployed contracts on Blockscout

echo "🔍 Starting contract verification on MIDL Regtest..."
echo "=================================================="
echo ""

# Contracts without constructor arguments
echo "📝 Verifying contracts without constructor arguments..."
echo ""

echo "Verifying SimpleStorage..."
pnpm hardhat verify 0x784a7627BE8f69CD16AE701fFCa242f9A5a2EF9D --network regtest

echo "Verifying PerpetualExchange..."
pnpm hardhat verify 0xB6de03a50D0cfed70B5687c9461Cbf56545481cb --network regtest

echo "Verifying MarginAccount..."
pnpm hardhat verify 0x425A2E54f9eec665cfFf7c6F87fE69A90B800d7c --network regtest

echo "Verifying Token..."
pnpm hardhat verify 0x6A8A491C81Ff46954C4eD22D91a633Aa2063F70C --network regtest

echo "Verifying WETH9..."
pnpm hardhat verify 0x78123C7a9523226543bAF753A2c53bd716d02452 --network regtest

echo "Verifying UniswapV2Factory..."
pnpm hardhat verify 0xa615c9f5B2555344658Ec5A4e499B171984010e4 --network regtest

echo "Verifying WrappedBTC..."
pnpm hardhat verify 0x79939104589669c632264909dfF99E5A7ab99cd8 --network regtest

echo "Verifying WrappedETH..."
pnpm hardhat verify 0xBA35a3207b893fd01C29f50CE5c8504a5Df5E0ad --network regtest

echo "Verifying WrappedSOL..."
pnpm hardhat verify 0xfE78ca3296a6b8356c6A566ef56B6831178085cf --network regtest

echo "Verifying Faucet..."
pnpm hardhat verify 0x21Ce37A49cA9A291c5fA9ABA6e7eB720A1505aD8 --network regtest

echo ""
echo "📝 Verifying contracts with constructor arguments..."
echo ""

echo "Verifying mUSDT (debt ceiling: 100,000,000 * 10^18)..."
pnpm hardhat verify 0xA82c1B2b1171e32a3950A10FcEDbccc29995907f "100000000000000000000000000" --network regtest

echo "Verifying PerpetualDEX (mUSDT address)..."
pnpm hardhat verify 0x8247B5B9973D1f7dd34623b91e1252cdFf51526F "0xA82c1B2b1171e32a3950A10FcEDbccc29995907f" --network regtest

echo "Verifying TokenFactory (Uniswap addresses)..."
pnpm hardhat verify 0x99fB32Dd45f43B5585bc86cB06c54aA56e519347 "0xa615c9f5B2555344658Ec5A4e499B171984010e4" "0xFB5D8eE9aD10a0e24aa23750B0D71e9Ce4a83887" --network regtest

echo "Verifying UniswapV2Router02 (factory and WETH addresses)..."
pnpm hardhat verify 0xFB5D8eE9aD10a0e24aa23750B0D71e9Ce4a83887 "0xa615c9f5B2555344658Ec5A4e499B171984010e4" "0x78123C7a9523226543bAF753A2c53bd716d02452" --network regtest

echo ""
echo "=================================================="
echo "✅ Verification complete!"
echo ""
echo "View verified contracts on Blockscout:"
echo "https://blockscout.staging.midl.xyz"
echo ""
