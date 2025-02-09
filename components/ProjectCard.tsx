import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import Image from "next/image";

interface ProjectCardProps {
  title: string;
  artist: string;
  image: string;
  raised: number;
  goal: number;
  daysLeft: number;
  description: string;
  location: string;
  className?: string;
}

export default function ProjectCard({
  title,
  artist,
  image,
  raised,
  goal,
  daysLeft,
  description,
  location,
  className = "",
}: ProjectCardProps) {
  const progress = (raised / goal) * 100;

  return (
    <div
      className={`bg-black/20 rounded-lg overflow-hidden border border-purple-500/20 ${className}`}
    >
      <div className="relative h-48">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <p className="text-sm text-gray-300">{location}</p>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
          {title}
        </h3>
        <p className="text-sm text-gray-400 mb-4">by {artist}</p>
        <p className="text-sm text-gray-300 mb-4 line-clamp-2">{description}</p>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Raised</span>
            <span className="text-white">{raised} ETH</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Goal: {goal} ETH</span>
            <span className="text-gray-400">{daysLeft} days left</span>
          </div>
        </div>
      </div>
    </div>
  );
}
