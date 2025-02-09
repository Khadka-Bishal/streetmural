"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Upload, Wallet, Vote } from "lucide-react";
import { Project } from "@/lib/types/project";
import { useRouter } from "next/navigation";
import ContributionSection from "@/components/ContributionSection";
import MuralSubmission from "@/components/MuralSubmission";

interface Mural {
  id: string;
  imageUrl: string;
  artist: string;
  votes: number;
  timestamp: Date;
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [murals, setMurals] = useState<Mural[]>([]);
  const [contribution, setContribution] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projects = JSON.parse(localStorage.getItem("projects") || "[]");
        const projectData = projects.find((p: any) => p.id === params.id);
        
        if (!projectData) {
          router.push("/projects"); // Redirect if project not found
          return;
        }

        setProject({
          ...projectData,
          fundsCollected: projectData.fundsCollected || 0,
          contributors: projectData.contributors || 0,
          muralsSubmitted: projectData.muralsSubmitted || 0,
          votesCast: projectData.votesCast || 0,
          isFunded: projectData.isFunded || false,
          isCompleted: projectData.isCompleted || false,
          isFinalized: projectData.isFinalized || false,
          createdAt: new Date(projectData.createdAt),
          endDate: projectData.endDate ? new Date(projectData.endDate) : null
        });

        // Mock murals data
        setMurals([
          {
            id: "1",
            imageUrl: "https://images.unsplash.com/photo-1561059488-916d69792237",
            artist: "Artist 1",
            votes: 12,
            timestamp: new Date()
          }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project:", error);
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [params.id, router]);

  const handleContributionSuccess = (amountUsd: number) => {
    if (!project) return;

    // Update project in localStorage
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const updatedProjects = projects.map((p: Project) => {
      if (p.id === project.id) {
        return {
          ...p,
          fundsCollected: (p.fundsCollected || 0) + amountUsd,
          contributors: (p.contributors || 0) + 1
        };
      }
      return p;
    });

    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    
    // Update local state
    setProject(prev => prev ? {
      ...prev,
      fundsCollected: prev.fundsCollected + amountUsd,
      contributors: prev.contributors + 1
    } : null);
  };

  const handleMuralSubmissionSuccess = () => {
    // Refresh murals list
    fetchProjectDetails();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0b0f] flex items-center justify-center">
        <div className="animate-pulse text-purple-400">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0a0b0f] flex items-center justify-center">
        <div className="text-red-400">Project not found</div>
      </div>
    );
  }

  const progress = (project.fundsCollected / project.estimatedFunding) * 100;

  return (
    <div className="min-h-screen bg-[#0a0b0f] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Project Header */}
        <div className="relative h-64 rounded-xl overflow-hidden mb-8">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <h1 className="text-4xl font-bold text-white mb-2">
              {project.title}
            </h1>
            <p className="text-gray-300">{project.location}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#12131a] rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
                About the Project
              </h2>
              <p className="text-gray-300 mb-6">{project.description}</p>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Raised</span>
                  <span className="text-white">
                    ${project.fundsCollected.toLocaleString()}
                  </span>
                </div>
                <Progress value={progress} className="bg-gray-700" />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">
                    Goal: ${project.estimatedFunding.toLocaleString()}
                  </span>
                  <span className="text-gray-400">
                    {project.contributors} contributors
                  </span>
                </div>
              </div>
            </div>

            {/* Mural Gallery */}
            <div className="bg-[#12131a] rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
                Mural Gallery
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {murals.map((mural) => (
                  <div
                    key={mural.id}
                    className="relative group rounded-lg overflow-hidden"
                  >
                    <img
                      src={mural.imageUrl}
                      alt="Mural submission"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-4 left-4">
                        <p className="text-white">{mural.artist}</p>
                        <p className="text-gray-300">{mural.votes} votes</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            {/* Contribute Section */}
            <ContributionSection
              projectId={project.id}
              currentFunding={project.fundsCollected}
              targetFunding={project.estimatedFunding}
              onContributionSuccess={handleContributionSuccess}
            />

            {/* Submit Mural Section */}
            <MuralSubmission
              projectId={project.id}
              onSubmissionSuccess={handleMuralSubmissionSuccess}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
