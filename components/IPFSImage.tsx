"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface IPFSImageProps {
  ipfsHash: string;
  alt: string;
  className?: string;
}

export default function IPFSImage({
  ipfsHash,
  alt,
  className,
}: IPFSImageProps) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchIPFSImage = async () => {
      try {
        const response = await fetch(`/api/ipfs-handler?hash=${ipfsHash}`);
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setImageUrl(data.imageUrl);
        setLoading(false);
      } catch (err) {
        console.error("Error loading IPFS image:", err);
        setError(true);
        setLoading(false);
      }
    };

    if (ipfsHash) {
      fetchIPFSImage();
    }
  }, [ipfsHash]);

  if (loading) {
    return <div className={`animate-pulse bg-gray-800 ${className}`} />;
  }

  if (error) {
    return (
      <div
        className={`bg-gray-900 flex items-center justify-center ${className}`}
      >
        Failed to load image
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-full object-cover"
        onError={() => setError(true)}
      />
    </div>
  );
}
