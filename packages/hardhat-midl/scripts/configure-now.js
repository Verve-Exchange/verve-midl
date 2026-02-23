// Direct configuration script using @midl/ethers
const { ethers } = require('@midl/ethers');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('🔧 Configuring Faucet NOW\n');
  
  // Connect to MIDL RPC
  const provider = new ethers.JsonRpcProvider('https://rpc.staging.midl.xyz');
  
  // Use the mnemonic
  const mnemonic = process.env.MNEMONIC || 'vintage brisk patch luxury pink lab pear input aisle opinion develop table';
  const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);
  const signer = hdNode.connect(provider);
  
  console.log('Using account:', signer.address);
  
  // Read deployment addresses
  const faucetData = JSON.parse(fs.readFileSync(path.join(__dirname, '../deployments/Faucet.json'), 'utf8'));
  const wbtcData = JSON.parse(fs.readFileSync(path.join(__dirname, '../deployments/WrappedBTC.json'), 'utf8'));
  const wethData = JSON.parse(fs.readFileSync(path.join(__dirname, '../deployments/WrappedETH.json'), 'utf8'));
  const wsolData = JSON.parse(fs.readFileSync(path.join(__dirname, '../deployments/WrappedSOL.json'), 'utf8'));
  
  console.log('\n📍 Addresses:');
  console.log('Faucet:', faucetData.address);
  console.log('WBTC:', wbtcData.address);
  console.log('WETH:', wethData.address);
  console.log('WSOL:', wsolData.address);
  
  // Contract ABIs
  const faucetABI = [
    'function configureToken(string symbol, address tokenAddress, uint256 amount, uint256 cooldown)',
    'function getTokenConfig(string symbol) view returns (tuple(address tokenAddress, uint256 amount, uint256 cooldown, bool isEnabled))',
  ];
  
  const tokenABI = [
    'function mint(address to, uint256 amount)',
    'function balanceOf(address account) view returns (uint256)',
  ];
  
  const faucet = new ethers.Contract(faucetData.address, faucetABI, signer);
  const wbtc = new ethers.Contract(wbtcData.address, tokenABI, signer);
  const weth = new ethers.Contract(wethData.address, tokenABI, signer);
  const wsol = new ethers.Contract(wsolData.address, tokenABI, signer);
  
  console.log('\n📝 Configuring tokens...');
  
  // Configure WBTC
  console.log('\n1. Configuring WBTC...');
  try {
    const tx1 = await faucet.configureToken(
      'WBTC',
      wbtcData.address,
      ethers.parseUnits('0.01', 8),
      86400
    );
    console.log('   TX:', tx1.hash);
    await tx1.wait();
    console.log('   ✅ Confirmed');
  } catch (error) {
    console.log('   ❌ Error:', error.shortMessage || error.message);
    console.log('   Full error:', error);
  }
  
  // Configure WETH
  console.log('\n2. Configuring WETH...');
  try {
    const tx2 = await faucet.configureToken(
      'WETH',
      wethData.address,
      ethers.parseUnits('1', 18),
      86400
    );
    console.log('   TX:', tx2.hash);
    await tx2.wait();
    console.log('   ✅ Confirmed');
  } catch (error) {
    console.log('   ❌ Error:', error.shortMessage || error.message);
  }
  
  // Configure WSOL
  console.log('\n3. Configuring WSOL...');
  try {
    const tx3 = await faucet.configureToken(
      'WSOL',
      wsolData.address,
      ethers.parseUnits('10', 9),
      86400
    );
    console.log('   TX:', tx3.hash);
    await tx3.wait();
    console.log('   ✅ Confirmed');
  } catch (error) {
    console.log('   ❌ Error:', error.shortMessage || error.message);
  }
  
  console.log('\n💰 Funding faucet...');
  
  // Mint WBTC
  console.log('\n1. Minting WBTC...');
  try {
    const tx4 = await wbtc.mint(faucetData.address, ethers.parseUnits('10', 8));
    console.log('   TX:', tx4.hash);
    await tx4.wait();
    console.log('   ✅ Confirmed');
  } catch (error) {
    console.log('   ❌ Error:', error.shortMessage || error.message);
  }
  
  // Mint WETH
  console.log('\n2. Minting WETH...');
  try {
    const tx5 = await weth.mint(faucetData.address, ethers.parseUnits('1000', 18));
    console.log('   TX:', tx5.hash);
    await tx5.wait();
    console.log('   ✅ Confirmed');
  } catch (error) {
    console.log('   ❌ Error:', error.shortMessage || error.message);
  }
  
  // Mint WSOL
  console.log('\n3. Minting WSOL...');
  try {
    const tx6 = await wsol.mint(faucetData.address, ethers.parseUnits('10000', 9));
    console.log('   TX:', tx6.hash);
    await tx6.wait();
    console.log('   ✅ Confirmed');
  } catch (error) {
    console.log('   ❌ Error:', error.shortMessage || error.message);
  }
  
  console.log('\n✅ Verification:');
  
  // Verify
  const tokens = [
    { name: 'WBTC', decimals: 8, contract: wbtc },
    { name: 'WETH', decimals: 18, contract: weth },
    { name: 'WSOL', decimals: 9, contract: wsol },
  ];
  
  for (const token of tokens) {
    try {
      const config = await faucet.getTokenConfig(token.name);
      const balance = await token.contract.balanceOf(faucetData.address);
      
      console.log(`\n${token.name}:`);
      console.log('  Enabled:', config.isEnabled);
      console.log('  Amount:', ethers.formatUnits(config.amount, token.decimals));
      console.log('  Balance:', ethers.formatUnits(balance, token.decimals));
    } catch (error) {
      console.log(`\n${token.name}: ❌`, error.message);
    }
  }
  
  console.log('\n🎉 Done!');
  console.log('\n⚠️  Note: Wait for Bitcoin confirmations before testing frontend');
}

main().catch(console.error);
