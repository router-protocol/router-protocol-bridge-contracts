async function voterConfigure() {
  console.log("------------------------------ Initial Setup Started ------------------------------");
  let deployContract = "VoterUpgradeable";

  const hre = require("hardhat");
  let fs = require("fs");
  let deployedContracts = require("../deployment/VoterUpgradeable.json");
  let bridge = require("../deployment/BridgeUpgradeable.json");

  const network = await hre.getChainId();
  const C1 = await hre.ethers.getContractFactory("VoterUpgradeable");
  const C1Addr = C1.attach(deployedContracts[network].VoterUpgradeable.proxy);

  console.log("------------------------------ Initial Setup Ended ------------------------------");

  console.log("------------------------------ Contract Configuration Started ------------------------------");

  await C1Addr.setBridge(bridge[network].BridgeUpgradeable.proxy);

  console.log("------------------------------ Contract Configuration Ended ------------------------------");
}

voterConfigure()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
