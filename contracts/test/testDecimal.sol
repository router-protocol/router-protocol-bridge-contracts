// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

contract decimalTestCases {

    function Test(uint8 srcDecimal , uint8 destDecimal , uint256 tokenAmount ) public pure returns (uint256) {
        if(srcDecimal == destDecimal)
            return tokenAmount;
        if(srcDecimal > destDecimal){
            uint256 factor = (10 ** (srcDecimal - destDecimal));
            return tokenAmount / factor;
        } else {
            uint256 factor = (10 ** (destDecimal - srcDecimal));
            return tokenAmount * factor;
        }
    }

    function Test1(uint8 srcDecimal , uint8 destDecimal , uint256 tokenAmount ) public pure returns (uint256) {
        if(srcDecimal == destDecimal)
            return tokenAmount;
        if(srcDecimal > destDecimal){
            uint256 factor = (10 ** (uint256(srcDecimal) - uint256(destDecimal)));
            return tokenAmount / factor;
        } else {
            uint256 factor = (10 ** (uint256(destDecimal) - uint256(srcDecimal)));
            return tokenAmount * factor;
        }
    }

}
