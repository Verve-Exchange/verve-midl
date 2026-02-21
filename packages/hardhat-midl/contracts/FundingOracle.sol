// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;


import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";


contract FundingOracle {
    uint256 public fundingRate;
    address public owner;
    AggregatorV3Interface public priceFeed;

    event FundingRateUpdated(uint256 newFundingRate);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor(address _priceFeed) {
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function updateFundingRate(uint256 newFundingRate) external onlyOwner {
        fundingRate = newFundingRate;
        emit FundingRateUpdated(newFundingRate);
    }

    function updateFundingRateFromOracle() external onlyOwner {
        (, int256 price, , uint256 updatedAt,) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price");
        require(block.timestamp - updatedAt < 1 hours, "Stale price");
        
        uint8 decimals = priceFeed.decimals();
        fundingRate = uint256(price) * 1e18 / (10 ** decimals);
        emit FundingRateUpdated(fundingRate);
    }
}
