import ProjectCard from "./ProjectCard";

export default function FeaturedProjects() {
  const featuredProjects = [
    {
      title: "Street Art Project 1",
      artist: "Artist Name",
      image: "/project1.jpg",
      raised: 1.5,
      goal: 3.0,
      daysLeft: 15,
    },
    {
      title: "Street Art Project 2",
      artist: "Another Artist",
      image: "/project2.jpg",
      raised: 2.0,
      goal: 4.0,
      daysLeft: 20,
    },
    // Add more featured projects as needed
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-[#0a0b0f] to-[#12131a]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}
