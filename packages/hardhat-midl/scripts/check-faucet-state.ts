import hre from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🔍 Checking Faucet State...\n");

  const { ethers } = hre;
  const [signer] = await ethers.getSigners();
  
  console.log("Using account:", signer.address);
  console.log("Network:", hre.network.name);
  
  // Get RPC URL safely
  const networkConfig = hre.network.config as any;
  if (networkConfig.url) {
    console.log("RPC URL:", networkConfig.url);
  }

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

  console.log("\n📊 Token Configurations:");
  
  // Check WBTC
  try {
    const wbtcConfig = await Faucet.getTokenConfig("WBTC");
    console.log("\n✅ WBTC Configuration:");
    console.log("  Token Address:", wbtcConfig.tokenAddress);
    console.log("  Amount per claim:", ethers.formatUnits(wbtcConfig.amount, 8), "WBTC");
    console.log("  Cooldown:", Number(wbtcConfig.cooldown) / 3600, "hours");
    console.log("  Enabled:", wbtcConfig.isEnabled);
    
    const wbtcBalance = await WBTC.balanceOf(faucetAddress);
    console.log("  Faucet Balance:", ethers.formatUnits(wbtcBalance, 8), "WBTC");
  } catch (error: any) {
    console.log("\n❌ WBTC Configuration: NOT FOUND or ERROR");
    console.log("  Error:", error.message);
  }

  // Check WETH
  try {
    const wethConfig = await Faucet.getTokenConfig("WETH");
    console.log("\n✅ WETH Configuration:");
    console.log("  Token Address:", wethConfig.tokenAddress);
    console.log("  Amount per claim:", ethers.formatUnits(wethConfig.amount, 18), "WETH");
    console.log("  Cooldown:", Number(wethConfig.cooldown) / 3600, "hours");
    console.log("  Enabled:", wethConfig.isEnabled);
    
    const wethBalance = await WETH.balanceOf(faucetAddress);
    console.log("  Faucet Balance:", ethers.formatUnits(wethBalance, 18), "WETH");
  } catch (error: any) {
    console.log("\n❌ WETH Configuration: NOT FOUND or ERROR");
    console.log("  Error:", error.message);
  }

  // Check WSOL
  try {
    const wsolConfig = await Faucet.getTokenConfig("WSOL");
    console.log("\n✅ WSOL Configuration:");
    console.log("  Token Address:", wsolConfig.tokenAddress);
    console.log("  Amount per claim:", ethers.formatUnits(wsolConfig.amount, 9), "WSOL");
    console.log("  Cooldown:", Number(wsolConfig.cooldown) / 3600, "hours");
    console.log("  Enabled:", wsolConfig.isEnabled);
    
    const wsolBalance = await WSOL.balanceOf(faucetAddress);
    console.log("  Faucet Balance:", ethers.formatUnits(wsolBalance, 9), "WSOL");
  } catch (error: any) {
    console.log("\n❌ WSOL Configuration: NOT FOUND or ERROR");
    console.log("  Error:", error.message);
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n💡 Next Steps:");
  console.log("  1. If configurations show 'NOT FOUND', run: npm run deploy");
  console.log("  2. If 'Enabled: false', the deployment may still be pending Bitcoin confirmation");
  console.log("  3. Wait a few minutes for Bitcoin blocks to confirm");
  console.log("  4. Check on Blockscout: https://blockscout.staging.midl.xyz/address/" + faucetAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
