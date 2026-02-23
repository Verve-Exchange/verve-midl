import type { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async (hre) => {
  const { midl } = hre as any;
  
  console.log("\n🔧 Configuring Faucet...\n");
  
  await midl.initialize();
  
  // Get deployed contracts
  const faucet = await midl.get("Faucet");
  const wbtc = await midl.get("WrappedBTC");
  const weth = await midl.get("WrappedETH");
  const wsol = await midl.get("WrappedSOL");
  
  console.log("Contract Addresses:");
  console.log("Faucet:", faucet?.address);
  console.log("WBTC:", wbtc?.address);
  console.log("WETH:", weth?.address);
  console.log("WSOL:", wsol?.address);
  
  // Configure WBTC: 0.01 BTC (8 decimals), 24 hour cooldown
  console.log("\n1. Configuring WBTC...");
  await midl.execute("Faucet", "configureToken", [
    "WBTC",
    wbtc.address,
    "1000000", // 0.01 WBTC (8 decimals)
    "86400"    // 24 hours
  ]);
  console.log("✅ WBTC configured");
  
  // Configure WETH: 1 ETH (18 decimals), 24 hour cooldown
  console.log("\n2. Configuring WETH...");
  await midl.execute("Faucet", "configureToken", [
    "WETH",
    weth.address,
    "1000000000000000000", // 1 WETH (18 decimals)
    "86400"                 // 24 hours
  ]);
  console.log("✅ WETH configured");
  
  // Configure WSOL: 10 SOL (9 decimals), 24 hour cooldown
  console.log("\n3. Configuring WSOL...");
  await midl.execute("Faucet", "configureToken", [
    "WSOL",
    wsol.address,
    "10000000000", // 10 WSOL (9 decimals)
    "86400"        // 24 hours
  ]);
  console.log("✅ WSOL configured");
  
  // Fund the faucet with tokens
  console.log("\n💰 Funding faucet with tokens...");
  
  // Mint and transfer WBTC
  console.log("\n1. Minting 10 WBTC...");
  await midl.execute("WrappedBTC", "mint", [
    faucet.address,
    "1000000000" // 10 WBTC (8 decimals)
  ]);
  console.log("✅ Faucet funded with 10 WBTC");
  
  // Mint and transfer WETH
  console.log("\n2. Minting 1000 WETH...");
  await midl.execute("WrappedETH", "mint", [
    faucet.address,
    "1000000000000000000000" // 1000 WETH (18 decimals)
  ]);
  console.log("✅ Faucet funded with 1000 WETH");
  
  // Mint and transfer WSOL
  console.log("\n3. Minting 10000 WSOL...");
  await midl.execute("WrappedSOL", "mint", [
    faucet.address,
    "10000000000000" // 10000 WSOL (9 decimals)
  ]);
  console.log("✅ Faucet funded with 10000 WSOL");
  
  console.log("\n🎉 Faucet configuration complete!");
  console.log("\nFaucet is ready to use at:", faucet.address);
  console.log("Users can claim:");
  console.log("  - 0.01 WBTC every 24 hours");
  console.log("  - 1 WETH every 24 hours");
  console.log("  - 10 WSOL every 24 hours");
};

deploy.tags = ["ConfigureFaucet"];
deploy.dependencies = ["Faucet", "WrappedTokens"];

export default deploy;
