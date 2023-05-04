/* eslint-disable @typescript-eslint/no-unused-vars */
import { task } from "hardhat/config";
import { grantRole, IDeployment, setFeeStatus } from "../utils";
import { TaskArguments } from "hardhat/types";
import deployment from "../../deployment/deployments.json";
import usdcConfig from "../../deployment/config/usdcCrosschain.json";
import fs from "fs";
import {
  contracts,
  ONESPLIT,
  TASK_SET_FEE,
  TASK_SET_MULTIPLE_DECIMAL,
  TASK_SET_MULTIPLE_FEES,
  TASK_SET_SEQUENCER_ON_HANDLER,
  TASK_SET_USDC_BURNER_ON_ERC20_HANDLER,
  TASK_SET_USDC_CHAIN_PAIRS_ON_ERC20_HANDLER,
  TASK_SET_USDC_ON_ERC20_HANDLER,
} from "../constants";
const deployments: IDeployment = deployment;
const usdcConfigs: any = usdcConfig;

task("Configure:handler").setAction(async function (_taskArguments: TaskArguments, hre) {
  const network = await hre.getChainId();

  const C1 = await hre.ethers.getContractFactory("ERC20HandlerUpgradeable");
  const C1Addr = C1.attach(deployments[network].ERC20HandlerUpgradeable.proxy);

  console.log("Contract Configuration Started ");
  const bridgeRole = await C1Addr.BRIDGE_ROLE();
  await grantRole("ERC20HandlerUpgradeable", bridgeRole, deployments[network].BridgeUpgradeable.proxy, hre);

  let tx = await C1Addr.setFeeManager(deployments[network].FeeManagerUpgradeable.proxy);
  console.log(tx);
  console.log("setFeeManager");
  await tx.wait(2);
  tx = await C1Addr.setReserve(deployments[network].HandlerReserveUpgradeable.proxy);
  console.log(tx);
  console.log("setReserve");
  await tx.wait(2);
  tx = await C1Addr.setOneSplitAddress(ONESPLIT[network]);
  console.log(tx);
  console.log("setOneSplitAddress");
  await tx.wait(2);
  tx = await C1Addr.setSequencer(deployments[network].SequencerHandlerUpgradeable.proxy);
  console.log(tx);
  console.log("setSequencer");
  await tx.wait(2);

  console.log("setting usdc on erc20 handler started");
  await hre.run(TASK_SET_USDC_ON_ERC20_HANDLER);
  console.log("setting usdc on erc20 handler completed");

  console.log("setting usdc burner on erc20 handler started");
  await hre.run(TASK_SET_USDC_BURNER_ON_ERC20_HANDLER);
  console.log("setting usdc burner on erc20 handler completed");

  console.log("setting usdc chain pairs on erc20 handler started");
  await hre.run(TASK_SET_USDC_CHAIN_PAIRS_ON_ERC20_HANDLER);
  console.log("setting usdc chain pairs on erc20 handler completed");

  console.log("Contract Configuration Ended ");
});

task("handler-config-after-bridge").setAction(async function (taskArguments: TaskArguments, hre) {
  console.log("Setting decimals");
  await hre.run(TASK_SET_MULTIPLE_DECIMAL);
  console.log("Setting decimals complete");

  console.log("Setting fees");
  await hre.run(TASK_SET_MULTIPLE_FEES);
  console.log("Setting fees complete");
});

task(TASK_SET_FEE, "Set fee for a token on the BRIDGE")
  .addParam("destchainid", "Destination chain ID")
  .addParam("feetokenaddress", "Fee token address")
  .addParam("transferfee", "Transfer Fee (in wei)")
  .addParam("exchangefee", "Exchange Fee (in wei)")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const network = await hre.getChainId();
    const C1 = await hre.ethers.getContractFactory(contracts["ERC20HANDLER"]);
    const C1Addr = C1.attach(deployments[network][contracts["ERC20HANDLER"]].proxy);

    const tx = await C1Addr.setBridgeFee(
      taskArguments.destchainid,
      taskArguments.feetokenaddress,
      taskArguments.transferfee,
      taskArguments.exchangefee,
      true,
    );
    console.log(tx);
    await tx.wait(2);
    console.log("Fee set for token " + taskArguments.feeTokenAddress);
  });

task(TASK_SET_MULTIPLE_FEES, "Set Fee of token from json file")
  .addOptionalParam("filePath", "Path of json file")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const network = await hre.getChainId();
    const C1 = await hre.ethers.getContractFactory(contracts["ERC20HANDLER"]);
    const C1Addr = C1.attach(deployments[network][contracts["ERC20HANDLER"]].proxy);
    console.log(taskArguments);
    const filePath = taskArguments.filePath || "deployment/config/fees.json";
    const feeData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    // console.log(feeData[network]);
    let counter = 0;
    for (const data of feeData[network]) {
      if (data.alreadySet || !data.token) {
        counter++;
        continue;
      }
      console.log(data);
      const tx = await C1Addr.setBridgeFee(data.destchainid, data.token, data.transferfee, data.exchangefee, true);
      console.log(tx);
      await tx.wait(3);
      feeData[network][counter].alreadySet = true;
      fs.writeFileSync(filePath, JSON.stringify(feeData));
      counter++;
    }
  });

task(TASK_SET_SEQUENCER_ON_HANDLER).setAction(async function (taskArguments: TaskArguments, hre) {
  const chainId = await hre.getChainId();
  const C1 = await hre.ethers.getContractFactory(contracts["ERC20HANDLER"]);
  const C11 = C1.attach(deployments[chainId][contracts["ERC20HANDLER"]].proxy);

  await C11.setSequencer(deployments[chainId][contracts["SEQUENCER"]].proxy);
  console.log("Sequencer set on handler");
});

task(TASK_SET_MULTIPLE_DECIMAL, "Set Decimal of token contract from json file")
  .addOptionalParam("filePath", "Path of json file contains destid and decimal")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const network = await hre.getChainId();
    const C1 = await hre.ethers.getContractFactory(contracts["ERC20HANDLER"]);
    const C1Addr = C1.attach(deployments[network][contracts["ERC20HANDLER"]].proxy);
    console.log(taskArguments);
    const filePath = taskArguments.filePath || "deployment/config/decimals.json";
    const decimalData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    // console.log(decimalData[network]);

    const tokens = [];
    const destIds = [];
    const decimals = [];
    // console.log(decimalData[network]);
    let counter = 0;
    for (const data of decimalData[network]) {
      if (data.alreadySet || !data.token) {
        counter++;
        continue;
      }
      console.log(data);
      tokens.push(data.token);
      destIds.push(data.destid);
      decimals.push(data.decimal);
    }

    console.log("tokens: ", tokens);
    console.log("destChainIds: ", destIds);
    console.log("decimals: ", decimals);

    if (tokens.length === destIds.length && tokens.length === decimals.length) {
      const tx = await C1Addr.setTokenDecimals(tokens, destIds, decimals);
      console.log(tx);
      await tx.wait(4);
      counter = 0;

      for (const data of decimalData[network]) {
        if (data.alreadySet || !data.token) {
          counter++;
          continue;
        }

        decimalData[network][counter].alreadySet = true;
        fs.writeFileSync(filePath, JSON.stringify(decimalData));
        counter++;
      }
    } else throw Error("Setting decimals on erc20Handler: Array length mismatch");
  });

task(TASK_SET_USDC_ON_ERC20_HANDLER).setAction(async function (taskArguments: TaskArguments, hre) {
  const chainId = await hre.getChainId();

  if (!usdcConfigs[chainId]) {
    console.log("Usdc contracts not deployed on this chain");
    return;
  }

  const C1 = await hre.ethers.getContractFactory(contracts["ERC20HANDLER"]);
  const C11 = C1.attach(deployments[chainId][contracts["ERC20HANDLER"]].proxy);

  await C11.setUsdcAddress(usdcConfigs[chainId].Usdc);
  console.log("Usdc address set on handler");
});

task(TASK_SET_USDC_CHAIN_PAIRS_ON_ERC20_HANDLER).setAction(async function (taskArguments: TaskArguments, hre) {
  const pairData = require("../../deployment/config/usdcChainPairs.json");
  const chainId = await hre.getChainId();

  if (!pairData[chainId]) {
    console.log("Usdc contracts not deployed on this chain");
    return;
  }

  const C1 = await hre.ethers.getContractFactory(contracts["ERC20HANDLER"]);
  const C11 = C1.attach(deployments[chainId][contracts["ERC20HANDLER"]].proxy);
  const setTrue = Array(pairData[chainId].length).fill(true);

  await C11.setUsdcBurnableAndMintable(pairData[chainId], setTrue);
  console.log("Usdc chain pairs set on handler");
});

task(TASK_SET_USDC_BURNER_ON_ERC20_HANDLER).setAction(async function (taskArguments: TaskArguments, hre) {
  const chainId = await hre.getChainId();

  if (!usdcConfigs[chainId]) {
    console.log("Usdc contracts not deployed on this chain");
    return;
  }

  const C1 = await hre.ethers.getContractFactory(contracts["ERC20HANDLER"]);
  const C11 = C1.attach(deployments[chainId][contracts["ERC20HANDLER"]].proxy);

  await C11.setUsdcBurnerContract(usdcConfigs[chainId].UsdcDepositAndBurn.proxy);
  console.log("Usdc burner contract set on handler");
});
