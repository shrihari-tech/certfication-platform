// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lock {
    uint num1 = 0;
    uint num2 = 42;
    uint256 [] public number1=[0,1,2];
    uint256 [] public number2=[3,4,5];
    function numbers1() public view returns (uint256[] memory){
        return number1;
    }

    function numbers2() public view returns(uint256[] memory){
        return number2;
    }
}
