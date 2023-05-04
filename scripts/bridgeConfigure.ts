async function bridgeConfigure() {
  console.log("------------------------------ Initial Setup Started ------------------------------");
  let deployContract = "BridgeUpgradeable";

  const hre = require("hardhat");
  let fs = require("fs");
  let deployedContracts = require("../deployment/BridgeUpgradeable.json");
  let voter = require("../deployment/BridgeUpgradeable.json");
  let MConf = require("../config/config.json");
  const network = await hre.getChainId();
  let conf = MConf[network].BridgeUpgradeable;

  const C1 = await hre.ethers.getContractFactory("BridgeUpgradeable");
  // const C1Addr = C1.attach(deployedContracts[network].BridgeUpgradeable.proxy);

  console.log("------------------------------ Initial Setup Ended ------------------------------");

  console.log("------------------------------ Contract Configuration Started ------------------------------");

  console.log("------------------------------ Contract Configuration Ended ------------------------------");
}

bridgeConfigure()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
