import hre from "hardhat";

async function main() {
  const { midl } = hre as any;
  
  console.log("🔍 Verifying Faucet Configuration...\n");
  
  await midl.initialize();
  
  const faucet = await midl.get("Faucet");
  console.log("Faucet Address:", faucet.address);
  
  // Check WBTC configuration
  console.log("\n📋 Checking WBTC configuration...");
  const wbtcConfig = await midl.call("Faucet", "getTokenConfig", ["WBTC"]);
  console.log("WBTC Config:", wbtcConfig);
  
  // Check WETH configuration
  console.log("\n📋 Checking WETH configuration...");
  const wethConfig = await midl.call("Faucet", "getTokenConfig", ["WETH"]);
  console.log("WETH Config:", wethConfig);
  
  // Check WSOL configuration
  console.log("\n📋 Checking WSOL configuration...");
  const wsolConfig = await midl.call("Faucet", "getTokenConfig", ["WSOL"]);
  console.log("WSOL Config:", wsolConfig);
  
  // Check if tokens are enabled
  console.log("\n✅ Token Status:");
  console.log("WBTC enabled:", wbtcConfig.isEnabled);
  console.log("WETH enabled:", wethConfig.isEnabled);
  console.log("WSOL enabled:", wsolConfig.isEnabled);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
