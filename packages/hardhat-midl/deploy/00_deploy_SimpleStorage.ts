import type { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async (hre) => {
  const { midl } = hre as any;
  
  console.log("🚀 Starting SimpleStorage deployment...");
  
  await midl.initialize();
  await midl.deploy("SimpleStorage", ["Hello from MIDL!"]);
  await midl.execute();
  
  const contract = await midl.get("SimpleStorage");
  console.log("✅ SimpleStorage deployed at:", contract?.address);
};

deploy.tags = ["SimpleStorage"];

export default deploy;
