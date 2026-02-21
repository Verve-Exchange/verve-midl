// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { AggregatorV3Interface } from "./interfaces/AggregatorV3Interface.sol";
import "./MarginAccount.sol";

contract PerpetualFutures {
    struct Position {
        address trader;
        uint256 size;
        int256 entryPrice;
        int256 margin;
        bool isLong;
        bool isOpen;
    }

    mapping(address => Position) public positions;
    AggregatorV3Interface public priceFeed;
    MarginAccount public marginAccount;
    uint256 public fundingRate;
    uint256 public lastFundingTimestamp;

    event PositionOpened(address indexed trader, uint256 size, int256 entryPrice, int256 margin, bool isLong);
    event PositionClosed(address indexed trader, int256 pnl);
    event FundingRateUpdated(uint256 newFundingRate);

    constructor(address _priceFeed, address _marginAccount) {
        priceFeed = AggregatorV3Interface(_priceFeed);
        marginAccount = MarginAccount(_marginAccount);
    }

    function getLatestPrice() public view returns (int256) {
        (, int256 price, , ,) = priceFeed.latestRoundData();
        return price;
    }

    function openPosition(uint256 size, int256 margin, bool isLong) external {
        require(!positions[msg.sender].isOpen, "Position already open");
        int256 entryPrice = getLatestPrice();
        require(marginAccount.balances(msg.sender) >= uint256(margin), "Insufficient margin");
        marginAccount.lockMargin(msg.sender, uint256(margin));
        positions[msg.sender] = Position(msg.sender, size, entryPrice, margin, isLong, true);
        emit PositionOpened(msg.sender, size, entryPrice, margin, isLong);
    }

    function closePosition() external {
        Position storage pos = positions[msg.sender];
        require(pos.isOpen, "No open position");
        int256 exitPrice = getLatestPrice();
        int256 pnl = calculatePnL(pos, exitPrice);
        marginAccount.unlockMargin(msg.sender, uint256(pos.margin), pnl);
        pos.isOpen = false;
        emit PositionClosed(msg.sender, pnl);
    }

    function updateFundingRate(uint256 newFundingRate) external {
        fundingRate = newFundingRate;
        lastFundingTimestamp = block.timestamp;
        emit FundingRateUpdated(newFundingRate);
    }

    function calculatePnL(Position memory pos, int256 exitPrice) public pure returns (int256) {
        if (pos.isLong) {
            return int256(pos.size) * (exitPrice - pos.entryPrice);
        } else {
            return int256(pos.size) * (pos.entryPrice - exitPrice);
        }
    }
}
