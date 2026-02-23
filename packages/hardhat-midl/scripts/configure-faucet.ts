import "@nomicfoundation/hardhat-ethers";
import hre from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🔧 Configuring Faucet...\n");

  // Use Hardhat's ethers and network configuration
  const { ethers } = hre;
  const [signer] = await ethers.getSigners();
  
  console.log("Using account:", signer.address);
  console.log("Network:", hre.network.name);

  // Read deployment addresses from individual files
  const deploymentsPath = path.join(__dirname, "../deployments");
  
  const faucetData = JSON.parse(fs.readFileSync(path.join(deploymentsPath, "Faucet.json"), "utf8"));
  const wbtcData = JSON.parse(fs.readFileSync(path.join(deploymentsPath, "WrappedBTC.json"), "utf8"));
  const wethData = JSON.parse(fs.readFileSync(path.join(deploymentsPath, "WrappedETH.json"), "utf8"));
  const wsolData = JSON.parse(fs.readFileSync(path.join(deploymentsPath, "WrappedSOL.json"), "utf8"));

  const faucetAddress = faucetData.address;
  const wbtcAddress = wbtcData.address;
  const wethAddress = wethData.address;
  const wsolAddress = wsolData.address;

  console.log("\nContract Addresses:");
  console.log("Faucet:", faucetAddress);
  console.log("WBTC:", wbtcAddress);
  console.log("WETH:", wethAddress);
  console.log("WSOL:", wsolAddress);

  // Get Faucet contract
  const Faucet = await ethers.getContractAt("Faucet", faucetAddress);

  // Configure tokens
  console.log("\n📝 Configuring tokens...");

  // WBTC: 0.01 BTC (8 decimals), 24 hour cooldown
  console.log("\n1. Configuring WBTC...");
  const wbtcAmount = ethers.parseUnits("0.01", 8);
  const cooldown = 86400; // 24 hours
  let tx = await Faucet.configureToken("WBTC", wbtcAddress, wbtcAmount, cooldown);
  await tx.wait();
  console.log("✅ WBTC configured");

  // WETH: 1 ETH (18 decimals), 24 hour cooldown
  console.log("\n2. Configuring WETH...");
  const wethAmount = ethers.parseUnits("1", 18);
  tx = await Faucet.configureToken("WETH", wethAddress, wethAmount, cooldown);
  await tx.wait();
  console.log("✅ WETH configured");

  // WSOL: 10 SOL (9 decimals), 24 hour cooldown
  console.log("\n3. Configuring WSOL...");
  const wsolAmount = ethers.parseUnits("10", 9);
  tx = await Faucet.configureToken("WSOL", wsolAddress, wsolAmount, cooldown);
  await tx.wait();
  console.log("✅ WSOL configured");

  // Fund the faucet with tokens
  console.log("\n💰 Funding faucet with tokens...");

  const WBTC = await ethers.getContractAt("WrappedToken", wbtcAddress);
  const WETH = await ethers.getContractAt("WrappedToken", wethAddress);
  const WSOL = await ethers.getContractAt("WrappedToken", wsolAddress);

  // Mint tokens to deployer first
  console.log("\n1. Minting WBTC to deployer...");
  tx = await WBTC.mint(signer.address, ethers.parseUnits("10", 8));
  await tx.wait();
  
  console.log("2. Approving and transferring WBTC to faucet...");
  tx = await WBTC.approve(faucetAddress, ethers.parseUnits("10", 8));
  await tx.wait();
  tx = await WBTC.transfer(faucetAddress, ethers.parseUnits("10", 8));
  await tx.wait();
  console.log("✅ Faucet funded with 10 WBTC");

  console.log("\n3. Minting WETH to deployer...");
  tx = await WETH.mint(signer.address, ethers.parseUnits("1000", 18));
  await tx.wait();
  
  console.log("4. Approving and transferring WETH to faucet...");
  tx = await WETH.approve(faucetAddress, ethers.parseUnits("1000", 18));
  await tx.wait();
  tx = await WETH.transfer(faucetAddress, ethers.parseUnits("1000", 18));
  await tx.wait();
  console.log("✅ Faucet funded with 1000 WETH");

  console.log("\n5. Minting WSOL to deployer...");
  tx = await WSOL.mint(signer.address, ethers.parseUnits("10000", 9));
  await tx.wait();
  
  console.log("6. Approving and transferring WSOL to faucet...");
  tx = await WSOL.approve(faucetAddress, ethers.parseUnits("10000", 9));
  await tx.wait();
  tx = await WSOL.transfer(faucetAddress, ethers.parseUnits("10000", 9));
  await tx.wait();
  console.log("✅ Faucet funded with 10000 WSOL");

  // Verify configuration
  console.log("\n✅ Faucet configuration complete!");
  console.log("\nToken Configurations:");
  
  const wbtcConfig = await Faucet.getTokenConfig("WBTC");
  console.log("\nWBTC:");
  console.log("  Address:", wbtcConfig.tokenAddress);
  console.log("  Amount per claim:", ethers.formatUnits(wbtcConfig.amount, 8), "WBTC");
  console.log("  Cooldown:", Number(wbtcConfig.cooldown) / 3600, "hours");
  console.log("  Enabled:", wbtcConfig.isEnabled);
  console.log("  Balance:", ethers.formatUnits(await WBTC.balanceOf(faucetAddress), 8), "WBTC");

  const wethConfig = await Faucet.getTokenConfig("WETH");
  console.log("\nWETH:");
  console.log("  Address:", wethConfig.tokenAddress);
  console.log("  Amount per claim:", ethers.formatUnits(wethConfig.amount, 18), "WETH");
  console.log("  Cooldown:", Number(wethConfig.cooldown) / 3600, "hours");
  console.log("  Enabled:", wethConfig.isEnabled);
  console.log("  Balance:", ethers.formatUnits(await WETH.balanceOf(faucetAddress), 18), "WETH");

  const wsolConfig = await Faucet.getTokenConfig("WSOL");
  console.log("\nWSOL:");
  console.log("  Address:", wsolConfig.tokenAddress);
  console.log("  Amount per claim:", ethers.formatUnits(wsolConfig.amount, 9), "WSOL");
  console.log("  Cooldown:", Number(wsolConfig.cooldown) / 3600, "hours");
  console.log("  Enabled:", wsolConfig.isEnabled);
  console.log("  Balance:", ethers.formatUnits(await WSOL.balanceOf(faucetAddress), 9), "WSOL");

  console.log("\n🎉 Faucet is ready to use!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
