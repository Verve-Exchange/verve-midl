/**
 * Deploy all contracts using MIDL's deployment system
 * This script runs all deploy scripts in the deploy/ folder
 */

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function main() {
  console.log("🚀 Deploying all contracts via MIDL hardhat-deploy...\n");
  
  try {
    // Run hardhat deploy command which will execute all deploy scripts
    const { stdout, stderr } = await execAsync(
      "pnpm exec hardhat deploy --network regtest",
      { 
        cwd: process.cwd(),
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer for large outputs
      }
    );
    
    if (stdout) {
      console.log(stdout);
    }
    
    if (stderr) {
      console.error("Warnings/Errors:", stderr);
    }
    
    console.log("\n✅ All contracts deployed successfully!");
    console.log("\n📄 Check deployment files in: packages/hardhat-midl/deployments/");
    console.log("📖 Read full documentation: packages/hardhat-midl/DEPLOYMENTS.md");
    
  } catch (error: any) {
    console.error("\n❌ Deployment failed:");
    console.error(error.message);
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.error(error.stderr);
    process.exit(1);
  }
}

main();
