// import { expect } from "chai";
// import { ethers, upgrades } from "hardhat";
// import { createResourceID, createERCDepositData, delay } from "../../helpers";
// import {
//   BridgeUpgradeable,
//   RouterERC20Upgradable,
//   ERC20HandlerUpgradeable,
//   WETH9,
//   VoterUpgradeable,
//   FeeManagerUpgradeable,
//   HandlerReserveUpgradeable,
// } from "../../../typechain";
// import { SignerWithAddress } from "hardhat-deploy-ethers/dist/src/signers";
//
// describe("E2E ERC20 - Same Chain", () => {
//   const chainID = 1;
//   const ETH = "0xc944E90C64B2c07662A292be6244BDf05Cda44a7"; //Random address for ETH
//
//   let depositerAddress: SignerWithAddress;
//   let recipientAddress: SignerWithAddress;
//   let relayer1Address: SignerWithAddress;
//   let relayer2Address: SignerWithAddress;
//   let feeSetter: SignerWithAddress;
//
//   const quorum = 6000;
//   const initialTokenAmount = 100;
//   const depositAmount = 10;
//   const expectedDepositNonce = 1;
//   const tokenTransferFee = 1;
//   const tokenExchangeFee = 2;
//   const ETHTransferFee = ethers.utils.parseUnits("1.0");
//   const ETHExchangeFee = ethers.utils.parseUnits("2.0");
//
//   let WETH: WETH9;
//   let HandlerReserveInstance: HandlerReserveUpgradeable;
//   let FeeManagerInstance: FeeManagerUpgradeable;
//   let VoterInstance: VoterUpgradeable;
//   let BridgeInstance: BridgeUpgradeable;
//   let ERC20MintableInstance: RouterERC20Upgradable;
//   let ERC20HandlerInstance: ERC20HandlerUpgradeable;
//
//   let resourceID: string;
//   let depositData: string;
//   let depositProposalData: string;
//   let depositProposalDataHash: string;
//   let initialResourceIDs;
//   let initialContractAddresses;
//   let burnableContractAddresses: string[];
//
//   beforeEach(async () => {
//     const accounts = await ethers.getSigners();
//
//     depositerAddress = accounts[1];
//     recipientAddress = accounts[2];
//     relayer1Address = accounts[3];
//     relayer2Address = accounts[4];
//     feeSetter = accounts[5];
//
//     const ERC20Contract = await ethers.getContractFactory("WETH9");
//     WETH = (await ERC20Contract.deploy()) as WETH9;
//
//     const VoterContract = await ethers.getContractFactory("VoterUpgradeable");
//     VoterInstance = (await upgrades.deployProxy(VoterContract, [], { kind: "uups" })) as VoterUpgradeable;
//
//     const BridgeContract = await ethers.getContractFactory("BridgeUpgradeable");
//     BridgeInstance = (await upgrades.deployProxy(BridgeContract, [
//       chainID,
//       quorum,
//       5, //expiry
//       VoterInstance.address,
//     ])) as BridgeUpgradeable;
//
//     await VoterInstance.grantRole(await VoterInstance.BRIDGE_ROLE(), BridgeInstance.address);
//
//     const ERC20MintableContract = await ethers.getContractFactory("RouterERC20Upgradable");
//     ERC20MintableInstance = (await upgrades.deployProxy(ERC20MintableContract, [
//       "token",
//       "TOK",
//       18,
//     ])) as RouterERC20Upgradable;
//     resourceID = createResourceID(ERC20MintableInstance.address, chainID);
//
//     initialResourceIDs = [resourceID];
//     initialContractAddresses = [ERC20MintableInstance.address];
//     burnableContractAddresses = [];
//
//     const ERC20HandlerContract = await ethers.getContractFactory("ERC20HandlerUpgradeable");
//     ERC20HandlerInstance = (await upgrades.deployProxy(ERC20HandlerContract, [
//       BridgeInstance.address,
//       ETH,
//       WETH.address,
//       initialResourceIDs,
//       initialContractAddresses,
//       burnableContractAddresses,
//     ])) as ERC20HandlerUpgradeable;
//
//     const HandlerReserve = await ethers.getContractFactory("HandlerReserveUpgradeable");
//     HandlerReserveInstance = (await upgrades.deployProxy(HandlerReserve, [
//       ERC20HandlerInstance.address,
//     ])) as HandlerReserveUpgradeable;
//
//     await ERC20HandlerInstance.setReserve(HandlerReserveInstance.address);
//
//     const FeeManagerContract = await ethers.getContractFactory("FeeManagerUpgradeable");
//     FeeManagerInstance = (await upgrades.deployProxy(FeeManagerContract, [
//       ERC20HandlerInstance.address,
//     ])) as FeeManagerUpgradeable;
//
//     await ERC20HandlerInstance.grantRole(await ERC20HandlerInstance.BRIDGE_ROLE(), BridgeInstance.address);
//     await ERC20HandlerInstance.setFeeManager(FeeManagerInstance.address);
//
//     await ERC20MintableInstance.mint(depositerAddress.address, initialTokenAmount);
//     await BridgeInstance.adminSetResource(ERC20HandlerInstance.address, resourceID, ERC20MintableInstance.address);
//
//     await ERC20MintableInstance.connect(depositerAddress).approve(
//       HandlerReserveInstance.address,
//       depositAmount + tokenTransferFee,
//     );
//
//     depositData = createERCDepositData(
//       depositAmount,
//       depositAmount,
//       depositAmount,
//       depositAmount,
//       20,
//       20,
//       20,
//       20,
//       recipientAddress.address,
//       ERC20MintableInstance.address,
//       ERC20MintableInstance.address,
//       ERC20MintableInstance.address,
//     );
//
//     depositProposalData = createERCDepositData(
//       depositAmount,
//       depositAmount,
//       depositAmount,
//       depositAmount,
//       20,
//       20,
//       20,
//       20,
//       recipientAddress.address,
//       ERC20MintableInstance.address,
//       ERC20MintableInstance.address,
//       ERC20MintableInstance.address,
//     );
//     depositProposalDataHash = ethers.utils.keccak256(ERC20HandlerInstance.address + depositProposalData.substr(2));
//
//     //Turn on the Fee
//     await BridgeInstance.adminSetFeeStatus(resourceID, true);
//
//     //Add Fee setter
//     await BridgeInstance.adminAddFeeSetter(resourceID, feeSetter.address);
//
//     //Set Fee
//     await BridgeInstance.connect(feeSetter).setBridgeFee(
//       resourceID,
//       chainID,
//       ERC20MintableInstance.address,
//       tokenTransferFee,
//       tokenExchangeFee,
//       true,
//     );
//
//     await BridgeInstance.connect(feeSetter).setBridgeFee(
//       resourceID,
//       chainID,
//       ETH,
//       ETHTransferFee,
//       ETHExchangeFee,
//       true,
//     );
//
//     //Whitelisting
//     await BridgeInstance.setWhitelisting(true);
//     await BridgeInstance.addToWhitelist(depositerAddress.address);
//
//     //Add Relayers
//     await BridgeInstance.grantRole(await BridgeInstance.RELAYER_ROLE(), relayer1Address.address);
//     await BridgeInstance.grantRole(await BridgeInstance.RELAYER_ROLE(), relayer2Address.address);
//   });
//
//   it("[sanity] depositerAddress' balance should be equal to initialTokenAmount", async () => {
//     const depositerBalance = await ERC20MintableInstance.balanceOf(depositerAddress.address);
//     expect(depositerBalance.toNumber()).to.be.equal(initialTokenAmount);
//   });
//
//   it("[sanity] HandlerReserveInstance.address should have an allowance of depositAmount from depositerAddress", async () => {
//     const handlerAllowance = await ERC20MintableInstance.allowance(
//       depositerAddress.address,
//       HandlerReserveInstance.address,
//     );
//     expect(handlerAllowance.toNumber()).to.be.equal(depositAmount + tokenTransferFee);
//   });
//
//   it("E2E: depositAmount of Destination ERC20 should be transferred to recipientAddress (Fee in ERC20)", async () => {
//     // depositerAddress makes initial deposit of depositAmount
//     await BridgeInstance.connect(depositerAddress).deposit(
//       chainID,
//       resourceID,
//       depositData,
//       //data below is random
//       [0],
//       [0],
//       [depositerAddress.address],
//       ERC20MintableInstance.address, //Fee token
//     );
//
//     // Handler Reserve should have a balance of depositAmount
//     const handlerBalance = await ERC20MintableInstance.balanceOf(HandlerReserveInstance.address);
//     expect(handlerBalance.toNumber()).to.be.equal(depositAmount);
//
//     // relayer1 creates the deposit proposal
//     await BridgeInstance.connect(relayer1Address).voteProposal(
//       chainID,
//       expectedDepositNonce,
//       resourceID,
//       depositProposalDataHash,
//     );
//
//     // relayer2 votes in favor of the deposit proposal
//     await BridgeInstance.connect(relayer2Address).voteProposal(
//       chainID,
//       expectedDepositNonce,
//       resourceID,
//       depositProposalDataHash,
//     );
//
//     await delay(700);
//
//     // relayer2 votes after expiry
//     // because the proposal has expired so the deposit will go
//     // into a finalized state
//     await BridgeInstance.connect(relayer2Address).voteProposal(
//       chainID,
//       expectedDepositNonce,
//       resourceID,
//       depositProposalDataHash,
//     );
//
//     // relayer1 will execute the deposit proposal
//     await BridgeInstance.connect(relayer2Address).executeProposal(
//       chainID,
//       expectedDepositNonce,
//       depositProposalData,
//       resourceID,
//       //data below is random
//       [0],
//       [0],
//       [relayer2Address.address],
//     );
//
//     // Assert ERC20 balance was transferred from depositerAddress
//     const depositerBalance = await ERC20MintableInstance.balanceOf(depositerAddress.address);
//     expect(depositerBalance.toNumber()).to.be.equal(initialTokenAmount - depositAmount - tokenTransferFee);
//
//     // Assert ERC20 balance was transferred to recipientAddress
//     const recipientBalance = await ERC20MintableInstance.balanceOf(recipientAddress.address);
//     expect(recipientBalance.toNumber()).to.be.equal(depositAmount);
//   });
//
//   it("E2E: depositAmount of Destination ERC20 should be transferred to recipientAddress (Fee in ETH)", async () => {
//     // depositerAddress makes initial deposit of depositAmount
//     await BridgeInstance.connect(depositerAddress).deposit(
//       chainID,
//       resourceID,
//       depositData,
//       //data below is random
//       [0],
//       [0],
//       [depositerAddress.address],
//       ETH, //Fee token
//       { value: ETHTransferFee },
//     );
//
//     const bridgeWethBal = await WETH.balanceOf(BridgeInstance.address);
//     expect(bridgeWethBal.toString()).to.be.equal(ETHTransferFee.toString(), "Fees was not transferred");
//
//     // Handler Reserve should have a balance of depositAmount
//     const handlerBalance = await ERC20MintableInstance.balanceOf(HandlerReserveInstance.address);
//     expect(handlerBalance.toNumber()).to.be.equal(depositAmount);
//
//     // relayer1 creates the deposit proposal
//     await BridgeInstance.connect(relayer1Address).voteProposal(
//       chainID,
//       expectedDepositNonce,
//       resourceID,
//       depositProposalDataHash,
//     );
//
//     // relayer2 votes in favor of the deposit proposal
//     await BridgeInstance.connect(relayer2Address).voteProposal(
//       chainID,
//       expectedDepositNonce,
//       resourceID,
//       depositProposalDataHash,
//     );
//
//     await delay(700);
//
//     // relayer2 votes after expiry
//     // because the proposal has expired so the deposit will go
//     // into a finalized state
//     await BridgeInstance.connect(relayer2Address).voteProposal(
//       chainID,
//       expectedDepositNonce,
//       resourceID,
//       depositProposalDataHash,
//     );
//
//     // relayer1 will execute the deposit proposal
//     await BridgeInstance.connect(relayer2Address).executeProposal(
//       chainID,
//       expectedDepositNonce,
//       depositProposalData,
//       resourceID,
//       //data below is random
//       [0],
//       [0],
//       [relayer2Address.address],
//     );
//
//     // Assert ERC20 balance was transferred from depositerAddress
//     const depositerBalance = await ERC20MintableInstance.balanceOf(depositerAddress.address);
//     expect(depositerBalance.toNumber()).to.be.equal(initialTokenAmount - depositAmount);
//
//     //Assert ERC20 balance was transferred to recipientAddress
//     const recipientBalance = await ERC20MintableInstance.balanceOf(recipientAddress.address);
//     expect(recipientBalance.toNumber()).to.be.equal(depositAmount);
//   });
// });
