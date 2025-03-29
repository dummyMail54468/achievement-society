
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAchievements } from '../context/AchievementContext';
import CommentList from '../components/CommentList';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar,
  Globe,
  Users,
  ArrowLeft,
  Loader,
  Heart,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface User {
  id: string;
  username: string;
  fullName: string;
  profilePicture?: string;
  college?: string;
}

// Mock user data for development
const mockUsers: User[] = [
  {
    id: "1",
    username: "johndoe",
    fullName: "John Doe",
    profilePicture: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
    college: "Tech University"
  },
  {
    id: "2",
    username: "janedoe",
    fullName: "Jane Doe",
    profilePicture: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
    college: "Engineering Institute"
  }
];

const AchievementDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    getAchievementById, 
    likeAchievement, 
    unlikeAchievement, 
    deleteAchievement, 
    loading 
  } = useAchievements();
  const [author, setAuthor] = useState<User | undefined>(undefined);
  
  const achievement = id ? getAchievementById(id) : undefined;
  
  useEffect(() => {
    if (achievement) {
      // Find author from mock data
      const foundAuthor = mockUsers.find(user => user.id === achievement.userId);
      setAuthor(foundAuthor);
    }
  }, [achievement]);
  
  const isLiked = user && achievement ? achievement.likes.includes(user.id) : false;
  const isAuthor = user && achievement ? user.id === achievement.userId : false;
  
  const handleLikeToggle = async () => {
    if (!achievement) return;
    
    if (isLiked) {
      await unlikeAchievement(achievement.id);
    } else {
      await likeAchievement(achievement.id);
    }
  };
  
  const handleDelete = async () => {
    if (!achievement) return;
    
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      await deleteAchievement(achievement.id);
      navigate('/profile/' + author?.username);
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!achievement) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Achievement Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The achievement you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-6">
      <Link to="/">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </Link>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden">
        {achievement.imageUrl && (
          <div className="w-full h-64 md:h-80 overflow-hidden">
            <img 
              src={achievement.imageUrl} 
              alt={achievement.title}
              className="w-full h-full object-cover" 
            />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold">{achievement.title}</h1>
            
            {isAuthor && (
              <div className="flex items-center space-x-2">
                <Link to={`/achievement/edit/${achievement.id}`}>
                  <Button variant="outline" size="sm" className="h-9">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-9 text-destructive hover:text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4 mb-6">
            <Link to={`/profile/${author?.username}`} className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={author?.profilePicture} alt={author?.fullName || 'User'} />
                <AvatarFallback>
                  {author ? getInitials(author.fullName) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{author?.fullName || 'Unknown User'}</p>
                <p className="text-xs text-muted-foreground">{author?.college}</p>
              </div>
            </Link>
          </div>
          
          <div className="space-y-6 mb-8">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {format(new Date(achievement.date), 'MMMM d, yyyy')}
              </div>
              <div className="flex items-center">
                <Globe className="mr-2 h-4 w-4" />
                {achievement.category}
              </div>
              {achievement.collaborators && achievement.collaborators.length > 0 && (
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Collaborated with {achievement.collaborators.join(', ')}
                </div>
              )}
            </div>
            
            <p className="whitespace-pre-line">{achievement.description}</p>
            
            {achievement.links && achievement.links.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Links</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {achievement.links.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline break-all"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {achievement.tags && achievement.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {achievement.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4 py-4 border-t border-b">
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLikeToggle}
                className={isLiked ? 'text-achievement-primary' : ''}
              >
                <Heart
                  className={`h-5 w-5 mr-2 ${isLiked ? 'fill-achievement-primary' : ''}`}
                />
                <span>{achievement.likes.length} Likes</span>
              </Button>
            ) : (
              <div className="flex items-center text-sm text-muted-foreground">
                <Heart className="h-5 w-5 mr-2" />
                <span>{achievement.likes.length} Likes</span>
              </div>
            )}
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Comments</h2>
            <CommentList achievementId={achievement.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementDetailPage;
