const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const { ethers } = hre;

  console.log("🔧 Configuring Faucet via Hardhat\n");

  const [signer] = await ethers.getSigners();
  console.log("Using account:", signer.address);

  const faucetData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../deployments/Faucet.json"), "utf8")
  );

  const wbtcData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../deployments/WrappedBTC.json"), "utf8")
  );

  const wethData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../deployments/WrappedETH.json"), "utf8")
  );

  const wsolData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../deployments/WrappedSOL.json"), "utf8")
  );

  const faucet = await ethers.getContractAt(
    "Faucet",
    faucetData.address,
    signer
  );

  const wbtc = await ethers.getContractAt(
    "WrappedBTC",
    wbtcData.address,
    signer
  );

  const weth = await ethers.getContractAt(
    "WrappedETH",
    wethData.address,
    signer
  );

  const wsol = await ethers.getContractAt(
    "WrappedSOL",
    wsolData.address,
    signer
  );

  console.log("\nConfiguring tokens...");

  await (await faucet.configureToken(
    "WBTC",
    wbtcData.address,
    ethers.parseUnits("0.01", 8),
    86400
  )).wait();

  await (await faucet.configureToken(
    "WETH",
    wethData.address,
    ethers.parseUnits("1", 18),
    86400
  )).wait();

  await (await faucet.configureToken(
    "WSOL",
    wsolData.address,
    ethers.parseUnits("10", 9),
    86400
  )).wait();

  console.log("✅ Tokens configured");

  console.log("\nMinting...");

  await (await wbtc.mint(faucetData.address, ethers.parseUnits("10", 8))).wait();
  await (await weth.mint(faucetData.address, ethers.parseUnits("1000", 18))).wait();
  await (await wsol.mint(faucetData.address, ethers.parseUnits("10000", 9))).wait();

  console.log("✅ Faucet funded");
}

main().catch(console.error);