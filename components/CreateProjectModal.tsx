"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Project } from "@/lib/types/project";

interface ProjectFormData {
  title: string;
  description: string;
  location: string;
  estimatedFunding: number;
  image: string;
}

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProjectModal({
  isOpen,
  onClose,
}: CreateProjectModalProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    location: "",
    estimatedFunding: 0,
    image: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (
        !formData.title ||
        !formData.description ||
        !formData.estimatedFunding
      ) {
        throw new Error("Please fill in all required fields");
      }

      const newProject: Project = {
        ...formData,
        id: crypto.randomUUID(),
        fundsCollected: 0,
        contributors: 0,
        createdAt: new Date(),
        endDate: null,
        isFunded: false,
        isCompleted: false,
        isFinalized: false,
        muralsSubmitted: 0,
        votesCast: 0,
      };

      // Store in localStorage
      const existingProjects = JSON.parse(
        localStorage.getItem("projects") || "[]"
      );
      localStorage.setItem(
        "projects",
        JSON.stringify([...existingProjects, newProject])
      );

      alert("Project created successfully!");
      setFormData({
        title: "",
        description: "",
        location: "",
        estimatedFunding: 0,
        image: "",
      });
      onClose();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to create project"
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Launch New Project
          </DialogTitle>
          <DialogDescription>
            Fill in the details to create your street art project
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Project Title
            </label>
            <Input
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter project title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Project Description
            </label>
            <Textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe your street art project"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <Input
              required
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="City, Country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Sample Image URL
            </label>
            <Input
              type="url"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              placeholder="Enter image URL"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Estimated Funding (USD)
            </label>
            <Input
              required
              type="number"
              step="100"
              min="0"
              value={formData.estimatedFunding}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  estimatedFunding: parseFloat(e.target.value),
                })
              }
              placeholder="Enter estimated funding needed in USD"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
