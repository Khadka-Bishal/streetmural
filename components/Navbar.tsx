// components/Navbar.tsx
"use client";

import { Menu, Wallet } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ConnectWallet from "./ConnectWallet";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const connectWalletRef = useRef<any>(null);

  const handleConnectWallet = () => {
    if (connectWalletRef.current) {
      connectWalletRef.current.connectWallet();
    }
  };

  // Listen for address changes
  useEffect(() => {
    const handleAddressChange = (address: string) => {
      setWalletAddress(address);
    };

    // Add event listener to ConnectWallet component
    if (connectWalletRef.current) {
      connectWalletRef.current.onAddressChange = handleAddressChange;
    }
  }, []);

  return (
    <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-lg border-b border-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
              StreetMural
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/projects"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Projects
            </Link>
            <Button
              variant="ghost"
              className="text-foreground/80 hover:text-foreground"
            >
              Artists
            </Button>
            <Button
              variant="ghost"
              className="text-foreground/80 hover:text-foreground"
            >
              Tutorials
            </Button>

            <Button
              variant="outline"
              className="ml-4 border border-purple-500 hover:bg-purple-500/20"
              onClick={handleConnectWallet}
            >
              <Wallet className="mr-2 h-4 w-4" />
              {walletAddress || "Connect Wallet"}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/projects"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Projects
              </Link>
              <Button variant="ghost" className="w-full text-left">
                Artists
              </Button>
              <Button variant="ghost" className="w-full text-left">
                About
              </Button>
              <Button
                variant="outline"
                className="w-full border border-purple-500 hover:bg-purple-500/20"
                onClick={handleConnectWallet} // Trigger wallet connection
              >
                <Wallet className="mr-2 h-4 w-4" />
                {walletAddress || "Connect Wallet"}
              </Button>
            </div>
          </div>
        )}
      </div>
      <ConnectWallet
        ref={connectWalletRef}
        onAddressChange={setWalletAddress}
      />
    </nav>
  );
}
