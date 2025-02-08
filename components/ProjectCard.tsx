import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import Image from 'next/image';

interface ProjectCardProps {
  title: string;
  artist: string;
  image: string;
  raised: number;
  goal: number;
  daysLeft: number;
}

export default function ProjectCard({
  title,
  artist,
  image,
  raised,
  goal,
  daysLeft,
}: ProjectCardProps) {
  const progress = (raised / goal) * 100;

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 border border-accent/20">
      <div className="relative h-48">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">by {artist}</p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>{raised} ETH raised</span>
            <span>{goal} ETH goal</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{daysLeft} days left</span>
          <Button 
            variant="outline"
            className="border-purple-500 hover:bg-purple-500/20"
          >
            View Project
          </Button>
        </div>
      </div>
    </Card>
  );
}