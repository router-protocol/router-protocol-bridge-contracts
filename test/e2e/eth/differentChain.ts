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
// describe("E2E ETH - Two EVM Chains", () => {
//   const originChainID = 1;
//   const ETH = "0xc944E90C64B2c07662A292be6244BDf05Cda44a7"; //Random address for ETH
//   let originRelayer1Address: SignerWithAddress;
//   let originRelayer2Address: SignerWithAddress;
//
//   const destinationChainID = 2;
//   let destinationRelayer1Address: SignerWithAddress;
//   let destinationRelayer2Address: SignerWithAddress;
//
//   let depositerAddress: SignerWithAddress;
//   let recipientAddress: SignerWithAddress;
//   let feeSetter: SignerWithAddress;
//   const quorum = 6000;
//   const initialTokenAmount = 10000;
//   const depositAmount = 10;
//   const expectedDepositNonce = 1;
//   const originTokenTransferFee = 1;
//   const originTokenExchangeFee = 2;
//   const destinationTokenTransferFee = 1;
//   const destinationTokenExchangeFee = 2;
//   const ETHTransferFee = 1000;
//   const ETHExchangeFee = 2000;
//
//   let WETH: WETH9;
//   let OriginHandlerReserveInstance: HandlerReserveUpgradeable;
//   let DestinationHandlerReserveInstance: HandlerReserveUpgradeable;
//   let OriginFeeManagerInstance: FeeManagerUpgradeable;
//   let DestinationFeeManagerInstance: FeeManagerUpgradeable;
//   let OriginVoterInstance: VoterUpgradeable;
//   let DestinationVoterInstance: VoterUpgradeable;
//   let OriginBridgeInstance: BridgeUpgradeable;
//   let OriginERC20MintableInstance: RouterERC20Upgradable;
//   let OriginERC20HandlerInstance: ERC20HandlerUpgradeable;
//   let originDepositData: string;
//   let originDepositProposalData: string;
//   let originDepositProposalDataHash: string;
//   let originResourceID: string;
//
//   let DestinationBridgeInstance: BridgeUpgradeable;
//   let DestinationERC20MintableInstance: RouterERC20Upgradable;
//   let DestinationERC20HandlerInstance: ERC20HandlerUpgradeable;
//   let destinationResourceID: string;
//
//   beforeEach(async () => {
//     const accounts = await ethers.getSigners();
//
//     originRelayer1Address = accounts[3];
//     originRelayer2Address = accounts[4];
//     destinationRelayer1Address = accounts[3];
//     destinationRelayer2Address = accounts[4];
//     depositerAddress = accounts[1];
//     recipientAddress = accounts[2];
//     feeSetter = accounts[5];
//
//     const ERC20Contract = await ethers.getContractFactory("WETH9");
//     WETH = (await ERC20Contract.deploy()) as WETH9;
//
//     const VoterContract = await ethers.getContractFactory("VoterUpgradeable");
//     OriginVoterInstance = (await upgrades.deployProxy(VoterContract, [], { kind: "uups" })) as VoterUpgradeable;
//     DestinationVoterInstance = (await upgrades.deployProxy(VoterContract, [], { kind: "uups" })) as VoterUpgradeable;
//
//     const BridgeContract = await ethers.getContractFactory("BridgeUpgradeable");
//     OriginBridgeInstance = (await upgrades.deployProxy(
//       BridgeContract,
//       [
//         originChainID,
//         quorum,
//         5, //expiry
//         OriginVoterInstance.address,
//       ],
//       { kind: "uups" },
//     )) as BridgeUpgradeable;
//
//     DestinationBridgeInstance = (await upgrades.deployProxy(
//       BridgeContract,
//       [
//         destinationChainID,
//         quorum,
//         5, //expiry
//         DestinationVoterInstance.address,
//       ],
//       { kind: "uups" },
//     )) as BridgeUpgradeable;
//
//     await OriginVoterInstance.grantRole(await OriginVoterInstance.BRIDGE_ROLE(), OriginBridgeInstance.address);
//     await DestinationVoterInstance.grantRole(
//       await DestinationVoterInstance.BRIDGE_ROLE(),
//       DestinationBridgeInstance.address,
//     );
//     const ERC20MintPause = await ethers.getContractFactory("RouterERC20Upgradable");
//     OriginERC20MintableInstance = (await upgrades.deployProxy(
//       ERC20MintPause,
//       ["token", "TOK", 18],
//       // { kind: "uups" }
//     )) as RouterERC20Upgradable;
//     DestinationERC20MintableInstance = (await upgrades.deployProxy(
//       ERC20MintPause,
//       ["token", "TOK", 18],
//       // { kind: "uups" }
//     )) as RouterERC20Upgradable;
//
//     originResourceID = createResourceID(ETH, originChainID);
//
//     destinationResourceID = createResourceID(ETH, destinationChainID);
//
//     const ERC20HandlerContract = await ethers.getContractFactory("ERC20HandlerUpgradeable");
//
//     //For now using random addresses
//     OriginERC20HandlerInstance = (await upgrades.deployProxy(
//       ERC20HandlerContract,
//       [OriginBridgeInstance.address, ETH, WETH.address, [], [], []],
//       // { kind: "uups" }
//     )) as ERC20HandlerUpgradeable;
//
//     DestinationERC20HandlerInstance = (await upgrades.deployProxy(
//       ERC20HandlerContract,
//       [DestinationBridgeInstance.address, ETH, WETH.address, [], [], []],
//       // { kind: "uups" }
//     )) as ERC20HandlerUpgradeable;
//
//     const HandlerReserve = await ethers.getContractFactory("HandlerReserveUpgradeable");
//     OriginHandlerReserveInstance = (await upgrades.deployProxy(HandlerReserve, [
//       OriginERC20HandlerInstance.address,
//     ])) as HandlerReserveUpgradeable;
//     DestinationHandlerReserveInstance = (await upgrades.deployProxy(HandlerReserve, [
//       DestinationERC20HandlerInstance.address,
//     ])) as HandlerReserveUpgradeable;
//
//     await OriginERC20HandlerInstance.setReserve(OriginHandlerReserveInstance.address);
//     await DestinationERC20HandlerInstance.setReserve(DestinationHandlerReserveInstance.address);
//
//     const FeeManagerContract = await ethers.getContractFactory("FeeManagerUpgradeable");
//     OriginFeeManagerInstance = (await upgrades.deployProxy(FeeManagerContract, [
//       OriginERC20HandlerInstance.address,
//     ])) as FeeManagerUpgradeable;
//     await OriginERC20HandlerInstance.setFeeManager(OriginFeeManagerInstance.address);
//
//     DestinationFeeManagerInstance = (await upgrades.deployProxy(FeeManagerContract, [
//       DestinationERC20HandlerInstance.address,
//     ])) as FeeManagerUpgradeable;
//     await DestinationERC20HandlerInstance.setFeeManager(DestinationFeeManagerInstance.address);
//
//     await OriginERC20MintableInstance.mint(depositerAddress.address, initialTokenAmount);
//     await OriginERC20MintableInstance.grantRole(
//       await OriginERC20MintableInstance.BURNER_ROLE(),
//       OriginHandlerReserveInstance.address,
//     );
//     await DestinationERC20MintableInstance.grantRole(
//       await DestinationERC20MintableInstance.BURNER_ROLE(),
//       DestinationHandlerReserveInstance.address,
//     );
//
//     await OriginERC20MintableInstance.connect(depositerAddress).approve(
//       OriginHandlerReserveInstance.address,
//       depositAmount,
//     );
//     await OriginERC20MintableInstance.grantRole(
//       await OriginERC20MintableInstance.MINTER_ROLE(),
//       OriginHandlerReserveInstance.address,
//     );
//     await DestinationERC20MintableInstance.grantRole(
//       await DestinationERC20MintableInstance.MINTER_ROLE(),
//       DestinationHandlerReserveInstance.address,
//     );
//
//     await OriginERC20HandlerInstance.grantRole(
//       await OriginERC20HandlerInstance.BRIDGE_ROLE(),
//       OriginBridgeInstance.address,
//     );
//     await DestinationERC20HandlerInstance.grantRole(
//       await DestinationERC20HandlerInstance.BRIDGE_ROLE(),
//       DestinationBridgeInstance.address,
//     );
//     await OriginERC20HandlerInstance.grantRole(
//       await DestinationERC20HandlerInstance.BRIDGE_ROLE(),
//       DestinationBridgeInstance.address,
//     );
//     await DestinationERC20HandlerInstance.grantRole(
//       await OriginERC20HandlerInstance.BRIDGE_ROLE(),
//       OriginBridgeInstance.address,
//     );
//
//     await OriginBridgeInstance.adminSetResource(OriginERC20HandlerInstance.address, originResourceID, ETH);
//     await OriginBridgeInstance.adminSetResource(DestinationERC20HandlerInstance.address, destinationResourceID, ETH);
//     await DestinationBridgeInstance.adminSetResource(
//       DestinationERC20HandlerInstance.address,
//       destinationResourceID,
//       ETH,
//     );
//     await DestinationBridgeInstance.adminSetResource(OriginERC20HandlerInstance.address, originResourceID, ETH);
//
//     originDepositData = createERCDepositData(
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
//     originDepositProposalData = createERCDepositData(
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
//     originDepositProposalDataHash = ethers.utils.keccak256(
//       DestinationERC20HandlerInstance.address + originDepositProposalData.substr(2),
//     );
//
//     //Turn on the Fee
//     await OriginBridgeInstance.adminSetFeeStatus(originResourceID, true);
//     await DestinationBridgeInstance.adminSetFeeStatus(destinationResourceID, true);
//
//     //Add Fee setter
//     await OriginBridgeInstance.adminAddFeeSetter(originResourceID, feeSetter.address);
//     await DestinationBridgeInstance.adminAddFeeSetter(destinationResourceID, feeSetter.address);
//
//     //Set Fee
//     await OriginBridgeInstance.connect(feeSetter).setBridgeFee(
//       originResourceID,
//       destinationChainID,
//       ETH,
//       ETHTransferFee,
//       ETHExchangeFee,
//       true,
//     );
//
//     await OriginBridgeInstance.connect(feeSetter).setBridgeFee(
//       originResourceID,
//       destinationChainID,
//       OriginERC20MintableInstance.address,
//       originTokenTransferFee,
//       originTokenExchangeFee,
//       true,
//     );
//
//     await DestinationBridgeInstance.connect(feeSetter).setBridgeFee(
//       destinationResourceID,
//       originChainID,
//       DestinationERC20MintableInstance.address,
//       destinationTokenTransferFee,
//       destinationTokenExchangeFee,
//       true,
//     );
//
//     await DestinationBridgeInstance.connect(feeSetter).setBridgeFee(
//       destinationResourceID,
//       originChainID,
//       ETH,
//       ETHTransferFee,
//       ETHExchangeFee,
//       true,
//     );
//
//     //Whitelisting
//     await OriginBridgeInstance.setWhitelisting(true);
//     await DestinationBridgeInstance.setWhitelisting(true);
//     await OriginBridgeInstance.addToWhitelist(depositerAddress.address);
//     await DestinationBridgeInstance.addToWhitelist(recipientAddress.address);
//
//     //Add Relayers
//     await OriginBridgeInstance.grantRole(await OriginBridgeInstance.RELAYER_ROLE(), originRelayer1Address.address);
//     await OriginBridgeInstance.grantRole(await OriginBridgeInstance.RELAYER_ROLE(), originRelayer2Address.address);
//     await DestinationBridgeInstance.grantRole(
//       await DestinationBridgeInstance.RELAYER_ROLE(),
//       destinationRelayer1Address.address,
//     );
//     await DestinationBridgeInstance.grantRole(
//       await DestinationBridgeInstance.RELAYER_ROLE(),
//       destinationRelayer2Address.address,
//     );
//   });
//
//   it("deployment gas", async () => {
//     const receipt = await ethers.provider.getTransactionReceipt(DestinationERC20HandlerInstance.deployTransaction.hash);
//     // expect((receipt.gasUsed).toString()).to.eq('857442');
//     console.log(receipt.gasUsed.toString());
//   });
//
//   it("[sanity] depositerAddress' balance should be equal to initialTokenAmount", async () => {
//     const depositerBalance = await OriginERC20MintableInstance.balanceOf(depositerAddress.address);
//     expect(depositerBalance.toNumber()).to.be.equal(initialTokenAmount);
//   });
//
//   it("[sanity] OriginHandlerReserveInstance.address should have an allowance of depositAmount from depositerAddress", async () => {
//     const handlerAllowance = await OriginERC20MintableInstance.allowance(
//       depositerAddress.address,
//       OriginHandlerReserveInstance.address,
//     );
//     expect(handlerAllowance.toNumber()).to.be.equal(depositAmount);
//   });
//
//   it("[sanity] DestinationHandlerReserveInstance.address should have minterRole for DestinationERC20MintableInstance", async () => {
//     const isMinter = await DestinationERC20MintableInstance.hasRole(
//       await DestinationERC20MintableInstance.MINTER_ROLE(),
//       DestinationHandlerReserveInstance.address,
//     );
//     expect(isMinter).to.be.true;
//   });
//
//   it("E2E: depositAmount of Origin ETH owned by depositAddress to Destination ETH owned by recipientAddress and back again (FEE in ETH)", async () => {
//     const initialRecipientBalance = await ethers.provider.getBalance(recipientAddress.address);
//
//     // depositerAddress makes initial deposit of depositAmount
//     await OriginBridgeInstance.connect(depositerAddress).depositETH(
//       destinationChainID,
//       originResourceID,
//       originDepositData,
//       //data below is random
//       [0],
//       [0],
//       [depositerAddress.address],
//       ETH, //Fee token
//       { value: depositAmount + ETHTransferFee },
//     );
//
//     // destinationRelayer1 creates the deposit proposal
//     await DestinationBridgeInstance.connect(destinationRelayer1Address).voteProposal(
//       originChainID,
//       expectedDepositNonce,
//       destinationResourceID,
//       originDepositProposalDataHash,
//     );
//
//     // destinationRelayer2 votes in favor of the deposit proposal
//     await DestinationBridgeInstance.connect(destinationRelayer2Address).voteProposal(
//       originChainID,
//       expectedDepositNonce,
//       destinationResourceID,
//       originDepositProposalDataHash,
//     );
//
//     await delay(700);
//
//     // destinationRelayer2 votes after expiry
//     // because the proposal has expired so the deposit will go
//     // into a finalized state
//     await DestinationBridgeInstance.connect(destinationRelayer2Address).voteProposal(
//       originChainID,
//       expectedDepositNonce,
//       destinationResourceID,
//       originDepositProposalDataHash,
//     );
//
//     //transfer some WETH to DestinationHandler as reserve ETH
//     await WETH.deposit({ value: depositAmount });
//     //TODO
//     await WETH.transfer(DestinationHandlerReserveInstance.address, depositAmount);
//     // destinationRelayer1 will execute the deposit proposal
//     await DestinationBridgeInstance.connect(destinationRelayer2Address).executeProposal(
//       originChainID,
//       expectedDepositNonce,
//       originDepositProposalData,
//       destinationResourceID,
//       //data below is random
//       [0],
//       [0],
//       [destinationRelayer2Address.address],
//     );
//
//     // Assert WETH balance was transferred from handlerAddress
//     const handlerBalance = await WETH.balanceOf(DestinationERC20HandlerInstance.address);
//     expect(handlerBalance.toNumber()).to.be.equal(0);
//
//     // Assert ERC20 balance was transferred to recipientAddress
//     const recipientBalance = await ethers.provider.getBalance(recipientAddress.address);
//     expect(recipientBalance.eq(initialRecipientBalance.add(depositAmount))).to.be.equal(true);
//   });
//
//   it("E2E: depositAmount of Origin ERC20 owned by depositAddress to Destination ERC20 owned by recipientAddress and back again (FEE in ERC20)", async () => {
//     const initialRecipientBalance = await ethers.provider.getBalance(recipientAddress.address);
//
//     // depositerAddress makes initial deposit of depositAmount
//     await OriginBridgeInstance.connect(depositerAddress).depositETH(
//       destinationChainID,
//       originResourceID,
//       originDepositData,
//       //data below is random
//       [0],
//       [0],
//       [depositerAddress.address],
//       OriginERC20MintableInstance.address, //Fee token
//       { value: depositAmount },
//     );
//
//     // destinationRelayer1 creates the deposit proposal
//     await DestinationBridgeInstance.connect(destinationRelayer1Address).voteProposal(
//       originChainID,
//       expectedDepositNonce,
//       destinationResourceID,
//       originDepositProposalDataHash,
//     );
//
//     // destinationRelayer2 votes in favor of the deposit proposal
//     await DestinationBridgeInstance.connect(destinationRelayer2Address).voteProposal(
//       originChainID,
//       expectedDepositNonce,
//       destinationResourceID,
//       originDepositProposalDataHash,
//     );
//
//     await delay(700);
//
//     // destinationRelayer2 votes after expiry
//     // because the proposal has expired so the deposit will go
//     // into a finalized state
//     await DestinationBridgeInstance.connect(destinationRelayer2Address).voteProposal(
//       originChainID,
//       expectedDepositNonce,
//       destinationResourceID,
//       originDepositProposalDataHash,
//     );
//
//     //transfer some WETH to DestinationHandler as reserve ETH
//     await WETH.deposit({ value: depositAmount });
//     await WETH.transfer(DestinationHandlerReserveInstance.address, depositAmount);
//     // destinationRelayer1 will execute the deposit proposal
//     await DestinationBridgeInstance.connect(destinationRelayer2Address).executeProposal(
//       originChainID,
//       expectedDepositNonce,
//       originDepositProposalData,
//       destinationResourceID,
//       //data below is random
//       [0],
//       [0],
//       [destinationRelayer2Address.address],
//     );
//
//     // Assert WETH balance was transferred from handlerAddress
//     const handlerBalance = await WETH.balanceOf(DestinationERC20HandlerInstance.address);
//     expect(handlerBalance.toNumber()).to.be.equal(0);
//
//     const depositerBalanceERC20 = await OriginERC20MintableInstance.balanceOf(depositerAddress.address);
//     expect(depositerBalanceERC20.toNumber()).to.be.equal(initialTokenAmount - originTokenTransferFee);
//
//     // Assert ERC20 balance was transferred to recipientAddress
//     const recipientBalance = await ethers.provider.getBalance(recipientAddress.address);
//     expect(recipientBalance.eq(initialRecipientBalance.add(depositAmount))).to.be.equal(true);
//   });
// });
