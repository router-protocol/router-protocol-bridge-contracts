/* eslint-disable @typescript-eslint/no-unused-vars */
import { task } from "hardhat/config";
import { IDeployment } from "../utils";
import { TaskArguments } from "hardhat/types";
import deployment from "../../deployment/deployments.json";
import ethHandler from "../../deployment/config/ethHandlers.json";
const deployments: IDeployment = deployment;
const ethHandlers: any = ethHandler;

task("Configure:HandlerReserve").setAction(async function (_taskArguments: TaskArguments, hre) {
  const network = await hre.getChainId();
  const C1 = await hre.ethers.getContractFactory("HandlerReserveUpgradeable");
  const C1Addr = C1.attach(deployments[network].HandlerReserveUpgradeable.proxy);
  console.log("Contract Configuration Started ");
  const ethHandlerAddr = ethHandlers[network].proxy;
  const tx = await C1Addr.setEthHandler(ethHandlerAddr);
  console.log(tx);
  console.log("setEthHandler");
  await tx.wait(2);

  console.log("Contract Configuration Ended ");
});
