
import React, { useState } from 'react';
import { useAchievements } from '../context/AchievementContext';
import AchievementCard from './AchievementCard';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  username: string;
  fullName: string;
  profilePicture?: string;
}

interface AchievementListProps {
  userId?: string;
  limit?: number;
}

// Mock user data for development
const mockUsers: User[] = [
  {
    id: "1",
    username: "johndoe",
    fullName: "John Doe",
    profilePicture: "https://images.unsplash.com/photo-1599566150163-29194dcaad36"
  },
  {
    id: "2",
    username: "janedoe",
    fullName: "Jane Doe",
    profilePicture: "https://images.unsplash.com/photo-1580489944761-15a19d654956"
  }
];

const AchievementList: React.FC<AchievementListProps> = ({ userId, limit }) => {
  const { achievements, comments, loading } = useAchievements();
  const [displayCount, setDisplayCount] = useState(limit || 5);
  
  // Filter achievements if userId is provided
  const filteredAchievements = userId
    ? achievements.filter(achievement => achievement.userId === userId)
    : achievements;
    
  // Sort by date (newest first)
  const sortedAchievements = [...filteredAchievements].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  const displayedAchievements = sortedAchievements.slice(0, displayCount);
  
  const loadMore = () => {
    setDisplayCount(prev => prev + 5);
  };
  
  // Helper function to get comment count
  const getCommentCount = (achievementId: string) => {
    return comments.filter(comment => comment.achievementId === achievementId).length;
  };
  
  // Helper function to find author data
  const getAuthor = (userId: string) => {
    return mockUsers.find(user => user.id === userId);
  };

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (displayedAchievements.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-muted-foreground">No achievements found.</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {displayedAchievements.map(achievement => (
        <AchievementCard 
          key={achievement.id} 
          achievement={achievement}
          author={getAuthor(achievement.userId)}
          commentCount={getCommentCount(achievement.id)}
        />
      ))}
      
      {displayCount < sortedAchievements.length && (
        <div className="flex justify-center my-4">
          <Button 
            variant="outline"
            onClick={loadMore}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default AchievementList;
