//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IERC20 {

    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}


contract TokenSwap {

  IERC20 public token1;
  IERC20 public token2;
  address public debter1;
  address public debter2;

  constructor (address _token1, address _debter1, address _token2, address _debter2) {
    token1 = IERC20(_token1);
    debter1 = _debter1;
    token2 = IERC20(_token2);
    debter2 = _debter2;
  }

  function swap( uint _amount1, uint _amount2) public {
    // one of the debter needs to initialize the swap
    require(msg.sender  == debter1 || msg.sender == debter2, "not authorized to swap");
    // debter1 ->sends-> amount1 of token1 to ==> debter2
    require(token1.allowance(debter1, address(this)) >= _amount1, "Token 1 allowance too low");
    // debter2 ->sends-> amount2 of token2 to ==> debter2
    require(token2.allowance(debter2, address(this)) >= _amount2, "Token 2 allowance too low");

    _safeTransferFrom(token1, debter1, debter2, _amount1);
    _safeTransferFrom(token2, debter2, debter1, _amount2);
  }

  function _safeTransferFrom(IERC20 token, address sender, address receiver, uint amount) private {
    bool sent = token.transferFrom(sender, receiver, amount);
    require(sent, "transfer canceled");
  }

}