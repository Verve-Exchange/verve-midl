// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


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
        PerpetualFutures.Position memory pos = perpetualFutures.positions(trader);
        require(pos.isOpen, "No open position");
        int256 currentPrice = perpetualFutures.getLatestPrice();
        int256 pnl = perpetualFutures.calculatePnL(pos, currentPrice);
        uint256 margin = uint256(pos.margin);
        // Example: Liquidate if margin + pnl < threshold (e.g., 10% of margin)
        require((margin + pnl) < (margin / 10), "Position not eligible for liquidation");
        perpetualFutures.forceClosePosition(trader);
        marginAccount.unlockMargin(trader, margin, pnl);
        emit PositionLiquidated(trader, pnl);
    }
}
