import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { IBridgeConfig, IDeployment } from "../utils";
import fs from "fs";
import {
  contracts,
  TASK_BRIDGE_PAUSE,
  TASK_CHANGE_QUORUM,
  TASK_SET_BURNABLE,
  TASK_SET_FEE_STATUS,
  TASK_SET_LP,
  TASK_SET_LP_OWNER,
  TASK_SET_ONESPLIT,
  TASK_SET_RESOURCE,
  // TASK_SET_MULTIPLE_DECIMAL,
  // TASK_SET_MULTIPLE_FEES,
  TASK_SET_MULTIPLE_RESOURCE,
  BRIDGE_CONFIG,
  TASK_SET_UNSUPPORTED_CHAIN,
  TASK_SET_GENERIC_RESOURCE,
  GENERIC_RESOURCE_ID,
  TASK_SET_SEQUENCER_RESOURCE,
  SEQUENCER_RESOURCE_ID,
  TASK_SET_NONCE_CHECKPOINT_ON_BRIDGE,
} from "../constants";
import deployment from "../../deployment/deployments.json";
const deployments: IDeployment = deployment;

task("Configure:Bridge").setAction(async function (_taskArguments: TaskArguments, hre) {
  const network = await hre.getChainId();
  const conf: IBridgeConfig = BRIDGE_CONFIG;
  console.log("Bridge config: ", conf[network]);
  const C1 = await hre.ethers.getContractFactory("BridgeUpgradeable");
  const C11 = await C1.attach(deployments[network][contracts["BRIDGE"]].proxy);
  const Handler = await hre.ethers.getContractFactory("ERC20HandlerUpgradeable");
  const handler = await Handler.attach(deployments[network][contracts["ERC20HANDLER"]].proxy);

  const relayerRole = await C11.RELAYER_ROLE();
  const resourceSetterRole = await C11.RESOURCE_SETTER();
  const feeSetterRole = await C11.FEE_SETTER_ROLE();
  const ridForFeeStatus = "0x00000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa8417400";

  const signers = await hre.ethers.getSigners();
  const deployer = signers[0].address;

  console.log("Granting resource setter and fee setter roles");
  const tx1 = await C11.grantRole(resourceSetterRole, deployer);
  await tx1.wait(3);
  console.log("granted resource setter to deployer");

  const tx2 = await C11.grantRole(feeSetterRole, deployer);
  await tx2.wait(3);
  console.log("granted fee setter to deployer");

  if (conf[network].resourceSetters.length > 0) {
    for (const resourceSetter of conf[network].resourceSetters) {
      const tx3 = await C11.grantRole(resourceSetterRole, resourceSetter);
      await tx3.wait(3);
    }
  }

  if (conf[network].feeSetters.length > 0) {
    for (const feeSetter of conf[network].feeSetters) {
      const tx4 = await C11.grantRole(feeSetterRole, feeSetter);
      await tx4.wait(3);
    }
  }

  console.log("Granting resource setter and fee setter roles completed");

  console.log("Granting relayer roles to initial relayers");
  if (conf[network].initialRelayers.length > 0) {
    for (const relayer of conf[network].initialRelayers) {
      const tx5 = await C11.grantRole(relayerRole, relayer);
      await tx5.wait(3);
    }
  }
  console.log("Granting relayer roles to initial relayers completed");

  console.log("Setting sequencer resource on bridge");
  await hre.run(TASK_SET_SEQUENCER_RESOURCE);
  console.log("Setting sequencer resource complete");

  console.log("Setting resources started");
  await hre.run(TASK_SET_MULTIPLE_RESOURCE);
  console.log("Setting resources completed");

  console.log("Setting fee status started");
  const tx6 = await C11.adminSetFeeStatus(ridForFeeStatus, true);
  await tx6.wait(3);
  console.log("Setting fee status completed");

  const tokensDeployedPath = "deployment/config/tokenDeployments.json";
  const tokenData = JSON.parse(fs.readFileSync(tokensDeployedPath, "utf-8"));
  let counter = 0;

  console.log("Setting LPs started");
  for (const data of tokenData[network]) {
    if (data.alreadySet) {
      counter++;
      continue;
    }
    const tx = await C11.adminSetLiquidityPool(handler.address, data.chainAdd, data.proxy);
    await tx.wait(3);
    tokenData[network][counter].alreadySet = true;
    fs.writeFileSync(tokensDeployedPath, JSON.stringify(tokenData));
    counter++;
  }
  console.log("Setting LPs completed");

  // console.log("Setting decimals started");
  // await hre.run(TASK_SET_MULTIPLE_DECIMAL);
  // console.log("Setting decimals complete");

  // console.log("Setting fees on fee manager");
  // await hre.run(TASK_SET_MULTIPLE_FEES);
  // console.log("Setting fees on fee manager complete");
});

task(TASK_SET_UNSUPPORTED_CHAIN)
  .addParam("chainId", "unsupported chain id")
  .addParam("unsupport", "true for unsupport and false for support")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const chainId = await hre.getChainId();
    const C1 = await hre.ethers.getContractFactory(contracts["BRIDGE"]);
    const C11 = C1.attach(deployments[chainId][contracts["BRIDGE"]].proxy);

    await C11.setUnsupportedChain(taskArguments.chainId, taskArguments.unsupport);
    console.log("Unsupported on chain with chainId ", chainId);
  });

task(TASK_SET_NONCE_CHECKPOINT_ON_BRIDGE)
  .addOptionalParam("filePath", "Path of json file contains ")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const network = await hre.getChainId();
    const C1 = await hre.ethers.getContractFactory(contracts["BRIDGE"]);
    const C11 = C1.attach(deployments[network][contracts["BRIDGE"]].proxy);

    const filePath = taskArguments.filePath || "deployment/config/nonceCheckpoints.json";
    const nonceCheckpointsData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const chainIds = [];
    const nonceCheckpoints = [];

    let counter = 0;
    for (const data of nonceCheckpointsData[network]) {
      if (data.alreadySet || !data.srcChainId || !data.nonceCheckpoint) {
        counter++;
        continue;
      }

      console.log(data);
      chainIds.push(data.srcChainId);
      nonceCheckpoints.push(data.nonceCheckpoint);
    }

    console.log("srcChainIds: ", chainIds);
    console.log("nonceCheckpoints: ", nonceCheckpoints);

    if (chainIds.length === nonceCheckpoints.length) {
      const tx = await C11.adminSetNonceCheckpoint(chainIds, nonceCheckpoints);
      console.log(tx);
      await tx.wait(4);
      counter = 0;

      for (const data of nonceCheckpointsData[network]) {
        if (data.alreadySet || !data.srcChainId || !data.nonceCheckpoint) {
          counter++;
          continue;
        }

        nonceCheckpointsData[network][counter].alreadySet = true;
        fs.writeFileSync(filePath, JSON.stringify(nonceCheckpointsData));
        counter++;
      }
    } else throw Error("Setting nonce checkpoints on bridge: Array length mismatch");

    console.log("Nonce checkpoints set");
  });

// task(TASK_SET_FEE, "Set fee for a token on the BRIDGE")
//   .addParam("resourceid", "Resource ID of the token")
//   .addParam("destchainid", "Destination chain ID")
//   .addParam("feetokenaddress", "Fee token address")
//   .addParam("transferfee", "Transfer Fee (in wei)")
//   .addParam("exchangefee", "Exchange Fee (in wei)")
//   .setAction(async function (taskArguments: TaskArguments, hre) {
//     const network = await hre.getChainId();
//     const C1 = await hre.ethers.getContractFactory(contracts["BRIDGE"]);
//     const C1Addr = C1.attach(deployments[network][contracts["BRIDGE"]].proxy);
//     await setFeeStatus(taskArguments.resourceid, true, hre);
//     const tx = await C1Addr.setBridgeFee(
//       taskArguments.resourceid,
//       taskArguments.destchainid,
//       taskArguments.feetokenaddress,
//       taskArguments.transferfee,
//       taskArguments.exchangefee,
//       true,
//     );
//     console.log(tx);
//     await tx.wait(2);
//     console.log("Fee set for token " + taskArguments.feeTokenAddress);
//   });

// task(TASK_SET_MULTIPLE_FEES, "Set Fee of token from json file")
//   .addOptionalParam("filePath", "Path of json file")
//   .setAction(async function (taskArguments: TaskArguments, hre) {
//     const network = await hre.getChainId();
//     const C1 = await hre.ethers.getContractFactory(contracts["BRIDGE"]);
//     const C1Addr = C1.attach(deployments[network][contracts["BRIDGE"]].proxy);
//     console.log(taskArguments);
//     const filePath = taskArguments.filePath || "deployment/config/fees.json";
//     const feeData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
//     // console.log(feeData[network]);
//     let counter = 0;
//     for (const data of feeData[network]) {
//       if (data.alreadySet || !data.token) {
//         counter++;
//         continue;
//       }
//       console.log(data);
//       const tx = await C1Addr.setBridgeFee(
//         data.rid,
//         data.destchainid,
//         data.token,
//         data.transferfee,
//         data.exchangefee,
//         true,
//       );
//       console.log(tx);
//       await tx.wait(3);
//       feeData[network][counter].alreadySet = true;
//       fs.writeFileSync(filePath, JSON.stringify(feeData));
//       counter++;
//     }
//   });

task(TASK_SET_GENERIC_RESOURCE).setAction(async function (taskArguments: TaskArguments, hre) {
  const chainId = await hre.getChainId();
  const C1 = await hre.ethers.getContractFactory(contracts["BRIDGE"]);
  const C11 = C1.attach(deployments[chainId][contracts["BRIDGE"]].proxy);

  await C11.adminSetGenericResource(deployments[chainId][contracts["GENERICHANDLER"]].proxy, GENERIC_RESOURCE_ID);
  console.log("Generic resource set");
});

task(TASK_SET_SEQUENCER_RESOURCE).setAction(async function (taskArguments: TaskArguments, hre) {
  const chainId = await hre.getChainId();
  const C1 = await hre.ethers.getContractFactory(contracts["BRIDGE"]);
  const C11 = C1.attach(deployments[chainId][contracts["BRIDGE"]].proxy);

  const tx = await C11.adminSetSequencerResource(
    deployments[chainId][contracts["SEQUENCER"]].proxy,
    SEQUENCER_RESOURCE_ID,
  );
  await tx.wait(5);
  console.log("Sequencer resource set");
});

task(TASK_SET_MULTIPLE_RESOURCE, "Set Fee of token from json file")
  .addOptionalParam("filePath", "Path of json file")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const network = await hre.getChainId();
    const C1 = await hre.ethers.getContractFactory(contracts["BRIDGE"]);
    const C1Addr = C1.attach(deployments[network][contracts["BRIDGE"]].proxy);
    console.log(taskArguments);
    const filePath = taskArguments.filePath || "deployment/config/resource.json";
    const resourceData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    // console.log(resourceData[network]);
    let counter = 0;
    for (const data of resourceData[network]) {
      if (data.alreadySet || !data.token) {
        counter++;
        continue;
      }
      console.log(data);
      const tx = await C1Addr.adminSetResource(
        deployments[network][contracts["ERC20HANDLER"]].proxy,
        data.rid,
        data.token,
      );
      await tx.wait(2);
      console.log("Added Resource to bridge");
      if (data.burnable) {
        console.log(`Adding ${data.name} as burnable asset`);
        const C1 = await hre.ethers.getContractFactory("ERC20HandlerUpgradeable");
        const handler = C1.attach(deployments[network].ERC20HandlerUpgradeable.proxy);
        const tx2 = await C1Addr.adminSetBurnable(handler.address, data.token, true);
        await tx2.wait(2);
        console.log("Added as burnable asset");

        await hre.run("grant-role", {
          contract: "ERC20Token",
          role: "MINTER_ROLE",
          address: deployments[network].HandlerReserveUpgradeable.proxy,
          contractaddress: data.token,
        });

        await hre.run("grant-role", {
          contract: "ERC20Token",
          role: "BURNER_ROLE",
          address: deployments[network].HandlerReserveUpgradeable.proxy,
          contractaddress: data.token,
        });
      }
      resourceData[network][counter].alreadySet = true;
      fs.writeFileSync(filePath, JSON.stringify(resourceData));

      counter++;
    }
  });

// task(TASK_SET_MULTIPLE_DECIMAL, "Set Decimal of token contract from json file")
//   .addOptionalParam("filePath", "Path of json file contains destid and decimal")
//   .setAction(async function (taskArguments: TaskArguments, hre) {
//     const network = await hre.getChainId();
//     const C1 = await hre.ethers.getContractFactory(contracts["BRIDGE"]);
//     const C1Addr = C1.attach(deployments[network][contracts["BRIDGE"]].proxy);
//     console.log(taskArguments);
//     const filePath = taskArguments.filePath || "deployment/config/decimals.json";
//     const decimalData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
//     // console.log(decimalData[network]);
//     let counter = 0;
//     for (const data of decimalData[network]) {
//       if (data.alreadySet || !data.token) {
//         counter++;
//         continue;
//       }
//       console.log(data);
//       const tx = await C1Addr.adminSetTokenDecimals(
//         deployments[network][contracts["ERC20HANDLER"]].proxy,
//         data.token,
//         data.destid,
//         data.decimal,
//       );
//       console.log(tx);
//       await tx.wait(4);
//       decimalData[network][counter].alreadySet = true;
//       fs.writeFileSync(filePath, JSON.stringify(decimalData));

//       counter++;
//     }
//   });

task(TASK_SET_FEE_STATUS, "Set status for a fee token")
  .addParam("resourceId", "Resource ID of the token")
  .addParam("status", "Status (true or false)")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const network = await hre.getChainId();
    const C1 = await hre.ethers.getContractFactory("BridgeUpgradeable");
    const C1Addr = C1.attach(deployments[network]["BridgeUpgradeable"].proxy);

    await C1Addr.setFeeStatus(taskArguments.resourceId, taskArguments.status);
    console.log("Fee status set to " + taskArguments.status + " for resourceId " + taskArguments.resourceId);
  });

task(TASK_SET_RESOURCE, "Set a token as a resource")
  .addParam("rid", "Resource ID of the handler")
  .addParam("token", "Address of the token")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const network = await hre.getChainId();
    const C1 = await hre.ethers.getContractFactory("BridgeUpgradeable");
    const C1Addr = C1.attach(deployments[network]["BridgeUpgradeable"].proxy);
    console.log(taskArguments);
    const tx = await C1Addr.adminSetResource(
      deployments[network][contracts["ERC20HANDLER"]].proxy,
      taskArguments.rid,
      taskArguments.token,
    );
    await tx.wait(2);
    console.log("Added Resource to bridge");
  });

task(TASK_SET_BURNABLE, "Set a token as a burnable")
  .addParam("handleraddress", "Address of the handler")
  .addParam("tokenaddress", "Address of the token")
  .addParam("status", "Status (true or false)")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const network = await hre.getChainId();
    const C1 = await hre.ethers.getContractFactory(contracts["BRIDGE"]);
    const C1Addr = C1.attach(deployments[network][contracts["BRIDGE"]].proxy);
    const tx = await C1Addr.adminSetBurnable(
      taskArguments.handleraddress,
      taskArguments.tokenaddress,
      taskArguments.status,
    );
    await tx.wait(2);
    console.log("Added Token as burnable");
  });

task(TASK_SET_ONESPLIT, "Set onesplit contract address")
  .addParam("handleraddress", "Address of the handler")
  .addParam("onesplit", "Address of onesplit contract")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const network = await hre.getChainId();
    const C1 = await hre.ethers.getContractFactory(contracts["BRIDGE"]);
    const C1Addr = C1.attach(deployments[network][contracts["BRIDGE"]].proxy);
    const tx = await C1Addr.adminSetOneSplitAddress(taskArguments.handleraddress, taskArguments.onesplit);
    await tx.wait(2);
    console.log("Added Oneplit contract");
  });

task(TASK_BRIDGE_PAUSE, "Pause the bridge")
  .addParam("type", "Enables or disables pausing bridge contract (enable or disable)")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const network = await hre.getChainId();
    const C1 = await hre.ethers.getContractFactory(deployments[network]["BRIDGE"].proxy);
    const C1Addr = C1.attach(deployments[network][contracts["BRIDGE"]].proxy);

    if (taskArguments.type === "enable") {
      const tx = await C1Addr.pause();
      await tx.wait(2);
      console.log("Bridge Paused");
    } else if (taskArguments.type === "disable") {
      const tx = await C1Addr.unpause();
      await tx.wait(2);
      console.log("Bridge Paused");
    }
  });

task(TASK_SET_LP, "Set LP to bridge contract")
  // .addParam("name", "Name of the LP Pool")
  // .addParam("symbol", "Symbol of the LP Pool")
  // .addParam("decimal", "decimal of the LP Pool")
  .addParam("tokenaddress", "Address of token contract")
  // .addOptionalParam("lpaddress", "Address of LP contract")
  .addParam("lpaddress", "Address of LP contract")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const network = await hre.getChainId();
    const C1 = await hre.ethers.getContractFactory(contracts["BRIDGE"]);
    const C1Addr = C1.attach(deployments[network][contracts["BRIDGE"]].proxy);
    console.log(taskArguments);
    const tx = await C1Addr.adminSetLiquidityPool(
      // taskArguments.name,
      // taskArguments.symbol,
      // taskArguments.decimal,
      deployments[network][contracts["ERC20HANDLER"]].proxy,
      taskArguments.tokenaddress,
      // taskArguments.lpaddress ? taskArguments.lpaddress : "0x0000000000000000000000000000000000000000",
      taskArguments.lpaddress,
    );
    console.log(tx);
    await tx.wait(2);
  });

// task(TASK_SET_DECIMAL, "Set Decimal of token contract")
//   .addParam("destid", "Symbol of the LP Pool")
//   .addParam("decimal", "decimal of the LP Pool")
//   .addParam("tokenaddress", "Address of token contract")
//   .setAction(async function (taskArguments: TaskArguments, hre) {
//     const network = await hre.getChainId();
//     const C1 = await hre.ethers.getContractFactory(contracts["BRIDGE"]);
//     const C1Addr = C1.attach(deployments[network][contracts["BRIDGE"]].proxy);
//     console.log(taskArguments);

//     const tx = await C1Addr.adminSetTokenDecimals(
//       deployments[network][contracts["ERC20HANDLER"]].proxy,
//       taskArguments.tokenaddress,
//       taskArguments.destid,
//       taskArguments.decimal,
//     );
//     console.log(tx);
//     await tx.wait(2);
//   });

task(TASK_SET_LP_OWNER, "Set Owner of the LP contract")
  .addParam("handlerAddress", "Address of the handler")
  .addParam("ownerAddress", "Address of the New Owner")
  .addParam("tokenAddress", "Address of token contract")
  .addParam("lpAddress", "Address of LP contract")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const network = await hre.getChainId();
    const C1 = await hre.ethers.getContractFactory(deployments[network]["BRIDGE"].proxy);
    const C1Addr = C1.attach(deployments[network][contracts["BRIDGE"]].proxy);
    const tx = await C1Addr.adminSetLiquidityPoolOwner(
      taskArguments.handlerAddress,
      taskArguments.ownerAddress,
      taskArguments.tokenAddress,
      taskArguments.lpAddress,
    );
    await tx.wait(2);
    console.log("Owner of the LP contract changed to " + taskArguments.ownerAddress);
  });

task(TASK_CHANGE_QUORUM, "Change quorum of bridge contract")
  .addParam("quorum", "New quorum value")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const network = await hre.getChainId();
    const C1 = await hre.ethers.getContractFactory(deployments[network]["BRIDGE"].proxy);
    const C1Addr = C1.attach(deployments[network][contracts["BRIDGE"]].proxy);
    const tx = await C1Addr.adminChangeQuorum(taskArguments.quorum);
    await tx.wait(2);
  });
