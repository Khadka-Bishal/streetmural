"use client";

import ProjectCard from "./ProjectCard";
import { useEffect, useState } from "react";

interface Project {
  title: string;
  artist: string;
  image: string;
  raised: number;
  goal: number;
  daysLeft: number;
  description: string;
  location: string;
}

const projectsData = [
  {
    title: "London Vibes",
    artist: "SpraySmith",
    image: "https://images.unsplash.com/photo-1561059488-916d69792237",
    raised: 3.0,
    goal: 5.0,
    daysLeft: 20,
    description:
      "Capturing the essence of London's urban life through vibrant street art.",
    location: "London, UK",
  },
  {
    title: "Brooklyn Beats",
    artist: "TagMaster",
    image: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8",
    raised: 2.5,
    goal: 4.0,
    daysLeft: 15,
    description:
      "A dynamic mural celebrating Brooklyn's rich musical heritage.",
    location: "Brooklyn, NY, USA",
  },
  {
    title: "Manchester Movement",
    artist: "UrbanFlow",
    image: "https://images.unsplash.com/photo-1571757767119-68b8dbed8c97",
    raised: 1.8,
    goal: 3.5,
    daysLeft: 10,
    description:
      "Depicting the industrial and cultural evolution of Manchester.",
    location: "Manchester, UK",
  },
  {
    title: "LA Dreams",
    artist: "CaliColors",
    image: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    raised: 2.0,
    goal: 4.5,
    daysLeft: 12,
    description:
      "A fusion of Hollywood glamour and street culture in Los Angeles.",
    location: "Los Angeles, CA, USA",
  },
  {
    title: "Bristol Beats",
    artist: "GraffGuru",
    image: "https://images.unsplash.com/photo-1555689502-c4b22d76c56f",
    raised: 3.2,
    goal: 5.0,
    daysLeft: 18,
    description:
      "Showcasing Bristol's vibrant music scene through colorful murals.",
    location: "Bristol, UK",
  },
  {
    title: "Chicago Rhythms",
    artist: "WindyCityArtist",
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968",
    raised: 2.7,
    goal: 4.0,
    daysLeft: 14,
    description:
      "Celebrating Chicago's jazz heritage with expressive street art.",
    location: "Chicago, IL, USA",
  },
];

export default function FeaturedProjects() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Simulating API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setFeaturedProjects(projectsData);
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
