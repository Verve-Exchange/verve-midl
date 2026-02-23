// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title Faucet
 * @dev Testnet faucet for distributing wrapped tokens (WBTC, WETH, WSOL)
 * 
 * WARNING: This contract is for TESTNET ONLY
 * DO NOT deploy to mainnet
 */
contract Faucet is Ownable {
    using SafeERC20 for IERC20;
    
    struct TokenConfig {
        address tokenAddress;
        uint256 amount;         // Amount to distribute per claim
        uint256 cooldown;       // Cooldown period in seconds
        bool isEnabled;
    }
    
    // Token configurations
    mapping(string => TokenConfig) public tokens;
    
    // User claim tracking: user => token symbol => last claim time
    mapping(address => mapping(string => uint256)) public lastClaim;
    
    // Events
    event TokenClaimed(address indexed user, string indexed symbol, uint256 amount);
    event TokenConfigured(string indexed symbol, address tokenAddress, uint256 amount, uint256 cooldown);
    event TokensDeposited(string indexed symbol, uint256 amount);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Configure a token for the faucet
     */
    function configureToken(
        string memory symbol,
        address tokenAddress,
        uint256 amount,
        uint256 cooldown
    ) external onlyOwner {
        require(tokenAddress != address(0), "Invalid token address");
        require(amount > 0, "Amount must be > 0");
        
        tokens[symbol] = TokenConfig({
            tokenAddress: tokenAddress,
            amount: amount,
            cooldown: cooldown,
            isEnabled: true
        });
        
        emit TokenConfigured(symbol, tokenAddress, amount, cooldown);
    }
    
    /**
     * @dev Claim tokens from faucet
     */
    function claim(string memory symbol) external {
        TokenConfig memory config = tokens[symbol];
        require(config.isEnabled, "Token not enabled");
        require(config.tokenAddress != address(0), "Token not configured");
        
        uint256 lastClaimTime = lastClaim[msg.sender][symbol];
        require(block.timestamp >= lastClaimTime + config.cooldown, "Cooldown period not elapsed");
        
        IERC20 token = IERC20(config.tokenAddress);
        require(token.balanceOf(address(this)) >= config.amount, "Faucet empty");
        
        lastClaim[msg.sender][symbol] = block.timestamp;
        token.safeTransfer(msg.sender, config.amount);
        
        emit TokenClaimed(msg.sender, symbol, config.amount);
    }
    
    /**
     * @dev Claim multiple tokens at once
     */
    function claimMultiple(string[] memory symbols) external {
        for (uint256 i = 0; i < symbols.length; i++) {
            TokenConfig memory config = tokens[symbols[i]];
            if (!config.isEnabled || config.tokenAddress == address(0)) continue;
            
            uint256 lastClaimTime = lastClaim[msg.sender][symbols[i]];
            if (block.timestamp < lastClaimTime + config.cooldown) continue;
            
            IERC20 token = IERC20(config.tokenAddress);
            if (token.balanceOf(address(this)) < config.amount) continue;
            
            lastClaim[msg.sender][symbols[i]] = block.timestamp;
            token.safeTransfer(msg.sender, config.amount);
            
            emit TokenClaimed(msg.sender, symbols[i], config.amount);
        }
    }
    
    /**
     * @dev Check if user can claim a token
     */
    function canClaim(address user, string memory symbol) external view returns (bool) {
        TokenConfig memory config = tokens[symbol];
        if (!config.isEnabled || config.tokenAddress == address(0)) return false;
        
        uint256 lastClaimTime = lastClaim[user][symbol];
        if (block.timestamp < lastClaimTime + config.cooldown) return false;
        
        IERC20 token = IERC20(config.tokenAddress);
        return token.balanceOf(address(this)) >= config.amount;
    }
    
    /**
     * @dev Get time until next claim is available
     */
    function timeUntilNextClaim(address user, string memory symbol) external view returns (uint256) {
        TokenConfig memory config = tokens[symbol];
        uint256 lastClaimTime = lastClaim[user][symbol];
        uint256 nextClaimTime = lastClaimTime + config.cooldown;
        
        if (block.timestamp >= nextClaimTime) return 0;
        return nextClaimTime - block.timestamp;
    }
    
    /**
     * @dev Deposit tokens into faucet
     */
    function depositTokens(string memory symbol, uint256 amount) external {
        TokenConfig memory config = tokens[symbol];
        require(config.tokenAddress != address(0), "Token not configured");
        
        IERC20(config.tokenAddress).safeTransferFrom(msg.sender, address(this), amount);
        emit TokensDeposited(symbol, amount);
    }
    
    /**
     * @dev Enable/disable a token
     */
    function setTokenEnabled(string memory symbol, bool enabled) external onlyOwner {
        tokens[symbol].isEnabled = enabled;
    }
    
    /**
     * @dev Update token amount
     */
    function updateTokenAmount(string memory symbol, uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be > 0");
        tokens[symbol].amount = amount;
    }
    
    /**
     * @dev Update cooldown period
     */
    function updateCooldown(string memory symbol, uint256 cooldown) external onlyOwner {
        tokens[symbol].cooldown = cooldown;
    }
    
    /**
     * @dev Emergency withdraw (owner only)
     */
    function emergencyWithdraw(address tokenAddress, uint256 amount) external onlyOwner {
        IERC20(tokenAddress).safeTransfer(msg.sender, amount);
    }
    
    /**
     * @dev Get token configuration
     */
    function getTokenConfig(string memory symbol) external view returns (TokenConfig memory) {
        return tokens[symbol];
    }
}
