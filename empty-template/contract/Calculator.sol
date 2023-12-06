// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Calculator {
    string public name = "Calculator";

    function add(uint x, uint y) external pure returns(uint) {
        return x+y;
    }
}