// scripts/deploy.js

async function main() {
    // Get the deployer account from Hardhat
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    // Log the deployer's balance (optional)
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatEther(balance));

  
    // Get the contract factory for your StreetMural contract
    const StreetMuralFactory = await ethers.getContractFactory("StreetMural");
  
    // Deploy the contract; if your constructor requires parameters, pass them here.
    const streetMural = await StreetMuralFactory.deploy();
  
    // Wait until the deployment is mined; ethers v6 uses waitForDeployment()
    await streetMural.waitForDeployment();
  
    // Log the deployed contract address; ethers v6 returns the contract's address in the "target" property.
    console.log("StreetMural deployed to:", streetMural.target);
  }
  
  // Execute the main function and handle errors.
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Deployment failed:", error);
      process.exit(1);
    });
  