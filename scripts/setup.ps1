# MIDL DeFi Exchange Setup Script (PowerShell)
# This script helps you set up the project for development

$ErrorActionPreference = "Stop"

Write-Host "🚀 MIDL DeFi Exchange Setup" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

# Check if pnpm is installed
try {
    $null = Get-Command pnpm -ErrorAction Stop
    Write-Host "✅ pnpm found" -ForegroundColor Green
} catch {
    Write-Host "❌ pnpm is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "   npm install -g pnpm" -ForegroundColor Yellow
    exit 1
}

# Check Node.js version
$nodeVersion = (node -v).Substring(1).Split('.')[0]
if ([int]$nodeVersion -lt 18) {
    Write-Host "❌ Node.js 18+ is required. Current version: $(node -v)" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js version OK" -ForegroundColor Green

# Install dependencies
Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
pnpm install

# Copy environment file
if (-not (Test-Path "apps/dashboard/.env.local")) {
    Write-Host ""
    Write-Host "📝 Creating .env.local file..." -ForegroundColor Yellow
    Copy-Item "apps/dashboard/.env.example" "apps/dashboard/.env.local"
    Write-Host "✅ .env.local created" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env.local already exists, skipping..." -ForegroundColor Yellow
}

# Check if Hardhat mnemonic is set
Write-Host ""
Write-Host "🔑 Checking Hardhat configuration..." -ForegroundColor Yellow
try {
    $hasMnemonic = npx hardhat vars has MNEMONIC 2>$null
    Write-Host "✅ MNEMONIC is configured" -ForegroundColor Green
} catch {
    Write-Host "⚠️  MNEMONIC not set in Hardhat" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To set your mnemonic, run:" -ForegroundColor Cyan
    Write-Host "   npx hardhat vars set MNEMONIC" -ForegroundColor White
    Write-Host ""
    Write-Host "Or use the default test mnemonic (REGTEST ONLY):" -ForegroundColor Cyan
    Write-Host "   test test test test test test test test test test test junk" -ForegroundColor White
}

# Get Bitcoin address
Write-Host ""
Write-Host "📍 Your Bitcoin address:" -ForegroundColor Yellow
try {
    npx hardhat midl:address 2>$null
} catch {
    Write-Host "⚠️  Run 'npx hardhat vars set MNEMONIC' first" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "============================" -ForegroundColor Cyan
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Get regtest BTC from the faucet:" -ForegroundColor White
Write-Host "   https://faucet.midl.xyz" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Deploy smart contracts:" -ForegroundColor White
Write-Host "   pnpm deploy:contracts" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Update .env.local with contract address" -ForegroundColor White
Write-Host ""
Write-Host "4. Start development server:" -ForegroundColor White
Write-Host "   pnpm dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "5. Visit http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   - README.md - Quick start guide" -ForegroundColor White
Write-Host "   - DEPLOYMENT.md - Deployment instructions" -ForegroundColor White
Write-Host "   - TESTING.md - Testing guide" -ForegroundColor White
Write-Host "   - ARCHITECTURE.md - Technical details" -ForegroundColor White
Write-Host ""
Write-Host "============================" -ForegroundColor Cyan
