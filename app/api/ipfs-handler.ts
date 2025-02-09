import { NextResponse } from "next/server";
import { uploadToIPFS, getFromIPFS } from "../../lib/ipfs";

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

    const imageUrl = `https://ipfs.io/ipfs/${ipfsHash}`;

    return NextResponse.json(
      { imageUrl },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
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
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ipfsHash = await uploadToIPFS(buffer);

    return NextResponse.json({ ipfsHash });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
