import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "hardhat-gas-reporter";
// import "hardhat-docgen";
import "solidity-coverage";
import "@openzeppelin/hardhat-upgrades";

import "./tasks/accounts";
import "./tasks/clean";

import "./tasks/deploy";
import "./tasks/deployAll";
import "./tasks/configure";
import "./tasks/grantRole";
import "./tasks/revokeRole";
import "./tasks/verify";
import "./tasks/helperTasks";
import "./tasks/full-tasks";
import "./tasks/upgrade/upgrade";
import "./tasks/full-tasks/sequencer-nonce-fix";

import { resolve } from "path";

import { config as dotenvConfig } from "dotenv";
import { NetworkUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ganache";

dotenvConfig({ path: resolve(__dirname, "./.env") });

const chainIds = {
  ganache: 5777,
  goerli: 5,
  hardhat: 7545,
  kovan: 42,
  mainnet: 1,
  rinkeby: 4,
  bscTestnet: 97,
  bsc: 56,
  ropsten: 3,
  mumbai: 80001,
  avalanche: 43114,
  polygon: 137,
  fuji: 43113,
  arbitrum: 42161,
  arbitrum_rinkeby: 421611,
  fantom_testnet: 4002,
  optimism: 10,
  optimism_kovan: 69,
  fantom: 250,
  harmony: 1666600000,
  cronos: 25,
  aurora: 1313161554,
  kava: 2222,
  moonbeam: 1284,
};

// Ensure that we have all the environment variables we need.
const mnemonic = process.env.MNEMONIC;
if (!mnemonic) {
  throw new Error("Please set your MNEMONIC in a .env file");
}

const infuraApiKey = process.env.INFURA_API_KEY;
if (!infuraApiKey) {
  throw new Error("Please set your INFURA_API_KEY in a .env file");
}

function getChainConfig(network: keyof typeof chainIds): NetworkUserConfig {
  let url = "";
  url = "https://" + network + ".infura.io/v3/" + infuraApiKey;
  if (network == "polygon") {
    url = "https://polygon-mainnet.g.alchemy.com/v2/hCz4x1BLpLDP3NoomXivfaqND37qCSgS";
  } else if (network == "mumbai") {
    url = "https://polygon-rpc.com";
  } else if (network == "bsc") {
    url = "https://bsc-dataseed.binance.org/";
  } else if (network == "avalanche") {
    url = "https://api.avax.network/ext/bc/C/rpc";
  } else if (network == "arbitrum") {
    //42161
    // url = "https://arbitrum-mainnet.infura.io/v3/fd9c5dbc69de41048405e7072cda9bf9";
    url = "https://arb1.arbitrum.io/rpc";
  } else if (network == "optimism") {
    //10
    url = "https://mainnet.optimism.io";
  } else if (network == "fantom") {
    //250
    url = "https://rpc.ankr.com/fantom";
  } else if (network == "mainnet") {
    //1
    url = "https://mainnet.infura.io/v3/0d73cc5bbe184146957a9d00764db99f";
    // console.log(url, process.env.PRIVATE_KEY)
  } else if (network == "harmony") {
    //1
    url = "https://api.harmony.one";
    // console.log(url, process.env.PRIVATE_KEY)
  } else if (network == "aurora") {
    //1
    url = "https://aurora-mainnet.infura.io/v3/21b8830bd17040c59ece8a18cd2ef144";
    // console.log(url, process.env.PRIVATE_KEY)
  } else if (network == "cronos") {
    //1
    url = "https://rpc.vvs.finance";
    //https://rpc.artemisone.org/cronos
    // console.log(url, process.env.PRIVATE_KEY)
  } else if (network == "kava") {
    url = "https://evm.kava.io";
  } else if (network == "moonbeam") {
    url = "https://rpc.api.moonbeam.network";
  }
  return {
    // accounts: {
    //   count: 10,
    //   mnemonic,
    //   path: "m/44'/60'/0'/0",
    //   initialIndex:2,
    // },
    accounts: [`${process.env.PRIVATE_KEY}`],
    chainId: chainIds[network],
    url,
    // gasPrice: network == "bsc" ? 20000000000 : 200000000000,
    // gasPrice: 14_000_000_000
  };
}

const config = {
  defaultNetwork: "hardhat",
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic,
      },
      chainId: chainIds.hardhat,
      mining: {
        auto: true,
        interval: 100,
      },
    },
    ganache1: {
      chainId: 7545,
      url: "http://127.0.0.1:7545/",
      accounts: {
        mnemonic,
      },
    },
    ganache2: {
      chainId: 2,
      url: "http://127.0.0.1:8546/",
      accounts: {
        mnemonic,
      },
    },

    ropsten: {
      saveDeployments: true,
      accounts: {
        initialIndex: 0,
        mnemonic,
        // path: "m/44'/60'/0'/0",
      },
      chainId: chainIds["ropsten"],
      url: "https://ropsten.infura.io/v3/" + infuraApiKey + "",
    },
    rinkeby: {
      saveDeployments: true,
      accounts: {
        initialIndex: 0,
        mnemonic,
        // path: "m/44'/60'/0'/0",
      },
      chainId: chainIds["rinkeby"],
      url: "https://rinkeby.infura.io/v3/" + infuraApiKey + "",
    },
    bscTestnet: {
      saveDeployments: true,
      accounts: {
        initialIndex: 0,
        mnemonic,
        // path: "m/44'/60'/0'/0",
      },
      chainId: chainIds["bscTestnet"],
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
    },
    polygonMumbai: {
      saveDeployments: true,
      accounts: {
        initialIndex: 0,
        mnemonic,
        // path: "m/44'/60'/0'/0",
      },
      chainId: chainIds["mumbai"],
      url: "https://polygon-mumbai.g.alchemy.com/v2/BZ0E4emoGVd4i2_R6I_BcEbqAecpv7Gf",
    },

    kovan: getChainConfig("kovan"),
    polygon: getChainConfig("polygon"),
    bsc: getChainConfig("bsc"),
    avalanche: getChainConfig("avalanche"),

    arbitrum: getChainConfig("arbitrum"),
    fantom: getChainConfig("fantom"),
    optimism: getChainConfig("optimism"),
    mainnet: getChainConfig("mainnet"),
    harmony: getChainConfig("harmony"),
    aurora: getChainConfig("aurora"),
    cronos: getChainConfig("cronos"),
    kava: getChainConfig("kava"),
    moonbeam: getChainConfig("moonbeam"),
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
    // deploy: "./deploy",
    // deployments: "./deployments",
    // imports: "./imports",
  },
  solidity: {
    version: "0.8.2",
    settings: {
      evmVersion: "berlin",
      metadata: {
        // Not including the metadata hash
        // https://github.com/paulrberg/solidity-template/issues/31
        bytecodeHash: "none",
      },
      // You should disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 50,
      },
    },
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  etherscan: {
    apiKey: {
      kovan: process.env.MAINNET_ETHERSCAN_KEY,
      polygonMumbai: process.env.POLYGON_ETHERSCAN_KEY,
      polygon: process.env.POLYGON_ETHERSCAN_KEY,
      bsc: process.env.BSC_ETHERSCAN_KEY,
      avalanche: "QAE2JD7XIBCYB6Z6GSKNJIHKZ8XGVYM8AI",
      kava: "notempty",
      opera: process.env.FTM_KEY,
      arbitrumOne: process.env.ARBITRUM_KEY,
      optimisticEthereum: process.env.OPTIMISM_KEY,
      mainnet: process.env.ETH_ETHERSCAN_KEY,
      aurora: process.env.AURORA_KEY,
      cronos: process.env.CRONOS_KEY,
      harmony: process.env.HARMONY_KEY,
      moonbeam: process.env.MOONBEAM_KEY,
    },
    customChains: [
      {
        network: "cronos",
        chainId: 25,
        urls: {
          apiURL: "https://api.cronoscan.com/api",
          browserURL: "https://cronoscan.com/",
        },
      },
      {
        network: "kava",
        chainId: 2222,
        urls: {
          apiURL: "https://explorer.kava.io/api",
          browserURL: "https://explorer.kava.io",
        },
      },
    ],
  },
};

// const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
//   // code here
// };
export default config;
