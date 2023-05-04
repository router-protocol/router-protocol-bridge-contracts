async function handlerReserveDeploy() {
  console.log("------------------------------ Initial Setup Started ------------------------------");
  const deployContract = "HandlerReserveUpgradeable";

  const hre = require("hardhat");
  let fs = require("fs");
  let deployedContractsv1 = require("../deployment/HandlerReserveUpgradeable.json");
  const network = await hre.getChainId();
  const handler = require("../deployment/ERC20HandlerUpgradeable.json");
  const handlerAddr = handler[network].ERC20HandlerUpgradeable;
  deployedContractsv1[network] = {};

  console.log("------------------------------ Initial Setup Ended ------------------------------");

  console.log("------------------------------ Contract Deployment Started ------------------------------");

  const C1 = await hre.ethers.getContractFactory("HandlerReserveUpgradeable");
  const c1Proxy = await hre.upgrades.deployProxy(C1, [handlerAddr.proxy]); // Add Constructor args here
  console.log("Contract " + deployContract + " deployed to: ", c1Proxy.address);

  console.log("------------------------------ Contract Deployment Ended ------------------------------");
  console.log("------------------------------ Deployment Storage Started ------------------------------");

  deployedContractsv1[network] = {
    HandlerReserveUpgradeable: {
      proxy: c1Proxy.address,
      implementation: "",
    },
  };

  fs.writeFileSync("./deployment/HandlerReserveUpgradeable.json", JSON.stringify(deployedContractsv1));

  console.log("------------------------------ Deployment Storage Ended ------------------------------");
}

handlerReserveDeploy()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
