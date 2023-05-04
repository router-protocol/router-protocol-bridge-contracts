import { expect } from "chai";

export function BridgeContractTestCases(): void {
  it("BRIDGE TC1 - Check Granting and revoking of RELAYER ROLES and corresponding minting of NT Tokens", async function () {
    let RR = await this.bridgeInstance.RELAYER_ROLE();
    await this.bridgeInstance.grantRole(RR, this.accounts[1].address);
    await this.bridgeInstance.grantRole(RR, this.accounts[2].address);
    await this.bridgeInstance.grantRole(RR, this.accounts[3].address);
    let B1 = await this.voterInstance.balanceOf(this.accounts[1].address);
    let B2 = await this.voterInstance.balanceOf(this.accounts[2].address);
    let B3 = await this.voterInstance.balanceOf(this.accounts[3].address);
    expect(B1.toString()).to.be.equal("1000000000000000000");
    expect(B2.toString()).to.be.equal("1000000000000000000");
    expect(B3.toString()).to.be.equal("1000000000000000000");

    await this.bridgeInstance.revokeRole(RR, this.accounts[1].address);
    await this.bridgeInstance.revokeRole(RR, this.accounts[2].address);
    await this.bridgeInstance.revokeRole(RR, this.accounts[3].address);

    let B4 = await this.voterInstance.balanceOf(this.accounts[1].address);
    let B5 = await this.voterInstance.balanceOf(this.accounts[2].address);
    let B6 = await this.voterInstance.balanceOf(this.accounts[3].address);
    expect(B4.toString()).to.be.equal("0");
    expect(B5.toString()).to.be.equal("0");
    expect(B6.toString()).to.be.equal("0");
  });
}
