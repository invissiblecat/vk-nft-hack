import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 5000,
      },
    },
  },
  networks: {
    hardhat: {
      accounts: { count: 20 },
    },
    testnet_bnb: {
      url: process.env.TESTNET_BNB || "",
      accounts: [process.env.PRIVATE_KEY_TESTNET || ""],
    },
  },
  // typechain: {
  //   outDir: "../typechain-types",
  // },
};

export default config;
