import { task } from "hardhat/config";
import { IDeployment } from "../utils";
import fs from "fs";
import { TaskArguments } from "hardhat/types";
import deployment from "../../deployment/deployments.json";
import usdcConfig from "../../deployment/config/usdcCrosschain.json";

const deployments: IDeployment = deployment;
const usdcConfigs: any = usdcConfig;

task("Deploy:UsdcBurner").setAction(async function (_taskArguments: TaskArguments, hre) {
  const deployContract = "UsdcDepositAndBurn";
  const network = await hre.getChainId();

  if (!usdcConfigs[network]) {
    console.log("Should not deploy USDC burner");
    return;
  }

  console.log("Contract Deployment Started ");
  const C1 = await hre.ethers.getContractFactory("UsdcDepositAndBurn");
  const c1Proxy = await hre.upgrades.deployProxy(
    C1,
    [
      usdcConfigs[network].TokenMessenger,
      usdcConfigs[network].Usdc,
      deployments[network].ERC20HandlerUpgradeable.proxy,
      deployments[network].HandlerReserveUpgradeable.proxy,
    ],
    {
      kind: "uups",
    },
  );

  console.log(c1Proxy);
  console.log(deployContract + " Proxy Contract deployed to: ", c1Proxy.address);
  await c1Proxy.deployed();
  const implementationAddr = await hre.upgrades.erc1967.getImplementationAddress(c1Proxy.address);
  console.log(deployContract + " Implementation Contract deployed to: ", implementationAddr);
  console.log("Contract Deployment Ended ");

  console.log("Deployment Storage Started ");
  usdcConfigs[network][deployContract] = {
    proxy: c1Proxy.address,
    implementation: [implementationAddr],
    creationTime: Date.now(),
    updatedTime: [Date.now()],
  };

  fs.writeFileSync("./deployment/config/usdcCrosschain.json", JSON.stringify(usdcConfigs));
  console.log("Deployment Storage Ended ");
});
