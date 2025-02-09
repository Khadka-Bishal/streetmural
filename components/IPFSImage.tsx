"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface IPFSImageProps {
  ipfsHash: string;
  alt: string;
  className?: string;
}

const IPFS_GATEWAYS = [
  "https://gateway.pinata.cloud/ipfs/",
  "https://ipfs.io/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/"
];

export default function IPFSImage({ ipfsHash, alt, className }: IPFSImageProps) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [currentGateway, setCurrentGateway] = useState(0);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const url = `${IPFS_GATEWAYS[currentGateway]}${ipfsHash}`;
        const response = await fetch(url);
        if (response.ok) {
          setImageUrl(url);
          // Cache the working gateway for this hash
          localStorage.setItem(`gateway_${ipfsHash}`, IPFS_GATEWAYS[currentGateway]);
        } else {
          // Try next gateway
          setCurrentGateway((prev) => (prev + 1) % IPFS_GATEWAYS.length);
        }
      } catch (error) {
        // Try next gateway on error
        setCurrentGateway((prev) => (prev + 1) % IPFS_GATEWAYS.length);
      }
    };

    if (ipfsHash && !imageUrl) {
      // Check cache first
      const cachedGateway = localStorage.getItem(`gateway_${ipfsHash}`);
      if (cachedGateway) {
        setImageUrl(`${cachedGateway}${ipfsHash}`);
      } else {
        loadImage();
      }
    }
  }, [ipfsHash, currentGateway]);

  if (!imageUrl) {
    return <div className={`animate-pulse bg-gray-700 ${className}`} />;
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
    />
  );
}
