import { task } from "hardhat/config";
import fs from "fs";
import { TaskArguments } from "hardhat/types";

task("Deploy:EthHandler").setAction(async function (_taskArguments: TaskArguments, hre) {
  const deployContract = "ETHHandler";
  const storePath = "deployment/config/ethHandlers.json";
  const handlerStorage = JSON.parse(fs.readFileSync(storePath, "utf-8"));
  const network = await hre.getChainId();

  console.log("Contract Deployment Started ");
  const C1 = await hre.ethers.getContractFactory(deployContract);
  const c1Proxy = await hre.upgrades.deployProxy(C1, []);
  console.log(c1Proxy);
  console.log(deployContract + " Proxy Contract deployed to: ", c1Proxy.address);
  await c1Proxy.deployed();
  const implementationAddr = await hre.upgrades.erc1967.getImplementationAddress(c1Proxy.address);
  console.log(deployContract + "Implementation Contract deployed to: ", implementationAddr);
  console.log("Contract Deployment Ended ");

  console.log("Deployment Storage Started ");
  handlerStorage[network] = {
    proxy: c1Proxy.address,
    implementation: implementationAddr,
    creationTime: Date.now(),
    updatedTime: [Date.now()],
  };
  fs.writeFileSync(storePath, JSON.stringify(handlerStorage));
  console.log("Deployment Storage Ended ");
});
