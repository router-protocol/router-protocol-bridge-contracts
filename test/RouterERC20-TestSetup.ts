import hre from "hardhat";
import {RouterERC20TestCases} from "./RouterERC20-TestCases";

describe("Testing RouterERC20 Contract", function () {
  beforeEach(async function () {
    let testingContract = "VoterUpgradeable";

    this.hre = hre;
    this.accounts = await hre.ethers.getSigners();
    this.ERC20 = await hre.ethers.getContractFactory("RouterERC20Upgradable");
    this.ERC20Instance = await hre.upgrades.deployProxy(this.ERC20, ["TEST-ERC20", "TRC" , "18"], { kind: "transparent" });
    this.ERC20Instance.deployed();
  });

  describe("Started Testing", function () {
    RouterERC20TestCases();
  });
});
