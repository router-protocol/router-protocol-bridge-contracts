async function voterDeploy() {
  console.log("------------------------------ Initial Setup Started ------------------------------");
  let deployContract = "VoterUpgradeable";

  const hre = require("hardhat");
  let fs = require("fs");
  let deployedContractsv1 = require("../deployment/VoterUpgradeable.json");
  const network = await hre.getChainId();
  deployedContractsv1[network] = {};

  console.log("------------------------------ Initial Setup Ended ------------------------------");

  console.log("------------------------------ Contract Deployment Started ------------------------------");

  const C1 = await hre.ethers.getContractFactory("VoterUpgradeable");
  const c1Proxy = await hre.upgrades.deployProxy(C1, [], { kind: "uups" }); // Add Constructor args here
  console.log("Contract " + deployContract + " deployed to: ", c1Proxy.address);

  console.log("------------------------------ Contract Deployment Ended ------------------------------");
  console.log("------------------------------ Deployment Storage Started ------------------------------");

  deployedContractsv1[network] = {
    VoterUpgradeable: {
      proxy: c1Proxy.address,
      implementation: "",
    },
  };

  fs.writeFileSync("./deployment/VoterUpgradeable.json", JSON.stringify(deployedContractsv1));

  console.log("------------------------------ Deployment Storage Ended ------------------------------");
}

voterDeploy()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
