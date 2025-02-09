"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setLoading(true);
    try {
      // Mock submission for now
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store in localStorage
      const murals = JSON.parse(localStorage.getItem(`murals_${projectId}`) || "[]");
      const newMural = {
        id: crypto.randomUUID(),
        imageUrl: previewUrl,
        artist: "Anonymous Artist",
        votes: 0,
        timestamp: new Date()
      };
      
      localStorage.setItem(`murals_${projectId}`, JSON.stringify([...murals, newMural]));

      toast({
        title: "Mural Submitted Successfully",
        description: "Your artwork has been uploaded successfully.",
      });

      // Reset form and notify parent
      setSelectedFile(null);
      setPreviewUrl("");
      onSubmissionSuccess();

    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to submit mural",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

        <Button
          onClick={handleSubmit}
          disabled={!selectedFile || loading}
          variant="outline"
          className="w-full border-purple-500 text-purple-400 hover:bg-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Submit Design
            </>
          )}
        </Button>
      </div>
    </div>
  );
} 