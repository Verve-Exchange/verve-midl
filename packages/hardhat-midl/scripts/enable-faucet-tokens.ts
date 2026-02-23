import hre from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🔧 Enabling Faucet Tokens...\n");

  const { ethers } = hre;
  const [signer] = await ethers.getSigners();
  
  console.log("Using account:", signer.address);
  console.log("Network:", hre.network.name);

  // Read deployment addresses
  const deploymentsPath = path.join(__dirname, "../deployments");
  
  const faucetData = JSON.parse(fs.readFileSync(path.join(deploymentsPath, "Faucet.json"), "utf8"));
  const wbtcData = JSON.parse(fs.readFileSync(path.join(deploymentsPath, "WrappedBTC.json"), "utf8"));
  const wethData = JSON.parse(fs.readFileSync(path.join(deploymentsPath, "WrappedETH.json"), "utf8"));
  const wsolData = JSON.parse(fs.readFileSync(path.join(deploymentsPath, "WrappedSOL.json"), "utf8"));

  const faucetAddress = faucetData.address;
  const wbtcAddress = wbtcData.address;
  const wethAddress = wethData.address;
  const wsolAddress = wsolData.address;

  console.log("\n📍 Contract Addresses:");
  console.log("Faucet:", faucetAddress);
  console.log("WBTC:", wbtcAddress);
  console.log("WETH:", wethAddress);
  console.log("WSOL:", wsolAddress);

  // Get contracts
  const Faucet = await ethers.getContractAt("Faucet", faucetAddress);
  const WBTC = await ethers.getContractAt("WrappedToken", wbtcAddress);
  const WETH = await ethers.getContractAt("WrappedToken", wethAddress);
  const WSOL = await ethers.getContractAt("WrappedToken", wsolAddress);

  console.log("\n📝 Configuring tokens...");

  // Configure WBTC
  console.log("\n1. Configuring WBTC...");
  try {
    const wbtcAmount = ethers.parseUnits("0.01", 8);
    const cooldown = 86400; // 24 hours
    
    let tx = await Faucet.configureToken("WBTC", wbtcAddress, wbtcAmount, cooldown);
    console.log("   TX sent:", tx.hash);
    await tx.wait();
    console.log("   ✅ WBTC configured");
  } catch (error: any) {
    console.log("   ⚠️ Error:", error.message);
  }

  // Configure WETH
  console.log("\n2. Configuring WETH...");
  try {
    const wethAmount = ethers.parseUnits("1", 18);
    const cooldown = 86400;
    
    let tx = await Faucet.configureToken("WETH", wethAddress, wethAmount, cooldown);
    console.log("   TX sent:", tx.hash);
    await tx.wait();
    console.log("   ✅ WETH configured");
  } catch (error: any) {
    console.log("   ⚠️ Error:", error.message);
  }

  // Configure WSOL
  console.log("\n3. Configuring WSOL...");
  try {
    const wsolAmount = ethers.parseUnits("10", 9);
    const cooldown = 86400;
    
    let tx = await Faucet.configureToken("WSOL", wsolAddress, wsolAmount, cooldown);
    console.log("   TX sent:", tx.hash);
    await tx.wait();
    console.log("   ✅ WSOL configured");
  } catch (error: any) {
    console.log("   ⚠️ Error:", error.message);
  }

  console.log("\n💰 Funding faucet with tokens...");

  // Mint and transfer WBTC
  console.log("\n1. Funding WBTC...");
  try {
    let tx = await WBTC.mint(faucetAddress, ethers.parseUnits("10", 8));
    console.log("   TX sent:", tx.hash);
    await tx.wait();
    console.log("   ✅ Faucet funded with 10 WBTC");
  } catch (error: any) {
    console.log("   ⚠️ Error:", error.message);
  }

  // Mint and transfer WETH
  console.log("\n2. Funding WETH...");
  try {
    let tx = await WETH.mint(faucetAddress, ethers.parseUnits("1000", 18));
    console.log("   TX sent:", tx.hash);
    await tx.wait();
    console.log("   ✅ Faucet funded with 1000 WETH");
  } catch (error: any) {
    console.log("   ⚠️ Error:", error.message);
  }

  // Mint and transfer WSOL
  console.log("\n3. Funding WSOL...");
  try {
    let tx = await WSOL.mint(faucetAddress, ethers.parseUnits("10000", 9));
    console.log("   TX sent:", tx.hash);
    await tx.wait();
    console.log("   ✅ Faucet funded with 10000 WSOL");
  } catch (error: any) {
    console.log("   ⚠️ Error:", error.message);
  }

  // Verify configuration
  console.log("\n" + "=".repeat(60));
  console.log("\n✅ Verification:");
  
  try {
    const wbtcConfig = await Faucet.getTokenConfig("WBTC");
    console.log("\nWBTC:");
    console.log("  Address:", wbtcConfig.tokenAddress);
    console.log("  Amount:", ethers.formatUnits(wbtcConfig.amount, 8), "WBTC");
    console.log("  Cooldown:", Number(wbtcConfig.cooldown) / 3600, "hours");
    console.log("  Enabled:", wbtcConfig.isEnabled);
    
    const wbtcBalance = await WBTC.balanceOf(faucetAddress);
    console.log("  Balance:", ethers.formatUnits(wbtcBalance, 8), "WBTC");
  } catch (error: any) {
    console.log("\nWBTC: ❌ Error -", error.message);
  }

  try {
    const wethConfig = await Faucet.getTokenConfig("WETH");
    console.log("\nWETH:");
    console.log("  Address:", wethConfig.tokenAddress);
    console.log("  Amount:", ethers.formatUnits(wethConfig.amount, 18), "WETH");
    console.log("  Cooldown:", Number(wethConfig.cooldown) / 3600, "hours");
    console.log("  Enabled:", wethConfig.isEnabled);
    
    const wethBalance = await WETH.balanceOf(faucetAddress);
    console.log("  Balance:", ethers.formatUnits(wethBalance, 18), "WETH");
  } catch (error: any) {
    console.log("\nWETH: ❌ Error -", error.message);
  }

  try {
    const wsolConfig = await Faucet.getTokenConfig("WSOL");
    console.log("\nWSOL:");
    console.log("  Address:", wsolConfig.tokenAddress);
    console.log("  Amount:", ethers.formatUnits(wsolConfig.amount, 9), "WSOL");
    console.log("  Cooldown:", Number(wsolConfig.cooldown) / 3600, "hours");
    console.log("  Enabled:", wsolConfig.isEnabled);
    
    const wsolBalance = await WSOL.balanceOf(faucetAddress);
    console.log("  Balance:", ethers.formatUnits(wsolBalance, 9), "WSOL");
  } catch (error: any) {
    console.log("\nWSOL: ❌ Error -", error.message);
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n🎉 Faucet setup complete!");
  console.log("\n⚠️  Note: Transactions need Bitcoin block confirmations.");
  console.log("    Wait a few minutes, then check the frontend.");
  console.log("\n🔗 Blockscout:", "https://blockscout.staging.midl.xyz/address/" + faucetAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Fatal error:", error);
    process.exit(1);
  });
