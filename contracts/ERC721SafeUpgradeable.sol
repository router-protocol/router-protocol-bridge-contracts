// SPDX-License-Identifier: MIT
pragma solidity 0.8.2;

import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";

import "./RouterERC721Upgradable.sol";

/// @title Manages deposited ERC721s.
/// @author Router Protocol.
/// @notice This contract is intended to be used with ERC721Handler contract.
contract ERC721SafeUpgradeable is Initializable, ContextUpgradeable {
    using AddressUpgradeable for address;

    function __ERC721SafeUpgradeable_init() internal initializer {
        __Context_init_unchained();
    }

    function __ERC721SafeUpgradeable_init_unchained() internal initializer {}

    /// @notice Used to transfer tokens into the safe to fund proposals.
    /// @param tokenAddress Address of ERC721 to transfer.
    /// @param owner Address of current token owner.
    /// @param tokenID ID of token to transfer.
    function fundERC721(
        address tokenAddress,
        address owner,
        uint256 tokenID
    ) public {
        IERC721Upgradeable erc721 = IERC721Upgradeable(tokenAddress);
        erc721.transferFrom(owner, address(this), tokenID);
    }

    /// @notice Used to gain custoday of deposited token.
    /// @param tokenAddress Address of ERC721 to transfer.
    /// @param owner Address of current token owner.
    /// @param recipient Address to transfer token to.
    /// @param tokenID ID of token to transfer.
    function lockERC721(
        address tokenAddress,
        address owner,
        address recipient,
        uint256 tokenID
    ) internal {
        IERC721Upgradeable erc721 = IERC721Upgradeable(tokenAddress);
        erc721.transferFrom(owner, recipient, tokenID);
    }

    /// @notice Transfers custody of token to recipient.
    /// @param tokenAddress Address of ERC721 to transfer.
    /// @param owner Address of current token owner.
    /// @param recipient Address to transfer token to.
    /// @param tokenID ID of token to transfer.
    function releaseERC721(
        address tokenAddress,
        address owner,
        address recipient,
        uint256 tokenID
    ) internal {
        IERC721Upgradeable erc721 = IERC721Upgradeable(tokenAddress);
        erc721.transferFrom(owner, recipient, tokenID);
    }

    /// @notice Used to create new ERC721s.
    /// @param tokenAddress Address of ERC721 to mint.
    /// @param recipient Address to mint token to.
    /// @param tokenID ID of token to mint.
    /// @param data Optional data to send along with mint call.
    function mintERC721(
        address tokenAddress,
        address recipient,
        uint256 tokenID,
        bytes memory data
    ) internal {
        RouterERC721Upgradable erc721 = RouterERC721Upgradable(tokenAddress);
        erc721.mint(recipient, tokenID, data);
    }

    /// @notice Used to burn ERC721s.
    /// @param tokenAddress Address of ERC721 to burn.
    /// @param tokenID ID of token to burn.
    function burnERC721(address tokenAddress, uint256 tokenID) internal {
        RouterERC721Upgradable erc721 = RouterERC721Upgradable(tokenAddress);
        erc721.burn(tokenID);
    }
}
