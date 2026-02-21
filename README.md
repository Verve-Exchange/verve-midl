# MIDL Perpetual Exchange

A decentralized perpetual futures exchange built on MIDL Protocol, combining Bitcoin Layer 1 security with EVM smart contract functionality.

## Overview

This project implements a production-grade perpetual trading platform that leverages MIDL Protocol's unique architecture to provide trustless, Bitcoin-secured derivatives trading. The system enables traders to open leveraged positions while maintaining the security guarantees of Bitcoin's proof-of-work consensus.

## Architecture

### System Components

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[Next.js Application]
        WC[Wallet Connector]
        TC[Trading Components]
    end
    
    subgraph "MIDL Protocol Layer"
        EX[Executor SDK]
        SK[Satoshi Kit]
        WG[Wagmi Client]
    end
    
    subgraph "Blockchain Layer"
        BTC[Bitcoin L1]
        EVM[EVM Runtime]
        SC[Smart Contracts]
    end
    
    UI --> WC
    UI --> TC
    WC --> SK
    TC --> EX
    TC --> WG
    EX --> BTC
    EX --> EVM
    WG --> SC
    SC --> EVM
    EVM --> BTC
```

### Transaction Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Xverse
    participant Executor
    participant Bitcoin
    participant EVM

    User->>Frontend: Initiate Trade
    Frontend->>Executor: Add Transaction Intention
    Executor->>Executor: Calculate Gas Requirements
    Executor->>Frontend: Return BTC Transaction Data
    Frontend->>Xverse: Request Signature
    Xverse->>User: Confirm Transaction
    User->>Xverse: Approve
    Xverse->>Frontend: Signed Transaction
    Frontend->>Executor: Broadcast Transaction
    Executor->>Bitcoin: Submit BTC Transaction
    Bitcoin->>Bitcoin: Confirm Block
    Bitcoin->>EVM: Trigger EVM Execution
    EVM->>EVM: Execute Smart Contract
    EVM->>Frontend: Transaction Receipt
    Frontend->>User: Update UI
```

## Features

### Trading Capabilities
- Perpetual futures contracts with up to 10x leverage
- Long and short position support
- Multiple order types: Market, Limit, Stop
- Cross-margin and isolated-margin modes
- Real-time profit and loss calculation

### Technical Features
- Bitcoin Layer 1 transaction security
- EVM smart contract execution
- Xverse wallet integration via MIDL Satoshi Kit
- Real-time market data feeds
- Responsive interface for desktop and mobile
- Transaction state management with optimistic updates

## Technology Stack

### Smart Contracts
- Solidity 0.8.28
- Hardhat development environment
- OpenZeppelin security patterns
- Gas-optimized implementations

### Frontend
- Next.js 16 with App Router
- React 19 with TypeScript 5
- Tailwind CSS 4 for styling
- Jotai for state management
- TanStack Query for data fetching

### Blockchain Integration
- MIDL Protocol SDK (@midl/core, @midl/react, @midl/executor)
- Wagmi 2.14.16 for EVM interactions
- Viem 2.14.16 for low-level operations
- Xverse wallet connector

## Project Structure

```
midl-hackathon/
├── apps/
│   └── dashboard/              # Frontend application
│       ├── app/                # Next.js app router
│       ├── components/         # React components
│       ├── hooks/              # Custom React hooks
│       ├── lib/                # Utility functions
│       ├── states/             # Jotai state atoms
│       └── context/            # React context providers
├── contracts/                  # Solidity smart contracts
│   └── PerpetualExchange.sol  # Main trading contract
├── deploy/                     # Hardhat deployment scripts
├── scripts/                    # Setup and utility scripts
└── docs/                       # Additional documentation
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm package manager
- Xverse wallet browser extension
- Regtest BTC from MIDL faucet

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd midl-hackathon
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment variables:
```bash
cp apps/dashboard/.env.example apps/dashboard/.env.local
```

4. Set up Hardhat mnemonic:
```bash
npx hardhat vars set MNEMONIC
```

### Smart Contract Deployment

1. Obtain your Bitcoin address:
```bash
npx hardhat midl:address
```

2. Claim regtest BTC from the faucet at https://faucet.midl.xyz

3. Deploy the PerpetualExchange contract:
```bash
pnpm deploy:contracts
```

4. Update the contract address in `.env.local`:
```env
NEXT_PUBLIC_PERP_CONTRACT_ADDRESS=<deployed-address>
```

5. Verify the contract on Blockscout:
```bash
npx hardhat verify --network regtest <contract-address>
```

### Running the Application

Development mode:
```bash
pnpm dev
```

Production build:
```bash
pnpm build
pnpm start
```

The application will be available at http://localhost:3000

## Smart Contract Interface

### PerpetualExchange.sol

#### Core Functions

**deposit()**
```solidity
function deposit() external payable
```
Deposits funds into the trading account. Requires sending BTC value with the transaction.

**openPosition()**
```solidity
function openPosition(
    uint256 size,
    uint256 price,
    uint256 leverage,
    bool isLong
) external
```
Opens a new leveraged position. Parameters:
- `size`: Position size in wei
- `price`: Entry price in wei
- `leverage`: Leverage multiplier (1-10)
- `isLong`: true for long, false for short

**closePosition()**
```solidity
function closePosition(
    uint256 positionId,
    uint256 exitPrice
) external
```
Closes an existing position and realizes profit or loss.

**getPositions()**
```solidity
function getPositions(address trader) 
    external 
    view 
    returns (Position[] memory)
```
Returns all positions for a given trader address.

**getBalance()**
```solidity
function getBalance(address user) 
    external 
    view 
    returns (uint256)
```
Returns the account balance for a given user.

#### Events

```solidity
event PositionOpened(
    address indexed trader,
    uint256 indexed positionId,
    uint256 size,
    uint256 price,
    uint256 leverage,
    bool isLong
);

event PositionClosed(
    address indexed trader,
    uint256 indexed positionId,
    int256 pnl
);

event Deposit(address indexed user, uint256 amount);
event Withdrawal(address indexed user, uint256 amount);
```

## Network Configuration

### MIDL Regtest

- RPC URL: https://rpc.staging.midl.xyz
- Chain ID: 1337
- Block Explorer: https://blockscout.staging.midl.xyz
- Bitcoin Explorer: https://mempool.staging.midl.xyz
- Faucet: https://faucet.midl.xyz

## Development

### Running Tests

```bash
npx hardhat test
```

### Linting

```bash
pnpm lint
```

### Type Checking

```bash
pnpm type-check
```

## Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

For production deployment considerations, refer to the deployment guide which covers:
- Environment configuration
- Contract deployment and verification
- Frontend deployment to Vercel
- Monitoring and maintenance

## Testing

Comprehensive testing documentation is available in [TESTING.md](TESTING.md), including:
- Manual testing procedures
- Integration testing
- Performance testing
- Security considerations

## Documentation

- [QUICKSTART.md](QUICKSTART.md) - Quick setup guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment instructions
- [TESTING.md](TESTING.md) - Testing procedures
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [CHANGELOG.md](CHANGELOG.md) - Version history

## Contract Addresses

### Regtest Deployment

Contract addresses will be updated here after deployment:

- PerpetualExchange: `<pending-deployment>`

Verify contracts on Blockscout: https://blockscout.staging.midl.xyz

## Security Considerations

This project implements several security measures:

- Input validation on all user-provided data
- Reentrancy protection using checks-effects-interactions pattern
- Integer overflow protection via Solidity 0.8+
- Access control for position management
- Secure wallet connection flow

Note: This is experimental software. Use at your own risk. The contracts have not undergone formal verification.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Resources

- [MIDL Protocol Documentation](https://docs.midl.xyz)
- [MIDL VibeHack Information](https://vibehack.midl.xyz)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## Support

For questions and support:
- Join the MIDL Discord community
- Review the documentation in the `/docs` directory
- Open an issue on GitHub

## Acknowledgments

Built for MIDL VibeHack 2026 (February 9-28, 2026).

Special thanks to the MIDL Protocol team for their support and the comprehensive developer tools that made this project possible.
