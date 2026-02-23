# Verify All Deployed Contracts on MIDL Regtest
# This script verifies all deployed contracts on Blockscout

Write-Host "🔍 Starting contract verification on MIDL Regtest..." -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Contracts without constructor arguments
Write-Host "📝 Verifying contracts without constructor arguments..." -ForegroundColor Yellow
Write-Host ""

Write-Host "Verifying SimpleStorage..."
pnpm hardhat verify 0x784a7627BE8f69CD16AE701fFCa242f9A5a2EF9D --network regtest

Write-Host "Verifying PerpetualExchange..."
pnpm hardhat verify 0xB6de03a50D0cfed70B5687c9461Cbf56545481cb --network regtest

Write-Host "Verifying MarginAccount..."
pnpm hardhat verify 0x425A2E54f9eec665cfFf7c6F87fE69A90B800d7c --network regtest

Write-Host "Verifying Token..."
pnpm hardhat verify 0x6A8A491C81Ff46954C4eD22D91a633Aa2063F70C --network regtest

Write-Host "Verifying WETH9..."
pnpm hardhat verify 0x78123C7a9523226543bAF753A2c53bd716d02452 --network regtest

Write-Host "Verifying UniswapV2Factory..."
pnpm hardhat verify 0xa615c9f5B2555344658Ec5A4e499B171984010e4 --network regtest

Write-Host "Verifying WrappedBTC..."
pnpm hardhat verify 0x79939104589669c632264909dfF99E5A7ab99cd8 --network regtest

Write-Host "Verifying WrappedETH..."
pnpm hardhat verify 0xBA35a3207b893fd01C29f50CE5c8504a5Df5E0ad --network regtest

Write-Host "Verifying WrappedSOL..."
pnpm hardhat verify 0xfE78ca3296a6b8356c6A566ef56B6831178085cf --network regtest

Write-Host "Verifying Faucet..."
pnpm hardhat verify 0x21Ce37A49cA9A291c5fA9ABA6e7eB720A1505aD8 --network regtest

Write-Host ""
Write-Host "📝 Verifying contracts with constructor arguments..." -ForegroundColor Yellow
Write-Host ""

Write-Host "Verifying mUSDT (debt ceiling: 100,000,000 * 10^18)..."
pnpm hardhat verify 0xA82c1B2b1171e32a3950A10FcEDbccc29995907f "100000000000000000000000000" --network regtest

Write-Host "Verifying PerpetualDEX (mUSDT address)..."
pnpm hardhat verify 0x8247B5B9973D1f7dd34623b91e1252cdFf51526F "0xA82c1B2b1171e32a3950A10FcEDbccc29995907f" --network regtest

Write-Host "Verifying TokenFactory (Uniswap addresses)..."
pnpm hardhat verify 0x99fB32Dd45f43B5585bc86cB06c54aA56e519347 "0xa615c9f5B2555344658Ec5A4e499B171984010e4" "0xFB5D8eE9aD10a0e24aa23750B0D71e9Ce4a83887" --network regtest

Write-Host "Verifying UniswapV2Router02 (factory and WETH addresses)..."
pnpm hardhat verify 0xFB5D8eE9aD10a0e24aa23750B0D71e9Ce4a83887 "0xa615c9f5B2555344658Ec5A4e499B171984010e4" "0x78123C7a9523226543bAF753A2c53bd716d02452" --network regtest

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "✅ Verification complete!" -ForegroundColor Green
Write-Host ""
Write-Host "View verified contracts on Blockscout:"
Write-Host "https://blockscout.staging.midl.xyz" -ForegroundColor Blue
Write-Host ""
