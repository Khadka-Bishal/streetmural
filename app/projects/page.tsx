import ProjectCard from "@/components/ProjectCard";

export default function ProjectsPage() {
  const projects = [
    {
      title: "Downtown Revival",
      artist: "NeonDreams",
      image:
        "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?auto=format&fit=crop&q=80",
      raised: 1.8,
      goal: 3.0,
      daysLeft: 12,
    },
    {
      title: "Urban Stories",
      artist: "StreetCanvas",
      image:
        "https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?auto=format&fit=crop&q=80",
      raised: 2.2,
      goal: 4.0,
      daysLeft: 8,
    },
    // Add more projects as needed
  ];

  return (
    <main className="min-h-screen">
      <section className="py-24 px-4 bg-gradient-to-b from-[#0a0b0f] to-[#12131a]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Street Art Projects
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
