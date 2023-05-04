/* eslint-disable @typescript-eslint/no-unused-vars */
import { task } from "hardhat/config";
import { grantRole, IDeployment, IBridgeConfig } from "../utils";
import { TaskArguments } from "hardhat/types";
import fs from "fs";
import deployment from "../../deployment/deployments.json";
import {
  contracts,
  TASK_SET_MULTIPLE_GASLIMIT,
  TASK_SET_MULTIPLE_GASPRICE,
  TASK_SET_MULTIPLE_GENERIC_FEES,
  TASK_SET_CHAINID_ON_GENHANDLER,
  BRIDGE_CONFIG,
} from "../constants";
const deployments: IDeployment = deployment;

task("Configure:genericHandler").setAction(async function (_taskArguments: TaskArguments, hre) {
  const network = await hre.getChainId();

  const C1 = await hre.ethers.getContractFactory("GenericHandlerUpgradeable");
  const C1Addr = C1.attach(deployments[network].GenericHandlerUpgradeable.proxy);

  console.log("Contract Configuration Started ");

  console.log("setFeeManagerGeneric started");
  const tx = await C1Addr.setFeeManager(deployments[network].FeeManagerGenericUpgradeable.proxy);
  console.log(tx);
  await tx.wait(2);
  console.log("setFeeManagerGeneric complete");

  console.log("Setting multiple gasLimits");
  await hre.run(TASK_SET_MULTIPLE_GASLIMIT);
  console.log("Setting multiple gasLimits complete");

  console.log("Setting multiple gasPrice");
  await hre.run(TASK_SET_MULTIPLE_GASPRICE);
  console.log("Setting multiple gasPrice complete");

  console.log("Setting multiple genericFees");
  await hre.run(TASK_SET_MULTIPLE_GENERIC_FEES);
  console.log("Setting multiple genericFees complete");

  console.log("setting chainid on generic handler");
  await hre.run(TASK_SET_CHAINID_ON_GENHANDLER);
  console.log("setting chainid on generic handler complete");

  console.log("Contract Configuration Ended ");
});

task(TASK_SET_CHAINID_ON_GENHANDLER, "Set chainid on gen handler").setAction(async function (
  taskArguments: TaskArguments,
  hre,
) {
  const network = await hre.getChainId();
  const conf: IBridgeConfig = BRIDGE_CONFIG;
  const chainid = conf[network].chainID;

  const C1 = await hre.ethers.getContractFactory("GenericHandlerUpgradeable");
  const C1Addr = C1.attach(deployments[network]["GenericHandlerUpgradeable"].proxy);
  const tx = await C1Addr.setChainId(chainid);
  await tx.wait(2);
  console.log("Added chainid to genHandler");
});

task(TASK_SET_MULTIPLE_GENERIC_FEES, "Set Fee for generic from json file")
  .addOptionalParam("filePath", "Path of json file")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const network = await hre.getChainId();
    const C1 = await hre.ethers.getContractFactory(contracts["GENERICHANDLER"]);
    const C1Addr = C1.attach(deployments[network][contracts["GENERICHANDLER"]].proxy);
    const filePath = taskArguments.filePath || "deployment/config/genericFees.json";
    const feeData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    // console.log(feeData[network]);
    let counter = 0;
    for (const data of feeData[network]) {
      if (data.alreadySet || !data.feeToken) {
        counter++;
        continue;
      }
      console.log(data);
      const tx = await C1Addr.setFees(data.destinationID, data.feeToken, data.feeFactor, data.baseFee, true);
      console.log(tx);
      await tx.wait(3);
      feeData[network][counter].alreadySet = true;
      fs.writeFileSync(filePath, JSON.stringify(feeData));
      counter++;
    }
  });

task(TASK_SET_MULTIPLE_GASLIMIT, "Set a generic default gasLimit")
  .addOptionalParam("filePath", "Path of json file")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const network = await hre.getChainId();
    const C1 = await hre.ethers.getContractFactory(contracts["GENERICHANDLER"]);
    const C1Addr = C1.attach(deployments[network][contracts["GENERICHANDLER"]].proxy);
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
    console.log("default gas limits => ", defaultGas);

    if (chainIds.length === defaultGas.length) {
      const tx = await C1Addr.setDefaultGas(chainIds, defaultGas);
      console.log(tx);
      await tx.wait(3);
    } else {
      throw new Error("tasks/configure/generic.ts - Gas limit array length mismatch");
    }
    // feeData[network][counter].alreadySet = true;
    // fs.writeFileSync(filePath, JSON.stringify(feeData));
  });

task(TASK_SET_MULTIPLE_GASPRICE, "Set a generic default gasPrice")
  .addOptionalParam("filePath", "Path of json file")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const network = await hre.getChainId();
    const C1 = await hre.ethers.getContractFactory(contracts["GENERICHANDLER"]);
    const C1Addr = C1.attach(deployments[network][contracts["GENERICHANDLER"]].proxy);
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

    console.log("chainIds => ", chainIds);
    console.log("defaultGasPrice => ", defaultGasPrice);

    if (chainIds.length === defaultGasPrice.length) {
      const tx = await C1Addr.setDefaultGasPrice(chainIds, defaultGasPrice);
      console.log(tx);
      await tx.wait(3);
      console.log("Default gas price set on gen handler");
    } else {
      throw new Error("tasks/configure/generic.ts - Gas price array length mismatch");
    }
  });
