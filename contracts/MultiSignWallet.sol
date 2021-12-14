//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MultiSigWallet {
  address private _owner;

  mapping(address => bool) private _owners;

  uint constant MIN_SIGNATURES = 2;

  uint private _transactionIdx;

  bool private reentracyProtection;

  struct Transaction {
    address from;
    address to;
    uint amount;
    uint8 signatureCount;
    address signaturesAddr;
  }
  
  mapping(address => mapping(address => bool)) signatures;

  mapping(uint => Transaction) private _transactions;

  uint[] private _pendingTransactions;


  modifier isOwner() {
    require(msg.sender == _owner, "Not contract owner");
    _;
  }

  modifier validOwner() {
    require(msg.sender == _owner || _owners[msg.sender] == true, "Not valid owner");
    _;
  }

  event DepositFunds(address from, uint amount);
  event WithdrawFunds(address from, uint amount);
  event TransferFunds(address from, address to, uint amount);
  event TransactionSigned(address by, uint transactionId);
  event TransactionCreated(address by, uint transactionId);

  constructor() {
    _owner = msg.sender;
  }

  function addOwner(address newOwner) public isOwner {
    _owners[newOwner] = true;
  }

  function removeOwner(address oldOwner) public isOwner {
    _owners[oldOwner] = false;
  }

  receive() external payable {
    emit DepositFunds(msg.sender, msg.value);
  }

  // Create transaction function
  function createTransaction(address to, uint amount) external validOwner {
    require(address(this).balance >= amount, "Insufficient Funds");

    uint transactionId = _transactionIdx++;

    Transaction memory transaction = Transaction({
      from: msg.sender,
      to: payable(to),
      amount: amount,
      signatureCount: 0,
      signaturesAddr: address(bytes20(keccak256(abi.encodePacked(block.timestamp))))
    });

    _transactions[transactionId] = transaction;
    _pendingTransactions.push(transactionId);

    emit TransactionCreated(msg.sender, transactionId);

  }

  function getPendingTransactions() public view validOwner returns (uint[] memory) {
    return _pendingTransactions;
  }

  function getTransactionInfo(uint transactionId) public view validOwner returns (Transaction memory) {
    return _transactions[transactionId];
  }

  function signTransaction(uint transactionId) public validOwner {

    Transaction storage transaction = _transactions[transactionId];

    // Check if transaction exists
    require(address(0) != transaction.from, "Transaction with that id doesn't exist");
    // creator cannot sign own trasaction
    require(msg.sender != transaction.from, "Creator cannot sign own trasaction");
    // Check so it cannot sign twice
    require(signatures[transaction.signaturesAddr][msg.sender] == false, "Already voted");
    // require(transaction.signatures[msg.sender] == false);

    signatures[transaction.signaturesAddr][msg.sender] = true;
    transaction.signatureCount++;

    emit TransactionSigned(msg.sender, transactionId);


    if(transaction.signatureCount >= MIN_SIGNATURES) {
      require(address(this).balance >= transaction.amount);
      address to = transaction.to;
      uint amount = transaction.amount;
      bool status = deleteTransaction(transactionId);
      require(status, "Transaction was not sent");
      require(reentracyProtection == false, "No hacking please");
      reentracyProtection = true;
      (bool sent, ) = to.call{value: amount}("");
      reentracyProtection = false;
      require(sent, "Failed to send ether");
    }

  }

  function deleteTransaction (uint transactionId) private returns (bool){
    for (uint256 i = 0; i < _pendingTransactions.length; i++) {
      if(_pendingTransactions[i] == transactionId){

        _pendingTransactions[i] = _pendingTransactions[_pendingTransactions.length - 1];
        delete _pendingTransactions[_pendingTransactions.length - 1];
        delete _transactions[transactionId];

        return true;
      }
    }

    return false;
  }

  function walletBalance() public view returns (uint){
    return address(this).balance;
  }



}
