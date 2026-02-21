import DeployFunction from "hardhat-deploy";

interface Midl {
  initialize(): Promise<void>;
  deploy(contractName: string, args: unknown[]): Promise<void>;
  execute(): Promise<void>;
}

interface HardhatRuntimeEnvironment {
  midl: Midl;
}

const deploy: typeof DeployFunction = async (
  hre: HardhatRuntimeEnvironment,
) => {
  /**
   * Initializes the MIDL hardhat deploy SDK
   */
  await hre.midl.initialize();

  /**
   * Add the deploy contract transaction intention
   */
  await hre.midl.deploy("SimpleStorage", ["Hello from MIDL!"]);

  /**
   * Sends the BTC transaction and EVM transaction to the network
   */
  await hre.midl.execute();
};

deploy.id = "00_deploy_SimpleStorage";

export default deploy;
