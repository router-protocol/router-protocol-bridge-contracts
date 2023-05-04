import { expect } from "chai";

export function VoterContractTestCases(): void {
  it("Voter TC1 - Check bridge address", async function () {
    expect(await this.voterInstance.bridge()).to.equal(this.TestBridge.address);
  });

  it("Voter TC2 - Minting and non transferable tokens", async function () {
    await this.voterInstance.connect(this.TestBridge).mint(this.accounts[0].address);

    let B1 = await this.voterInstance.balanceOf(this.accounts[0].address);
    expect(B1.toString()).to.equal("1000000000000000000");

    await expect(this.voterInstance.transfer(this.accounts[2].address, "1000000000000000000")).to.be.reverted;
  });

  it("Voter TC3 - Minting and buring of NT Tokens", async function () {
    await this.voterInstance.connect(this.TestBridge).mint(this.accounts[0].address);

    let B1 = await this.voterInstance.balanceOf(this.accounts[0].address);
    expect(B1.toString()).to.equal("1000000000000000000");

    await this.voterInstance.connect(this.TestBridge).burn(this.accounts[0].address);

    let B2 = await this.voterInstance.balanceOf(this.accounts[0].address);
    expect(B2.toString()).to.equal("0");
  });

  it("Voter TC4 - 6 User Create proposal and Execute proposal case - All user vote yes", async function () {
    await this.voterInstance.connect(this.TestBridge).mint(this.accounts[0].address);
    await this.voterInstance.connect(this.TestBridge).mint(this.accounts[1].address);
    await this.voterInstance.connect(this.TestBridge).mint(this.accounts[2].address);
    await this.voterInstance.connect(this.TestBridge).mint(this.accounts[3].address);
    await this.voterInstance.connect(this.TestBridge).mint(this.accounts[4].address);
    await this.voterInstance.connect(this.TestBridge).mint(this.accounts[5].address);

    await this.voterInstance.connect(this.TestBridge).createProposal("10000", "6000");

    let CTR = await this.voterInstance.fetchCtr();

    await this.voterInstance.connect(this.TestBridge).vote(CTR.toString(), "1", this.accounts[0].address);
    await this.voterInstance.connect(this.TestBridge).vote(CTR.toString(), "1", this.accounts[1].address);
    await this.voterInstance.connect(this.TestBridge).vote(CTR.toString(), "1", this.accounts[2].address);

    let SS0 = await this.voterInstance.fetchIssueMap(CTR.toString());
    expect(SS0.status.toString()).to.equal("1");
    await this.voterInstance.connect(this.TestBridge).vote(CTR.toString(), "1", this.accounts[3].address);

    let SS1 = await this.voterInstance.fetchIssueMap(CTR.toString());
    expect(SS1.status.toString()).to.equal("2"); // Cross check of auto updation of voting status
    await expect(this.voterInstance.connect(this.TestBridge).vote(CTR.toString(), "1", this.accounts[4].address)).to.be
      .reverted;
    await expect(this.voterInstance.connect(this.TestBridge).vote(CTR.toString(), "1", this.accounts[5].address)).to.be
      .reverted;

    await this.voterInstance.connect(this.TestBridge).executeProposal(CTR.toString());
    let SS2 = await this.voterInstance.fetchIssueMap(CTR.toString());
    expect(SS2.status.toString()).to.equal("3"); // Success - execution
  });

  it("Voter TC5 - 6 User Create proposal and Execute proposal case - 4 Yes and 2 no user ", async function () {
    await this.voterInstance.connect(this.TestBridge).mint(this.accounts[0].address);
    await this.voterInstance.connect(this.TestBridge).mint(this.accounts[1].address);
    await this.voterInstance.connect(this.TestBridge).mint(this.accounts[2].address);
    await this.voterInstance.connect(this.TestBridge).mint(this.accounts[3].address);
    await this.voterInstance.connect(this.TestBridge).mint(this.accounts[4].address);
    await this.voterInstance.connect(this.TestBridge).mint(this.accounts[5].address);

    await this.voterInstance.connect(this.TestBridge).createProposal("10000", "6000");

    let CTR = await this.voterInstance.fetchCtr();

    await this.voterInstance.connect(this.TestBridge).vote(CTR.toString(), "2", this.accounts[0].address);
    await this.voterInstance.connect(this.TestBridge).vote(CTR.toString(), "2", this.accounts[1].address);
    await this.voterInstance.connect(this.TestBridge).vote(CTR.toString(), "1", this.accounts[2].address);
    await this.voterInstance.connect(this.TestBridge).vote(CTR.toString(), "1", this.accounts[3].address);
    await this.voterInstance.connect(this.TestBridge).vote(CTR.toString(), "1", this.accounts[4].address);
    let SS0 = await this.voterInstance.fetchIssueMap(CTR.toString());
    expect(SS0.status.toString()).to.equal("1");
    await this.voterInstance.connect(this.TestBridge).vote(CTR.toString(), "1", this.accounts[5].address);
    let SS1 = await this.voterInstance.fetchIssueMap(CTR.toString());
    expect(SS1.status.toString()).to.equal("2"); // Cross check of auto updation of voting status

    await this.voterInstance.connect(this.TestBridge).executeProposal(CTR.toString());
    let SS2 = await this.voterInstance.fetchIssueMap(CTR.toString());
    expect(SS2.status.toString()).to.equal("3"); // Success - execution
  });

  it("Voter TC6 - 6 User Create proposal and Execute proposal case - 4 No and 2 Yes user - Cancelled state  ", async function () {
    await this.voterInstance.connect(this.TestBridge).mint(this.accounts[0].address);
    await this.voterInstance.connect(this.TestBridge).mint(this.accounts[1].address);
    await this.voterInstance.connect(this.TestBridge).mint(this.accounts[2].address);
    await this.voterInstance.connect(this.TestBridge).mint(this.accounts[3].address);
    await this.voterInstance.connect(this.TestBridge).mint(this.accounts[4].address);
    await this.voterInstance.connect(this.TestBridge).mint(this.accounts[5].address);

    await this.voterInstance.connect(this.TestBridge).createProposal("200", "6000");

    let CTR = await this.voterInstance.fetchCtr();

    await this.voterInstance.connect(this.TestBridge).vote(CTR.toString(), "2", this.accounts[0].address);
    await this.voterInstance.connect(this.TestBridge).vote(CTR.toString(), "2", this.accounts[1].address);
    await this.voterInstance.connect(this.TestBridge).vote(CTR.toString(), "2", this.accounts[2].address);
    await this.voterInstance.connect(this.TestBridge).vote(CTR.toString(), "2", this.accounts[3].address);
    await this.voterInstance.connect(this.TestBridge).vote(CTR.toString(), "1", this.accounts[4].address);
    await this.voterInstance.connect(this.TestBridge).vote(CTR.toString(), "1", this.accounts[5].address);

    let CB0 = await this.voterInstance.ballotOf(CTR.toString(), this.accounts[0].address);
    let CB1 = await this.voterInstance.ballotOf(CTR.toString(), this.accounts[5].address);
    expect(CB0.toString()).to.equal("2");
    expect(CB1.toString()).to.equal("1");

    let HV0 = await this.voterInstance.Voted(CTR.toString(), this.accounts[0].address);
    let HV5 = await this.voterInstance.Voted(CTR.toString(), this.accounts[5].address);
    let HVN = await this.voterInstance.Voted(CTR.toString(), this.accounts[7].address);
    expect(HV0).to.equal(true);
    expect(HV5).to.equal(true);
    expect(HVN).to.equal(false);

    let SS0 = await this.voterInstance.fetchIssueMap(CTR.toString());
    expect(SS0.status.toString()).to.equal("1");

    let EXP0 = await this.voterInstance.fetchIsExpired(CTR.toString());
    expect(EXP0).to.equal(false);

    let i = 0;
    while (i < 200) {
      i++;
      await this.hre.ethers.provider.send("evm_mine");
      // Mine empty blocks
    }
    let EXP1 = await this.voterInstance.fetchIsExpired(CTR.toString());
    expect(EXP1).to.equal(true);

    await this.voterInstance.connect(this.TestBridge).setStatus(CTR.toString());

    let SS1 = await this.voterInstance.fetchIssueMap(CTR.toString());
    expect(SS1.status.toString()).to.equal("4"); // Status must be cancelled
  });

  it("Voter TC7 - 6 User Create proposal and Execute proposal case - Invalid Quorum set  ", async function () {
    await this.voterInstance.connect(this.TestBridge).mint(this.accounts[0].address);
    await this.voterInstance.connect(this.TestBridge).mint(this.accounts[1].address);
    await this.voterInstance.connect(this.TestBridge).mint(this.accounts[2].address);
    await this.voterInstance.connect(this.TestBridge).mint(this.accounts[3].address);
    await this.voterInstance.connect(this.TestBridge).mint(this.accounts[4].address);
    await this.voterInstance.connect(this.TestBridge).mint(this.accounts[5].address);

    await expect(this.voterInstance.connect(this.TestBridge).createProposal("100", "60000")).to.be.reverted;
  });
}
