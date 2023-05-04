// SPDX-License-Identifier: MIT
pragma solidity 0.8.2;

interface ICircleBridge {
    function depositForBurnWithCaller(
        uint256 _amount,
        uint32 _destinationDomain,
        bytes32 _mintRecipient,
        address _burnToken,
        bytes32 _destinationCaller
    ) external returns (uint64);
}
