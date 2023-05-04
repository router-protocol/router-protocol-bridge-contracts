/* eslint-disable @typescript-eslint/no-unused-vars */
import { task } from "hardhat/config";
import { IDeployment } from "../utils";
import { TaskArguments } from "hardhat/types";
import fs from "fs";
import deployment from "../../deployment/deployments.json";
import widgetFee from "../../deployment/config/widgetFee.json";
const deployments: IDeployment = deployment;
const widgetFees: any = widgetFee;

task("set-multiple-widget-fees")
  .addOptionalParam("filePath")
  .setAction(async function (_taskArguments: TaskArguments, hre) {
    const network = await hre.getChainId();
    const C1 = await hre.ethers.getContractFactory("FeeManagerUpgradeable");
    const C1Addr = C1.attach(deployments[network].FeeManagerUpgradeable.proxy);
    console.log("Adding widget fee started");

    const filePath = _taskArguments.filePath || "deployment/config/widgetFee.json";
    const widgetFeeData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    let feeTokens = [];
    let widgetIds = [];
    let feePerTx = [];
    let widgetOwner = [];

    let counter = 0;
    for (const data of widgetFeeData[network]) {
      if (data.alreadySet || !data.feeToken || !data.widgetOwner || !data.widgetId || !data.feePerTx) {
        counter++;
        continue;
      }

      console.log(data);
      feeTokens.push(data.feeToken);
      widgetIds.push(data.widgetId);
      feePerTx.push(data.feePerTx);
      widgetOwner.push(data.widgetOwner);
    }

    console.log("feeTokens: ", feeTokens);
    console.log("widgetIds: ", widgetIds);
    console.log("feePerTx: ", feePerTx);
    console.log("widgetOwner: ", widgetOwner);

    if (
      !(
        feeTokens.length == widgetIds.length &&
        feeTokens.length == feePerTx.length &&
        feeTokens.length == widgetOwner.length
      )
    ) {
      throw new Error("Setting widget fee on fee manager: Array length mismatch");
    }

    const tx = await C1Addr.setWidgetFee(widgetIds, feeTokens, feePerTx, widgetOwner);
    console.log(tx);
    await tx.wait(4);
    counter = 0;

    for (const data of widgetFeeData[network]) {
      if (data.alreadySet || !data.feeToken || !data.widgetOwner || !data.widgetId || !data.feePerTx) {
        counter++;
        continue;
      }

      widgetFeeData[network][counter].alreadySet = true;
      fs.writeFileSync(filePath, JSON.stringify(widgetFeeData));
      counter++;
    }

    console.log("Adding widget fee started");
  });
