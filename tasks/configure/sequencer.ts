/* eslint-disable @typescript-eslint/no-unused-vars */
import { task } from "hardhat/config";
import { grantRole, IDeployment } from "../utils";
import { TaskArguments } from "hardhat/types";
import deployment from "../../deployment/deployments.json";
import fs from "fs";
import {
  contracts,
  TASK_SET_MULTIPLE_GASLIMIT_ON_SEQUENCER,
  TASK_SET_MULTIPLE_GASPRICE_ON_SEQUENCER,
} from "../constants";
const deployments: IDeployment = deployment;

task("Configure:sequencer").setAction(async function (_taskArguments: TaskArguments, hre) {
  const network = await hre.getChainId();

  const C1 = await hre.ethers.getContractFactory("SequencerHandlerUpgradeable");
  const C1Addr = C1.attach(deployments[network].SequencerHandlerUpgradeable.proxy);

  console.log("Contract Configuration Started ");

  const tx = await C1Addr.setFeeManager(deployments[network].FeeManagerGenericUpgradeable.proxy);
  console.log(tx);
  await tx.wait(2);
  console.log("setFeeManager");

  console.log("Setting multiple gasLimits");
  await hre.run(TASK_SET_MULTIPLE_GASLIMIT_ON_SEQUENCER);
  console.log("Setting multiple gasLimits complete");

  console.log("Setting multiple gasPrice");
  await hre.run(TASK_SET_MULTIPLE_GASPRICE_ON_SEQUENCER);
  console.log("Setting multiple gasPrice complete");

  console.log("Contract Configuration Ended ");
});

task(TASK_SET_MULTIPLE_GASLIMIT_ON_SEQUENCER, "Set a generic default gasLimit")
  .addOptionalParam("filePath", "Path of json file")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const network = await hre.getChainId();
    const C1 = await hre.ethers.getContractFactory(contracts["SEQUENCER"]);
    const C1Addr = C1.attach(deployments[network][contracts["SEQUENCER"]].proxy);
    const filePath = taskArguments.filePath || "deployment/config/defaultGasLimit.json";
    const feeData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    // console.log(feeData[network]);
    let defaultGas = [];
    let chainIds = [];

    for (const data of feeData[network]) {
      if (data.alreadySet || !data.gasLimit) {
        continue;
      }
      chainIds.push(data.destinationID);
      defaultGas.push(data.gasLimit);
    }

    console.log("chainids => ", chainIds);
    console.log("Dest gas => ", defaultGas);

    if (chainIds.length === defaultGas.length) {
      const tx = await C1Addr.setDefaultGas(chainIds, defaultGas);
      console.log(tx);
      await tx.wait(3);
    } else {
      throw new Error("tasks/configure/sequencer.ts - Gas limit array length mismatch");
    }
  });

task(TASK_SET_MULTIPLE_GASPRICE_ON_SEQUENCER, "Set a generic default gasPrice")
  .addOptionalParam("filePath", "Path of json file")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const network = await hre.getChainId();
    const C1 = await hre.ethers.getContractFactory(contracts["SEQUENCER"]);
    const C1Addr = C1.attach(deployments[network][contracts["SEQUENCER"]].proxy);
    const filePath = taskArguments.filePath || "deployment/config/defaultGasPrice.json";
    const feeData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    // console.log(feeData[network]);
    let defaultGasPrice = [];
    let chainIds = [];

    for (const data of feeData[network]) {
      if (data.alreadySet || !data.gasPrice) {
        continue;
      }
      chainIds.push(data.destinationID);
      defaultGasPrice.push(data.gasPrice);
    }

    console.log("chainids => ", chainIds);
    console.log("Dest gas price => ", defaultGasPrice);

    if (chainIds.length === defaultGasPrice.length) {
      const tx = await C1Addr.setDefaultGasPrice(chainIds, defaultGasPrice);
      console.log(tx);
      await tx.wait(3);
    } else {
      throw new Error("tasks/configure/generic.ts - Gas price array length mismatch");
    }
  });
