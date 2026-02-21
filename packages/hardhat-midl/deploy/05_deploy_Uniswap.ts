import type { DeployFunction } from "hardhat-deploy/types";
import type { HardhatRuntimeEnvironment } from "hardhat/types";

const deploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { midl, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  
  console.log("🚀 Starting Uniswap V2 deployment...");
  console.log("📍 Deployer address:", deployer);
  
  await midl.initialize();
  
  // Deploy WETH9
  console.log("📦 Deploying WETH9...");
  await midl.deploy("WETH9", []);
  
  // Deploy UniswapV2Factory
  console.log("📦 Deploying UniswapV2Factory...");
  await midl.deploy("UniswapV2Factory", [deployer]); // feeToSetter
  
  // Execute all deployments
  await midl.execute();
  
  const weth = await midl.get("WETH9");
  const factory = await midl.get("UniswapV2Factory");
  
  console.log("✅ WETH9 deployed at:", weth?.address);
  console.log("✅ UniswapV2Factory deployed at:", factory?.address);
  
  // Deploy UniswapV2Router02 in a separate transaction
  await midl.initialize();
  console.log("📦 Deploying UniswapV2Router02...");
  await midl.deploy("UniswapV2Router02", [factory?.address, weth?.address]);
  await midl.execute();
  
  const router = await midl.get("UniswapV2Router02");
  console.log("✅ UniswapV2Router02 deployed at:", router?.address);
  
  console.log("\n=== Uniswap V2 Deployment Complete ===");
  console.log("WETH9:", weth?.address);
  console.log("Factory:", factory?.address);
  console.log("Router:", router?.address);
  console.log("=====================================\n");
};

deploy.tags = ["Uniswap"];

export default deploy;
