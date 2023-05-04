import { expect } from "chai";
import { ethers, getChainId, network, upgrades } from "hardhat";
import { createResourceID, createERCDepositData, delay } from "../test/helpers";
import {
  BridgeUpgradeable,
  RouterERC20Upgradable,
  ERC20HandlerUpgradeable,
  WETH9,
  VoterUpgradeable,
  FeeManagerUpgradeable,
  HandlerReserveUpgradeable,
} from "../typechain";
import { SignerWithAddress } from "hardhat-deploy-ethers/dist/src/signers";
import { constants } from "ethers";
let newtestTokenDeployed = require("../deployment/newTestToken.json");
let reserve = require("../deployment/HandlerReserveUpgradeable.json");
let bridgeDeployed = require("../deployment/BridgeUpgradeable.json");
let handlerDeployed = require("../deployment/ERC20HandlerUpgradeable.json");

async function testScript() {
  // const originChainID = 1;
  // const ETH = "0xc944E90C64B2c07662A292be6244BDf05Cda44a7"; //Random address for ETH
  // let originRelayer1Address: SignerWithAddress;
  // let originRelayer2Address: SignerWithAddress;

  // const destinationChainID = 2;
  // let destinationRelayer1Address: SignerWithAddress;
  // let destinationRelayer2Address: SignerWithAddress;
  // const network = await getChainId();
  const ETH = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  const maticETH = "0x0000000000000000000000000000000000001010";
  let depositerAddress: SignerWithAddress;
  let recipientAddress: SignerWithAddress;
  // let feeSetter: SignerWithAddress;
  // const quorum = 6000;
  // const initialTokenAmount = 100;
  const depositAmount = 1000;
  // const expectedDepositNonce = 1;
  // const originTokenTransferFee = 1;
  // const originTokenExchangeFee = 2;
  // const destinationTokenTransferFee = 1;
  // const destinationTokenExchangeFee = 2;
  // const ETHTransferFee = ethers.utils.parseUnits("1.0");
  // const ETHExchangeFee = ethers.utils.parseUnits("2.0");

  // let WETH: WETH9;
  // let OriginHandlerReserveInstance: HandlerReserveUpgradeable;
  // let DestinationHandlerReserveInstance: HandlerReserveUpgradeable;
  // let OriginFeeManagerInstance: FeeManagerUpgradeable;
  // let DestinationFeeManagerInstance: FeeManagerUpgradeable;
  // let OriginVoterInstance: VoterUpgradeable;
  // let DestinationVoterInstance: VoterUpgradeable;
  let OriginBridgeInstance: BridgeUpgradeable;
  let OriginERC20MintableInstance: RouterERC20Upgradable;
  let HandlerInstance: ERC20HandlerUpgradeable;
  // let OriginERC20HandlerInstance: ERC20HandlerUpgradeable;
  let originDepositData: string;
  // let originDepositProposalData: string;
  // let originDepositProposalDataHash: string;
  let originResourceID: string;
  // let originInitialResourceIDs: string[];
  // let originInitialContractAddresses;
  // let originBurnableContractAddresses;

  // let DestinationBridgeInstance: BridgeUpgradeable;
  // let DestinationERC20MintableInstance: RouterERC20Upgradable;
  // let DestinationERC20HandlerInstance: ERC20HandlerUpgradeable;
  // let destinationDepositData: string;
  // let destinationDepositProposalData: string;
  // let destinationDepositProposalDataHash: string;
  // let destinationResourceID: string;
  // let destinationInitialResourceIDs: string[];
  // let destinationInitialContractAddresses;
  // let destinationBurnableContractAddresses;
  // // beforeEach(async () => {
    const accounts = await ethers.getSigners();

  //   originRelayer1Address = accounts[3];
  //   originRelayer2Address = accounts[4];
  //   destinationRelayer1Address = accounts[3];
  //   destinationRelayer2Address = accounts[4];
    depositerAddress = accounts[0];
    recipientAddress = accounts[0];
  //   feeSetter = accounts[5];

  //   const ERC20Contract = await ethers.getContractFactory("WETH9");
  //   WETH = (await ERC20Contract.deploy()) as WETH9;

  //   const VoterContract = await ethers.getContractFactory("VoterUpgradeable");
  //   OriginVoterInstance = (await upgrades.deployProxy(VoterContract, [], { kind: "uups" })) as VoterUpgradeable;
  //   DestinationVoterInstance = (await upgrades.deployProxy(VoterContract, [], { kind: "uups" })) as VoterUpgradeable;

    const BridgeContract = await ethers.getContractFactory("BridgeUpgradeable");
    const HandlerContract = await ethers.getContractFactory("ERC20HandlerUpgradeable");
    // OriginBridgeInstance = (await BridgeContract.attach("0x3ad99fc01a317dDa27221737EB479a3B651d4dfd")) as BridgeUpgradeable;
    OriginBridgeInstance = (await BridgeContract.attach((bridgeDeployed[await getChainId()]).BridgeUpgradeable.proxy)) as BridgeUpgradeable;
    HandlerInstance = (await HandlerContract.attach((handlerDeployed[await getChainId()]).ERC20HandlerUpgradeable.proxy)) as ERC20HandlerUpgradeable;

    // DestinationBridgeInstance = (await upgrades.deployProxy(
    //   BridgeContract,
    //   [
    //     destinationChainID,
    //     quorum,
    //     5, //expiry
    //     DestinationVoterInstance.address,
    //   ],
    //   { kind: "uups" },
    // )) as BridgeUpgradeable;

    // await OriginVoterInstance.grantRole(await OriginVoterInstance.BRIDGE_ROLE(), OriginBridgeInstance.address);
    // await DestinationVoterInstance.grantRole(
    //   await DestinationVoterInstance.BRIDGE_ROLE(),
    //   DestinationBridgeInstance.address,
    // );
    // const ERC20MintPause = await ethers.getContractFactory("RouterERC20Upgradable");
    // OriginERC20MintableInstance = (await ERC20MintPause.attach((newtestTokenDeployed[await getChainId()]).TestToken.newtoken)) as RouterERC20Upgradable;
    // DestinationERC20MintableInstance = (await upgrades.deployProxy(
    //   ERC20MintPause,
    //   ["token", "TOK", 18],
    //   // { kind: "uups" }
    // )) as RouterERC20Upgradable;

    originResourceID = createResourceID(maticETH, 0);
    console.log(originResourceID);
    // originInitialResourceIDs = [originResourceID];
    // originInitialContractAddresses = [OriginERC20MintableInstance.address];
    // originBurnableContractAddresses = [OriginERC20MintableInstance.address];

    // destinationResourceID = createResourceID(DestinationERC20MintableInstance.address, originChainID);
    // destinationInitialResourceIDs = [destinationResourceID];
    // destinationInitialContractAddresses = [DestinationERC20MintableInstance.address];
    // destinationBurnableContractAddresses = [DestinationERC20MintableInstance.address];

    // const ERC20HandlerContract = await ethers.getContractFactory("ERC20HandlerUpgradeable");
    // // TODO: WETH and ETH address for testing
    // //For now using random addresses
    // OriginERC20HandlerInstance = (await upgrades.deployProxy(
    //   ERC20HandlerContract,
    //   [
    //     OriginBridgeInstance.address,
    //     ETH,
    //     WETH.address,
    //     originInitialResourceIDs,
    //     originInitialContractAddresses,
    //     originBurnableContractAddresses,
    //   ],
    //   // { kind: "uups" }
    // )) as ERC20HandlerUpgradeable;

    // DestinationERC20HandlerInstance = (await upgrades.deployProxy(
    //   ERC20HandlerContract,
    //   [
    //     DestinationBridgeInstance.address,
    //     ETH,
    //     WETH.address,
    //     destinationInitialResourceIDs,
    //     destinationInitialContractAddresses,
    //     destinationBurnableContractAddresses,
    //   ],
    //   // { kind: "uups" }
    // )) as ERC20HandlerUpgradeable;

    // const HandlerReserve = await ethers.getContractFactory("HandlerReserveUpgradeable");
    // OriginHandlerReserveInstance = (await upgrades.deployProxy(HandlerReserve, [
    //   OriginERC20HandlerInstance.address,
    // ])) as HandlerReserveUpgradeable;
    // DestinationHandlerReserveInstance = (await upgrades.deployProxy(HandlerReserve, [
    //   DestinationERC20HandlerInstance.address,
    // ])) as HandlerReserveUpgradeable;

    // await OriginERC20HandlerInstance.setReserve(OriginHandlerReserveInstance.address);
    // await DestinationERC20HandlerInstance.setReserve(DestinationHandlerReserveInstance.address);

    // const FeeManagerContract = await ethers.getContractFactory("FeeManagerUpgradeable");
    // OriginFeeManagerInstance = (await upgrades.deployProxy(FeeManagerContract, [
    //   OriginERC20HandlerInstance.address,
    // ])) as FeeManagerUpgradeable;
    // await OriginERC20HandlerInstance.setFeeManager(OriginFeeManagerInstance.address);

    // DestinationFeeManagerInstance = (await upgrades.deployProxy(FeeManagerContract, [
    //   DestinationERC20HandlerInstance.address,
    // ])) as FeeManagerUpgradeable;
    // await DestinationERC20HandlerInstance.setFeeManager(DestinationFeeManagerInstance.address);

    // await OriginERC20MintableInstance.mint(depositerAddress.address, initialTokenAmount);
    // await OriginERC20MintableInstance.grantRole(
    //   await OriginERC20MintableInstance.BURNER_ROLE(),
    //   OriginHandlerReserveInstance.address,
    // );
    // await DestinationERC20MintableInstance.grantRole(
    //   await DestinationERC20MintableInstance.BURNER_ROLE(),
    //   DestinationHandlerReserveInstance.address,
    // );

    // await OriginERC20MintableInstance.connect(depositerAddress).approve(
    //   // OriginERC20HandlerInstance.address,
    //   OriginHandlerReserveInstance.address,
    //   depositAmount,
    // );
    // await OriginERC20MintableInstance.grantRole(
    //   await OriginERC20MintableInstance.MINTER_ROLE(),
    //   OriginHandlerReserveInstance.address,
    // );
    // await DestinationERC20MintableInstance.grantRole(
    //   await DestinationERC20MintableInstance.MINTER_ROLE(),
    //   DestinationHandlerReserveInstance.address,
    // );

    // await OriginERC20HandlerInstance.grantRole(
    //   await OriginERC20HandlerInstance.BRIDGE_ROLE(),
    //   OriginBridgeInstance.address,
    // );
    // await DestinationERC20HandlerInstance.grantRole(
    //   await DestinationERC20HandlerInstance.BRIDGE_ROLE(),
    //   DestinationBridgeInstance.address,
    // );
    // await OriginERC20HandlerInstance.grantRole(
    //   await DestinationERC20HandlerInstance.BRIDGE_ROLE(),
    //   DestinationBridgeInstance.address,
    // );
    // await DestinationERC20HandlerInstance.grantRole(
    //   await OriginERC20HandlerInstance.BRIDGE_ROLE(),
    //   OriginBridgeInstance.address,
    // );

    // await OriginBridgeInstance.adminSetResource(
    //   OriginERC20HandlerInstance.address,
    //   originResourceID,
    //   OriginERC20MintableInstance.address,
    // );
    // await OriginBridgeInstance.adminSetResource(
    //   DestinationERC20HandlerInstance.address,
    //   destinationResourceID,
    //   DestinationERC20MintableInstance.address,
    // );
    // await DestinationBridgeInstance.adminSetResource(
    //   DestinationERC20HandlerInstance.address,
    //   destinationResourceID,
    //   DestinationERC20MintableInstance.address,
    // );
    // await DestinationBridgeInstance.adminSetResource(
    //   OriginERC20HandlerInstance.address,
    //   originResourceID,
    //   OriginERC20MintableInstance.address,
    // );

    // originDepositData = createERCDepositData(
    //   depositAmount,
    //   depositAmount,
    //   depositAmount,
    //   depositAmount,
    //   20,
    //   20,
    //   20,
    //   20,
    //   recipientAddress.address,
    //   ETH,
    //   maticETH,
    //   maticETH,
    //   // testTokenDeployed["2"].TestToken.proxy,
    //   // testTokenDeployed["2"].TestToken.proxy,
    // );
    // originDepositProposalData = createERCDepositData(
    //   depositAmount,
    //   20,
    //   20,
    //   depositAmount,
    //   20,
    //   20,
    //   20,
    //   20,
    //   recipientAddress.address,
    //   OriginERC20MintableInstance.address,
    //   DestinationERC20MintableInstance.address,
    //   DestinationERC20MintableInstance.address,
    // );
    // originDepositProposalDataHash = ethers.utils.keccak256(
    //   DestinationERC20HandlerInstance.address + originDepositProposalData.substr(2),
    // );

    // destinationDepositData = createERCDepositData(
    //   depositAmount - destinationTokenTransferFee,
    //   depositAmount - destinationTokenTransferFee,
    //   depositAmount - destinationTokenTransferFee,
    //   depositAmount - destinationTokenTransferFee,
    //   20,
    //   20,
    //   20,
    //   20,
    //   depositerAddress.address,
    //   DestinationERC20MintableInstance.address,
    //   OriginERC20MintableInstance.address,
    //   OriginERC20MintableInstance.address,
    // );
    // destinationDepositProposalData = createERCDepositData(
    //   depositAmount - destinationTokenTransferFee,
    //   depositAmount - destinationTokenTransferFee,
    //   depositAmount - destinationTokenTransferFee,
    //   depositAmount - destinationTokenTransferFee,
    //   20,
    //   20,
    //   20,
    //   20,
    //   depositerAddress.address,
    //   DestinationERC20MintableInstance.address,
    //   OriginERC20MintableInstance.address,
    //   OriginERC20MintableInstance.address,
    // );
    // destinationDepositProposalDataHash = ethers.utils.keccak256(
    //   OriginERC20HandlerInstance.address + destinationDepositProposalData.substr(2),
    // );

    // //Turn on the Fee
    // await OriginBridgeInstance.adminSetFeeStatus(originResourceID, true);
    // await DestinationBridgeInstance.adminSetFeeStatus(destinationResourceID, true);

    // //Add Fee setter
    // await OriginBridgeInstance.adminAddFeeSetter(originResourceID, feeSetter.address);
    // await DestinationBridgeInstance.adminAddFeeSetter(destinationResourceID, feeSetter.address);

    // //Set Fee
    // await OriginBridgeInstance.connect(feeSetter).setBridgeFee(
    //   originResourceID,
    //   destinationChainID,
    //   ETH,
    //   ETHTransferFee,
    //   ETHExchangeFee,
    //   true,
    // );

    // await OriginBridgeInstance.connect(feeSetter).setBridgeFee(
    //   originResourceID,
    //   destinationChainID,
    //   OriginERC20MintableInstance.address,
    //   originTokenTransferFee,
    //   originTokenExchangeFee,
    //   true,
    // );

    // await DestinationBridgeInstance.connect(feeSetter).setBridgeFee(
    //   destinationResourceID,
    //   originChainID,
    //   DestinationERC20MintableInstance.address,
    //   destinationTokenTransferFee,
    //   destinationTokenExchangeFee,
    //   true,
    // );

    // await DestinationBridgeInstance.connect(feeSetter).setBridgeFee(
    //   destinationResourceID,
    //   originChainID,
    //   ETH,
    //   ETHTransferFee,
    //   ETHExchangeFee,
    //   true,
    // );

    // //Whitelisting
    // await OriginBridgeInstance.setWhitelisting(true);
    // await DestinationBridgeInstance.setWhitelisting(true);
    // await OriginBridgeInstance.addToWhitelist(depositerAddress.address);
    // await DestinationBridgeInstance.addToWhitelist(recipientAddress.address);

    // //Add Relayers
    // await OriginBridgeInstance.grantRole(await OriginBridgeInstance.RELAYER_ROLE(), originRelayer1Address.address);
    // await OriginBridgeInstance.grantRole(await OriginBridgeInstance.RELAYER_ROLE(), originRelayer2Address.address);
    // await DestinationBridgeInstance.grantRole(
    //   await DestinationBridgeInstance.RELAYER_ROLE(),
    //   destinationRelayer1Address.address,
    // );
    // await DestinationBridgeInstance.grantRole(
    //   await DestinationBridgeInstance.RELAYER_ROLE(),
    //   destinationRelayer2Address.address,
    // );


    // depositerAddress makes initial deposit of depositAmount
    //APPROVAL
    // let tx = await OriginERC20MintableInstance.approve(reserve[await getChainId()].HandlerReserveUpgradeable.proxy, "1000000000000000000000");
    // await tx.wait(2);
    // await OriginBridgeInstance.connect(depositerAddress).depositETH(
    //   2,
    //   originResourceID,
    //   originDepositData,
    //   //data below is random
    //   [0],
    //   [0],
    //   [depositerAddress.address],
    //   ETH, //Fee token
    //   {value : depositAmount}
    // );

    let tx = await OriginBridgeInstance.adminSetLiquidityPool(
      "RMATIC",
      "RMATIC",
      18,
      HandlerInstance.address,
      maticETH,
      constants.AddressZero,
    );
    await tx.wait(2);

    //Stake from depositor address
    tx = await OriginBridgeInstance.connect(depositerAddress).stakeETH(
      originResourceID,
      maticETH,
      "10000",
      {
        value: "10000"
      }
    );
    await tx.wait(2);
    // const recipientBalance = await ethers.provider.getBalance(depositerAddress.address);
    // console.log(recipientBalance.toString());
    // console.log((await OriginERC20MintableInstance.balanceOf(depositerAddress.address)).toString());

}

testScript()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
