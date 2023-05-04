async function extraTokenDeploy() {
  console.log("------------------------------ Initial Setup Started ------------------------------");
  let deployContract = "ExtraToken";

  const hre = require("hardhat");
  let fs = require("fs");
  let deployedContractsv1 = require("../deployment/extraToken.json");
  const network = await hre.getChainId();
  deployedContractsv1[network] = {};

  console.log("------------------------------ Initial Setup Ended ------------------------------");

  console.log("------------------------------ Contract Deployment Started ------------------------------");

  const C1 = await hre.ethers.getContractFactory("RouterERC20Upgradable");
  const c1Proxy = await hre.upgrades.deployProxy(C1, ["DFYN", "DFYN", 18]); // Add Constructor args here
  const c2Proxy = await hre.upgrades.deployProxy(C1, ["ROUTE", "ROUTE", 18]); // Add Constructor args here
  // await new Promise(resolve => setTimeout(resolve, 10000));
  // const c2Proxy = await hre.upgrades.deployProxy(C1, ["Route", "ROUTE", 18]); // Add Constructor args here
  console.log("Token DFYN " + deployContract + " deployed to: ", c1Proxy.address);
  console.log("Token ROUTE " + deployContract + " deployed to: ", c2Proxy.address);
  // console.log("Token 2 " + deployContract + " deployed to: ", c2Proxy.address);

  console.log("------------------------------ Contract Deployment Ended ------------------------------");
  console.log("------------------------------ Deployment Storage Started ------------------------------");

  deployedContractsv1[network] = {
    TestToken: {
      token1: c1Proxy.address,
      token2: c2Proxy.address,
    },
  };

  fs.writeFileSync("./deployment/extraToken.json", JSON.stringify(deployedContractsv1));

  console.log("------------------------------ Deployment Storage Ended ------------------------------");
}

extraTokenDeploy()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
