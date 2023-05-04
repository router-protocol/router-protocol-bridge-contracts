import { ethers, getChainId } from "hardhat";
import { createResourceID } from "../test/helpers";
async function ammConfigure() {
  console.log("------------------------------ Initial Setup Started ------------------------------");

  const hre = require("hardhat");
  let deployedContracts = require("../deployment/extraToken.json");
  let testToken = require("../deployment/reserveToken.json");
  let handler = require("../deployment/ERC20HandlerUpgradeable.json");
  let bridge = require("../deployment/BridgeUpgradeable.json");
  let reserve = require("../deployment/HandlerReserveUpgradeable.json");

  const network = await hre.getChainId();
  const router = network == "42" ? "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D" : "0x136B1009Ab6324973BE63F100AED7578CC13f3Bc";
  const factory = network == "42" ? "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f" : "0x22e18D791EeE1EE7Eda4c7d6a9D435A8CA10Cf78";
  const Router = await hre.ethers.getContractAt("IUniswapV2Router02", router);
  const Factory = await hre.ethers.getContractAt("IUniswapV2Factory", factory);
  const Ctoken = await hre.ethers.getContractFactory("RouterERC20Upgradable");
  // const Bridge = await hre.ethers.getContractFactory("BridgeUpgradeable");
  // const Router = Crouter.attach(router);
  const DFYN = Ctoken.attach(deployedContracts[network].TestToken.token1);
  const ROUTE = Ctoken.attach(deployedContracts[network].TestToken.token2);
  const USDT = Ctoken.attach(testToken[network].TestToken.token1);
  // const BridgeAddr = Bridge.attach(bridge[network].BridgeUpgradeable.proxy);
  // const ETH = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

  console.log("------------------------------ Initial Setup Ended ------------------------------");

  console.log("------------------------------ Contract Configuration Started ------------------------------");

  //adding liq
  let tx = await DFYN.approve(Router.address, "500000000000000000000");
  await tx.wait(2);
  tx = await USDT.approve(Router.address, "1000000000000000000000");
  await tx.wait(2);
  tx = await USDT.mint((await ethers.getSigners())[0].address, "500000000000000000000");
  await tx.wait(2);
  tx = await ROUTE.approve(Router.address, "500000000000000000000");
  await tx.wait(2);
  tx = await Router.addLiquidity(
    DFYN.address,
    USDT.address,
    "500000000000000000000",
    "500000000000000000000",
    0,
    0,
    (await ethers.getSigners())[0].address,
    Math.floor(Date.now() / 1000) + 100
  )
  await tx.wait(2);
  tx = await Router.addLiquidity(
    ROUTE.address,
    USDT.address,
    "500000000000000000000",
    "500000000000000000000",
    0,
    0,
    (await ethers.getSigners())[0].address,
    Math.floor(Date.now() / 1000) + 100
  )
  await tx.wait(2);
  console.log("address of new pair : " + (await Factory.getPair(DFYN.address, USDT.address)).toString());
  console.log("address of new pair : " + (await Factory.getPair(ROUTE.address, USDT.address)).toString());

  console.log("------------------------------ Contract Configuration Ended ------------------------------");

}

ammConfigure()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
