"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getMuralDAOContract } from '@/lib/contract';

interface CreateSubmissionFormProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmissionSuccess: () => void;
  previewUrl: string;
}

interface SubmissionFormData {
  artistName: string;
  description: string;
}

export default function CreateSubmissionForm({
  projectId,
  isOpen,
  onClose,
  onSubmissionSuccess,
  previewUrl,
}: CreateSubmissionFormProps) {
  const [formData, setFormData] = useState<SubmissionFormData>({
    artistName: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Reset form when dialog closes
  const handleClose = () => {
    setFormData({
      artistName: "",
      description: "",
    });
    setLoading(false);
    onClose();
  };

  const uploadToIPFS = async (imageUrl: string): Promise<string> => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append("file", blob, "mural.jpg");

      const ipfsResponse = await fetch("/api/ipfs-handler", {
        method: "POST",
        body: formData,
      });

      const data = await ipfsResponse.json();
      if (data.error || !data.ipfsHash) {
        throw new Error();
      }

      return data.ipfsHash;
    } catch {
      throw new Error();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast({
      title: "Uploading...",
      description: "Preparing your artwork",
      variant: "default",
      duration: 100000,
    });

    try {
      // 1. Upload to IPFS first
      const ipfsHash = await uploadToIPFS(previewUrl);
      
      // 2. Submit to blockchain
      const contract = await getMuralDAOContract();
      const tx = await contract.submitMural(
        projectId,
        ipfsHash,
        formData.description
      );

      await tx.wait();

      toast.dismiss(toastId);
      onSubmissionSuccess();
      handleClose();
    } catch {
      toast.dismiss(toastId);
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#12131a] border border-purple-500/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Submit Your Design
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative h-48 rounded-lg overflow-hidden border border-purple-500/20">
            <img
              src={previewUrl}
              alt="Mural preview"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Artist Name
            </label>
            <Input
              value={formData.artistName}
              onChange={(e) =>
                setFormData({ ...formData, artistName: e.target.value })
              }
              className="bg-black/20 border-purple-500/20 text-white/70 placeholder:text-white/20"
              placeholder="Enter your name or artist handle"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="bg-black/20 border-purple-500/20 text-white/70 placeholder:text-white/20"
              placeholder="Tell us about your design"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-purple-500 text-purple-400 hover:bg-purple-500/20 disabled:opacity-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-pink-600"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Design"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
