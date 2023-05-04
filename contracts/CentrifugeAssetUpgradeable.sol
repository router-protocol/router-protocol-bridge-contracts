// SPDX-License-Identifier: MIT
pragma solidity 0.8.2;

import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
    @title Represents a bridged Centrifuge asset.
    @author Router Protocol.
 */
contract CentrifugeAssetUpgradeable is Initializable, ContextUpgradeable {
    mapping(bytes32 => bool) public _assetsStored;

    event AssetStored(bytes32 indexed asset);

    ///@notice Marks {asset} as stored.
    ///@param asset Hash of asset deposited on Centrifuge chain.
    ///@notice {asset} must not have already been stored.
    ///@notice Emits {AssetStored} event.
    function store(bytes32 asset) external {
        require(!_assetsStored[asset], "asset is already stored");
        _assetsStored[asset] = true;
        emit AssetStored(asset);
    }

    function __CentrifugeAsset_init() internal initializer {
        __Context_init_unchained();
        __CentrifugeAsset_init_unchained();
    }

    function __CentrifugeAsset_init_unchained() internal initializer {}
}
