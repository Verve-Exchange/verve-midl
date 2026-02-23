import type { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async (hre) => {
  const { midl } = hre as any;
  
  console.log("🚀 Starting TokenFactory deployment...");
  
  await midl.initialize();
  
  // Get Uniswap addresses from previous deployments
  const factory = await midl.get("UniswapV2Factory");
  const router = await midl.get("UniswapV2Router02");
  
  if (!factory || !router) {
    throw new Error("Uniswap contracts not deployed. Run Uniswap deployment first.");
  }
  
  await midl.deploy("TokenFactory", [factory.address, router.address]);
  await midl.execute();
  
  const contract = await midl.get("TokenFactory");
  console.log("✅ TokenFactory deployed at:", contract?.address);
  console.log("   Using Uniswap Factory:", factory.address);
  console.log("   Using Uniswap Router:", router.address);
};

deploy.tags = ["TokenFactory"];
deploy.dependencies = ["Uniswap"];

export default deploy;
