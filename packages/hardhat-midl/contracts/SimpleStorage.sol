// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleStorage {
    uint256 private value;
    string public message;

    event ValueChanged(uint256 newValue);
    event MessageChanged(string newMessage);

    constructor(string memory _initialMessage) {
        message = _initialMessage;
    }

    function store(uint256 _value) public {
        value = _value;
        emit ValueChanged(_value);
    }

    function retrieve() public view returns (uint256) {
        return value;
    }

    function setMessage(string memory _message) public {
        message = _message;
        emit MessageChanged(_message);
    }
    
    function getMessage() public view returns (string memory) {
        return message;
    }
}
