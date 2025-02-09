import { create } from 'ipfs-http-client'

const ipfs = create({ host: 'localhost', port: 5001, protocol: 'https' })

export async function uploadToIPFS(file: Buffer) {
    try {
        const { cid } = await ipfs.add(file)
        return cid.toString()
    } catch (error) {
        console.error('Error uploading file to IPFS:', error)
        throw error
    }
}

export async function getFromIPFS(hash: string) {
    try {
        const file = await ipfs.cat(hash)
        return file
    } catch (error) {
        console.error('Error getting file from IPFS:', error) 
        throw error
    }
}