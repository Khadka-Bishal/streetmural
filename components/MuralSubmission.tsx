"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CreateSubmissionForm from "./CreateSubmissionForm";
import { getMuralDAOContract } from "@/lib/ethers";

interface MuralSubmissionProps {
  projectId: string;
  onSubmissionSuccess: () => void;
}

export default function MuralSubmission({
  projectId,
  onSubmissionSuccess,
}: MuralSubmissionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setIsFormOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const ipfsHash = await uploadToIPFS(previewUrl);
      const contract = await getMuralDAOContract();
      const tx = await contract.submitMural(
        projectId,
        ipfsHash,
        formData.description
      );

      await tx.wait();
      onSubmissionSuccess();
      handleClose();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again",
        variant: "destructive",
      });
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setSelectedFile(null);
    setPreviewUrl("");
  };

  return (
    <div className="bg-[#12131a] rounded-xl p-6 border border-purple-500/20">
      <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
        Submit Your Mural
      </h3>

      <div className="space-y-4">
        <div className="relative">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="mural-upload"
          />
          <label
            htmlFor="mural-upload"
            className="flex items-center justify-center w-full h-32 border-2 border-dashed border-purple-500/20 rounded-lg cursor-pointer hover:border-purple-500/40 transition-colors"
          >
            {previewUrl ? (
              <div className="relative w-full h-full">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm">Click to change image</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-400">
                  Click to upload your mural design
                </p>
              </div>
            )}
          </label>
        </div>
      </div>

      <CreateSubmissionForm
        projectId={projectId}
        isOpen={isFormOpen}
        onClose={handleClose}
        onSubmissionSuccess={onSubmissionSuccess}
        previewUrl={previewUrl}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
