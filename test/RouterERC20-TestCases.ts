import { expect } from "chai";
import { parseEther } from "@ethersproject/units/src.ts/index";
import hre from "hardhat";

export function RouterERC20TestCases(): void {
  it("should check initialize function", async function () {
    let minter = await hre.ethers.getSigners();
    expect(await this.ERC20Instance.symbol()).to.equal("TRC");
  });

  it("ROUTERERC20 - should have DEFAULT ADMIN ROLE", async function () {
    let DEFAULT_ADMIN_ROLE = await this.ERC20Instance.DEFAULT_ADMIN_ROLE();
    expect(await this.ERC20Instance.hasRole(DEFAULT_ADMIN_ROLE, this.accounts[0].address)).to.equal(true);
  });

  it("ROUTERERC20 - Grant  MINTER ROLE accounts 1 ", async function () {
    let MINTER_ROLE = await this.ERC20Instance.MINTER_ROLE();
    await this.ERC20Instance.connect(this.accounts[0]).grantRole(MINTER_ROLE, this.accounts[1].address);
    expect(await this.ERC20Instance.hasRole(MINTER_ROLE, this.accounts[1].address)).to.equal(true);
  });

  it("ROUTERERC20 - Grant BURNER ROLE accounts 2 ", async function () {
    let BURNER_ROLE = await this.ERC20Instance.BURNER_ROLE();
    await this.ERC20Instance.connect(this.accounts[0]).grantRole(BURNER_ROLE, this.accounts[2].address);
    expect(await this.ERC20Instance.hasRole(BURNER_ROLE, this.accounts[2].address)).to.equal(true);
  });

  it("ROUTERERC20 - should be able to MINT tokens", async function () {
    let MINTER_ROLE = await this.ERC20Instance.MINTER_ROLE();
    await this.ERC20Instance.connect(this.accounts[0]).grantRole(MINTER_ROLE, this.accounts[1].address);

    let eth = await hre.ethers.utils.parseEther("1");
    await this.ERC20Instance.connect(this.accounts[1]).mint(this.accounts[0].address, eth);
    let bal = await this.ERC20Instance.balanceOf(this.accounts[0].address);
    expect(bal.toString()).to.equal("1000000000000000000");
  });

  it("ROUTERERC20 - should be able to BURN tokens", async function () {
    let MINTER_ROLE = await this.ERC20Instance.MINTER_ROLE();
    let BURNER_ROLE = await this.ERC20Instance.BURNER_ROLE();

    await this.ERC20Instance.connect(this.accounts[0]).grantRole(MINTER_ROLE, this.accounts[1].address);
    await this.ERC20Instance.connect(this.accounts[0]).grantRole(BURNER_ROLE, this.accounts[2].address);

    let eth = await hre.ethers.utils.parseEther("1");

    await this.ERC20Instance.connect(this.accounts[1]).mint(this.accounts[0].address, eth);
    await this.ERC20Instance.connect(this.accounts[2]).burn(this.accounts[0].address, eth);

    let bal = await this.ERC20Instance.balanceOf(this.accounts[0].address);
    expect(bal.toString()).to.equal("0");
  });



  it("ROUTERERC20 - Grant PAUSE ROLE accounts 4 ", async function () {
    let PAUSE_ROLE = await this.ERC20Instance.PAUSER_ROLE();
    await this.ERC20Instance.connect(this.accounts[0]).grantRole(PAUSE_ROLE, this.accounts[4].address);
    expect(await this.ERC20Instance.hasRole(PAUSE_ROLE, this.accounts[4].address)).to.equal(true);
  });

  it("ROUTERERC20 - Must not be able to do any token transaction if paused ", async function () {
    let PAUSE_ROLE = await this.ERC20Instance.PAUSER_ROLE();
    let MINTER_ROLE = await this.ERC20Instance.MINTER_ROLE();

    await this.ERC20Instance.connect(this.accounts[0]).grantRole(MINTER_ROLE, this.accounts[1].address);
    await this.ERC20Instance.connect(this.accounts[0]).grantRole(PAUSE_ROLE, this.accounts[4].address);
    await this.ERC20Instance.connect(this.accounts[4]).pauseToken();

    let eth = await hre.ethers.utils.parseEther("1");

    await expect(this.ERC20Instance.connect(this.accounts[1]).mint(this.accounts[0].address, eth)).to.be.reverted;

    await this.ERC20Instance.connect(this.accounts[4]).unpauseToken();
    await this.ERC20Instance.connect(this.accounts[1]).mint(this.accounts[0].address, eth);
    let bal = await this.ERC20Instance.balanceOf(this.accounts[0].address);
    expect(bal.toString()).to.equal("1000000000000000000");
  });

}
