"use client";

import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

import {
  Palette,
  Paintbrush,
  Users,
  Sparkles,
  Rocket,
  Building,
} from "lucide-react";
import FeaturedProjects from "@/components/FeaturedProjects";
import CreateProjectForm from "@/components/CreateProjectForm";
import CreateProjectModal from "@/components/CreateProjectModal";
import { useState } from "react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0b0f]">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1611063158871-7dd3ed4a2ac8?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#0a0b0f]/90 backdrop-blur-sm" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 text-transparent bg-clip-text">
              StreetMural 2.0
            </span>
            <br />
            <span className="text-2xl md:text-4xl mt-4 block text-white/90">
              Community-Powered Graffiti
            </span>
          </h1>
          <p className="text-xl mb-8 text-white/70">
            A decentralized platform for artists and neighborhoods to
            collaborate on street murals. Vote for the best designs, fund
            projects, and make your city vibrant!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90 text-white px-8"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Browse Projects
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500/20"
              onClick={() => setIsModalOpen(true)}
            >
              <Rocket className="mr-2 h-5 w-5" />
              Launch a Project
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 bg-[#0a0b0f]/95">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative p-8 bg-[#12131a] rounded-lg">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Building className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Create a Project
                </h3>
                <p className="text-white/70">
                  Neighborhoods post mural ideas and locations for
                  transformation
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative p-8 bg-[#12131a] rounded-lg">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Paintbrush className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Artists Submit Designs
                </h3>
                <p className="text-white/70">
                  Graffiti artists upload their creative visions and proposals
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative p-8 bg-[#12131a] rounded-lg">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Users className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Community Votes & Funds
                </h3>
                <p className="text-white/70">
                  Winning designs get funded and brought to life on the streets
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="py-24 px-4 bg-[#0a0b0f]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Get Involved
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative p-8 bg-[#12131a] rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-white">
                  For Artists
                </h3>
                <p className="text-white/70">
                  Submit your mural proposals and connect with supporters
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative p-8 bg-[#12131a] rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-white">
                  For Communities
                </h3>
                <p className="text-white/70">
                  Propose spaces and support local art initiatives
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative p-8 bg-[#12131a] rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-white">
                  For Supporters
                </h3>
                <p className="text-white/70">
                  Fund projects and help transform urban spaces
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
