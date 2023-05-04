async function handlerConfigure() {
  console.log("------------------------------ Initial Setup Started ------------------------------");
  let deployContract = "ERC20HandlerUpgradeable";

  const hre = require("hardhat");
  let fs = require("fs");
  let deployedContracts = require("../deployment/ERC20HandlerUpgradeable.json");
  let bridge = require("../deployment/BridgeUpgradeable.json");
  let feeManager = require("../deployment/FeeManagerUpgradeable.json");
  let reserve = require("../deployment/HandlerReserveUpgradeable.json");

  const network = await hre.getChainId();
  const C1 = await hre.ethers.getContractFactory("ERC20HandlerUpgradeable");
  const C1Addr = C1.attach(deployedContracts[network].ERC20HandlerUpgradeable.proxy);

  console.log("------------------------------ Initial Setup Ended ------------------------------");

  console.log("------------------------------ Contract Configuration Started ------------------------------");
  const bridgeRole = await C1Addr.BRIDGE_ROLE();

  let tx = await C1Addr.grantRole(bridgeRole, bridge[network].BridgeUpgradeable.proxy);
  await tx.wait(2);
  tx = await C1Addr.setFeeManager(feeManager[network].FeeManagerUpgradeable.proxy);
  await tx.wait(2);
  tx = await C1Addr.setReserve(reserve[network].HandlerReserveUpgradeable.proxy);
  await tx.wait(2);

  const oneSplit = network == "42" ? "0x50D30bB7C64FB5d8dBca332541133c86EB0232A8" : "0x237F87Fd5cFA8E01396C5ea696c65FF36a731AE2";
  tx = await C1Addr.setOneSplitAddress(oneSplit);
  await tx.wait(2);

  console.log("------------------------------ Contract Configuration Ended ------------------------------");
}

handlerConfigure()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
