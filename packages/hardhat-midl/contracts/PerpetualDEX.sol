// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PerpetualDEX
 * @dev mUSDT-based perpetual futures exchange with order book
 * Uses algorithmic stablecoin (mUSDT) as collateral
 */
contract PerpetualDEX is ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable mUSDT;

    struct Position {
        address trader;
        string market; // e.g., "BTC/USD", "ETH/USD", "SOL/USD"
        uint256 size; // Position size in USD (6 decimals)
        uint256 entryPrice; // Entry price (6 decimals)
        uint256 leverage; // 1-100x
        bool isLong;
        uint256 margin; // Collateral in USDT
        uint256 timestamp;
        bool isOpen;
    }

    struct Order {
        address trader;
        string market;
        uint256 size;
        uint256 price;
        uint256 leverage;
        bool isLong;
        bool isLimit; // true for limit, false for market
        uint256 timestamp;
        bool isFilled;
    }

    // Trader => Position ID => Position
    mapping(address => mapping(uint256 => Position)) public positions;
    mapping(address => uint256) public positionCount;
    
    // Trader => USDT balance
    mapping(address => uint256) public balances;
    
    // Order book: Market => Order ID => Order
    mapping(string => mapping(uint256 => Order)) public orders;
    mapping(string => uint256) public orderCount;
    
    // Market => Current Price (for market orders)
    mapping(string => uint256) public marketPrices;
    
    uint256 public totalVolume;
    uint256 public constant MAX_LEVERAGE = 100;
    uint256 public constant MIN_LEVERAGE = 1;
    uint256 public tradingFee = 10; // 0.1% = 10 basis points

    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    
    event OrderPlaced(
        address indexed trader,
        uint256 indexed orderId,
        string market,
        uint256 size,
        uint256 price,
        uint256 leverage,
        bool isLong,
        bool isLimit
    );
    
    event PositionOpened(
        address indexed trader,
        uint256 indexed positionId,
        string market,
        uint256 size,
        uint256 price,
        uint256 leverage,
        bool isLong
    );
    
    event PositionClosed(
        address indexed trader,
        uint256 indexed positionId,
        int256 pnl,
        uint256 exitPrice
    );
    
    event PriceUpdated(string indexed market, uint256 price);

    constructor(address _mUSDT) {
        require(_mUSDT != address(0), "Invalid mUSDT address");
        mUSDT = IERC20(_mUSDT);
    }

    /**
     * @dev Deposit mUSDT as collateral
     */
    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        mUSDT.safeTransferFrom(msg.sender, address(this), amount);
        balances[msg.sender] += amount;
        emit Deposit(msg.sender, amount);
    }

    /**
     * @dev Withdraw mUSDT
     */
    function withdraw(uint256 amount) external nonReentrant {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        mUSDT.safeTransfer(msg.sender, amount);
        emit Withdrawal(msg.sender, amount);
    }

    /**
     * @dev Place a market or limit order
     */
    function placeOrder(
        string memory market,
        uint256 size,
        uint256 price, // For limit orders, 0 for market orders
        uint256 leverage,
        bool isLong,
        bool isLimit
    ) external nonReentrant returns (uint256) {
        require(size > 0, "Size must be greater than 0");
        require(leverage >= MIN_LEVERAGE && leverage <= MAX_LEVERAGE, "Invalid leverage");
        
        uint256 executionPrice = isLimit ? price : marketPrices[market];
        require(executionPrice > 0, "Invalid price");
        
        uint256 requiredMargin = (size * executionPrice) / leverage / 1e6;
        uint256 fee = (size * executionPrice * tradingFee) / 1e6 / 10000;
        uint256 totalRequired = requiredMargin + fee;
        
        require(balances[msg.sender] >= totalRequired, "Insufficient margin");
        
        uint256 orderId = orderCount[market]++;
        orders[market][orderId] = Order({
            trader: msg.sender,
            market: market,
            size: size,
            price: executionPrice,
            leverage: leverage,
            isLong: isLong,
            isLimit: isLimit,
            timestamp: block.timestamp,
            isFilled: false
        });
        
        emit OrderPlaced(msg.sender, orderId, market, size, executionPrice, leverage, isLong, isLimit);
        
        // Execute market orders immediately
        if (!isLimit) {
            _executeOrder(market, orderId);
        }
        
        return orderId;
    }

    /**
     * @dev Execute an order (internal)
     */
    function _executeOrder(string memory market, uint256 orderId) internal {
        Order storage order = orders[market][orderId];
        require(!order.isFilled, "Order already filled");
        
        uint256 requiredMargin = (order.size * order.price) / order.leverage / 1e6;
        uint256 fee = (order.size * order.price * tradingFee) / 1e6 / 10000;
        
        balances[order.trader] -= (requiredMargin + fee);
        
        uint256 positionId = positionCount[order.trader]++;
        positions[order.trader][positionId] = Position({
            trader: order.trader,
            market: market,
            size: order.size,
            entryPrice: order.price,
            leverage: order.leverage,
            isLong: order.isLong,
            margin: requiredMargin,
            timestamp: block.timestamp,
            isOpen: true
        });
        
        order.isFilled = true;
        totalVolume += order.size * order.price / 1e6;
        
        emit PositionOpened(
            order.trader,
            positionId,
            market,
            order.size,
            order.price,
            order.leverage,
            order.isLong
        );
    }

    /**
     * @dev Close a position
     */
    function closePosition(uint256 positionId) external nonReentrant {
        Position storage position = positions[msg.sender][positionId];
        require(position.isOpen, "Position not open");
        
        uint256 exitPrice = marketPrices[position.market];
        require(exitPrice > 0, "Invalid exit price");
        
        int256 pnl = _calculatePnL(position, exitPrice);
        uint256 fee = (position.size * exitPrice * tradingFee) / 1e6 / 10000;
        
        int256 finalAmount = int256(position.margin) + pnl - int256(fee);
        require(finalAmount >= 0, "Position liquidated");
        
        balances[msg.sender] += uint256(finalAmount);
        position.isOpen = false;
        
        emit PositionClosed(msg.sender, positionId, pnl, exitPrice);
    }

    /**
     * @dev Calculate PnL for a position
     */
    function _calculatePnL(Position memory position, uint256 currentPrice) 
        internal 
        pure 
        returns (int256) 
    {
        int256 priceDiff = int256(currentPrice) - int256(position.entryPrice);
        if (!position.isLong) {
            priceDiff = -priceDiff;
        }
        return (priceDiff * int256(position.size) * int256(position.leverage)) / int256(position.entryPrice);
    }

    /**
     * @dev Update market price (in production, use Chainlink oracle)
     */
    function updatePrice(string memory market, uint256 price) external {
        require(price > 0, "Invalid price");
        marketPrices[market] = price;
        emit PriceUpdated(market, price);
    }

    /**
     * @dev Get user's positions
     */
    function getUserPositions(address trader) external view returns (Position[] memory) {
        uint256 count = positionCount[trader];
        Position[] memory userPositions = new Position[](count);
        
        for (uint256 i = 0; i < count; i++) {
            userPositions[i] = positions[trader][i];
        }
        
        return userPositions;
    }

    /**
     * @dev Get position details
     */
    function getPosition(address trader, uint256 positionId) 
        external 
        view 
        returns (Position memory) 
    {
        return positions[trader][positionId];
    }

    /**
     * @dev Get user balance
     */
    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }

    /**
     * @dev Get market orders
     */
    function getMarketOrders(string memory market, uint256 limit) 
        external 
        view 
        returns (Order[] memory) 
    {
        uint256 count = orderCount[market];
        uint256 resultCount = count > limit ? limit : count;
        Order[] memory marketOrders = new Order[](resultCount);
        
        for (uint256 i = 0; i < resultCount; i++) {
            marketOrders[i] = orders[market][count - 1 - i];
        }
        
        return marketOrders;
    }
}
