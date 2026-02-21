# Verve Midl Monorepo

This is a full-stack monorepo for the MIDL Hackathon, using pnpm workspaces. It contains:

- **apps/dashboard**: Next.js frontend app for trading, explorer, holdings, and wallet management.
- **packages/hardhat-midl**: Hardhat smart contract package for perpetual futures, margin, liquidation, and Chainlink integration.

## Monorepo Structure

```
midl-hackathon/
├── apps/
│   └── dashboard/
├── packages/
│   └── hardhat-midl/
├── pnpm-workspace.yaml
├── package.json
├── README.md
```

## Getting Started

### Install dependencies

```sh
pnpm install
```

### Run Dashboard App

```sh
pnpm --filter ./apps/dashboard dev
```

### Build All Apps & Packages

```sh
pnpm run build
```

### Run Hardhat Contracts

```sh
cd packages/hardhat-midl
pnpm hardhat test
pnpm hardhat deploy
```

## Adding New Apps or Packages

- Add new folders under `apps/` or `packages/`.
- Update `pnpm-workspace.yaml` if needed.

## Workspace Configuration

**pnpm-workspace.yaml**

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**Root package.json**

```json
{
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "pnpm --filter ./apps/dashboard dev",
    "build": "pnpm --recursive run build",
    "lint": "pnpm --recursive run lint"
  }
}
```

## Trading Instructions

- Connect your wallet in the dashboard app.
- Use the explorer and trenches pages to view tokens and market stats.
- Place orders, manage holdings, and interact with smart contracts.

## Chainlink Integration

- Price feeds are integrated in the smart contracts for secure trading.
- See `packages/hardhat-midl/contracts/` for details.

## Contract Deployment

- Use Hardhat scripts in `packages/hardhat-midl` to deploy contracts to the MIDL network.
- Update environment variables and deployment scripts as needed.

---

For questions or support, see the docs or contact the team.
