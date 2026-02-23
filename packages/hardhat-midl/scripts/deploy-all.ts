import hre from "hardhat";
import * as fs from "fs";
import * as path from "path";
import "hardhat-deploy";

/**
 * This script runs all deployment scripts in order
 * It uses the hardhat-deploy plugin to execute deploy scripts
 */
async function main() {
  console.log("🚀 Starting full deployment via hardhat-deploy...\n");
  console.log("Network:", hre.network.name);
  
  const networkConfig = hre.network.config as any;
  if (networkConfig.url) {
    console.log("RPC URL:", networkConfig.url);
  }
  console.log("\n" + "=".repeat(80) + "\n");

  try {
    // Run all deploy scripts using hardhat-deploy
    // This will execute all scripts in the deploy/ folder in order
    const { deployments } = hre as any;
    
    console.log("📦 Running deployment scripts...\n");
    
    // Deploy all contracts
    await deployments.fixture();
    
    // Get all deployed contracts
    const allDeployments = await deployments.all();
    
    console.log("\n" + "=".repeat(80));
    console.log("🎉 DEPLOYMENT COMPLETE");
    console.log("=".repeat(80));
    console.log("\nDeployed Contracts:");
    console.log("-".repeat(80));
    
    const deploymentSummary: Record<string, any> = {};
    
    for (const [name, deployment] of Object.entries(allDeployments)) {
      const dep = deployment as any;
      console.log(`${name.padEnd(25)} ${dep.address}`);
      deploymentSummary[name] = {
        address: dep.address,
        txHash: dep.transactionHash,
      };
    }
    
    console.log("-".repeat(80));
    console.log(`\nTotal contracts deployed: ${Object.keys(allDeployments).length}`);
    
    // Save deployment summary
    const summaryPath = path.join(__dirname, "../deployment-summary.json");
    fs.writeFileSync(summaryPath, JSON.stringify(deploymentSummary, null, 2));
    console.log(`\n📄 Deployment summary saved to: ${summaryPath}\n`);
    
    // Print network info
    console.log("Network Information:");
    console.log("-".repeat(80));
    console.log(`Network: ${hre.network.name}`);
    if (networkConfig.url) {
      console.log(`RPC URL: ${networkConfig.url}`);
    }
    if (networkConfig.chainId) {
      console.log(`Chain ID: ${networkConfig.chainId}`);
    }
    console.log("-".repeat(80) + "\n");
    
  } catch (error) {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => {
    console.log("✅ All deployments completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });
