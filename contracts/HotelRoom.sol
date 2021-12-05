//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract HotelRoom {

  enum Status {free, busy}
  Status currentStatus;

  event Occupy(address _occupant, uint _value);

  address payable public owner;

  constructor() {
    owner = payable(msg.sender);
    currentStatus = Status.free;
  }


  modifier onlyIfFree () {
    require(currentStatus == Status.free, 'Is Currently Busy This Room');
    _;
  }

  modifier cost (uint _value) {
    require(msg.value > _value, 'Not enought money sent');
    _;
  }

  function recieve() external payable onlyIfFree cost(2 ether) {
    currentStatus = Status.busy;
    owner.transfer(msg.value);
    emit Occupy(msg.sender, msg.value);
    console.log("Room is recerved");
  }


}

