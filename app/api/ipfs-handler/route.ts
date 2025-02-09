import { NextResponse } from "next/server";
import axios from 'axios';
import FormData from 'form-data';

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

// GET endpoint: /api/ipfs-handler?hash=Qm123abc...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ipfsHash = searchParams.get("hash");

    if (!ipfsHash) {
      return NextResponse.json(
        { error: "No IPFS hash provided" },
        { status: 400 }
      );
    }

    // Using Pinata Gateway
    const imageUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}

// POST endpoint: /api/ipfs-handler
export async function POST(request: Request) {
  console.log("IPFS handler started");
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.error("No file provided");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("File received:", file.name, file.size, "bytes");

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create form data for Pinata
    const pinataFormData = new FormData();
    pinataFormData.append('file', buffer, {
      filename: file.name,
      contentType: file.type,
    });

    console.log("Sending to Pinata...");

    // Upload to Pinata
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      pinataFormData,
      {
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY,
          ...pinataFormData.getHeaders(),
        },
        maxBodyLength: Infinity,
      }
    );

    console.log("Pinata response:", response.status, response.data);

    return NextResponse.json({ 
      ipfsHash: response.data.IpfsHash,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Detailed upload error:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Upload failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
