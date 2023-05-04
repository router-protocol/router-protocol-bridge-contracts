async function feeManagerDeploy() {
  console.log("------------------------------ Initial Setup Started ------------------------------");
  const deployContract = "FeeManagerUpgradeable";

  const hre = require("hardhat");
  let fs = require("fs");
  let deployedContractsv1 = require("../deployment/FeeManagerUpgradeable.json");
  const network = await hre.getChainId();
  const handler = require("../deployment/ERC20HandlerUpgradeable.json");
  const handlerAddr = handler[network].ERC20HandlerUpgradeable;
  deployedContractsv1[network] = {};

  console.log("------------------------------ Initial Setup Ended ------------------------------");

  console.log("------------------------------ Contract Deployment Started ------------------------------");

  const C1 = await hre.ethers.getContractFactory("FeeManagerUpgradeable");
  const c1Proxy = await hre.upgrades.deployProxy(C1, [handlerAddr.proxy]); // Add Constructor args here
  console.log("Contract " + deployContract + " deployed to: ", c1Proxy.address);

  console.log("------------------------------ Contract Deployment Ended ------------------------------");
  console.log("------------------------------ Deployment Storage Started ------------------------------");

  deployedContractsv1[network] = {
    FeeManagerUpgradeable: {
      proxy: c1Proxy.address,
      implementation: "",
    },
  };

  fs.writeFileSync("./deployment/FeeManagerUpgradeable.json", JSON.stringify(deployedContractsv1));

  console.log("------------------------------ Deployment Storage Ended ------------------------------");
}

feeManagerDeploy()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
