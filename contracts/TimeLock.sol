//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TimeLock {

  using SafeMath for uint;

  mapping(address => uint) public balances;

  mapping(address => uint) public lockTime;


  function deposit() external payable {
    balances[msg.sender] += msg.value;
    lockTime[msg.sender] = block.timestamp + 1 weeks;
  }

  function increaseLockTime(uint _seconds) external {
    lockTime[msg.sender] = lockTime[msg.sender].add(_seconds);
  }

  function withdraw() public {
    require(balances[msg.sender] > 0, "Insufficient balance");

    require(block.timestamp > lockTime[msg.sender], "lock time has not expired");

    // update the balance
    uint amount = balances[msg.sender];

    balances[msg.sender] = 0;

    (bool sent, ) = msg.sender.call{value: amount}("");

    require(sent, "Failed to send ether");
  }

}