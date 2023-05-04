import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import {
  TASK_SET_NONCE_CHECKPOINT_ON_BRIDGE,
  TASK_SET_SEQUENCER_ON_HANDLER,
  TASK_SET_SEQUENCER_RESOURCE,
} from "../constants";


task("configure-upgrades:sequencer").setAction(async function (_taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) {
  // await hre.run("Deploy:Sequencer");
  await hre.run("Configure:sequencer");
  await hre.run(TASK_SET_SEQUENCER_ON_HANDLER);
  await hre.run(TASK_SET_SEQUENCER_RESOURCE);
  await hre.run(TASK_SET_NONCE_CHECKPOINT_ON_BRIDGE);
});
