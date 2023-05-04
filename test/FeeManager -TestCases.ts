import { expect } from "chai";

export function FeeManagerTestCases(): void {
  it("FEE Manager FM1 -  Role Grant and revoke DFA", async function () {

    let DFA = await this.FEEMANAGERInstance.DEFAULT_ADMIN_ROLE();
    await this.FEEMANAGERInstance.connect(this.accounts[0]).grantRole(DFA, this.accounts[1].address);
    expect( await this.FEEMANAGERInstance.hasRole(DFA, this.accounts[1].address) ).to.be.equal(true);
    await this.FEEMANAGERInstance.connect(this.accounts[0]).revokeRole(DFA, this.accounts[1].address);
    expect( await this.FEEMANAGERInstance.hasRole(DFA, this.accounts[1].address) ).to.be.equal(false);

  });

  it("FEE Manager FM2 - ONly handlers can set fees", async function () {
    await expect(this.FEEMANAGERInstance.setFee("1", this.accounts[9].address, "1000", "6000", true)).to.be.reverted;
  });

  it("FEE Manager FM3 - Set and fetch fees", async function () {

    await expect(this.FEEMANAGERInstance.setFee("1", this.accounts[9].address, "1000", "6000", true)).to.be.reverted;
    await this.FEEMANAGERInstance.connect(this.accounts[9]).setFee("1", this.accounts[9].address, "1000", "6000", true);
    let fees = await this.FEEMANAGERInstance.getFee("1", this.accounts[9].address);

    expect(fees[0].toString()).to.be.equal("1000");
    expect(fees[1].toString()).to.be.equal("6000");

  });

  it("FEE Manager FM4 - Only DFA can Update Handlers", async function () {

    await expect(this.FEEMANAGERInstance.connect(this.accounts[1]).setHandler( this.accounts[7].address)).to.be.reverted;

  });

  it("FEE Manager FM5 - Update Handlers", async function () {
    let DFA = await this.FEEMANAGERInstance.DEFAULT_ADMIN_ROLE();

    expect( await this.FEEMANAGERInstance.hasRole(DFA, this.accounts[0].address) ).to.be.equal(true);

    await this.FEEMANAGERInstance.connect(this.accounts[0]).setHandler( this.accounts[1].address);
    let handler = await this.FEEMANAGERInstance.fetchHandler();
    expect(handler).to.be.equal(this.accounts[1].address);

  });
}
