// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;



contract MarginAccount {
    mapping(address => uint256) public balances;
    mapping(address => uint256) public lockedMargins;
    address public owner;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event MarginLocked(address indexed user, uint256 amount);
    event MarginUnlocked(address indexed user, uint256 amount, int256 pnl);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function deposit() external payable {
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdraw(msg.sender, amount);
    }

    function lockMargin(address user, uint256 amount) external onlyOwner {
        require(balances[user] >= amount, "Insufficient balance");
        balances[user] -= amount;
        lockedMargins[user] += amount;
        emit MarginLocked(user, amount);
    }

    function unlockMargin(address user, uint256 amount, int256 pnl) external onlyOwner {
        require(lockedMargins[user] >= amount, "Insufficient locked margin");
        lockedMargins[user] -= amount;
        uint256 payout = amount;
        if (pnl > 0) {
            payout += uint256(pnl);
        } else if (pnl < 0) {
            uint256 loss = uint256(-pnl);
            if (loss > payout) {
                payout = 0;
            } else {
                payout -= loss;
            }
        }
        balances[user] += payout;
        emit MarginUnlocked(user, amount, pnl);
    }
}
