import "@typechain/hardhat";
import "@midl/hardhat-deploy";
import "hardhat-deploy";
import "@nomicfoundation/hardhat-verify";
import { vars, type HardhatUserConfig } from "hardhat/config";
import { midlRegtest } from "@midl/executor";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  midl: {
    networks: {
      regtest: {
        mnemonic: vars.get("MNEMONIC", "test test test test test test test test test test test junk"),
        confirmationsRequired: 1,
        btcConfirmationsRequired: 1,
      },
    },
  },
  networks: {
    regtest: {
      url: midlRegtest.rpcUrls.default.http[0],
      chainId: midlRegtest.id,
    },
  },
  etherscan: {
    apiKey: {
      regtest: "empty",
    },
    customChains: [
      {
        network: "regtest",
        chainId: midlRegtest.id,
        urls: {
          apiURL: "https://blockscout.staging.midl.xyz/api",
          browserURL: "https://blockscout.staging.midl.xyz",
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
};

export default config;
