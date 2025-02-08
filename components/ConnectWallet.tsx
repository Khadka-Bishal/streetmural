// components/ConnectWallet.tsx
"use client";

import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import Web3Modal from "web3modal";
import { BrowserProvider } from "ethers";

const ConnectWallet = forwardRef(
  (
    { onAddressChange }: { onAddressChange: (address: string) => void },
    ref
  ) => {
    const [provider, setProvider] = useState<any>(null);
    const [signer, setSigner] = useState<any>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const web3Modal = new Web3Modal({
      providerOptions: {},
    });

    const connectWallet = async () => {
      try {
        const connection = await web3Modal.connect();
        const provider = new BrowserProvider(connection);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        setProvider(provider);
        setSigner(signer);
        setAddress(address);
        setError(null);
      } catch (err) {
        setError("Failed to connect wallet. Please try again.");
        console.error(err);
      }
    };

    const disconnectWallet = async () => {
      setProvider(null);
      setSigner(null);
      setAddress(null);
      setError(null);
      await web3Modal.clearCachedProvider();
    };

    useEffect(() => {
      if (address) {
        const shortened = `${address.slice(0, 4)}...${address.slice(-4)}`;
        onAddressChange(shortened);
      } else {
        onAddressChange("");
      }
    }, [address, onAddressChange]);

    const shortenedAddress = address
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : "";

    // Expose the connect and disconnect functions to the parent component
    useImperativeHandle(ref, () => ({
      connectWallet,
      disconnectWallet,
    }));

    return <div>{error && <p className="text-red-500">{error}</p>}</div>;
  }
);

export default ConnectWallet;
