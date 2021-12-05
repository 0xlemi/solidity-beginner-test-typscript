//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

interface ERC20 {
  function totalSupply() external view returns (uint _totalSupply);
  function balanceOf(address _owner) external view returns (uint balance);
  function transfer(address _to, uint _value) external returns (bool success);
  function transferFrom(address _from, address _to, uint _value) external returns (bool success);
  function approve(address _spender, uint _value) external returns (bool success);
  function allowance(address _owner, address _spender) external view returns (uint remaining);
  event Transfer(address indexed _from, address indexed _to, uint _value);
  event Approval(address indexed _owner, address indexed _spender, uint _value);
}

contract Loeker is ERC20 {
  string public constant symbol = "LKR";
  string public constant name = "Loeker";
  uint8 public constant decimals = 18;

  uint private constant _totalSupply = 1000000000000000000000000;

  mapping(address => uint) private _balanceOf;

  mapping(address => mapping(address => uint)) private _allowances;

  constructor(){
    _balanceOf[msg.sender] = _totalSupply;
  }

  function totalSupply() public pure override returns (uint) {
    return _totalSupply;
  }

  function balanceOf(address _addr) public override view returns (uint) {
    return _balanceOf[_addr];
  }

  function transfer(address _to, uint _value) public override returns (bool) {
    if(_value > 0 && _balanceOf[msg.sender] >= _value){

      _balanceOf[msg.sender] -= _value;
      _balanceOf[_to] += _value;

      emit Transfer(msg.sender, _to, _value);
      return true;
    }
    return false;
  }

  // allowance[hasDebt][ownsDebt]
  function transferFrom(address _from, address _to, uint _value) public override returns (bool) {
    if( _allowances[_from][msg.sender] > 0 &&
        _value > 0 &&
        _allowances[_from][msg.sender] >= _value &&
        !isContract(_to)){
      
      // move balance
      _balanceOf[_from] -= _value;
      _balanceOf[_to] += _value;

      // redunce allowance
      _allowances[_from][msg.sender] -= _value;


      emit Transfer(_from, _to, _value);
      return true;
    }
    return false;
  }

  function isContract(address _addr) private view returns (bool) {
    uint codeSize;
    assembly{
      codeSize := extcodesize(_addr)
    }
    return codeSize > 0;
  }

  function approve(address _spender, uint _value) external override returns (bool) {
    _allowances[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value); 
    return true;
  }

  function allowance(address _hasDebt, address _spender) external override view returns (uint) {
    return _allowances[_hasDebt][_spender];
  }



}