async function handlerUpdateDeploy() {
  console.log("------------------------------ Initial Setup Started ------------------------------");
  const deployContract = "ERC20HandlerUpgradeable";

  const hre = require("hardhat");
  let fs = require("fs");
  let deployedContractsv1 = require("../deployment/ERC20HandlerUpgradeable.json");
  let bridge = require("../deployment/BridgeUpgradeable.json");
  let MConf = require("../config/config.json");
  const network = await hre.getChainId();
  // deployedContractsv1[network] = {};
  const ETH = network =="42" ? "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" : "0x0000000000000000000000000000000000001010";
  const WETH = network =="42" ? "0xd0A1E359811322d97991E03f863a0C30C2cF029C" : "0x6373c962DCFfc21465973150993E19F56d8640a4";

  console.log("------------------------------ Initial Setup Ended ------------------------------");

  console.log("------------------------------ Contract Deployment Started ------------------------------");

  const C1 = await hre.ethers.getContractFactory("ERC20HandlerUpgradeable");
  const c1Proxy = await hre.upgrades.upgradeProxy(deployedContractsv1[network].ERC20HandlerUpgradeable.proxy,C1); // Add Constructor args here
  console.log("Contract " + deployContract + " deployed to: ", c1Proxy.address);

  console.log("------------------------------ Contract Deployment Ended ------------------------------");
  console.log("------------------------------ Deployment Storage Started ------------------------------");

  deployedContractsv1[network] = {
    ERC20HandlerUpgradeable: {
      proxy: c1Proxy.address,
      implementation: "",
    },
  };

  fs.writeFileSync("./deployment/ERC20HandlerUpgradeable.json", JSON.stringify(deployedContractsv1));

  console.log("------------------------------ Deployment Storage Ended ------------------------------");
}

handlerUpdateDeploy()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
