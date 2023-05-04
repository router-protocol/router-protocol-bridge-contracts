async function bridgeDeploy() {
  console.log("------------------------------ Initial Setup Started ------------------------------");
  const deployContract = "BridgeUpgradeable";

  const hre = require("hardhat");
  let fs = require("fs");
  let deployedContractsv1 = require("../deployment/BridgeUpgradeable.json");
  let voter = require("../deployment/VoterUpgradeable.json");
  let MConf = require("../config/config.json");
  const network = await hre.getChainId();
  deployedContractsv1[network] = {};
  let conf = MConf[network].BridgeUpgradeable;
  let VoteAddr = voter[network].VoterUpgradeable;

  console.log("------------------------------ Initial Setup Ended ------------------------------");

  console.log("------------------------------ Contract Deployment Started ------------------------------");

  const C1 = await hre.ethers.getContractFactory("BridgeUpgradeable");
  const c1Proxy = await hre.upgrades.deployProxy(C1, [conf.chainID, conf.quorum, conf.expiry, VoteAddr.proxy], {
    kind: "uups",
  }); // Add Constructor args here
  console.log("Contract " + deployContract + " deployed to: ", c1Proxy.address);

  console.log("------------------------------ Contract Deployment Ended ------------------------------");
  console.log("------------------------------ Deployment Storage Started ------------------------------");

  deployedContractsv1[network] = {
    BridgeUpgradeable: {
      proxy: c1Proxy.address,
      implementation: "",
    },
  };

  fs.writeFileSync("./deployment/BridgeUpgradeable.json", JSON.stringify(deployedContractsv1));

  console.log("------------------------------ Deployment Storage Ended ------------------------------");
}

bridgeDeploy()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
