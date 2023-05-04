import { ethers, getChainId } from "hardhat";
import { createResourceID } from "../test/helpers";
async function newtestTokenConfigure() {
  console.log("------------------------------ Initial Setup Started ------------------------------");
  let deployContract = "TestToken";

  const hre = require("hardhat");
  let deployedContracts = require("../deployment/newTestToken.json");
  let handler = require("../deployment/ERC20HandlerUpgradeable.json");
  let bridge = require("../deployment/BridgeUpgradeable.json");
  let reserve = require("../deployment/HandlerReserveUpgradeable.json");

  const network = await hre.getChainId();
  const C1 = await hre.ethers.getContractFactory("RouterERC20Upgradable");
  const Bridge = await hre.ethers.getContractFactory("BridgeUpgradeable");
  const C1Addr = C1.attach(deployedContracts[network].TestToken.newtoken);
  // const C2Addr = C1.attach(deployedContracts[network].TestToken.token2);
  const BridgeAddr = Bridge.attach(bridge[network].BridgeUpgradeable.proxy);
  // const ETH = network =="42" ? "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" : "0x0000000000000000000000000000000000001010";

  console.log("------------------------------ Initial Setup Ended ------------------------------");

  console.log("------------------------------ Contract Configuration Started ------------------------------");

  // let tx = await C1Addr.grantRole(
  //   await C1Addr.BURNER_ROLE(),
  //   reserve[network].HandlerReserveUpgradeable.proxy,
  // );
  // await tx.wait(2);
  // tx = await C2Addr.grantRole(
  //   await C2Addr.BURNER_ROLE(),
  //   reserve[network].HandlerReserveUpgradeable.proxy,
  // );
  // await tx.wait(2);
  // tx = await C1Addr.grantRole(
  //   await C1Addr.MINTER_ROLE(),
  //   reserve[network].HandlerReserveUpgradeable.proxy,
  // );
  // await tx.wait(2);
  // tx = await C2Addr.grantRole(
  //   await C2Addr.MINTER_ROLE(),
  //   reserve[network].HandlerReserveUpgradeable.proxy,
  // );
  // await tx.wait(2);
  // //set admin resource
  // const ethResourceId = createResourceID("0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", 0);
  const daiResourceId = createResourceID(deployedContracts["42"].TestToken.newtoken, 0);
  // const routeResourceId = createResourceID(deployedContracts["42"].TestToken.token2, 0);

  // console.log("ETH resource id : "+ethResourceId);
  console.log("dai resource id : "+daiResourceId);
  // console.log("route resource id : "+routeResourceId);

  // const resourceSetter = await BridgeAddr.RESOURCE_SETTER();
  // const feeSetter = await BridgeAddr.FEE_SETTER_ROLE();
  // const relayerRole = await BridgeAddr.RELAYER_ROLE();

  // tx = await BridgeAddr.grantRole(resourceSetter, (await ethers.getSigners())[0].address);
  // await tx.wait(2);
  // tx = await BridgeAddr.grantRole(feeSetter, (await ethers.getSigners())[0].address);
  // await tx.wait(2);
  // tx = await BridgeAddr.grantRole(relayerRole, (await ethers.getSigners())[0].address);
  // await tx.wait(2);
  // tx = await BridgeAddr.grantRole(relayerRole, (await ethers.getSigners())[1].address);
  // await tx.wait(2);
  // let tx = await BridgeAddr.adminSetResource(handler[network].ERC20HandlerUpgradeable.proxy, ethResourceId, ETH);
  // await tx.wait(2);
  let tx = await BridgeAddr.adminSetResource(handler[network].ERC20HandlerUpgradeable.proxy, daiResourceId, C1Addr.address);
  await tx.wait(2);
  // tx = await BridgeAddr.adminSetResource(handler[network].ERC20HandlerUpgradeable.proxy, routeResourceId, C2Addr.address);
  // await tx.wait(2);
  // tx = await BridgeAddr.adminSetFeeStatus(ethResourceId, true);
  // await tx.wait(2);
  tx = await BridgeAddr.adminSetFeeStatus(daiResourceId, true);
  await tx.wait(2);
  // tx = await BridgeAddr.adminSetFeeStatus(routeResourceId, true);
  // await tx.wait(2);
  // tx = await BridgeAddr.adminSetBurnable(handler[network].ERC20HandlerUpgradeable.proxy, deployedContracts[network].TestToken.token1);
  // await tx.wait(2);
  // tx = await BridgeAddr.adminSetBurnable(handler[network].ERC20HandlerUpgradeable.proxy, deployedContracts[network].TestToken.token2);
  // await tx.wait(2);
  const destChain = (network) == "42" ? 2 : 1 ;

  // tx = await BridgeAddr.setBridgeFee(ethResourceId, destChain, ETH, 0, 0, true);
  // await tx.wait(2);
  tx = await BridgeAddr.setBridgeFee(daiResourceId, destChain, C1Addr.address, 0, 0, true);
  await tx.wait(2);
  // tx = await BridgeAddr.setBridgeFee(routeResourceId, destChain, C2Addr.address, 0, 0, true);
  // await tx.wait(2);
  // const Handler = await hre.ethers.getContractFactory("ERC20HandlerUpgradeable");
  // const WETH9 = await hre.ethers.getContractFactory("WETH9");
  // const HandlerAddr = Handler.attach(handler[network].ERC20HandlerUpgradeable.proxy);
  // const WETHAddr = await HandlerAddr._WETH();
  // console.log(WETHAddr + " weth address");
  // const WETHInstance = WETH9.attach(WETHAddr);
  // tx = await WETHInstance.deposit({ value: "50000000000000000" });
  // await tx.wait(2);
  // tx = await WETHInstance.transfer(reserve[network].HandlerReserveUpgradeable.proxy, "50000000000000000");
  // await tx.wait(2);
  tx = await C1Addr.mint((await ethers.getSigners())[0].address, "1000000000000000000000");
  await tx.wait(2);
  // tx = await C2Addr.mint((await ethers.getSigners())[0].address, "1000000000000000000000");
  // await tx.wait(2);
  console.log(" Depositor balance = " + (await C1Addr.balanceOf((await ethers.getSigners())[0].address)).toString());
  console.log("------------------------------ Contract Configuration Ended ------------------------------");
}

newtestTokenConfigure()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
