// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import { AggregatorV3Interface } from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

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
        (, int256 price, , ,) = priceFeed.latestRoundData();
        fundingRate = uint256(price);
        emit FundingRateUpdated(fundingRate);
    }
}
