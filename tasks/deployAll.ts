import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

task("Deploy:All").setAction(async function (_taskArguments: TaskArguments, hre) {
  console.log("deploying ethHandler started");
  await hre.run("Deploy:EthHandler");
  console.log("deploying ethHandler finished");

  console.log("deploying voter Started ");
  await hre.run("deploy:voter");
  console.log("deploying voter Finished ");

  console.log("deploying Bridge started ");
  await hre.run("deploy:Bridge");
  console.log("deploying Bridge Finished  ");

  console.log("deploying sequencer Started");
  await hre.run("Deploy:Sequencer");
  console.log("deploying sequencer Finished  ");

  console.log("deploying handler Started  ");
  await hre.run("Deploy:Handler");
  console.log("deploying handler Finished  ");

  console.log("deploying  handler reserve started  ");
  await hre.run("Deploy:HandlerReserve");
  console.log("deploying  handler reserve Finished  ");

  console.log("configuring handlerReserve Started  ");
  await hre.run("Configure:HandlerReserve");
  console.log("configuring handlerReserve finished  ");

  console.log("deploying Usdc burner Started  ");
  await hre.run("Deploy:UsdcBurner");
  console.log("deploying Usdc burner Finished  ");

  console.log("configuring Usdc burner Started  ");
  await hre.run("Configure:UsdcBurner");
  console.log("configuring Usdc burner Finished  ");

  console.log("deploying Usdc minter Started  ");
  await hre.run("Deploy:UsdcMinter");
  console.log("deploying Usdc minter Finished  ");

  console.log("deploying  fee manager started  ");
  await hre.run("Deploy:FeeManager");
  console.log("deploying  fee manager finished  ");

  console.log("configuring handler started");
  await hre.run("Configure:handler");
  console.log("configuring handler finished");

  console.log("configuring Voter Staretd  ");
  await hre.run("Configure:Voter");
  console.log("configuring Voter Finished  ");

  console.log("configuring Bridge Started  ");
  await hre.run("Configure:Bridge");
  console.log("configuring Bridge Finished  ");

  console.log("configuring Handler after Bridge Started  ");
  await hre.run("handler-config-after-bridge");
  console.log("configuring Handler after Bridge Finished  ");

  console.log("deploying  Generic started  ");
  await hre.run("Deploy:Generic");
  console.log("deploying  Generic finished  ");

  console.log("deploying generic fee manager started  ");
  await hre.run("Deploy:GenericFeeManager");
  console.log("deploying generic fee manager finished  ");

  console.log("configuring genericHandler Started");
  await hre.run("Configure:genericHandler");
  console.log("configuring genericHandler finished  ");

  console.log("Setting generic resource on brige");
  await hre.run("task-set-generic-resource");
  console.log("Generic resource setting complete");

  console.log("configuring sequencer started");
  await hre.run("Configure:sequencer");
  console.log("configuring sequencer finished");

  console.log("configuring usdc minter started");
  await hre.run("Configure:UsdcMinter");
  console.log("configuring usdc minter finished");
});
