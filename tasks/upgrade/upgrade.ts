import { task } from "hardhat/config";
import { IDeployment } from "../utils";
import fs from "fs";
import { TaskArguments } from "hardhat/types";
import { contracts } from "../constants";
import deployment from "../../deployment/deployments.json";
import usdcConfig from "../../deployment/config/usdcCrosschain.json";

const deployments: IDeployment = deployment;
const usdcConfigs: any = usdcConfig;

task("Upgrade")
  .addParam("contract", "Name of the Contract")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const contractName = contracts[taskArguments.contract];
    const network = await hre.getChainId();
    let proxyAddr;
    console.log("taskArguments.contract: ", taskArguments.contract)
    if ((taskArguments.contract == "USDCMINTER") || taskArguments.contract == "USDCBURNER") {
      proxyAddr = usdcConfigs[network][contractName].proxy;
    } else {
      proxyAddr = deployments[network][contractName].proxy;
    }

    console.log("Contract Upgrade Started ");
    const C1 = await hre.ethers.getContractFactory(contractName);
    const tx = await hre.upgrades.upgradeProxy(proxyAddr, C1);
    console.log(tx);
    console.log(contractName + " Proxy Contract upgraded to " + proxyAddr);
    const implementationAddr = await hre.upgrades.erc1967.getImplementationAddress(proxyAddr);
    console.log(contractName + " Implementation Contract deployed to: ", implementationAddr);
    console.log("Contract Upgrade Ended");

    console.log(" Storage Update Started");
    if ((taskArguments.contract == "USDCMINTER") || taskArguments.contract == "USDCBURNER") {
      usdcConfigs[network][contractName].implementation.push(implementationAddr);
      usdcConfigs[network][contractName].updatedTime.push(Date.now());
      fs.writeFileSync("./deployment/config/usdcCrossChain.json", JSON.stringify(usdcConfigs));
    } else {
      deployments[network][contractName].implementation.push(implementationAddr);
      deployments[network][contractName].updatedTime.push(Date.now());
      fs.writeFileSync("./deployment/deployments.json", JSON.stringify(deployments));
    }
    console.log(" Storage Update Ended ");
    console.log(proxyAddr, "-", implementationAddr);
  });
