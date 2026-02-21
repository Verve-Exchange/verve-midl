// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract PerpetualExchange {
    struct Position {
        address trader;
        uint256 size;
        uint256 entryPrice;
        uint256 leverage;
        bool isLong;
        uint256 margin;
        uint256 timestamp;
    }

    mapping(address => Position[]) public positions;
    mapping(address => uint256) public balances;
    
    uint256 public totalVolume;
    uint256 public totalPositions;
    
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

    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, amount);
    }

    function openPosition(
        uint256 size,
        uint256 price,
        uint256 leverage,
        bool isLong
    ) external {
        require(size > 0, "Size must be greater than 0");
        require(leverage > 0 && leverage <= 10, "Leverage must be between 1 and 10");
        
        uint256 requiredMargin = (size * price) / leverage;
        require(balances[msg.sender] >= requiredMargin, "Insufficient margin");
        
        balances[msg.sender] -= requiredMargin;
        
        Position memory newPosition = Position({
            trader: msg.sender,
            size: size,
            entryPrice: price,
            leverage: leverage,
            isLong: isLong,
            margin: requiredMargin,
            timestamp: block.timestamp
        });
        
        positions[msg.sender].push(newPosition);
        totalPositions++;
        totalVolume += size * price;
        
        emit PositionOpened(
            msg.sender,
            positions[msg.sender].length - 1,
            size,
            price,
            leverage,
            isLong
        );
    }

    function closePosition(uint256 positionId, uint256 exitPrice) external {
        require(positionId < positions[msg.sender].length, "Invalid position ID");
        Position storage position = positions[msg.sender][positionId];
        require(position.size > 0, "Position already closed");
        
        int256 pnl = calculatePnL(position, exitPrice);
        uint256 finalAmount = uint256(int256(position.margin) + pnl);
        
        balances[msg.sender] += finalAmount;
        position.size = 0;
        
        emit PositionClosed(msg.sender, positionId, pnl);
    }

    function calculatePnL(Position memory position, uint256 currentPrice) 
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

    function getPositions(address trader) external view returns (Position[] memory) {
        return positions[trader];
    }

    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }
}
