// SPDX-License-Identifier: MIT
pragma solidity 0.8.2;

import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "contracts/RouterERC20UpgradableOld.sol";

interface IBridgeLocal {
    function adminSetResource(address handlerAddress, bytes32 resourceID, address tokenAddress) public;
    function adminSetBurnable(address handlerAddress, address tokenAddress, bool status) public;
}

contract ConfigureAsset is Initializable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable,
    PausableUpgradeable,
    AccessControlUpgradeable {
    using SafeMathUpgradeable for uint256;
    using SafeERC20Upgradeable for IERC20Upgradeable;

    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    IBridgeLocal public _bridge;

    modifier onlyAdminOrManager() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || hasRole(MANAGER_ROLE, msg.sender),
            "sender is not admin or manager"
        );
        _;
    }
    function initialize(address bridgeAddress) external initializer {
        __AccessControl_init();
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        __Pausable_init();
        __ReentrancyGuard_init();

        _bridge = IBridgeLocal(bridgeAddress);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}

    function deployAsset(string memory name_, string memory symbol_, uint8 decimals_) 
        external returns (RouterERC20UpgradableToken) {
        RouterERC20UpgradableToken deployedTokenAddress = new RouterERC20UpgradableToken();
        deployedTokenAddress.initialize(name_,
            symbol_,
            decimals_);

        return deployedTokenAddress;
    }

    function configureReserveAsset(address tokenAddress, string rId, address erc20HandlerAddress, bool isBurnable) external onlyAdminOrManager returns (bool) {
        //configure reserve asset
        /*
 const network = await hre.getChainId();
    const C1 = await hre.ethers.getContractFactory("BridgeUpgradeable");
    const C1Addr = C1.attach(deployments[network]["BridgeUpgradeable"].proxy);
    console.log(taskArguments)
    const tx = await C1Addr.adminSetResource(
      deployments[network][contracts["ERC20HANDLER"]].proxy,
      taskArguments.rid,
      taskArguments.token,
    );
    await tx.wait(2);
    console.log("Added Resource to bridge");
        */
        _bridge.adminSetResource(erc20HandlerAddress, rId, tokenAddress);
        if(isBurnable) _bridge.adminSetBurnable(handlerAddress, tokenAddress, status);
        return true;
    }
}

/*
1. Deploy RAsset + Link RAsset to Asset + configure as Asset as Reserve
2. Remove Asset as reserve
3. Set Reserve asset
*/