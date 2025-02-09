"use client";

import ProjectCard from "./ProjectCard";
import { useEffect, useState } from "react";
import { Project } from "@/lib/types/project";

export default function FeaturedProjects() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Simulating API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get projects from localStorage
        const storedProjects = JSON.parse(
          localStorage.getItem("projects") || "[]"
        );

        // Transform dates back to Date objects
        const transformedProjects = storedProjects.map((project: any) => ({
          ...project,
          createdAt: new Date(project.createdAt),
          endDate: project.endDate ? new Date(project.endDate) : null,
        }));

        setFeaturedProjects(transformedProjects);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-[#0a0b0f] to-[#12131a]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
          Featured Projects
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-gray-800 rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <ProjectCard
                key={index}
                {...project}
                className="transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
