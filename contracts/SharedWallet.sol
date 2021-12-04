//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract SharedWallet {
  address private _owner;

  mapping(address => bool) private _owners;
  uint private _ownersCount = 1;

  modifier isOwner() {
    require(msg.sender == _owner);
    _;
  }

  modifier validOwner() {
    require(msg.sender == _owner || _owners[msg.sender] == true);
    _;
  }

  event DepositFunds(address from, uint amount);
  event WithdrawFunds(address to, uint amount);
  event TransferFunds(address from, address to, uint amount);


  constructor() {
    _owner = msg.sender;
  }


  function isMasterOwner() public view returns (bool){
    return _owner == msg.sender;
  }


  function isItOwner() public view returns (bool) {
    return _owners[msg.sender] == true;
  }

  function addOwner(address toAdd) public isOwner {
    _owners[toAdd] = true;
    _ownersCount++;
  }

  function removeOwner(address toRemove) public isOwner {
    _owners[toRemove] = false;
    _ownersCount--;
  }

  fallback() external payable {
    console.log("fallback called");
    emit DepositFunds(msg.sender, msg.value);
  }

  receive() external payable {
    console.log("recive called successfully");
    console.log(msg.sender);
    console.log(Strings.toString(msg.value));
    emit DepositFunds(msg.sender, msg.value);
  }

  function withdraw (uint amount) public validOwner payable{
    require(address(this).balance >= amount);
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
    emit WithdrawFunds(msg.sender, amount);
    console.log("funds sent");
  }

  function transferTo (address to, uint amount) public validOwner payable{
    require(address(this).balance >= amount);
    (bool success, ) = to.call{value: amount}("");
    require(success);
    emit TransferFunds(msg.sender, to, amount);
  }

}



