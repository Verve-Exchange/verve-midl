import type { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async ({ midl }) => {
  console.log("🚀 Starting PerpetualExchange deployment...");
  
  await midl.initialize();
  await midl.deploy("PerpetualExchange", []);
  await midl.execute();
  
  const contract = await midl.get("PerpetualExchange");
  console.log("✅ PerpetualExchange deployed at:", contract?.address);
};

deploy.tags = ["PerpetualExchange", "main"];

export default deploy;
