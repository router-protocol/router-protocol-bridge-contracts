import deployment from "../deployment/deployments.json";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { contracts, TASK_VERIFY_ALL, TASK_VERIFY_PROXY } from "./constants";
import { IDeployment, verify } from "./utils";
const deployments: IDeployment = deployment;

task(TASK_VERIFY_PROXY, "Verify the implementation by providing proxy contract")
  .addParam("proxy", "Address of the proxy contract")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    await verify(taskArguments.proxy, hre);
  });

task(TASK_VERIFY_ALL, "Verify the all the contracts").setAction(async function (_taskArguments: TaskArguments, hre) {
  const network = await hre.getChainId();
  for (const contract in contracts) {
    await verify(deployments[network][contracts[contract]].proxy, hre);
  }
});
