import type { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async ({ midl }) => {
  console.log("🚀 Starting Wrapped Tokens deployment...");
  
  await midl.initialize();
  
  // Deploy all wrapped tokens in one transaction
  console.log("📦 Deploying WrappedBTC...");
  await midl.deploy("WrappedBTC", []);
  
  console.log("📦 Deploying WrappedETH...");
  await midl.deploy("WrappedETH", []);
  
  console.log("📦 Deploying WrappedSOL...");
  await midl.deploy("WrappedSOL", []);
  
  await midl.execute();
  
  const wbtc = await midl.get("WrappedBTC");
  const weth = await midl.get("WrappedETH");
  const wsol = await midl.get("WrappedSOL");
  
  console.log("\n=== Wrapped Tokens Deployment Complete ===");
  console.log("WrappedBTC (WBTC):", wbtc?.address);
  console.log("WrappedETH (WETH):", weth?.address);
  console.log("WrappedSOL (WSOL):", wsol?.address);
  console.log("=========================================\n");
};

deploy.tags = ["WrappedTokens", "tokens"];

export default deploy;
