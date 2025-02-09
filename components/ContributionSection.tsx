"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Wallet, RefreshCcw } from "lucide-react";
import { ethers, formatEther, parseEther } from "ethers";
import { useToast } from "@/hooks/use-toast";

interface ContributionSectionProps {
  projectId: string;
  currentFunding: number;
  targetFunding: number;
  onContributionSuccess: (amount: number) => void;
}

export default function ContributionSection({
  projectId,
  currentFunding,
  targetFunding,
  onContributionSuccess,
}: ContributionSectionProps) {
  const [ethAmount, setEthAmount] = useState<string>("");
  const [usdAmount, setUsdAmount] = useState<string>("");
  const [ethPrice, setEthPrice] = useState<number>(0);
  const [gasEstimate, setGasEstimate] = useState<string>("0");
  const [totalUsd, setTotalUsd] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const { toast } = useToast();

  // Fetch ETH price from CoinGecko (more reliable than Flare FTSO)
  useEffect(() => {
    const fetchEthPrice = async (): Promise<void> => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        const data = await response.json();
        setEthPrice(data.ethereum.usd);
      } catch (error) {
        console.error("Failed to fetch ETH price:", error);
        setEthPrice(0);
      }
    };

    fetchEthPrice();
    const interval = setInterval(fetchEthPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  // Estimate gas when amount changes
  useEffect(() => {
    const estimateGas = async () => {
      if (!ethAmount || !walletAddress || parseFloat(ethAmount) === 0) {
        setGasEstimate("0");
        setTotalUsd("0");
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);

        // Get current gas price
        const feeData = await provider.getFeeData();
        const gasPrice = feeData.gasPrice;

        // Estimate gas limit for the transaction
        const estimatedGas = BigInt(21000); // Base transaction gas

        if (!gasPrice) {
          throw new Error("Could not get gas price");
        }

        // Calculate total gas cost in ETH
        const gasCostWei = gasPrice * estimatedGas;
        const gasCostEth = formatEther(gasCostWei);
        setGasEstimate(gasCostEth);

        // Calculate total in USD (contribution + gas)
        const totalEth = parseFloat(ethAmount) + parseFloat(gasCostEth);
        setTotalUsd((totalEth * ethPrice).toFixed(2));
      } catch (error) {
        console.error("Gas estimation failed:", error);
        setGasEstimate("0");
        setTotalUsd(usdAmount || "0");
      }
    };

    estimateGas();
  }, [ethAmount, walletAddress, ethPrice, usdAmount]);

  // Handle ETH amount changes
  const handleEthChange = (value: string) => {
    setEthAmount(value);
    if (ethPrice && !isNaN(parseFloat(value))) {
      const usdValue = (parseFloat(value) * ethPrice).toFixed(2);
      setUsdAmount(usdValue);
    } else {
      setUsdAmount("");
    }
  };

  // Handle USD amount changes
  const handleUsdChange = (value: string) => {
    setUsdAmount(value);
    if (ethPrice && !isNaN(parseFloat(value))) {
      const ethValue = (parseFloat(value) / ethPrice).toFixed(6);
      setEthAmount(ethValue);
    } else {
      setEthAmount("");
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (typeof window !== "undefined" && !window.ethereum) {
        throw new Error("Please install MetaMask to contribute");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);

      // Listen for account changes
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setWalletAddress(accounts[0] || "");
      });
    } catch (error) {
      toast({
        title: "Wallet Connection Failed",
        description:
          error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  // Handle contribution
  const handleContribute = async () => {
    if (!ethAmount || !walletAddress) return;

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // TODO: Replace with actual contract address and ABI
      const contractAddress = "YOUR_CONTRACT_ADDRESS";
      const contractABI = [
        {
          inputs: [],
          name: "contribute",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
      ];

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const tx = await contract.contribute({
        value: ethers.parseEther(ethAmount.toString()), // Ensure it's a string
      });

      await tx.wait();

      // Update local state
      onContributionSuccess(parseFloat(ethAmount) * ethPrice);

      toast({
        title: "Contribution Successful",
        description: `You contributed ${ethAmount} ETH ($${usdAmount})`,
      });

      // Reset form
      setEthAmount("");
      setUsdAmount("");
    } catch (error) {
      toast({
        title: "Contribution Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to process contribution",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#12131a] rounded-xl p-6 border border-purple-500/20">
      <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
        Contribute to Project
      </h3>

      {walletAddress ? (
        <div className="mb-4 p-2 bg-black/20 rounded-lg">
          <p className="text-sm text-gray-400">Connected Wallet</p>
          <p className="text-sm text-white font-mono">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </p>
        </div>
      ) : (
        <Button
          onClick={connectWallet}
          variant="outline"
          className="w-full mb-4 border-purple-500 text-purple-400 hover:bg-purple-500/20"
        >
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">
            Amount (ETH)
          </label>
          <Input
            type="number"
            value={ethAmount}
            onChange={(e) => handleEthChange(e.target.value)}
            placeholder="0.0"
            className="bg-black/20 border-purple-500/20 focus:border-purple-500/50 text-white placeholder:text-gray-600"
            step="0.01"
            min="0"
          />
        </div>

        <div>
          <label className="text-sm text-gray-400 mb-1 block">
            Amount (USD) • 1 ETH = ${ethPrice.toFixed(2)}
          </label>
          <Input
            type="number"
            value={usdAmount}
            onChange={(e) => handleUsdChange(e.target.value)}
            placeholder="0.00"
            className="bg-black/20 border-purple-500/20 focus:border-purple-500/50 text-white placeholder:text-gray-600"
            step="1"
            min="0"
          />
        </div>

        {walletAddress && ethAmount && (
          <div className="p-2 bg-black/20 rounded-lg">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Estimated Gas Fee:</span>
              <span>{parseFloat(gasEstimate).toFixed(6)} ETH</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>Total (including gas):</span>
              <span>${totalUsd}</span>
            </div>
          </div>
        )}

        <Button
          onClick={handleContribute}
          disabled={!walletAddress || !ethAmount || loading}
          variant="outline"
          className="w-full border-purple-500 text-purple-400 hover:bg-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wallet className="mr-2 h-4 w-4" />
          )}
          {loading ? "Processing..." : "Send Contribution"}
        </Button>
      </div>
    </div>
  );
}
