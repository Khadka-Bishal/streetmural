"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface ProjectFormData {
  title: string;
  description: string;
  location: string;
  goal: number;
  fundingDuration: number; // in days
}

export default function CreateProjectForm() {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    location: "",
    goal: 0,
    fundingDuration: 30,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create project object
    const newProject = {
      ...formData,
      raised: 0, // Start with 0 ETH raised
      daysLeft: formData.fundingDuration,
      image: "https://images.unsplash.com/photo-1561059488-916d69792237", // Placeholder image
    };

    // Store in localStorage
    const existingProjects = JSON.parse(
      localStorage.getItem("projects") || "[]"
    );
    localStorage.setItem(
      "projects",
      JSON.stringify([...existingProjects, newProject])
    );

    // Reset form
    setFormData({
      title: "",
      description: "",
      location: "",
      goal: 0,
      fundingDuration: 30,
    });

    // You could add a success message or redirect here
    alert("Project created successfully!");
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

      <Button type="submit" className="w-full">
        Create Project
      </Button>
    </form>
  );
}
