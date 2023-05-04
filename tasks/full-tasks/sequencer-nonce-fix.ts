import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";

task("sequencer:nonce-fix").setAction(async function (_taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) {
  // await hre.run("Deploy:Sequencer");
  await hre.run("Upgrade", {
    contract: "SEQUENCER",
  });

});
