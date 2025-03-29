
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAchievements } from '../context/AchievementContext';
import AchievementCard from '../components/AchievementCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Loader } from 'lucide-react';

interface User {
  id: string;
  username: string;
  fullName: string;
  profilePicture?: string;
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

const CATEGORIES = [
  "All Categories",
  "Hackathon",
  "Competition",
  "Research",
  "Project",
  "Internship",
  "Award",
  "Certification",
  "Other"
];

const SearchPage = () => {
  const location = useLocation();
  const { achievements, comments, loading } = useAchievements();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [filteredAchievements, setFilteredAchievements] = useState(achievements);
  const [isFiltering, setIsFiltering] = useState(false);
  
  // Parse query parameters (e.g., /search?category=Hackathon or /search?tag=AI)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const tagParam = params.get('tag');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    
    if (tagParam) {
      setSearchTerm(tagParam);
    }
  }, [location.search]);
  
  // Filter achievements based on search term and category
  useEffect(() => {
    setIsFiltering(true);
    
    const timer = setTimeout(() => {
      let filtered = [...achievements];
      
      if (searchTerm) {
        filtered = filtered.filter(achievement => 
          achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          achievement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          achievement.tags?.some(tag => 
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }
      
      if (selectedCategory !== 'All Categories') {
        filtered = filtered.filter(achievement => 
          achievement.category === selectedCategory
        );
      }
      
      // Sort by date (newest first)
      filtered.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setFilteredAchievements(filtered);
      setIsFiltering(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [achievements, searchTerm, selectedCategory]);
  
  // Helper function to get comment count
  const getCommentCount = (achievementId: string) => {
    return comments.filter(comment => comment.achievementId === achievementId).length;
  };
  
  // Helper function to find author data
  const getAuthor = (userId: string) => {
    return mockUsers.find(user => user.id === userId);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useEffect above
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Discover Achievements</h1>
      
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search by title, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex-shrink-0 md:w-48">
            <Select 
              value={selectedCategory} 
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" className="md:hidden">
            Search
          </Button>
        </form>
      </div>
      
      {loading || isFiltering ? (
        <div className="flex justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredAchievements.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <h3 className="text-lg font-medium mb-2">No achievements found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground mb-4">
            Showing {filteredAchievements.length} results
          </p>
          
          {filteredAchievements.map(achievement => (
            <AchievementCard 
              key={achievement.id} 
              achievement={achievement}
              author={getAuthor(achievement.userId)}
              commentCount={getCommentCount(achievement.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
