import hre from "hardhat";
import { VoterContractTestCases } from "./VoterContract-TestCases";

describe("Testing VoterUpgradeable Contract", function () {
  beforeEach(async function () {
    let testingContract = "VoterUpgradeable";

    this.hre = hre;
    this.accounts = await hre.ethers.getSigners();
    this.Voter = await hre.ethers.getContractFactory("VoterUpgradeable");
    this.voterInstance = await hre.upgrades.deployProxy(this.Voter, [], { kind: "uups" });
    this.TestBridge = this.accounts[9];
    await this.voterInstance.setBridge(this.TestBridge.address);
  });

  describe("Started Testing", function () {
    VoterContractTestCases();
  });
});
