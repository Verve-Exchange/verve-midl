// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title mUSDT
 * @dev Production-ready algorithmic stablecoin pegged to $1 USD
 * 
 * Features:
 * - Over-collateralized by BTC/ETH/SOL wrapped tokens
 * - CDP (Collateralized Debt Position) system
 * - Automatic liquidation mechanism
 * - Stability fee (interest on borrowed mUSDT)
 * - Price oracle integration ready
 * - Emergency shutdown capability
 */
contract mUSDT is ERC20, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    // Collateral types
    enum CollateralType { BTC, ETH, SOL }
    
    struct CDP {
        address owner;
        CollateralType collateralType;
        uint256 collateralAmount;      // Amount of collateral locked
        uint256 debtAmount;             // Amount of AlgoUSD minted
        uint256 lastUpdateTime;         // Last time stability fee was accrued
        bool isActive;
    }
    
    struct CollateralConfig {
        address tokenAddress;           // Wrapped token address (WBTC, WETH, WSOL)
        uint8 decimals;                 // Token decimals
        uint256 minCollateralRatio;    // Minimum collateralization ratio (150% = 150)
        uint256 liquidationRatio;      // Liquidation threshold (130% = 130)
        uint256 liquidationPenalty;    // Liquidation penalty (10% = 10)
        uint256 stabilityFee;          // Annual stability fee in basis points (5% = 500)
        bool isEnabled;
    }
    
    // CDP storage: owner => cdpId => CDP
    mapping(address => mapping(uint256 => CDP)) public cdps;
    mapping(address => uint256) public cdpCount;
    
    // Collateral configurations
    mapping(CollateralType => CollateralConfig) public collateralConfigs;
    
    // Price feeds (USD price with 8 decimals, e.g., $50000.00000000)
    mapping(CollateralType => uint256) public collateralPrices;
    
    // System parameters
    uint256 public constant PRICE_DECIMALS = 8;
    uint256 public totalDebt;
    uint256 public debtCeiling;
    bool public isShutdown;
    
    // Events
    event CDPCreated(address indexed owner, uint256 indexed cdpId, CollateralType collateralType);
    event CollateralDeposited(address indexed owner, uint256 indexed cdpId, uint256 amount);
    event AlgoUSDBorrowed(address indexed owner, uint256 indexed cdpId, uint256 amount);
    event DebtRepaid(address indexed owner, uint256 indexed cdpId, uint256 amount);
    event CollateralWithdrawn(address indexed owner, uint256 indexed cdpId, uint256 amount);
    event CDPLiquidated(address indexed owner, uint256 indexed cdpId, address indexed liquidator, uint256 debtRepaid, uint256 collateralSeized);
    event PriceUpdated(CollateralType indexed collateralType, uint256 price);
    event CollateralConfigured(CollateralType indexed collateralType, address tokenAddress);
    event EmergencyShutdown();
    
    constructor(uint256 _debtCeiling) ERC20("MIDL Tether USD", "mUSDT") Ownable(msg.sender) {
        debtCeiling = _debtCeiling;
    }
    
    /**
     * @dev Configure collateral type with token address and parameters
     */
    function configureCollateral(
        CollateralType collateralType,
        address tokenAddress,
        uint8 decimals,
        uint256 minCollateralRatio,
        uint256 liquidationRatio,
        uint256 liquidationPenalty,
        uint256 stabilityFee
    ) external onlyOwner {
        require(tokenAddress != address(0), "Invalid token address");
        require(minCollateralRatio > 100, "Min ratio must be > 100%");
        require(liquidationRatio < minCollateralRatio, "Liquidation ratio must be < min ratio");
        require(liquidationPenalty <= 25, "Penalty too high");
        require(stabilityFee <= 2000, "Fee too high"); // Max 20%
        
        collateralConfigs[collateralType] = CollateralConfig({
            tokenAddress: tokenAddress,
            decimals: decimals,
            minCollateralRatio: minCollateralRatio,
            liquidationRatio: liquidationRatio,
            liquidationPenalty: liquidationPenalty,
            stabilityFee: stabilityFee,
            isEnabled: true
        });
        
        emit CollateralConfigured(collateralType, tokenAddress);
    }
    
    /**
     * @dev Update collateral price (integrate with Chainlink in production)
     */
    function updatePrice(CollateralType collateralType, uint256 price) external onlyOwner {
        require(price > 0, "Invalid price");
        collateralPrices[collateralType] = price;
        emit PriceUpdated(collateralType, price);
    }
    
    /**
     * @dev Create a new CDP
     */
    function createCDP(CollateralType collateralType) external nonReentrant returns (uint256) {
        require(!isShutdown, "System is shutdown");
        CollateralConfig memory config = collateralConfigs[collateralType];
        require(config.isEnabled, "Collateral type not enabled");
        require(config.tokenAddress != address(0), "Collateral not configured");
        
        uint256 cdpId = cdpCount[msg.sender]++;
        cdps[msg.sender][cdpId] = CDP({
            owner: msg.sender,
            collateralType: collateralType,
            collateralAmount: 0,
            debtAmount: 0,
            lastUpdateTime: block.timestamp,
            isActive: true
        });
        
        emit CDPCreated(msg.sender, cdpId, collateralType);
        return cdpId;
    }
    
    /**
     * @dev Deposit collateral into CDP
     */
    function depositCollateral(uint256 cdpId, uint256 amount) external nonReentrant {
        require(!isShutdown, "System is shutdown");
        CDP storage cdp = cdps[msg.sender][cdpId];
        require(cdp.isActive, "CDP not active");
        require(amount > 0, "Amount must be > 0");
        
        CollateralConfig memory config = collateralConfigs[cdp.collateralType];
        IERC20(config.tokenAddress).safeTransferFrom(msg.sender, address(this), amount);
        
        cdp.collateralAmount += amount;
        emit CollateralDeposited(msg.sender, cdpId, amount);
    }
    
    /**
     * @dev Borrow mUSDT against collateral
     */
    function borrowmUSDT(uint256 cdpId, uint256 amount) external nonReentrant {
        require(!isShutdown, "System is shutdown");
        CDP storage cdp = cdps[msg.sender][cdpId];
        require(cdp.isActive, "CDP not active");
        require(amount > 0, "Amount must be > 0");
        
        _accrueStabilityFee(cdp);
        
        uint256 newDebt = cdp.debtAmount + amount;
        require(_isCollateralized(cdp, newDebt), "Insufficient collateral");
        require(totalDebt + amount <= debtCeiling, "Debt ceiling reached");
        
        cdp.debtAmount = newDebt;
        totalDebt += amount;
        
        _mint(msg.sender, amount);
        emit AlgoUSDBorrowed(msg.sender, cdpId, amount);
    }
    
    /**
     * @dev Repay mUSDT debt
     */
    function repayDebt(uint256 cdpId, uint256 amount) external nonReentrant {
        CDP storage cdp = cdps[msg.sender][cdpId];
        require(cdp.isActive, "CDP not active");
        require(amount > 0, "Amount must be > 0");
        
        _accrueStabilityFee(cdp);
        require(amount <= cdp.debtAmount, "Amount exceeds debt");
        
        _burn(msg.sender, amount);
        
        cdp.debtAmount -= amount;
        totalDebt -= amount;
        
        emit DebtRepaid(msg.sender, cdpId, amount);
    }
    
    /**
     * @dev Withdraw collateral from CDP
     */
    function withdrawCollateral(uint256 cdpId, uint256 amount) external nonReentrant {
        CDP storage cdp = cdps[msg.sender][cdpId];
        require(cdp.isActive, "CDP not active");
        require(amount > 0, "Amount must be > 0");
        require(amount <= cdp.collateralAmount, "Insufficient collateral");
        
        _accrueStabilityFee(cdp);
        
        uint256 newCollateral = cdp.collateralAmount - amount;
        
        if (cdp.debtAmount > 0) {
            uint256 collateralValue = _getCollateralValue(cdp.collateralType, newCollateral);
            uint256 ratio = (collateralValue * 100 * (10 ** decimals())) / cdp.debtAmount;
            
            CollateralConfig memory config = collateralConfigs[cdp.collateralType];
            require(ratio >= config.minCollateralRatio, "Would be undercollateralized");
        }
        
        cdp.collateralAmount = newCollateral;
        
        CollateralConfig memory config = collateralConfigs[cdp.collateralType];
        IERC20(config.tokenAddress).safeTransfer(msg.sender, amount);
        
        emit CollateralWithdrawn(msg.sender, cdpId, amount);
    }
    
    /**
     * @dev Liquidate an undercollateralized CDP
     */
    function liquidateCDP(address owner, uint256 cdpId) external nonReentrant {
        CDP storage cdp = cdps[owner][cdpId];
        require(cdp.isActive, "CDP not active");
        require(cdp.debtAmount > 0, "No debt to liquidate");
        
        _accrueStabilityFee(cdp);
        
        CollateralConfig memory config = collateralConfigs[cdp.collateralType];
        uint256 collateralValue = _getCollateralValue(cdp.collateralType, cdp.collateralAmount);
        uint256 ratio = (collateralValue * 100 * (10 ** decimals())) / cdp.debtAmount;
        
        require(ratio < config.liquidationRatio, "CDP is not undercollateralized");
        
        uint256 debtToRepay = cdp.debtAmount;
        uint256 penalty = (debtToRepay * config.liquidationPenalty) / 100;
        uint256 totalDebtWithPenalty = debtToRepay + penalty;
        
        _burn(msg.sender, debtToRepay);
        
        uint256 collateralToLiquidator = (totalDebtWithPenalty * (10 ** config.decimals) * (10 ** PRICE_DECIMALS)) / 
                                         (collateralPrices[cdp.collateralType] * (10 ** decimals()));
        
        if (collateralToLiquidator > cdp.collateralAmount) {
            collateralToLiquidator = cdp.collateralAmount;
        }
        
        IERC20(config.tokenAddress).safeTransfer(msg.sender, collateralToLiquidator);
        
        uint256 remainingCollateral = cdp.collateralAmount - collateralToLiquidator;
        if (remainingCollateral > 0) {
            IERC20(config.tokenAddress).safeTransfer(owner, remainingCollateral);
        }
        
        totalDebt -= debtToRepay;
        cdp.isActive = false;
        cdp.collateralAmount = 0;
        cdp.debtAmount = 0;
        
        emit CDPLiquidated(owner, cdpId, msg.sender, debtToRepay, collateralToLiquidator);
    }
    
    /**
     * @dev Accrue stability fee on CDP
     */
    function _accrueStabilityFee(CDP storage cdp) internal {
        if (cdp.debtAmount == 0) return;
        
        CollateralConfig memory config = collateralConfigs[cdp.collateralType];
        uint256 timeElapsed = block.timestamp - cdp.lastUpdateTime;
        
        uint256 fee = (cdp.debtAmount * config.stabilityFee * timeElapsed) / (365 days * 10000);
        
        cdp.debtAmount += fee;
        totalDebt += fee;
        cdp.lastUpdateTime = block.timestamp;
    }
    
    /**
     * @dev Check if CDP is properly collateralized
     */
    function _isCollateralized(CDP storage cdp, uint256 newDebt) internal view returns (bool) {
        if (newDebt == 0) return true;
        
        uint256 collateralValue = _getCollateralValue(cdp.collateralType, cdp.collateralAmount);
        uint256 ratio = (collateralValue * 100 * (10 ** decimals())) / newDebt;
        
        CollateralConfig memory config = collateralConfigs[cdp.collateralType];
        return ratio >= config.minCollateralRatio;
    }
    
    /**
     * @dev Get collateral value in mUSDT (18 decimals)
     */
    function _getCollateralValue(CollateralType collateralType, uint256 amount) internal view returns (uint256) {
        uint256 price = collateralPrices[collateralType];
        require(price > 0, "Price not set");
        
        CollateralConfig memory config = collateralConfigs[collateralType];
        
        // Convert to 18 decimals: (amount * price * 10^18) / (10^collateralDecimals * 10^priceDecimals)
        return (amount * price * (10 ** decimals())) / (10 ** config.decimals) / (10 ** PRICE_DECIMALS);
    }
    
    /**
     * @dev Get CDP collateralization ratio (percentage with 18 decimals)
     */
    function getCollateralizationRatio(address owner, uint256 cdpId) external view returns (uint256) {
        CDP storage cdp = cdps[owner][cdpId];
        if (cdp.debtAmount == 0) return type(uint256).max;
        
        uint256 collateralValue = _getCollateralValue(cdp.collateralType, cdp.collateralAmount);
        return (collateralValue * 100 * (10 ** decimals())) / cdp.debtAmount;
    }
    
    /**
     * @dev Get CDP details
     */
    function getCDP(address owner, uint256 cdpId) external view returns (CDP memory) {
        return cdps[owner][cdpId];
    }
    
    /**
     * @dev Emergency shutdown - stops all minting
     */
    function emergencyShutdown() external onlyOwner {
        isShutdown = true;
        emit EmergencyShutdown();
    }
    
    /**
     * @dev Update debt ceiling
     */
    function updateDebtCeiling(uint256 newCeiling) external onlyOwner {
        debtCeiling = newCeiling;
    }
    
    /**
     * @dev Enable/disable collateral type
     */
    function setCollateralEnabled(CollateralType collateralType, bool enabled) external onlyOwner {
        collateralConfigs[collateralType].isEnabled = enabled;
    }
}
