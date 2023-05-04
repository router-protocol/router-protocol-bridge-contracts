import { ethers, getChainId } from "hardhat";
import { createResourceID } from "../test/helpers";
async function ammConfigure() {
  console.log("------------------------------ Initial Setup Started ------------------------------");

  const hre = require("hardhat");
  let deployedContracts = require("../deployment/extraToken.json");
  let testToken = require("../deployment/reserveToken.json");
  let stakeToken = require("../deployment/newTestToken.json");
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
  const USDC = Ctoken.attach(testToken[network].TestToken.token2);
  const DAI = Ctoken.attach(stakeToken[network].TestToken.newtoken);
  // const BridgeAddr = Bridge.attach(bridge[network].BridgeUpgradeable.proxy);
  // const ETH = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

  console.log("------------------------------ Initial Setup Ended ------------------------------");

  console.log("------------------------------ Contract Configuration Started ------------------------------");

  //approvals to router
  // let tx = await DFYN.approve(Router.address, "10000000000000000000000000");
  // await tx.wait(2);
  // tx = await ROUTE.approve(Router.address, "10000000000000000000000000");
  // await tx.wait(2);
  // tx = await USDT.approve(Router.address, "10000000000000000000000000");
  // await tx.wait(2);
  // tx = await USDC.approve(Router.address, "10000000000000000000000000");
  // await tx.wait(2);
  // tx = await DAI.approve(Router.address, "10000000000000000000000000");
  // await tx.wait(2);
  // //minting
  // tx = await DFYN.mint(, "1500000000000000000000");
  // await tx.wait(2);
  // tx = await ROUTE.mint((await ethers.getSigners())[0].address, "1500000000000000000000");
  // await tx.wait(2);
  let tx = await USDT.mint("0x07548c2Dad52662AAa9F2090A1b38F57dAFc82A9", "5000000000000000000000");
  await tx.wait(2);
  tx = await USDC.mint("0x07548c2Dad52662AAa9F2090A1b38F57dAFc82A9", "5000000000000000000000");
  await tx.wait(2);
  // tx = await DAI.mint((await ethers.getSigners())[0].address, "1000000000000000000000");
  // await tx.wait(2);

  //with USDT
  // tx = await Router.addLiquidityETH(
  //   DFYN.address,
  //   "1500000000000000000000",
  //   0,
  //   0,
  //   (await ethers.getSigners())[0].address,
  //   Math.floor(Date.now() / 1000) + 100,
  //   {value : "500000000000000000"}
  // )
  // await tx.wait(2);
  // tx = await Router.addLiquidityETH(
  //   ROUTE.address,
  //   "1500000000000000000000",
  //   0,
  //   0,
  //   (await ethers.getSigners())[0].address,
  //   Math.floor(Date.now() / 1000) + 100,
  //   {value : "500000000000000000"}
  // )
  // await tx.wait(2);

  // //with USDC
  // tx = await Router.addLiquidityETH(
  //   USDC.address,
  //   "1000000000000000000000",
  //   0,
  //   0,
  //   (await ethers.getSigners())[0].address,
  //   Math.floor(Date.now() / 1000) + 100,
  //   {value : "500000000000000000"}
  // )
  // await tx.wait(2);
  // tx = await Router.addLiquidityETH(
  //   USDT.address,
  //   "1000000000000000000000",
  //   0,
  //   0,
  //   (await ethers.getSigners())[0].address,
  //   Math.floor(Date.now() / 1000) + 100,
  //   {value : "500000000000000000"}
  // )
  // await tx.wait(2);

  // //with DAI
  // tx = await Router.addLiquidityETH(
  //   DAI.address,
  //   "1000000000000000000000",
  //   0,
  //   0,
  //   (await ethers.getSigners())[0].address,
  //   Math.floor(Date.now() / 1000) + 100,
  //   {value : "500000000000000000"}
  // )
  // await tx.wait(2);
  // tx = await Router.addLiquidity(
  //   ROUTE.address,
  //   DAI.address,
  //   "500000000000000000000",
  //   "500000000000000000000",
  //   0,
  //   0,
  //   (await ethers.getSigners())[0].address,
  //   Math.floor(Date.now() / 1000) + 100
  // )
  // await tx.wait(2);

  // console.log("address of new pair : " + (await Factory.getPair(DFYN.address, DAI.address)).toString());
  // console.log("address of new pair : " + (await Factory.getPair(ROUTE.address, DAI.address)).toString());

  console.log("------------------------------ Contract Configuration Ended ------------------------------");

}

ammConfigure()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
