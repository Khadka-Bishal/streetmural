import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Project } from "@/lib/types/project";

type ProjectCardProps = Partial<Project> & {
  className?: string;
  title: string;
  description: string;
  location: string;
  image: string;
  estimatedFunding: number;
};

export default function ProjectCard({
  id,
  title,
  description,
  location,
  image,
  estimatedFunding,
  fundsCollected = 0,
  contributors = 0,
  isFunded = false,
  className = "",
}: ProjectCardProps) {
  const router = useRouter();
  const progress = ((fundsCollected || 0) / estimatedFunding) * 100;

  return (
    <div
      onClick={() => router.push(`/project/${id}`)}
      className={`bg-black/20 rounded-lg overflow-hidden border border-purple-500/20 cursor-pointer ${className}`}
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
        <p className="text-sm text-gray-300 mb-4 line-clamp-2">{description}</p>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Raised</span>
            <span className="text-white">
              ${fundsCollected.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">
              Goal: ${estimatedFunding.toLocaleString()}
            </span>
            <span className="text-gray-400">{contributors} contributors</span>
          </div>
        </div>
      </div>
    </div>
  );
}
