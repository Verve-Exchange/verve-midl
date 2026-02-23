// Simple script to check faucet state without Hardhat
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('🔍 Quick Faucet Check\n');
  
  // Connect to MIDL RPC
  const provider = new ethers.JsonRpcProvider('https://rpc.staging.midl.xyz');
  
  // Read faucet address
  const faucetData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../deployments/Faucet.json'), 'utf8')
  );
  
  console.log('Faucet Address:', faucetData.address);
  console.log('Blockscout:', `https://blockscout.staging.midl.xyz/address/${faucetData.address}\n`);
  
  // Faucet ABI (just the functions we need)
  const faucetABI = [
    'function getTokenConfig(string symbol) view returns (tuple(address tokenAddress, uint256 amount, uint256 cooldown, bool isEnabled))',
  ];
  
  const faucet = new ethers.Contract(faucetData.address, faucetABI, provider);
  
  // Check each token
  const tokens = ['WBTC', 'WETH', 'WSOL'];
  
  for (const token of tokens) {
    try {
      const config = await faucet.getTokenConfig(token);
      console.log(`${token}:`);
      console.log('  Token Address:', config.tokenAddress);
      console.log('  Amount:', config.amount.toString());
      console.log('  Cooldown:', config.cooldown.toString(), 'seconds');
      console.log('  Enabled:', config.isEnabled);
      console.log('');
    } catch (error) {
      console.log(`${token}: ❌ Error -`, error.message);
      console.log('');
    }
  }
}

main().catch(console.error);
