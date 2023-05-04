import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { IBridgeConfig } from "../utils";
import usdcConfig from "../../deployment/config/usdcCrosschain.json";
import { contracts, TASK_SET_RELAYERS_ON_USDC_MINTER, BRIDGE_CONFIG } from "../constants";
const usdcConfigs: any = usdcConfig;
const bridgeConfig: any = BRIDGE_CONFIG;

task("Configure:UsdcMinter", "Set relayers on usdc minter").setAction(async function (
  taskArguments: TaskArguments,
  hre,
) {
  const network = await hre.getChainId();

  if (!usdcConfigs[network]) {
    console.log("Usdc burner not deployed on this chain");
    return;
  }

  const C1 = await hre.ethers.getContractFactory(contracts["USDCMINTER"]);
  const C1Addr = C1.attach(usdcConfigs[network][contracts["USDCMINTER"]].proxy);
  const resourceSetter = await C1Addr.RESOURCE_SETTER();
  for (let i = 0; i < bridgeConfig[network]["resourceSetters"].length; i++) {
    const tx5 = await C1Addr.grantRole(resourceSetter, bridgeConfig[network]["resourceSetters"][i]);
    await tx5.wait(4);
  }

  await hre.run(TASK_SET_RELAYERS_ON_USDC_MINTER);
});

task(TASK_SET_RELAYERS_ON_USDC_MINTER, "Set relayers on usdc minter").setAction(async function (
  taskArguments: TaskArguments,
  hre,
) {
  const network = await hre.getChainId();

  if (!usdcConfigs[network]) {
    console.log("Usdc burner not deployed on this chain");
    return;
  }

  const conf: IBridgeConfig = BRIDGE_CONFIG;
  const relayers = conf[network].initialRelayers;

  const C1 = await hre.ethers.getContractFactory(contracts["USDCMINTER"]);
  const C1Addr = C1.attach(usdcConfigs[network][contracts["USDCMINTER"]].proxy);
  const relayerRole = await C1Addr.RELAYER_ROLE();

  console.log("Granting relayer roles on usdc minter started");

  if (relayers.length > 0) {
    for (const relayer of relayers) {
      const tx5 = await C1Addr.grantRole(relayerRole, relayer);
      await tx5.wait(3);
    }
  }
  console.log("Granting relayer roles on usdc minter completed");
});
