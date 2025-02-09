"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { getMuralDAOContract } from '@/lib/contract';
import { ethers } from 'ethers';
import { toast } from "@/components/ui/use-toast";

interface ProjectFormData {
  title: string;
  description: string;
  location: string;
  goal: number;
  fundingDuration: number; // in days
  estimatedFunding: number; // in ETH
}

export default function CreateProjectForm() {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    location: "",
    goal: 0,
    fundingDuration: 30,
    estimatedFunding: 0,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const contract = await getMuralDAOContract();
      
      // Create project on-chain
      const tx = await contract.createProject(
        formData.title,
        formData.description,
        formData.location,
        ethers.parseEther(formData.estimatedFunding.toString())
      );

      // Wait for transaction
      await tx.wait();
      
      toast({
        title: "Project Created",
        description: "Your project has been created on the blockchain",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        location: "",
        goal: 0,
        fundingDuration: 30,
        estimatedFunding: 0,
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <label className="block text-sm font-medium mb-2">Project Title</label>
        <Input
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
          Funding Goal (USD)
        </label>
        <Input
          required
          type="number"
          step="0.1"
          min="0"
          value={formData.goal}
          onChange={(e) =>
            setFormData({ ...formData, goal: parseFloat(e.target.value) })
          }
          placeholder="Enter funding goal in USD"
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        Create Project
      </Button>
    </form>
  );
}
