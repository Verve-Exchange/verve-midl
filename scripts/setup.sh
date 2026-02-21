#!/bin/bash

# MIDL DeFi Exchange Setup Script
# This script helps you set up the project for development

set -e

echo "🚀 MIDL DeFi Exchange Setup"
echo "============================"
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install it first:"
    echo "   npm install -g pnpm"
    exit 1
fi

echo "✅ pnpm found"

# Check if Node.js version is 18+
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version OK"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
pnpm install

# Copy environment file
if [ ! -f "apps/dashboard/.env.local" ]; then
    echo ""
    echo "📝 Creating .env.local file..."
    cp apps/dashboard/.env.example apps/dashboard/.env.local
    echo "✅ .env.local created"
else
    echo "⚠️  .env.local already exists, skipping..."
fi

# Check if Hardhat mnemonic is set
echo ""
echo "🔑 Checking Hardhat configuration..."
if ! npx hardhat vars has MNEMONIC 2>/dev/null; then
    echo "⚠️  MNEMONIC not set in Hardhat"
    echo ""
    echo "To set your mnemonic, run:"
    echo "   npx hardhat vars set MNEMONIC"
    echo ""
    echo "Or use the default test mnemonic (REGTEST ONLY):"
    echo "   test test test test test test test test test test test junk"
else
    echo "✅ MNEMONIC is configured"
fi

# Get Bitcoin address
echo ""
echo "📍 Your Bitcoin address:"
npx hardhat midl:address 2>/dev/null || echo "⚠️  Run 'npx hardhat vars set MNEMONIC' first"

echo ""
echo "============================"
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo ""
echo "1. Get regtest BTC from the faucet:"
echo "   https://faucet.midl.xyz"
echo ""
echo "2. Deploy smart contracts:"
echo "   pnpm deploy:contracts"
echo ""
echo "3. Update .env.local with contract address"
echo ""
echo "4. Start development server:"
echo "   pnpm dev"
echo ""
echo "5. Visit http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Quick start guide"
echo "   - DEPLOYMENT.md - Deployment instructions"
echo "   - TESTING.md - Testing guide"
echo "   - ARCHITECTURE.md - Technical details"
echo ""
echo "============================"
