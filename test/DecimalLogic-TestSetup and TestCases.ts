import hre from "hardhat";
import { expect } from "chai";

import {FeeManagerTestCases} from "./FeeManager -TestCases";

describe("Testing Fee Manger Contract", function () {
  beforeEach(async function () {
    let testingContract = "Decimal Logic Testcases";

    this.hre = hre;
    this.accounts = await hre.ethers.getSigners();
    this.DECIMALTEST = await hre.ethers.getContractFactory("decimalTestCases");
    this.DECIMALTESTInstance = await this.DECIMALTEST.deploy();
    await this.DECIMALTESTInstance.deployed();
  });

  describe("Started Testing", function () {
    it("DECIMAL TEST DC1 -  Where SRC == DEST ", async function () {
      let TokenAmount = await this.hre.ethers.utils.parseEther("1");
      let Value = await this.DECIMALTESTInstance.Test(18,18,TokenAmount);
      console.log(TokenAmount.toString(), Value.toString());
      expect(TokenAmount.toString()).to.be.equal("1000000000000000000");
      expect(Value.toString()).to.be.equal("1000000000000000000");

    });

    it("DECIMAL TEST DC2 -  Where SRC > DEST ", async function () {
      let TokenAmount = await this.hre.ethers.utils.parseEther("1");
      let Value = await this.DECIMALTESTInstance.Test(18,10,TokenAmount);
      console.log(TokenAmount.toString(), Value.toString());
      expect(TokenAmount.toString()).to.be.equal("1000000000000000000");
      expect(Value.toString()).to.be.equal("10000000000");

    });

    it("DECIMAL TEST DC3 -  Where DEST > SRC ", async function () {
      let TokenAmount = await this.hre.ethers.utils.parseEther("0.00000001");
      let Value = await this.DECIMALTESTInstance.Test(10,18,TokenAmount);
      console.log(TokenAmount.toString(), Value.toString());
      expect(TokenAmount.toString()).to.be.equal("10000000000");
      expect(Value.toString()).to.be.equal("1000000000000000000");

    });
  });
});
