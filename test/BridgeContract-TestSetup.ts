import hre from "hardhat";
import { BridgeContractTestCases } from "./BridgeContract-TestCases";

describe("Testing Bridge Contract", function () {
  beforeEach(async function () {
    let testingContract = "BridgeUpgradeable";
    this.accounts = await hre.ethers.getSigners();
    this.Voter = await hre.ethers.getContractFactory("VoterUpgradeable");
    this.voterInstance = await hre.upgrades.deployProxy(this.Voter, [], { kind: "uups" });
    this.voterInstance.deployed();

    this.Bridge = await hre.ethers.getContractFactory("BridgeUpgradeable");
    this.bridgeInstance = await hre.upgrades.deployProxy(
      this.Bridge,
      ["1", "6000", "1000", this.voterInstance.address],
      { kind: "uups" },
    );
    this.bridgeInstance.deployed();
    await this.voterInstance.setBridge(this.bridgeInstance.address);
  });

  describe("Started Testing", function () {
    BridgeContractTestCases();
  });
});
