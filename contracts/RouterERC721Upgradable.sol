// SPDX-License-Identifier: MIT
pragma solidity 0.8.2;

import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract RouterERC721Upgradable is
    Initializable,
    ContextUpgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    ERC721Upgradeable
{
    using AddressUpgradeable for address;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // Upgradable Functions

    /// @dev Sets the values for {name} and {symbol}.
    ///
    /// The default value of {decimals} is 18. To select a different value for
    /// {decimals} you should overload it.
    ///
    /// All two of these values are immutable: they can only be set once during
    /// construction.
    function __RouterERC721Upgradable_init(string memory name_, string memory symbol_) internal initializer {
        __Context_init_unchained();
        __AccessControl_init();
        __Pausable_init();
        __ERC721_init_unchained(name_, symbol_);
        __RouterERC20Upgradable_init_unchained();

        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());

        _setupRole(MINTER_ROLE, _msgSender());
        _setupRole(BURNER_ROLE, _msgSender());
        _setupRole(PAUSER_ROLE, _msgSender());
    }

    function __RouterERC20Upgradable_init_unchained() internal initializer {}

    function _authorizeUpgrade(address newImplementation) internal virtual onlyRole(DEFAULT_ADMIN_ROLE) {}

    // Upgradable Functions

    //Core Contract Functions

    /// @notice Used to pause the token
    /// @notice Only callable by an address that has Pauser Role
    /// @return Returns true when paused
    function pauseToken() public virtual onlyRole(PAUSER_ROLE) returns (bool) {
        _pause();
        return true;
    }

    /// @notice Used to unpause the token
    /// @notice Only callable by an address that has Pauser Role
    /// @return Returns true when unpaused
    function unpauseToken() public virtual onlyRole(PAUSER_ROLE) returns (bool) {
        _unpause();
        return true;
    }

    /// @notice Mints token with id `tokenId` to address `to`
    /// @notice Only callable by an address that has Minter Role.
    /// @param to Recipient address
    /// @param tokenId Id of the token
    /// @param _data Data to be passed with transaction
    /// @return Returns true if minted succesfully
    function mint(
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public virtual onlyRole(MINTER_ROLE) returns (bool) {
        _safeMint(to, tokenId, _data);
        return true;
    }

    /// @notice Destroys token with id `tokenId` from caller's account
    /// @notice Only callable by an address that has Burner Role.
    /// @param tokenId Id of the token
    /// @return Returns true if burnt succesfully
    function burn(uint256 tokenId) public virtual onlyRole(BURNER_ROLE) returns (bool) {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721Burnable: caller is not owner nor approved");
        _burn(tokenId);
        return true;
    }

    /// @dev See {ERC721-_beforeTokenTransfer}.
    ///
    /// Requirements:
    ///
    /// - the contract must not be paused.
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId);

        require(!paused(), "ERC721Pausable: token transfer while paused");
    }

    uint256[50] private __gap;

    /// return the sender of this call.
    /// if the call came through our trusted forwarder, return the original sender.
    /// otherwise, return `msg.sender`.
    /// should be used in the contract anywhere instead of msg.sender

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControlUpgradeable, ERC721Upgradeable)
        returns (bool)
    {
        return
            interfaceId == type(IERC721Upgradeable).interfaceId ||
            interfaceId == type(IERC721MetadataUpgradeable).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    //Core Contract Functions
}
