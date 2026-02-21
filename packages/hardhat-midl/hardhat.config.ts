import "@midl/hardhat-deploy";
import { MaestroSymphonyProvider, MempoolSpaceProvider } from "@midl/core";
import { midl, midlRegtest } from "@midl/executor";
import "@typechain/hardhat";
import { config as dotenvConfig } from "dotenv";
import "hardhat-deploy";
import type { HardhatUserConfig } from "hardhat/config";
import { resolve } from "path";

dotenvConfig({ path: resolve(__dirname, "./.env") });

const walletsPaths = {
  default: "m/86'/1'/0'/0/0",
};

const accounts = [
  process.env.MNEMONIC ||
    "vintage brisk patch luxury pink lab pear input aisle opinion develop table",
];

const config: HardhatUserConfig = {
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  networks: {
    default: {
      url: "https://rpc.mainnet.midl.xyz",
      accounts: {
        mnemonic: accounts[0],
        path: walletsPaths.default,
      },
      chainId: midl.id,
    },
    regtest: {
      url: "https://rpc.staging.midl.xyz",
      accounts: {
        mnemonic: accounts[0],
        path: walletsPaths.default,
      },
      chainId: midlRegtest.id,
    },
  },
  midl: {
    path: "deployments",
    networks: {
      default: {
        mnemonic: accounts[0],
        confirmationsRequired: 1,
        btcConfirmationsRequired: 1,
        hardhatNetwork: "default",
        network: {
          explorerUrl: "https://mempool.space",
          id: "mainnet",
          network: "bitcoin",
        },
        providerFactory: () =>
          new MempoolSpaceProvider({
            mainnet: "https://mempool.space",
          }),
        runesProviderFactory: () =>
          new MaestroSymphonyProvider({
            mainnet: "https://runes.mainnet.midl.xyz",
          }),
      },
      regtest: {
        mnemonic: accounts[0],
        confirmationsRequired: 1,
        btcConfirmationsRequired: 1,
        hardhatNetwork: "regtest",
        network: {
          explorerUrl: "https://mempool.staging.midl.xyz",
          id: "regtest",
          network: "regtest",
        },
        providerFactory: () =>
          new MempoolSpaceProvider({
            regtest: "https://mempool.staging.midl.xyz",
          }),
        runesProviderFactory: () =>
          new MaestroSymphonyProvider({
            regtest: "https://runes.staging.midl.xyz",
          }),
      },
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 999999,
          },
        },
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 999999,
          },
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
} as any;

export default config;
