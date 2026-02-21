# MIDL DeFi Exchange - VibeHack 2026

A production-ready decentralized perpetual exchange built on MIDL Protocol for the VibeHack hackathon (Feb 9-28, 2026).

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.28-blue)](https://soliditylang.org/)
[![MIDL](https://img.shields.io/badge/MIDL-Protocol-orange)](https://midl.xyz)

## 🚀 Quick Start

Get started in 5 minutes! See [QUICKSTART.md](QUICKSTART.md)

```bash
# Clone and install
git clone <your-repo>
cd midl-defi-exchange
pnpm install

# Deploy contracts
pnpm deploy:contracts

# Start app
pnpm dev
```

## 📖 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide
- **[TESTING.md](TESTING.md)** - Comprehensive testing guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical architecture
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines
- **[CHANGELOG.md](CHANGELOG.md)** - Version history
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete project overview
- **[VIBEHACK_SUBMISSION.md](VIBEHACK_SUBMISSION.md)** - Hackathon submission details

## ✨ Features

- **Perpetual Trading**: Long/short positions with up to 10x leverage
- **Bitcoin-Backed**: All transactions secured by Bitcoin L1
- **Real-time Charts**: TradingView integration for market analysis
- **MIDL Integration**: Native Bitcoin wallet support via Xverse
- **Cross/Isolated Margin**: Flexible margin management
- **Mobile Responsive**: Full trading experience on any device

## 🛠 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Smart Contracts**: Solidity 0.8.28
- **Blockchain**: MIDL Protocol (Bitcoin L1 + EVM)
- **Wallet**: Xverse (via @midl/satoshi-kit)
- **Deployment**: Hardhat with @midl/hardhat-deploy
- **UI**: Tailwind CSS, Radix UI, shadcn/ui

## 📦 Project Structure

```
.
├── contracts/              # Solidity smart contracts
├── deploy/                 # Hardhat deployment scripts
├── apps/dashboard/         # Next.js frontend
├── scripts/               # Setup and utility scripts
└── docs/                  # Comprehensive documentation
```

## 🔧 Prerequisites

- Node.js 18+ and pnpm
- Xverse wallet installed
- Regtest BTC from [faucet.midl.xyz](https://faucet.midl.xyz)

## 🚢 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions.

## 🧪 Testing

See [TESTING.md](TESTING.md) for comprehensive testing guide.

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## 📝 License

MIT - See [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Discord**: [VibeHack Channel](https://discord.gg/midl)
- **Docs**: [MIDL Documentation](https://docs.midl.xyz)
- **Issues**: Create a GitHub issue

## 🎯 VibeHack 2026

Built for MIDL VibeHack (Feb 9-28, 2026). See [VIBEHACK_SUBMISSION.md](VIBEHACK_SUBMISSION.md) for submission details.

---

**Built with ❤️ for VibeHack 2026**
