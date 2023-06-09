import { task } from "hardhat/config";
import { recordAllDeployments, IBridgeConfig, IDeployment } from "../utils";
import fs from "fs";
import { TaskArguments } from "hardhat/types";
import { BRIDGE_CONFIG } from "../constants";
import deployment from "../../deployment/deployments.json";
const deployments: IDeployment = deployment;

task("deploy:Bridge").setAction(async function (_taskArguments: TaskArguments, hre) {
  const deployContract = "BridgeUpgradeable";
  const network = await hre.getChainId();
  const conf: IBridgeConfig = BRIDGE_CONFIG;

  console.log("Contract Deployment Started ");
  const C1 = await hre.ethers.getContractFactory("BridgeUpgradeable");
  const c1Proxy = await hre.upgrades.deployProxy(
    C1,
    [conf[network].chainID, conf[network].quorum, conf[network].expiry, deployments[network].VoterUpgradeable.proxy],
    {
      kind: "uups",
    },
  );

  console.log(c1Proxy);
  console.log(deployContract + " Proxy Contract deployed to: ", c1Proxy.address);
  await c1Proxy.deployed();
  const implementationAddr = await hre.upgrades.erc1967.getImplementationAddress(c1Proxy.address);
  console.log(deployContract + " Implementation Contract deployed to: ", implementationAddr);
  console.log("Contract Deployment Ended ");

  console.log("Deployment Storage Started ");
  const writeData = await recordAllDeployments(network, deployContract, c1Proxy.address, implementationAddr);
  fs.writeFileSync("./deployment/deployments.json", JSON.stringify(writeData));
  console.log("Deployment Storage Ended ");
});
