import { task } from "hardhat/config";
// import { recordAllDeployments, IBridgeConfig, IDeployment } from "../utils";
import fs from "fs";
import { TaskArguments } from "hardhat/types";
import { BRIDGE_CONFIG } from "../constants";
// import { count } from "console";

task("deploy:Token")
  .addParam("name", "Name of the Token")
  .addParam("symbol", "Symbol of the Token")
  .addParam("decimal", "Decimal of the Token")
  .addOptionalParam("chainAdd", "Address of asset on chain for R assets eg USDC add for RUSDC")
  .addOptionalParam("rid", "Resource Id for the token")
  .setAction(async function (_taskArguments: TaskArguments, hre) {
    const storePath = "deployment/config/tokenDeployments.json";
    const tokenStorage = JSON.parse(fs.readFileSync(storePath, "utf-8"));
    const network = await hre.getChainId();
    const deployContract = "RouterERC20UpgradableToken";

    console.log("Contract Deployment Started ");

    const C1 = await hre.ethers.getContractFactory(deployContract);
    const c1Proxy = await hre.upgrades.deployProxy(C1, [
      _taskArguments.name,
      _taskArguments.symbol,
      _taskArguments.decimal,
    ]);

    console.log(c1Proxy);
    console.log(deployContract + " Proxy Contract deployed to: ", c1Proxy.address);
    await c1Proxy.deployed();
    const implementationAddr = await hre.upgrades.erc1967.getImplementationAddress(c1Proxy.address);
    console.log(deployContract + " Implementation Contract deployed to: ", implementationAddr);

    console.log("Contract Deployment Ended ");

    console.log("Deployment Storage Started ");

    if (!tokenStorage[network]) {
      tokenStorage[network] = [];
    }

    tokenStorage[network][tokenStorage[network].length] = {
      name: _taskArguments.name,
      symbol: _taskArguments.symbol,
      rid: _taskArguments.rid ? _taskArguments.rid : "",
      chainAdd: _taskArguments.actualAddress ? _taskArguments.actualAddress : c1Proxy.address,
      decimal: _taskArguments.decimal,
      alreadySet: false,
      proxy: c1Proxy.address,
      implementation: implementationAddr,
      creationTime: Date.now(),
      updatedTime: [Date.now()],
    };
    fs.writeFileSync(storePath, JSON.stringify(tokenStorage));
    console.log("Deployment Storage Ended ");

    console.log("Contract Deployment Ended ");
    console.log(`${_taskArguments.name} token deployed on chain with chainId ${network}`);
  });

task("deploy:MultipleTokens")
  .addOptionalParam("filePath", "Path of JSON file")
  .setAction(async function (_taskArguments: TaskArguments, hre) {
    const filePath = _taskArguments.filePath || "deployment/config/tokensToDeploy.json";
    const storePath = "deployment/config/tokenDeployments.json";
    const deployContract = "RouterERC20UpgradableToken";
    const C1 = await hre.ethers.getContractFactory(deployContract);
    const tokenData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const tokenStorage = JSON.parse(fs.readFileSync(storePath, "utf-8"));
    const network = await hre.getChainId();

    let counter = 0;

    console.log("Contract Deployment Started ");
    for (const data of tokenData[network]) {
      if (data.alreadySet) {
        counter++;
        continue;
      }
      console.log(data);
      const c1Proxy = await hre.upgrades.deployProxy(C1, [data.name, data.symbol, data.decimal]);

      console.log(c1Proxy);
      console.log(deployContract + " Proxy Contract deployed to: ", c1Proxy.address);
      await c1Proxy.deployed();
      const implementationAddr = await hre.upgrades.erc1967.getImplementationAddress(c1Proxy.address);
      console.log(deployContract + " Implementation Contract deployed to: ", implementationAddr);

      console.log("Deployment Storage Started ");

      tokenData[network][counter].alreadySet = true;
      fs.writeFileSync(filePath, JSON.stringify(tokenData));

      tokenStorage[network][tokenStorage[network].length] = {
        ...data,
        chainAdd: data.chainAdd != "" ? data.chainAdd : c1Proxy.address,
        alreadySet: data.symbol == "ROUTE" || data.symbol == "DFYN" ? true : false,
        proxy: c1Proxy.address,
        implementation: implementationAddr,
        creationTime: Date.now(),
        updatedTime: [Date.now()],
      };
      fs.writeFileSync(storePath, JSON.stringify(tokenStorage));
      console.log("Deployment Storage Ended ");

      counter++;
    }
    console.log("Contract Deployment Ended ");
    console.log(`${counter} tokens deployed on chain with chainId ${network}`);
  });
