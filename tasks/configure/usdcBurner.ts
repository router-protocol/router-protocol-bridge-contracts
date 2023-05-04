/* eslint-disable @typescript-eslint/no-unused-vars */
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import fs from "fs";
import usdcConfig from "../../deployment/config/usdcCrosschain.json";
import deployment from "../../deployment/deployments.json";
import {
  BRIDGE_CONFIG,
  contracts,
  TASK_SET_DEST_DETAILS_ON_USDC_BURNER,
  TASK_SET_RESERVE_ON_USDC_DEPOSIT_AND_BURN,
} from "../constants";
import { IDeployment } from "../utils";
const usdcConfigs: any = usdcConfig;
const deployments: IDeployment = deployment;
const bridgeConfig: any = BRIDGE_CONFIG;

task("Configure:UsdcBurner").setAction(async function (taskArguments: TaskArguments, hre) {
  const network = await hre.getChainId();

  const C1 = await hre.ethers.getContractFactory(contracts["USDCBURNER"]);
  const C1Addr = C1.attach(usdcConfigs[network][contracts["USDCBURNER"]].proxy);

  console.log("USDC Burner Contract Configuration Started ");

  console.log("Granting resource setter role");
  const resourceSetterRole = await C1Addr.RESOURCE_SETTER();
  for (let i = 0; i < bridgeConfig[network]["resourceSetters"].length; i++) {
    const tx1 = await C1Addr.grantRole(resourceSetterRole, bridgeConfig[network]["resourceSetters"][i]);
    await tx1.wait(3);
  }
  console.log("Granting resource setter role complete");

  // console.log("Setting token messenger");
  // const tx2 = await C1Addr.setTokenMessenger(usdcConfigs[network]["TokenMessenger"]);
  // await tx2.wait(3);
  // console.log("Setting token messenger complete");

  // await hre.run(TASK_SET_RESERVE_ON_USDC_DEPOSIT_AND_BURN);
});

task(TASK_SET_RESERVE_ON_USDC_DEPOSIT_AND_BURN, "set reserve on usdc burner").setAction(async function (
  taskArguments: TaskArguments,
  hre,
) {
  const network = await hre.getChainId();

  if (!usdcConfigs[network]) {
    console.log("Usdc burner not deployed on this chain");
    return;
  }

  const C1 = await hre.ethers.getContractFactory(contracts["USDCBURNER"]);
  const C1Addr = C1.attach(usdcConfigs[network][contracts["USDCBURNER"]].proxy);
  const tx = await C1Addr.setReserve(deployments[network][contracts["HANDLERRESERVE"]].proxy);

  console.log(tx);
  await tx.wait(4);
});

task(TASK_SET_DEST_DETAILS_ON_USDC_BURNER, "Set dest details on usdc burner")
  .addOptionalParam("filePath", "Path of json file contains destid and decimal")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const network = await hre.getChainId();

    if (!usdcConfigs[network]) {
      console.log("Usdc burner not deployed on this chain");
      return;
    }

    const C1 = await hre.ethers.getContractFactory(contracts["USDCBURNER"]);
    const C1Addr = C1.attach(usdcConfigs[network][contracts["USDCBURNER"]].proxy);
    console.log(taskArguments);
    const filePath = taskArguments.filePath || "deployment/config/usdcDestDetails.json";
    const destDetails = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const details: any[] = [];

    for (let i = 0; i < destDetails[network].length; i++) {
      details.push({
        chainId: destDetails[network][i].chainId,
        usdcDomainId: destDetails[network][i].usdcDomainId,
        reserveHandlerAddress: deployments[destDetails[network][i].actualChainId][contracts["HANDLERRESERVE"]].proxy,
        destCallerAddress: usdcConfigs[destDetails[network][i].actualChainId][contracts["USDCMINTER"]].proxy,
      });
    }

    console.log(details);

    const tx = await C1Addr.setDestDetails(details);
    console.log(tx);
    await tx.wait(4);
  });