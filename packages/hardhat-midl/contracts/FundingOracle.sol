// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FundingOracle {
    uint256 public fundingRate;
    address public owner;

    event FundingRateUpdated(uint256 newFundingRate);

    constructor() {
        owner = msg.sender;
    }

    function updateFundingRate(uint256 newFundingRate) external {
        require(msg.sender == owner, "Only owner");
        fundingRate = newFundingRate;
        emit FundingRateUpdated(newFundingRate);
    }
}
