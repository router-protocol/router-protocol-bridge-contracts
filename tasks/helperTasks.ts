import { task } from "hardhat/config";
import { createResourceID, IDeployment } from "./utils";
import { TaskArguments } from "hardhat/types";
import { contracts, TASK_CREATE_RESOURCE_ID, TASK_RESERVE_BALANCE } from "./constants";
import deployment from "../deployment/deployments.json";
const deployments: IDeployment = deployment;

task(TASK_RESERVE_BALANCE, "Check balance of the reserve for the given token")
  .addParam("tokenaddress", "Address of the token to check balance for")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const network = await hre.getChainId();
    const C1 = await hre.ethers.getContractFactory("RouterERC20Upgradable");
    const C1Addr = C1.attach(taskArguments.tokenaddress);
    const balance = await C1Addr.balanceOf(deployments[network][contracts["HANDLERRESERVE"]]);
    console.log("Reserve Balance - " + balance);
  });

task(TASK_CREATE_RESOURCE_ID, "Create Resource ID for the given token address")
  .addParam("tokenaddress", "Address of the token")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    console.log("Resource ID - " + createResourceID(taskArguments.tokenaddress, 0, hre));
  });
