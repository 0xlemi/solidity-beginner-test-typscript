//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract AddressBook {

  mapping(address => address[]) private _addresses;

  mapping(address => mapping(address => string)) private _aliases;

  constructor() {
      console.log("Deploying a AddressBook ");
  }

  function getMyList() public view returns (address[] memory) {
    return _addresses[msg.sender];
  }

  function getAlias(address _addr) public view returns (string memory) {
    return _aliases[msg.sender][_addr];
  }

  function addAddress(address addr, string memory alia) public {
    _addresses[msg.sender].push(addr);
    _aliases[msg.sender][addr] = alia;
  }

  function removeAddress(address addr) public {
    for(uint i = 0; i < _addresses[msg.sender].length; i++){
      if(_addresses[msg.sender][i] == addr){

        uint lenghtMinus1 = _addresses[msg.sender].length - 1;
        if((_addresses[msg.sender].length > 1) && (i < _addresses[msg.sender].length - 1)) {
          _addresses[msg.sender][i] = _addresses[msg.sender][lenghtMinus1];
        }


          delete _addresses[msg.sender][lenghtMinus1];
          _addresses[msg.sender].pop();

          delete _aliases[msg.sender][addr];
          break;
      }
    }
  }
  

}