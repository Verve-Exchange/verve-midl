// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WrappedBTC is ERC20, Ownable {
    uint8 private constant _decimals = 8; // BTC has 8 decimals

    event Mint(address indexed to, uint256 amount);
    event Burn(address indexed from, uint256 amount);

    constructor() ERC20("Wrapped Bitcoin", "WBTC") Ownable(msg.sender) {}

    function decimals() public pure override returns (uint8) {
        return _decimals;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
        emit Mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
        emit Burn(msg.sender, amount);
    }
}
