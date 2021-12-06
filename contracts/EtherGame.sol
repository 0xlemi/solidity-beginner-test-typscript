//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract EtherGame {
  bool reEntracyMutex = false;
  uint public targetAmount = 14 ether;
  address public winner;
  uint public balance;

  event DepositFunds(address from, uint amount);

  function play() public payable{
    require(msg.value == 1 ether, "You can only send 1 ether");
    require(balance < targetAmount, "Game over");

    balance += msg.value;

    if (balance == targetAmount) {
      winner = msg.sender;
      console.log("You won!");
    }
  }

  function claimReward() public {
    require(!reEntracyMutex, "No reEntracy MTF");
    require(msg.sender == winner, "Not the winner");
    require(balance == targetAmount, "Price already Claimed");
    uint toSend = balance;
    balance = 0;
    reEntracyMutex = true;
    (bool sent, ) = msg.sender.call{value: toSend}("");
    if(!sent){
      balance = targetAmount;
    }
    reEntracyMutex = false;
    require(sent, "Failed to send ether");
  }

  receive() external payable {
    console.log("money received");
    emit DepositFunds(msg.sender, msg.value);
  }
  fallback() external payable {
    emit DepositFunds(msg.sender, msg.value);
  }

  function hackableClaimReward() public {
    require(msg.sender == winner, "Not the winner");
    console.log("hackable called");
    (bool sent, ) = msg.sender.call{value: balance}("");
    balance = 0;
    if(!sent){
      balance = targetAmount;
    }
    require(sent, "Failed to send ether");
  }

  function currentBalance() public view returns (uint){
    return balance;
  }

}
