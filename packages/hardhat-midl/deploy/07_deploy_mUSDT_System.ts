import type { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async (hre) => {
  const { midl } = hre as any;
  
  console.log("🚀 Starting mUSDT Stablecoin System deployment...");
  console.log("\n" + "=".repeat(80) + "\n");
  
  // Get wrapped token addresses
  const wbtc = await midl.get("WrappedBTC");
  const weth = await midl.get("WrappedETH");
  const wsol = await midl.get("WrappedSOL");
  
  if (!wbtc || !weth || !wsol) {
    console.error("❌ Wrapped tokens not deployed. Please deploy them first.");
    return;
  }
  
  // Deploy mUSDT with 100M debt ceiling
  await midl.initialize();
  console.log("📦 Deploying mUSDT (Algorithmic Stablecoin)...");
  const debtCeiling = "100000000" + "0".repeat(18); // 100M mUSDT
  await midl.deploy("mUSDT", [debtCeiling]);
  await midl.execute();
  
  const mUSDT = await midl.get("mUSDT");
  console.log("✅ mUSDT deployed at:", mUSDT?.address);
  console.log("   Debt Ceiling: 100,000,000 mUSDT\n");
  
  // Deploy PerpetualDEX
  await midl.initialize();
  console.log("📦 Deploying PerpetualDEX...");
  await midl.deploy("PerpetualDEX", [mUSDT?.address]);
  await midl.execute();
  
  const perpetualDEX = await midl.get("PerpetualDEX");
  console.log("✅ PerpetualDEX deployed at:", perpetualDEX?.address);
  console.log("   Collateral: mUSDT\n");
  
  // Deploy Faucet (testnet only)
  await midl.initialize();
  console.log("📦 Deploying Faucet (Testnet Only)...");
  await midl.deploy("Faucet", []);
  await midl.execute();
  
  const faucet = await midl.get("Faucet");
  console.log("✅ Faucet deployed at:", faucet?.address);
  console.log("   ⚠️  WARNING: Testnet only - DO NOT deploy to mainnet\n");
  
  console.log("=".repeat(80));
  console.log("🎉 DEPLOYMENT COMPLETE");
  console.log("=".repeat(80));
  console.log("\n📋 Deployed Contracts:");
  console.log("-".repeat(80));
  console.log(`mUSDT:         ${mUSDT?.address}`);
  console.log(`PerpetualDEX:  ${perpetualDEX?.address}`);
  console.log(`Faucet:        ${faucet?.address}`);
  console.log("-".repeat(80));
  
  console.log("\n📝 Post-Deployment Configuration Required:");
  console.log("-".repeat(80));
  console.log("\n1️⃣  Configure mUSDT Collateral Types:");
  console.log(`   mUSDT.configureCollateral(0, "${wbtc.address}", 8, 150, 130, 10, 500)`);
  console.log(`   mUSDT.configureCollateral(1, "${weth.address}", 18, 150, 130, 10, 500)`);
  console.log(`   mUSDT.configureCollateral(2, "${wsol.address}", 9, 175, 150, 12, 700)`);
  
  console.log("\n2️⃣  Set Initial Prices:");
  console.log("   mUSDT.updatePrice(0, 5000000000000) // BTC: $50,000");
  console.log("   mUSDT.updatePrice(1, 300000000000)  // ETH: $3,000");
  console.log("   mUSDT.updatePrice(2, 10000000000)   // SOL: $100");
  
  console.log("\n3️⃣  Configure Faucet:");
  console.log(`   Faucet.configureToken("WBTC", "${wbtc.address}", 100000000, 86400)`);
  console.log(`   Faucet.configureToken("WETH", "${weth.address}", 1000000000000000000, 86400)`);
  console.log(`   Faucet.configureToken("WSOL", "${wsol.address}", 10000000000, 86400)`);
  
  console.log("\n4️⃣  Update Market Prices in PerpetualDEX:");
  console.log('   PerpetualDEX.updatePrice("BTC/USD", 50000000000)');
  console.log('   PerpetualDEX.updatePrice("ETH/USD", 3000000000)');
  console.log('   PerpetualDEX.updatePrice("SOL/USD", 100000000)');
  
  console.log("\n" + "=".repeat(80) + "\n");
};

deploy.tags = ["mUSDT", "PerpetualDEX", "Faucet", "production"];
deploy.dependencies = ["WrappedTokens"];

export default deploy;
