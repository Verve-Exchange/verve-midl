# Contributing to MIDL DeFi Exchange

Thank you for your interest in contributing to the MIDL DeFi Exchange! This document provides guidelines and instructions for contributing.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Git
- Xverse wallet
- Basic knowledge of React, TypeScript, and Solidity

### Setup Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/midl-defi-exchange.git
   cd midl-defi-exchange
   ```

3. Run setup script:
   ```bash
   # Linux/Mac
   chmod +x scripts/setup.sh
   ./scripts/setup.sh

   # Windows
   .\scripts\setup.ps1
   ```

4. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### 1. Code Style

We use ESLint and Prettier for code formatting. Before committing:

```bash
# Lint code
pnpm lint

# Format code (if you have prettier configured)
pnpm format
```

### 2. Commit Messages

Follow conventional commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(trading): add stop-loss order type
fix(wallet): resolve connection timeout issue
docs(readme): update deployment instructions
```

### 3. Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Submit PR with clear description

PR Template:
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests pass locally
```

## Project Structure

```
.
├── apps/dashboard/          # Frontend application
│   ├── app/                # Next.js pages
│   ├── components/         # React components
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities
│   └── states/            # State management
├── contracts/             # Smart contracts
├── deploy/               # Deployment scripts
├── scripts/              # Utility scripts
└── docs/                 # Documentation
```

## Adding New Features

### Frontend Components

1. Create component in appropriate directory:
   ```typescript
   // apps/dashboard/components/my-feature/index.tsx
   export const MyFeature = () => {
     return <div>My Feature</div>;
   };
   ```

2. Add tests:
   ```typescript
   // apps/dashboard/components/my-feature/index.test.tsx
   import { render } from '@testing-library/react';
   import { MyFeature } from './index';

   describe('MyFeature', () => {
     it('renders correctly', () => {
       const { getByText } = render(<MyFeature />);
       expect(getByText('My Feature')).toBeInTheDocument();
     });
   });
   ```

3. Export from index:
   ```typescript
   // apps/dashboard/components/index.ts
   export { MyFeature } from './my-feature';
   ```

### Smart Contracts

1. Create contract:
   ```solidity
   // contracts/MyContract.sol
   // SPDX-License-Identifier: MIT
   pragma solidity ^0.8.28;

   contract MyContract {
       // Implementation
   }
   ```

2. Add deployment script:
   ```typescript
   // deploy/XX_deploy_MyContract.ts
   import type { DeployFunction } from "hardhat-deploy/types";

   const deploy: DeployFunction = async (hre) => {
     await hre.midl.initialize();
     await hre.midl.deploy("MyContract", []);
     await hre.midl.execute();
   };

   deploy.tags = ["MyContract"];
   export default deploy;
   ```

3. Add tests:
   ```typescript
   // test/MyContract.test.ts
   import { expect } from "chai";
   import { ethers } from "hardhat";

   describe("MyContract", () => {
     it("should deploy", async () => {
       const MyContract = await ethers.getContractFactory("MyContract");
       const contract = await MyContract.deploy();
       expect(contract.address).to.be.properAddress;
     });
   });
   ```

### Custom Hooks

1. Create hook:
   ```typescript
   // apps/dashboard/hooks/use-my-feature.ts
   import { useState, useCallback } from 'react';

   export const useMyFeature = () => {
     const [state, setState] = useState(null);

     const doSomething = useCallback(() => {
       // Implementation
     }, []);

     return { state, doSomething };
   };
   ```

2. Add tests:
   ```typescript
   // apps/dashboard/hooks/use-my-feature.test.ts
   import { renderHook, act } from '@testing-library/react';
   import { useMyFeature } from './use-my-feature';

   describe('useMyFeature', () => {
     it('works correctly', () => {
       const { result } = renderHook(() => useMyFeature());
       // Test implementation
     });
   });
   ```

## Testing Guidelines

### Unit Tests

Test individual functions and components:

```typescript
describe('calculatePnL', () => {
  it('calculates profit correctly', () => {
    const result = calculatePnL(100, 110, 1, true);
    expect(result).toBe(10);
  });

  it('calculates loss correctly', () => {
    const result = calculatePnL(100, 90, 1, true);
    expect(result).toBe(-10);
  });
});
```

### Integration Tests

Test component interactions:

```typescript
describe('Trading Flow', () => {
  it('opens position successfully', async () => {
    const { getByText, getByLabelText } = render(<TradingInterface />);
    
    fireEvent.change(getByLabelText('Size'), { target: { value: '0.1' } });
    fireEvent.click(getByText('Buy / Long'));
    
    await waitFor(() => {
      expect(getByText('Position opened')).toBeInTheDocument();
    });
  });
});
```

### E2E Tests

Test complete user flows:

```typescript
test('complete trading flow', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('text=Connect Wallet');
  await page.fill('[name="size"]', '0.1');
  await page.click('text=Buy / Long');
  await expect(page.locator('text=Position opened')).toBeVisible();
});
```

## Documentation

### Code Comments

Use JSDoc for functions:

```typescript
/**
 * Calculates profit and loss for a position
 * @param entryPrice - Price when position was opened
 * @param exitPrice - Current or exit price
 * @param size - Position size
 * @param isLong - Whether position is long or short
 * @returns PnL amount
 */
export function calculatePnL(
  entryPrice: number,
  exitPrice: number,
  size: number,
  isLong: boolean
): number {
  // Implementation
}
```

### README Updates

Update README.md when:
- Adding new features
- Changing setup process
- Updating dependencies
- Modifying configuration

### API Documentation

Document all public APIs:

```typescript
/**
 * Hook for interacting with the PerpetualExchange contract
 * 
 * @example
 * ```tsx
 * const { openPosition, isLoading } = usePerpContract();
 * 
 * await openPosition('0.1', '78000', 2, true);
 * ```
 */
export const usePerpContract = () => {
  // Implementation
};
```

## Security

### Reporting Vulnerabilities

DO NOT open public issues for security vulnerabilities.

Instead:
1. Email security@example.com (replace with actual email)
2. Include detailed description
3. Provide steps to reproduce
4. Wait for response before disclosure

### Security Best Practices

- Never commit private keys or mnemonics
- Validate all user inputs
- Use parameterized queries
- Implement rate limiting
- Follow OWASP guidelines
- Regular dependency updates

## Code Review

### As a Reviewer

- Be respectful and constructive
- Focus on code quality and best practices
- Test the changes locally
- Check for security issues
- Verify documentation updates

### As an Author

- Respond to feedback promptly
- Be open to suggestions
- Explain your decisions
- Update based on feedback
- Thank reviewers

## Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Create release branch
4. Run full test suite
5. Deploy to staging
6. Test on staging
7. Create release tag
8. Deploy to production
9. Announce release

## Community

### Communication Channels

- Discord: [VibeHack Channel](https://discord.gg/midl)
- GitHub Issues: Bug reports and feature requests
- GitHub Discussions: General questions and ideas

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- No harassment or discrimination
- Follow community guidelines

## Resources

### Learning Resources

- [MIDL Documentation](https://docs.midl.xyz)
- [Next.js Documentation](https://nextjs.org/docs)
- [Solidity Documentation](https://docs.soliditylang.org)
- [React Documentation](https://react.dev)

### Tools

- [Hardhat](https://hardhat.org)
- [Wagmi](https://wagmi.sh)
- [Viem](https://viem.sh)
- [TanStack Query](https://tanstack.com/query)

## Questions?

If you have questions:
1. Check existing documentation
2. Search GitHub issues
3. Ask in Discord
4. Create a GitHub discussion

Thank you for contributing! 🚀
