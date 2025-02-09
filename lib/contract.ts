import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
const CONTRACT_ABI = [/* Your contract ABI */];

export const getMuralDAOContract = async () => {
  if (typeof window.ethereum === "undefined") {
    throw new Error("Please install MetaMask");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}; 