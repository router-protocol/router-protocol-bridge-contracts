// SPDX-License-Identifier: MIT
pragma solidity 0.8.2;

/// @title Interface for Bridge contract.
/// @author Router Protocol.
interface IBridge {
    /// @notice Exposing getter for {_chainID} instead of forcing the use of call.
    /// @return uint8 The {_chainID} that is currently set for the Bridge contract.
    function _chainID() external returns (uint8);
}
