import type { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async ({ midl }) => {
  console.log("🚀 Starting MarginAccount deployment...");
  
  await midl.initialize();
  await midl.deploy("MarginAccount", []);
  await midl.execute();
  
  const contract = await midl.get("MarginAccount");
  console.log("✅ MarginAccount deployed at:", contract?.address);
};

deploy.tags = ["MarginAccount", "main"];

export default deploy;
