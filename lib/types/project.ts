export interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  estimatedFunding: number;
  image: string;
  
  // Auto-initialized fields
  fundsCollected: number;
  contributors: number;
  createdAt: Date;
  endDate: Date | null;
  
  // Status fields
  isFunded: boolean;
  isCompleted: boolean;
  isFinalized: boolean;
  
  // Voting fields
  muralsSubmitted: number;
  votesCast: number;
  winningMural?: string;
} 