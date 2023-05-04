import hre from "hardhat";
import {FeeManagerTestCases} from "./FeeManager -TestCases";

describe("Testing Fee Manger Contract", function () {
  beforeEach(async function () {
    let testingContract = "VoterUpgradeable";

    this.hre = hre;
    this.accounts = await hre.ethers.getSigners();
    this.FEEMANAGER = await hre.ethers.getContractFactory("FeeManagerUpgradeable");
    this.FEEMANAGERInstance = await hre.upgrades.deployProxy(this.FEEMANAGER, [this.accounts[9].address], { kind: "transparent" });
    this.FEEMANAGERInstance.deployed();
  });

  describe("Started Testing", function () {
    FeeManagerTestCases();
  });
});
