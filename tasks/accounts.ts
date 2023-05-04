import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";

import { TASK_ACCOUNTS } from "./constants";

task(TASK_ACCOUNTS, "Prints the list of accounts", async (_taskArgs, hre) => {
  const signers: Signer[] = await hre.ethers.getSigners();
  const addresses = await Promise.all(signers.map(signer => signer.getAddress()));

  console.log(addresses);
});
