/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { HardhatRuntimeEnvironment } from "hardhat/types";
import deployment from "../deployment/deployments.json";
// import { BridgeUpgradeable } from "../typechain";
import { BigNumber } from "ethers";
import { contracts } from "./constants";
const deployments: IDeployment = deployment;
export interface IDeployment {
  [key: string]: {
    [key: string]: {
      proxy: string;
      implementation: Array<string>;
      creationTime: number;
      updatedTime: Array<number>;
    };
  };
}
export interface IBridgeConfig {
  [key: string]: BridgeConfig;
}
export interface BridgeConfig {
  chainID: string;
  initialRelayers: Array<string>;
  resourceSetters: Array<string>;
  feeSetters: Array<string>;
  quorum: string;
  expiry: string;
}

export async function recordAllDeployments(
  network: string,
  contractname: string,
  proxyAddr: string,
  implementationAddr: string,
) {
  deployments[network][contractname] = {
    proxy: proxyAddr,
    implementation: [implementationAddr],
    creationTime: Date.now(),
    updatedTime: [Date.now()],
  };

  return deployments;
}

export async function grantRole(contractName: string, role: string, address: string, hre: HardhatRuntimeEnvironment) {
  const network = await hre.getChainId();
  const C1 = await hre.ethers.getContractFactory(contractName);
  const C1Addr = C1.attach(deployments[network][contractName].proxy);

  const tx = await C1Addr.grantRole(role, address);
  console.log(tx);
  await tx.wait(2);
}

export async function verify(proxyAddr: string, hre: HardhatRuntimeEnvironment) {
  const implementationAddr = await hre.upgrades.erc1967.getImplementationAddress(proxyAddr);
  console.log("Contract Verification Started", implementationAddr);
  try {
    await hre.run("verify:verify", {
      address: implementationAddr,
    });
  } catch (err) {
    console.error(err);
  }
  console.log("Contract Verification Ended");
}

//TODO: add a mapping of tokenName -> rscId and take tokenName as param
export async function setFeeStatus(resourceId: string, status: boolean, hre: HardhatRuntimeEnvironment) {
  const network = await hre.getChainId();
  const C1 = await hre.ethers.getContractFactory(contracts["BRIDGE"]);
  const BridgeInstance = C1.attach(deployments[network][contracts["BRIDGE"]].proxy);
  const tx = await BridgeInstance.adminSetFeeStatus(resourceId, status);
  await tx.wait(2);
}

export const toHex = (
  covertThis: BigNumber | number | string,
  padding: any,
  hre: HardhatRuntimeEnvironment,
): string => {
  //This checks if padding < convertThis, then error is not thrown in ethers-v5
  if (hre.ethers.utils.hexlify(covertThis).length > 2 * padding + 2) return hre.ethers.utils.hexlify(covertThis);

  return hre.ethers.utils.hexZeroPad(hre.ethers.utils.hexlify(covertThis), padding);
};

export const createResourceID = (contractAddress: string, chainID: number, hre: HardhatRuntimeEnvironment): string => {
  return toHex(contractAddress + toHex(chainID, 0, hre).substr(2), 32, hre);
};
