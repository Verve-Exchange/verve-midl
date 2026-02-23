import hre from "hardhat";
import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🚀 Starting full deployment...\n");
  
  const deployments: Record<string, string> = {};
  
  try {
    // Get provider and signer
    const provider = new ethers.JsonRpcProvider(hre.network.config.url);
    const accounts = hre.network.config.accounts as any;
    const wallet = ethers.Wallet.fromPhrase(accounts.mnemonic).connect(provider);
    
    console.log("📍 Deployer address:", wallet.address);
    console.log("💰 Deployer balance:", ethers.formatEther(await provider.getBalance(wallet.address)), "ETH\n");
    
    // 1. Deploy SimpleStorage
    console.log("📦 Deploying SimpleStorage...");
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    const simpleStorage = await SimpleStorage.deploy("Hello from MIDL!");
    await simpleStorage.waitForDeployment();
    deployments["SimpleStorage"] = await simpleStorage.getAddress();
    console.log("✅ SimpleStorage:", deployments["SimpleStorage"], "\n");
    
    // 2. Deploy WETH9
    console.log("📦 Deploying WETH9...");
    const WETH9 = await ethers.getContractFactory("WETH9");
    const weth9 = await WETH9.deploy();
    await weth9.waitForDeployment();
    deployments["WETH9"] = await weth9.getAddress();
    console.log("✅ WETH9:", deployments["WETH9"], "\n");
    
    // 3. Deploy UniswapV2Factory
    console.log("📦 Deploying UniswapV2Factory...");
    const UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory");
    const factory = await UniswapV2Factory.deploy(deployer.address);
    await factory.waitForDeployment();
    deployments["UniswapV2Factory"] = await factory.getAddress();
    console.log("✅ UniswapV2Factory:", deployments["UniswapV2Factory"], "\n");
    
    // 4. Deploy UniswapV2Router02
    console.log("📦 Deploying UniswapV2Router02...");
    const UniswapV2Router02 = await ethers.getContractFactory("UniswapV2Router02");
    const router = await UniswapV2Router02.deploy(deployments["UniswapV2Factory"], deployments["WETH9"]);
    await router.waitForDeployment();
    deployments["UniswapV2Router02"] = await router.getAddress();
    console.log("✅ UniswapV2Router02:", deployments["UniswapV2Router02"], "\n");
    
    // 5. Deploy Wrapped Tokens
    console.log("📦 Deploying WrappedBTC...");
    const WrappedBTC = await ethers.getContractFactory("WrappedBTC");
    const wbtc = await WrappedBTC.deploy();
    await wbtc.waitForDeployment();
    deployments["WrappedBTC"] = await wbtc.getAddress();
    console.log("✅ WrappedBTC:", deployments["WrappedBTC"], "\n");
    
    console.log("📦 Deploying WrappedETH...");
    const WrappedETH = await ethers.getContractFactory("WrappedETH");
    const weth = await WrappedETH.deploy();
    await weth.waitForDeployment();
    deployments["WrappedETH"] = await weth.getAddress();
    console.log("✅ WrappedETH:", deployments["WrappedETH"], "\n");
    
    console.log("📦 Deploying WrappedSOL...");
    const WrappedSOL = await ethers.getContractFactory("WrappedSOL");
    const wsol = await WrappedSOL.deploy();
    await wsol.waitForDeployment();
    deployments["WrappedSOL"] = await wsol.getAddress();
    console.log("✅ WrappedSOL:", deployments["WrappedSOL"], "\n");
    
    // Save deployment addresses
    const deploymentsPath = path.join(__dirname, "../deployments.json");
    fs.writeFileSync(deploymentsPath, JSON.stringify(deployments, null, 2));
    
    console.log("\n" + "=".repeat(80));
    console.log("🎉 DEPLOYMENT COMPLETE");
    console.log("=".repeat(80));
    console.log("\nDeployed Contracts:");
    console.log("-".repeat(80));
    for (const [name, address] of Object.entries(deployments)) {
      console.log(`${name.padEnd(25)} ${address}`);
    }
    console.log("-".repeat(80));
    console.log(`\n📄 Addresses saved to: ${deploymentsPath}\n`);
    
  } catch (error) {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
