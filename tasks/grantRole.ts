import { task } from "hardhat/config";
import { IDeployment } from "./utils";
import { TaskArguments } from "hardhat/types";
import { TASK_GRANT_ROLE, contracts } from "./constants";
import deployment from "../deployment/deployments.json";
const deployments: IDeployment = deployment;

// let ROLEMAP : any = {
//   BRIDGE :{
//     DEFAULT_ADMIN_ROLE : true,
//     FEE_SETTER_ROLE : true,
//     RELAYER_ROLE : true,
//     PAUSER_ROLE : true,
//     RESOURCE_SETTER : true,
//     EMERGENCY_ROLE : true
//   },
//   ERC20HANDLER : {
//     DEFAULT_ADMIN_ROLE : true,
//     BRIDGE_ROLE : true
//   },
//   FEEMANAGER : {
//     DEFAULT_ADMIN_ROLE : true,
//   },
//   HANDLERRESERVE : {
//     DEFAULT_ADMIN_ROLE : true,
//     ERC20HANDLER_ROLE : true
//   }
// }

task(TASK_GRANT_ROLE, "Task is used to grant role to BRIDGE, VOTER, ERC20HANDLER, FEEMANAGER, HANDLERRESERVE")
  .addParam("contract", "Name of the Contract")
  .addParam("role", "Name of the Role")
  .addParam("address", "Address to whom role is to be granted")
  .addOptionalParam("contractaddress", "Provide address for a contract on which we grant role")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const network = await hre.getChainId();
    const C1 = await hre.ethers.getContractFactory(contracts[taskArguments.contract]);
    const C1Addr = C1.attach(taskArguments.contractaddress || deployments[network][contracts[taskArguments.contract]].proxy);
    const ROLE = await C1Addr[taskArguments.role]();
    const tx = await C1Addr.grantRole(ROLE, taskArguments.address);
    console.log(tx)
    await tx.wait(2);
    console.log(
      taskArguments.address +
      " has been granted role - " +
      taskArguments.role +
      " in contract - " +
      contracts[taskArguments.contract],
    );
  });
