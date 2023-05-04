import { task } from "hardhat/config";
import { IDeployment } from "../utils";
import { TaskArguments } from "hardhat/types";
import deployment from "../../deployment/deployments.json";
const deployments: IDeployment = deployment;

task("Configure:Voter").setAction(async function (_taskArguments: TaskArguments, hre) {
  const network = await hre.getChainId();
  const C1 = await hre.ethers.getContractFactory("VoterUpgradeable");
  const C1Addr = C1.attach(deployments[network].VoterUpgradeable.proxy);

  console.log("Contract Configuration Started ");
  const tx = await C1Addr.setBridge(deployments[network].BridgeUpgradeable.proxy);
  await tx.wait(2);
  console.log("Contract Configuration Ended ");
});
