// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;


import "./PerpetualFutures.sol";
import "./MarginAccount.sol";

contract LiquidationManager {
    PerpetualFutures public perpetualFutures;
    MarginAccount public marginAccount;

    event PositionLiquidated(address indexed trader, int256 pnl);

    constructor(address _perpetualFutures, address _marginAccount) {
        perpetualFutures = PerpetualFutures(_perpetualFutures);
        marginAccount = MarginAccount(_marginAccount);
    }

    function liquidate(address trader) external {
        (address posTrader, uint256 size, int256 entryPrice, int256 margin, bool isLong, bool isOpen) = perpetualFutures.positions(trader);
        require(isOpen, "No open position");
        int256 currentPrice = perpetualFutures.getLatestPrice();
        PerpetualFutures.Position memory pos = PerpetualFutures.Position(posTrader, size, entryPrice, margin, isLong, isOpen);
        int256 pnl = perpetualFutures.calculatePnL(pos, currentPrice);
        uint256 marginUint = uint256(margin);
        // Example: Liquidate if margin + pnl < threshold (e.g., 10% of margin)
        int256 marginPlusPnl = margin + pnl;
        require(marginPlusPnl < int256(marginUint / 10), "Position not eligible for liquidation");
        perpetualFutures.forceClosePosition(trader);
        marginAccount.unlockMargin(trader, marginUint, pnl);
        emit PositionLiquidated(trader, pnl);
    }
}
