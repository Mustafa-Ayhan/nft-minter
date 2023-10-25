// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TreasuryWallet {
    address public owner;
    uint256 public balance;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function deposit() public payable onlyOwner {
        balance += msg.value;
    }

    function withdraw(uint256 amount) public onlyOwner {
        require(amount <= balance, "Insufficient balance");
        balance -= amount;
        payable(owner).transfer(amount);
    }

     function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
