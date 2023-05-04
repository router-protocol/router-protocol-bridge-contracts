import { BridgeConfig } from "./utils";

export enum ChainId {
  MAINNET = "1",
  ROPSTEN = "3",
  RINKEBY = "4",
  GÖRLI = "5",
  KOVAN = "42",
  FUJI = "43113",
  POLYGON = "137",
  MUMBAI = "80001",
  OKEX = "66",
  ARBITRUM = "42161",
  FANTOM = "250",
  XDAI = "100",
  BSC = "56",
  HARMONY = "1666600000",
  AVALANCHE = "43114",
  OPTIMISM = "10",
  AURORA = "1313161554",
  CRONOS = "25",
  KAVA = "2222",
  MOONBEAM = "1284",
}

export const contracts: any = {
  BRIDGE: "BridgeUpgradeable",
  VOTER: "VoterUpgradeable",
  ERC20HANDLER: "ERC20HandlerUpgradeable",
  FEEMANGER: "FeeManagerUpgradeable",
  DFYN: "RouterERC20UpgradableToken",
  ROUTE: "RouterERC20UpgradableToken",
  ERC20Token: "RouterERC20UpgradableToken",
  HANDLERRESERVE: "HandlerReserveUpgradeable",
  GENERICHANDLER: "GenericHandlerUpgradeable",
  FEEMANAGERGENERIC: "FeeManagerGenericUpgradeable",
  SEQUENCER: "SequencerHandlerUpgradeable",
  USDCBURNER: "UsdcDepositAndBurn",
  USDCMINTER: "UsdcMinter",
  AURORABRIDGE: "AuroraBridgeUpgradeable",
};

export const TASK_ACCOUNTS: string = "accounts";
export const TASK_GRANT_ROLE: string = "grant-role";
export const TASK_REVOKE_ROLE: string = "revoke-role";
export const TASK_ADD_RELAYER: string = "add-relayer";
export const TASK_REMOVE_RELAYER: string = "remove-relayer";
export const TASK_SET_RESOURCE: string = "set-resource";
export const TASK_SET_BURNABLE: string = "set-burnable";
export const TASK_SET_FEE: string = "set-fee";
export const TASK_SET_FEE_STATUS: string = "set-fee-status";
export const TASK_VERIFY_PROXY: string = "verify-proxy";
export const TASK_VERIFY_ALL: string = "verify-all";
export const TASK_SET_ONESPLIT: string = "set-onesplit";
export const TASK_BRIDGE_PAUSE: string = "pause";
export const TASK_SET_LP: string = "set-lp";
export const TASK_SET_DECIMAL: string = "set-decimal";
export const TASK_SET_LP_OWNER: string = "set-lp-owner";
export const TASK_CHANGE_QUORUM: string = "change-quorum";
export const TASK_RESERVE_BALANCE: string = "reserve-balance";
export const TASK_CREATE_RESOURCE_ID: string = "create-resource-id";
export const TASK_SET_MULTIPLE_DECIMAL: string = "set-multiple-decimal";
export const TASK_SET_MULTIPLE_FEES: string = "set-multiple-fees";
export const TASK_SET_MULTIPLE_RESOURCE: string = "set-multiple-resource";
export const TASK_SET_UNSUPPORTED_CHAIN: string = "task-set-unsupported-chain";
export const TASK_SET_GENERIC_RESOURCE: string = "task-set-generic-resource";
export const TASK_SET_SEQUENCER_RESOURCE: string = "task-set-sequencer-resource";
export const TASK_SET_SEQUENCER_ON_HANDLER: string = "task-set-sequencer-on-handler";
export const TASK_SET_MULTIPLE_GENERIC_FEES: string = "task-set-multiple-generic-fees";
export const TASK_SET_MULTIPLE_GASLIMIT: string = "task-set-multiple-gas-limit";
export const TASK_SET_MULTIPLE_GASPRICE: string = "task-set-multiple-gas-price";
export const TASK_SET_MULTIPLE_GASLIMIT_ON_SEQUENCER: string = "task-set-multiple-gas-limit-on-sequencer";
export const TASK_SET_MULTIPLE_GASPRICE_ON_SEQUENCER: string = "task-set-multiple-gas-price-on-sequencer";
export const TASK_SET_RESERVE_ON_USDC_DEPOSIT_AND_BURN: string = "task-set-reserve-on-usdc-burner";
export const TASK_SET_CHAINID_ON_GENHANDLER: string = "set-chain-id-on-genhandler";
export const TASK_SET_DEST_DETAILS_ON_USDC_BURNER: string = "set-dest-details-on-usdc-burner";
export const TASK_SET_USDC_ON_ERC20_HANDLER: string = "set-usdc-on-erc20-handler";
export const TASK_SET_USDC_BURNER_ON_ERC20_HANDLER: string = "set-usdc-burner-on-erc20-handler";
export const TASK_SET_USDC_CHAIN_PAIRS_ON_ERC20_HANDLER: string = "set-usdc-chain-pairs-on-erc20-handler";
export const TASK_SET_RELAYERS_ON_USDC_MINTER: string = "set-relayers-on-usdc-minter";
export const TASK_SET_NONCE_CHECKPOINT_ON_BRIDGE: string = "set-nonce-checkpoint-on-bridge";

export const GENERIC_RESOURCE_ID: string = "0x1111111111111111111111111111111111111111111111111111111111111111";
export const SEQUENCER_RESOURCE_ID: string = "0x2222222222222222222222222222222222222222222222222222222222222222";

export const FACTORY_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac",
  [ChainId.ROPSTEN]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  [ChainId.RINKEBY]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  [ChainId.GÖRLI]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  [ChainId.KOVAN]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  [ChainId.MUMBAI]: "0xE7Fb3e833eFE5F9c441105EB65Ef8b261266423B",
  [ChainId.POLYGON]: "0xE7Fb3e833eFE5F9c441105EB65Ef8b261266423B",
  [ChainId.OKEX]: "0xE7Fb3e833eFE5F9c441105EB65Ef8b261266423B",
  [ChainId.ARBITRUM]: "0xa102072a4c07f06ec3b4900fdc4c7b80b6c57429",
  [ChainId.XDAI]: "0x4c28f48448720e9000907BC2611F73022fdcE1fA",
  [ChainId.FANTOM]: "0xd9820a17053d6314B20642E465a84Bf01a3D64f5",
  [ChainId.BSC]: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73", // pancake
  [ChainId.AVALANCHE]: "0xd9820a17053d6314B20642E465a84Bf01a3D64f5",
  [ChainId.OPTIMISM]: "0xd9820a17053d6314B20642E465a84Bf01a3D64f5",
  [ChainId.HARMONY]: "0xd9820a17053d6314B20642E465a84Bf01a3D64f5",
  [ChainId.AURORA]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  [ChainId.CRONOS]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  [ChainId.KAVA]: "",
  [ChainId.MOONBEAM]: "",
  [ChainId.FUJI]: "",
  [ChainId.GÖRLI]: "",
};

export const ROUTER_ADDRESS: { [chainId in ChainId | string]: string } = {
  [ChainId.MAINNET]: "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
  [ChainId.RINKEBY]: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  [ChainId.ROPSTEN]: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  [ChainId.GÖRLI]: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  [ChainId.KOVAN]: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  [ChainId.MUMBAI]: "0xA102072A4C07F06EC3B4900FDC4C7B80b6c57429",
  [ChainId.POLYGON]: "0xA102072A4C07F06EC3B4900FDC4C7B80b6c57429",
  [ChainId.OKEX]: "0x34686CBF7229ed0bff2Fbe7ED2CFC916317764f6",
  [ChainId.ARBITRUM]: "0xaedE1EFe768bD8A1663A7608c63290C60B85e71c",
  [ChainId.XDAI]: "0xE7Fb3e833eFE5F9c441105EB65Ef8b261266423B",
  [ChainId.FANTOM]: "0x2724B9497b2cF3325C6BE3ea430b3cec34B5Ef2d",
  [ChainId.BSC]: "0x10ED43C718714eb63d5aA57B78B54704E256024E", // pancake bsc
  [ChainId.AVALANCHE]: "0x4c28f48448720e9000907BC2611F73022fdcE1fA",
  [ChainId.OPTIMISM]: "0x4c28f48448720e9000907BC2611F73022fdcE1fA",
  [ChainId.HARMONY]: "0x8973792d9E8EA794E546b62c0f2295e32a6d7E48",
  [ChainId.AURORA]: "0x8973792d9E8EA794E546b62c0f2295e32a6d7E48",
  [ChainId.CRONOS]: "0x8973792d9E8EA794E546b62c0f2295e32a6d7E48",
  [ChainId.KAVA]: "0x6C39Ef688ae7f246D9a1AF65689EFbd933722489",
  [ChainId.MOONBEAM]: "",
};

export const BRIDGE_CONFIG: { [chainId in ChainId]: BridgeConfig | any } = {
  [ChainId.POLYGON]: {
    chainID: "1",
    initialRelayers: [
      "0x111F4B2Af8a0d1A9647C5B3B2B51A2792A466Eec",
      "0x222FD20a8594B74e3Ccca2d6FcFfEFB38CA75a40",
      "0x33378e50Bc92c96b9c7FC35319A71dAA50576995",
    ],
    resourceSetters: ["0xB00BC9e04698A3315B6038225a2E9e42D63C7669"],
    feeSetters: ["0xB00BC9e04698A3315B6038225a2E9e42D63C7669"],
    quorum: "6000",
    expiry: "1000000000",
  },
  [ChainId.BSC]: {
    chainID: "3",
    initialRelayers: [],
    resourceSetters: [],
    feeSetters: [],
    quorum: "6000",
    expiry: "1000000000",
  },
  [ChainId.AVALANCHE]: {
    chainID: "3",
    initialRelayers: [],
    resourceSetters: [],
    feeSetters: [],
    quorum: "6000",
    expiry: "1000000000",
  },
  [ChainId.FANTOM]: {
    chainID: "4",
    initialRelayers: [
      "0x111F4B2Af8a0d1A9647C5B3B2B51A2792A466Eec",
      "0x222FD20a8594B74e3Ccca2d6FcFfEFB38CA75a40",
      "0x33378e50Bc92c96b9c7FC35319A71dAA50576995",
    ],
    resourceSetters: ["0xB00BC9e04698A3315B6038225a2E9e42D63C7669"],
    feeSetters: ["0xB00BC9e04698A3315B6038225a2E9e42D63C7669"],
    quorum: "6000",
    expiry: "1000000000",
  },
  [ChainId.ARBITRUM]: {
    chainID: "5",
    initialRelayers: [
      "0x04732fd4Ec57641257124eA3e03974eb50ef9b19",
      "0xc8aBF85F9840B4156E0fdF0532E86f6F3E8620a9",
      "0x33AEE8d62C7588fff9935c83Fd24E344B4309E5D",
    ],
    resourceSetters: [],
    feeSetters: [],
    quorum: "6000",
    expiry: "1000000000",
  },
  [ChainId.OPTIMISM]: {
    chainID: "6",
    initialRelayers: [
      "0x04732fd4Ec57641257124eA3e03974eb50ef9b19",
      "0xc8aBF85F9840B4156E0fdF0532E86f6F3E8620a9",
      "0x33AEE8d62C7588fff9935c83Fd24E344B4309E5D",
    ],
    resourceSetters: [],
    feeSetters: [],
    quorum: "6000",
    expiry: "1000000000",
  },
  [ChainId.MAINNET]: {
    chainID: "7",
    initialRelayers: [
      "0x04732fd4Ec57641257124eA3e03974eb50ef9b19",
      "0xc8aBF85F9840B4156E0fdF0532E86f6F3E8620a9",
      "0x33AEE8d62C7588fff9935c83Fd24E344B4309E5D",
    ],
    resourceSetters: [],
    feeSetters: [],
    quorum: "6000",
    expiry: "1000000000",
  },
  [ChainId.HARMONY]: {
    chainID: "8",
    initialRelayers: [
      "0x04732fd4Ec57641257124eA3e03974eb50ef9b19",
      "0xc8aBF85F9840B4156E0fdF0532E86f6F3E8620a9",
      "0x33AEE8d62C7588fff9935c83Fd24E344B4309E5D",
    ],
    resourceSetters: [],
    feeSetters: [],
    quorum: "6000",
    expiry: "10000000000",
  },
  [ChainId.AURORA]: {
    chainID: "9",
    initialRelayers: [
      "0x04732fd4Ec57641257124eA3e03974eb50ef9b19",
      "0xc8aBF85F9840B4156E0fdF0532E86f6F3E8620a9",
      "0x33AEE8d62C7588fff9935c83Fd24E344B4309E5D",
    ],
    resourceSetters: [],
    feeSetters: [],
    quorum: "6000",
    expiry: "1000900000",
  },
  [ChainId.CRONOS]: {
    chainID: "10",
    initialRelayers: [
      "0x04732fd4Ec57641257124eA3e03974eb50ef9b19",
      "0xc8aBF85F9840B4156E0fdF0532E86f6F3E8620a9",
      "0x33AEE8d62C7588fff9935c83Fd24E344B4309E5D",
    ],
    resourceSetters: [],
    feeSetters: [],
    quorum: "6000",
    expiry: "1000000000",
  },
  // "43114": undefined,
  [ChainId.KAVA]: {
    chainID: "11",
    initialRelayers: [],
    resourceSetters: [],
    feeSetters: [],
    quorum: "6000",
    expiry: "1000000000",
  },
  [ChainId.MOONBEAM]: {
    chainID: "12",
    initialRelayers: [],
    resourceSetters: [],
    feeSetters: [],
    quorum: "6000",
    expiry: "1000000000",
  },
  [ChainId.ROPSTEN]: {
    chainID: "3",
    initialRelayers: ["0x33bCDe3dA095C1D2681F3167E5696bf5b7d4F321"],
    resourceSetters: [],
    feeSetters: [],
    quorum: "6000",
    expiry: "1000000000",
  },
  [ChainId.KOVAN]: {
    chainID: "1",
    initialRelayers: [
      "0x07548c2Dad52662AAa9F2090A1b38F57dAFc82A9",
      "0x33bCDe3dA095C1D2681F3167E5696bf5b7d4F321",
      "0x17DB1CfEd662f79d646094bf610f5bB17F036Dca",
    ],
    resourceSetters: [],
    feeSetters: [],
    quorum: "6000",
    expiry: "1000000000",
  },
  [ChainId.MUMBAI]: {
    chainID: "1",
    initialRelayers: [
      "0x111F4B2Af8a0d1A9647C5B3B2B51A2792A466Eec",
      "0x222FD20a8594B74e3Ccca2d6FcFfEFB38CA75a40",
      "0x33378e50Bc92c96b9c7FC35319A71dAA50576995",
    ],
    resourceSetters: ["0xabcdc08242E4395B0f78E476af4b6c2659f1DBC8"],
    feeSetters: ["0xabcdc08242E4395B0f78E476af4b6c2659f1DBC8"],
    quorum: "6000",
    expiry: "1000000000",
  },
  [ChainId.GÖRLI]: {
    chainID: "7",
    initialRelayers: [
      "0x111F4B2Af8a0d1A9647C5B3B2B51A2792A466Eec",
      "0x222FD20a8594B74e3Ccca2d6FcFfEFB38CA75a40",
      "0x33378e50Bc92c96b9c7FC35319A71dAA50576995",
    ],
    resourceSetters: ["0xabcdc08242E4395B0f78E476af4b6c2659f1DBC8"],
    feeSetters: ["0xabcdc08242E4395B0f78E476af4b6c2659f1DBC8"],
    quorum: "6000",
    expiry: "1000000000",
  },
  [ChainId.FUJI]: {
    chainID: "3",
    initialRelayers: [
      "0x111F4B2Af8a0d1A9647C5B3B2B51A2792A466Eec",
      "0x222FD20a8594B74e3Ccca2d6FcFfEFB38CA75a40",
      "0x33378e50Bc92c96b9c7FC35319A71dAA50576995",
    ],
    resourceSetters: ["0xabcdc08242E4395B0f78E476af4b6c2659f1DBC8"],
    feeSetters: ["0xabcdc08242E4395B0f78E476af4b6c2659f1DBC8"],
    quorum: "6000",
    expiry: "1000000000",
  },
  "4": [],
  "66": [],
  "100": [],
};

export const ETH: { [chainId in ChainId | any]: string } = {
  [ChainId.RINKEBY]: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  [ChainId.ROPSTEN]: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  [ChainId.GÖRLI]: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  [ChainId.KOVAN]: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  [ChainId.MUMBAI]: "0x0000000000000000000000000000000000001010",
  [ChainId.POLYGON]: "0x0000000000000000000000000000000000001010",
  [ChainId.OKEX]: "0x0000000000000000000000000000000000001010",
  [ChainId.XDAI]: "0x0000000000000000000000000000000000001010",
  [ChainId.HARMONY]: "0x0000000000000000000000000000000000001010",
  [ChainId.BSC]: "0x0000000000000000000000000000000000001010",
  [ChainId.AVALANCHE]: "0x0000000000000000000000000000000000001010",

  [ChainId.MAINNET]: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  [ChainId.FANTOM]: "0x0100000000000000000000000000000000000001",
  [ChainId.ARBITRUM]: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  [ChainId.OPTIMISM]: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",

  [ChainId.HARMONY]: "0x0000000000000000000000000000000000001010",
  [ChainId.AURORA]: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  [ChainId.CRONOS]: "0x0000000000000000000000000000000000001010",
  [ChainId.KAVA]: "0x0000000000000000000000000000000000001010",
  [ChainId.MOONBEAM]: "0x0000000000000000000000000000000000000802",
  [ChainId.FUJI]: "0x0000000000000000000000000000000000001010",
  [ChainId.MUMBAI]: "0x0000000000000000000000000000000000001010",
  [ChainId.GÖRLI]: "0x0000000000000000000000000000000000001010",
};

export const WETH: { [chainId in ChainId | any]: string | undefined } = {
  [ChainId.RINKEBY]: "0xd0A1E359811322d97991E03f863a0C30C2cF029C",
  [ChainId.ROPSTEN]: "0xd0A1E359811322d97991E03f863a0C30C2cF029C",
  [ChainId.GÖRLI]: "0xd0A1E359811322d97991E03f863a0C30C2cF029C",
  [ChainId.KOVAN]: "0xd0A1E359811322d97991E03f863a0C30C2cF029C",
  [ChainId.MUMBAI]: "0x6373c962DCFfc21465973150993E19F56d8640a4",
  [ChainId.POLYGON]: "0x4c28f48448720e9000907BC2611F73022fdcE1fA",
  [ChainId.OKEX]: "0x6373c962DCFfc21465973150993E19F56d8640a4",
  [ChainId.XDAI]: "0x6373c962DCFfc21465973150993E19F56d8640a4",
  [ChainId.HARMONY]: "0x6373c962DCFfc21465973150993E19F56d8640a4",
  [ChainId.BSC]: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", // WBNB
  [ChainId.AVALANCHE]: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",

  [ChainId.MAINNET]: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", //WETH
  [ChainId.ARBITRUM]: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", //WETH
  [ChainId.FANTOM]: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83", //WFTM
  [ChainId.OPTIMISM]: "0x4200000000000000000000000000000000000006", //WETH

  [ChainId.HARMONY]: "0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a",
  [ChainId.AURORA]: "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
  [ChainId.CRONOS]: "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23",
  [ChainId.KAVA]: "0xc86c7c0efbd6a49b35e8714c5f59d99de09a225b",
  [ChainId.MOONBEAM]: "0xacc15dc74880c9944775448304b263d191c6077f",
  [ChainId.FUJI]: "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
  [ChainId.GÖRLI]: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
};

export const ONESPLIT: { [chainId in ChainId | any]: string | undefined } = {
  [ChainId.RINKEBY]: "0x50D30bB7C64FB5d8dBca332541133c86EB0232A8",
  [ChainId.ROPSTEN]: "0x237F87Fd5cFA8E01396C5ea696c65FF36a731AE2",
  [ChainId.GÖRLI]: "0xd0A1E359811322d97991E03f863a0C30C2cF029C",
  [ChainId.KOVAN]: "0x97BDF7358164C3294466147ccFC00f521c11c164",
  [ChainId.MUMBAI]: "0x154Efcbc23EbB7566bd74fE77C5F32a3a6eD67bA",
  [ChainId.POLYGON]: "0xa9769da9482D35Bb62A96625FcC3ee0e4bA5cE20",
  [ChainId.OKEX]: "0x237F87Fd5cFA8E01396C5ea696c65FF36a731AE2",
  [ChainId.XDAI]: "0x237F87Fd5cFA8E01396C5ea696c65FF36a731AE2",
  [ChainId.HARMONY]: "0x237F87Fd5cFA8E01396C5ea696c65FF36a731AE2",
  [ChainId.BSC]: "0x5febcA23e97c8ead354318e5A3Ed34ec3704459a",
  [ChainId.AVALANCHE]: "0x237F87Fd5cFA8E01396C5ea696c65FF36a731AE2",

  [ChainId.MAINNET]: "0x323B7aF7Bdd2443Dde8B14e7654804D7Ac2292B1",
  [ChainId.FANTOM]: "0x222bBd96048bdd9c0605faD75e82A22e29fC6ee3",
  [ChainId.ARBITRUM]: "0xa62D2946DE44E89Ae2357ce2FcaebC85C7a25257",
  [ChainId.OPTIMISM]: "0x049137d5C3ea6cbdc3b5ba29fb4CF4eF752e578E",
  [ChainId.MOONBEAM]: "0xe5604a9a7E08c02147b0FFB3ce2C151F2aDa2A52",
  [ChainId.KAVA]: "0x964581cE26CEB898acf165353e360a1Bb60e820f",

  [ChainId.HARMONY]: "0xa62D2946DE44E89Ae2357ce2FcaebC85C7a25257",
  [ChainId.AURORA]: "0xa62D2946DE44E89Ae2357ce2FcaebC85C7a25257",
  [ChainId.CRONOS]: "0xa62D2946DE44E89Ae2357ce2FcaebC85C7a25257",
  [ChainId.FUJI]: "0xa62D2946DE44E89Ae2357ce2FcaebC85C7a25257",
  [ChainId.GÖRLI]: "0xa62D2946DE44E89Ae2357ce2FcaebC85C7a25257",
};
