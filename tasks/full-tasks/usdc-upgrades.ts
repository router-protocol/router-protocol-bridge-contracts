import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import usdcConfig from "../../deployment/config/usdcCrosschain.json";
import {
  TASK_SET_DEST_DETAILS_ON_USDC_BURNER,
  TASK_SET_USDC_BURNER_ON_ERC20_HANDLER,
  TASK_SET_USDC_CHAIN_PAIRS_ON_ERC20_HANDLER,
  TASK_SET_USDC_ON_ERC20_HANDLER,
} from "../constants";
const usdcConfigs: any = usdcConfig;

task("usdc-upgrades").setAction(async function (_taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) {
  const network = await hre.getChainId();

  if (!usdcConfigs[network]) {
    console.log("No usdc config found in deployment/config/usdcCrosschain.json file");
    return;
  }

  await hre.run("Deploy:UsdcBurner");
  await hre.run("Deploy:UsdcMinter");
  await hre.run("Configure:UsdcMinter");

  //TODO: run this command after testing
  await hre.run(TASK_SET_USDC_ON_ERC20_HANDLER);

  await hre.run(TASK_SET_USDC_BURNER_ON_ERC20_HANDLER);
  await hre.run(TASK_SET_USDC_CHAIN_PAIRS_ON_ERC20_HANDLER);
  await hre.run(TASK_SET_DEST_DETAILS_ON_USDC_BURNER);
});
