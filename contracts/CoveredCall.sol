//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Owned {
  address payable owner;

  constructor() { 
    owner = payable(msg.sender); 
  }

  modifier onlyOwner {
    require(msg.sender == owner, "You are not the owner");
    _;
  }
}

contract HelloToken is ERC20, Owned {
  constructor() ERC20("Hello Token", "HE") Owned(){
    _mint(msg.sender, 100 * 10 ** uint(decimals()));
  }

  function issue(address recipient, uint amount) public onlyOwner {
    _mint(recipient, amount);
  }

}

contract CallOptionSeller is Owned {

  address buyer;
  uint tokenAmount;
  uint strikePrice;
  uint purchasePrice;
  uint expiry;
  bool wasPurchased;
  HelloToken token;


  constructor(
    uint _tokenAmount, 
    uint _strikePrice, 
    uint _purchasePrice, 
    uint secToExpiry, 
    address _tokenAddress) Owned() {
      tokenAmount = _tokenAmount;
      strikePrice = _strikePrice;
      purchasePrice = _purchasePrice;
      expiry = secToExpiry + block.timestamp;
      token = HelloToken(_tokenAddress);
      wasPurchased = false;
  }

  function purchase() public payable {
    require(!wasPurchased, "Option already purchased");
    require(msg.value >= purchasePrice, "Not enough money to purchase");
    require(token.balanceOf(address(this)) == tokenAmount, "Cannot buy, Funding error");

    buyer = msg.sender;
    wasPurchased = true;
  }

  function execute() public payable {
    require(wasPurchased, "Please buy it first");
    require(msg.sender == buyer, "You are not the buyer!");
    require(expiry > block.timestamp, "Already Expired");
    require(msg.value >= strikePrice, "Not enough money to execute buy");
    require(token.balanceOf(address(this)) == tokenAmount, "Funding error");

    token.transfer(buyer, tokenAmount);
    selfdestruct(owner);
  }

  function timeLeft() public view returns (uint){
    return expiry - block.timestamp;
  }

  // function expiryTS() public view returns (uint){
  //   return expiry;
  // }

  // function blockTS() public view returns (uint){
  //   return block.timestamp;
  // }


  function refund() public onlyOwner {
    if(wasPurchased) {
      require(expiry < block.timestamp, "Not Expired");
    }
    token.transfer(owner, tokenAmount);
    selfdestruct(owner);
  }

  receive() external payable {}

}