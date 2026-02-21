import type { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async ({ midl }) => {
  console.log("🚀 Starting Token deployment...");
  
  await midl.initialize();
  await midl.deploy("Token", ["Verve Token", "VERVE", "1000000000000000000000000"]);
  await midl.execute();
  
  const contract = await midl.get("Token");
  console.log("✅ Token deployed at:", contract?.address);
};

deploy.tags = ["Token"];

export default deploy;
