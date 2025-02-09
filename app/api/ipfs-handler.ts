import { NextResponse } from 'next/server'
import { uploadToIPFS, getFromIPFS } from '../../lib/ipfs'

// POST endpoint: /api/ipfs-handler
export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        
        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        const ipfsHash = await uploadToIPFS(buffer)
        
        return NextResponse.json({ ipfsHash })

    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: 'Upload failed' },
            { status: 500 }
        )
    }
}