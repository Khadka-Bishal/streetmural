import { getMuralDAOContract } from '@/lib/ethers';
import { toast } from 'react-hot-toast';

export default function MuralCard({ mural, projectId }) {
  const handleVote = async () => {
    try {
      const contract = await getMuralDAOContract();
      const tx = await contract.voteMural(projectId, mural.id);
      await tx.wait();
      
      toast({
        title: "Vote Cast",
        description: "Your vote has been recorded",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cast vote",
        variant: "destructive",
      });
    }
  };

  return (
    // ... mural display JSX
  );
} 