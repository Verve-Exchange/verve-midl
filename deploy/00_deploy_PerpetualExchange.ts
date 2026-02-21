import type { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async (hre) => {
  console.log("🚀 Starting PerpetualExchange deployment...");
  
  // Initialize the MIDL hardhat deploy SDK
  await hre.midl.initialize();
  
  // Deploy the PerpetualExchange contract
  await hre.midl.deploy("PerpetualExchange", []);
  
  // Send the BTC transaction and EVM transaction to the network
  await hre.midl.execute();
  
  console.log("✅ PerpetualExchange deployed successfully!");
};

deploy.tags = ["main", "PerpetualExchange"];

export default deploy;
