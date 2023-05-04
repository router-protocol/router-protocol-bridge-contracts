async function testTokenDeploy() {
  console.log("------------------------------ Initial Setup Started ------------------------------");
  let deployContract = "TestToken";

  const hre = require("hardhat");
  let fs = require("fs");
  let deployedContractsv1 = require("../deployment/reserveToken.json");
  const network = await hre.getChainId();
  deployedContractsv1[network] = {};

  console.log("------------------------------ Initial Setup Ended ------------------------------");

  console.log("------------------------------ Contract Deployment Started ------------------------------");

  const C1 = await hre.ethers.getContractFactory("RouterERC20Upgradable");
  const c1Proxy = await hre.upgrades.deployProxy(C1, ["USDT", "USDT", 18]); // Add Constructor args here
  await new Promise(resolve => setTimeout(resolve, 10000));
  const c2Proxy = await hre.upgrades.deployProxy(C1, ["USDC", "USDC", 18]); // Add Constructor args here
  console.log("Token 1 " + deployContract + " deployed to: ", c1Proxy.address);
  console.log("Token 2 " + deployContract + " deployed to: ", c2Proxy.address);

  console.log("------------------------------ Contract Deployment Ended ------------------------------");
  console.log("------------------------------ Deployment Storage Started ------------------------------");

  deployedContractsv1[network] = {
    TestToken: {
      token1: c1Proxy.address,
      token2: c2Proxy.address,
    },
  };

  fs.writeFileSync("./deployment/reserveToken.json", JSON.stringify(deployedContractsv1));

  console.log("------------------------------ Deployment Storage Ended ------------------------------");
}

testTokenDeploy()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
