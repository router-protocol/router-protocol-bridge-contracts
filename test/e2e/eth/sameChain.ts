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
// describe("E2E ETH - Same Chain", () => {
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
//   const initialTokenAmount = 10000;
//   const depositAmount = 10000000;
//   const expectedDepositNonce = 1;
//   const tokenTransferFee = 1;
//   const tokenExchangeFee = 2;
//   const ETHTransferFee = 1000;
//   const ETHExchangeFee = 2000;
//
//   let WETH: WETH9;
//   let HandlerReserveInstance: HandlerReserveUpgradeable;
//   let FeeManagerInstance: FeeManagerUpgradeable;
//   let VoterInstance: VoterUpgradeable;
//   let BridgeInstance: BridgeUpgradeable;
//   let ERC20MintableInstance: RouterERC20Upgradable;
//   let ERC20HandlerInstance: ERC20HandlerUpgradeable;
//
//   let resourceIDEth: string;
//   let depositData: string;
//   let depositProposalData: string;
//   let depositProposalDataHash: string;
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
//     resourceIDEth = createResourceID(ETH, chainID);
//
//     const ERC20HandlerContract = await ethers.getContractFactory("ERC20HandlerUpgradeable");
//     ERC20HandlerInstance = (await upgrades.deployProxy(ERC20HandlerContract, [
//       BridgeInstance.address,
//       ETH,
//       WETH.address,
//       [],
//       [],
//       [],
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
//     await BridgeInstance.adminSetResource(ERC20HandlerInstance.address, resourceIDEth, ETH);
//
//     await ERC20MintableInstance.connect(depositerAddress).approve(HandlerReserveInstance.address, tokenTransferFee);
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
//       ETH,
//       ETH,
//       ETH,
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
//       ETH,
//       ETH,
//       ETH,
//     );
//     depositProposalDataHash = ethers.utils.keccak256(ERC20HandlerInstance.address + depositProposalData.substr(2));
//
//     //Turn on the Fee
//     await BridgeInstance.adminSetFeeStatus(resourceIDEth, true);
//
//     //Add Fee setter
//     await BridgeInstance.adminAddFeeSetter(resourceIDEth, feeSetter.address);
//
//     //Set Fee
//     await BridgeInstance.connect(feeSetter).setBridgeFee(
//       resourceIDEth,
//       chainID,
//       ERC20MintableInstance.address,
//       tokenTransferFee,
//       tokenExchangeFee,
//       true,
//     );
//
//     await BridgeInstance.connect(feeSetter).setBridgeFee(
//       resourceIDEth,
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
//   it("E2E: depositAmount of Destination ETH should be transferred to recipientAddress [Fee in ETH]", async () => {
//     const initialRecipientBalance = await ethers.provider.getBalance(recipientAddress.address);
//     // depositerAddress makes initial deposit of depositAmount
//     await BridgeInstance.connect(depositerAddress).depositETH(
//       chainID,
//       resourceIDEth, //passig eth resource id
//       depositData,
//       //data below is random
//       [0],
//       [0],
//       [depositerAddress.address],
//       ETH, //Fee token
//       { value: depositAmount + ETHTransferFee },
//     );
//
//     // Handler should have a balance of depositAmount
//     let handlerBalance = await WETH.balanceOf(HandlerReserveInstance.address);
//     expect(handlerBalance.toNumber()).to.be.equal(depositAmount);
//
//     // relayer1 creates the deposit proposal
//     await BridgeInstance.connect(relayer1Address).voteProposal(
//       chainID,
//       expectedDepositNonce,
//       resourceIDEth,
//       depositProposalDataHash,
//     );
//
//     // relayer2 votes in favor of the deposit proposal
//     await BridgeInstance.connect(relayer2Address).voteProposal(
//       chainID,
//       expectedDepositNonce,
//       resourceIDEth,
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
//       resourceIDEth,
//       depositProposalDataHash,
//     );
//
//     // relayer1 will execute the deposit proposal
//     await BridgeInstance.connect(relayer2Address).executeProposal(
//       chainID,
//       expectedDepositNonce,
//       depositProposalData,
//       resourceIDEth,
//       //data below is random
//       [0],
//       [0],
//       [relayer2Address.address],
//     );
//
//     // Assert WETH balance was transferred from handlerAddress
//     handlerBalance = await WETH.balanceOf(HandlerReserveInstance.address);
//     expect(handlerBalance.toNumber()).to.be.equal(0);
//
//     // Assert ETH balance was transferred to recipientAddress
//     const recipientBalance = await ethers.provider.getBalance(recipientAddress.address);
//     expect(recipientBalance.eq(initialRecipientBalance.add(depositAmount))).to.be.equal(true);
//   });
//
//   it("E2E: depositAmount of Destination ETH should be transferred to recipientAddress [Fee in ERC20]", async () => {
//     const initialRecipientBalance = await ethers.provider.getBalance(recipientAddress.address);
//     // depositerAddress makes initial deposit of depositAmount
//     await BridgeInstance.connect(depositerAddress).depositETH(
//       chainID,
//       resourceIDEth, //passig eth resource id
//       depositData,
//       //data below is random
//       [0],
//       [0],
//       [depositerAddress.address],
//       ERC20MintableInstance.address, //Fee token
//       { value: depositAmount },
//     );
//
//     //ERC20 Fees should have been transferred from depositor to Bridge
//     expect((await ERC20MintableInstance.balanceOf(depositerAddress.address)).toString()).to.be.equal(
//       (initialTokenAmount - tokenTransferFee).toString(),
//     );
//
//     // Handler should have a balance of depositAmount
//     let handlerBalance = await WETH.balanceOf(HandlerReserveInstance.address);
//     expect(handlerBalance.toNumber()).to.be.equal(depositAmount);
//
//     // relayer1 creates the deposit proposal
//     await BridgeInstance.connect(relayer1Address).voteProposal(
//       chainID,
//       expectedDepositNonce,
//       resourceIDEth,
//       depositProposalDataHash,
//     );
//
//     // relayer2 votes in favor of the deposit proposal
//     await BridgeInstance.connect(relayer2Address).voteProposal(
//       chainID,
//       expectedDepositNonce,
//       resourceIDEth,
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
//       resourceIDEth,
//       depositProposalDataHash,
//     );
//
//     // relayer1 will execute the deposit proposal
//     await BridgeInstance.connect(relayer2Address).executeProposal(
//       chainID,
//       expectedDepositNonce,
//       depositProposalData,
//       resourceIDEth,
//       //data below is random
//       [0],
//       [0],
//       [relayer2Address.address],
//     );
//
//     // Assert WETH balance was transferred from handlerAddress
//     handlerBalance = await WETH.balanceOf(HandlerReserveInstance.address);
//     expect(handlerBalance.toNumber()).to.be.equal(0);
//
//     const depositerBalanceERC20 = await ERC20MintableInstance.balanceOf(depositerAddress.address);
//     expect(depositerBalanceERC20.toNumber()).to.be.equal(initialTokenAmount - tokenTransferFee);
//
//     // Assert ETH balance was transferred to recipientAddress
//     const recipientBalance = await ethers.provider.getBalance(recipientAddress.address);
//     expect(recipientBalance.eq(initialRecipientBalance.add(depositAmount))).to.be.equal(true);
//   });
// });
