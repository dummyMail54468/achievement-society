
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Achievement, User } from '../types';
import { useAuth } from '../context/AuthContext';
import { useAchievements } from '../context/AchievementContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageSquare, Share2, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AchievementCardProps {
  achievement: Achievement;
  author: User | undefined;
  showActions?: boolean;
  commentCount?: number;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  author,
  showActions = true,
  commentCount = 0,
}) => {
  const { user } = useAuth();
  const { likeAchievement, unlikeAchievement, deleteAchievement } = useAchievements();

  const isLiked = user ? achievement.likes.includes(user.id) : false;
  const isAuthor = user?.id === achievement.userId;

  const handleLikeToggle = async () => {
    if (isLiked) {
      await unlikeAchievement(achievement.id);
    } else {
      await likeAchievement(achievement.id);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: achievement.title,
        text: `Check out this achievement: ${achievement.title}`,
        url: window.location.origin + `/achievement/${achievement.id}`,
      }).catch((error) => console.log('Error sharing', error));
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      await deleteAchievement(achievement.id);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="w-full card-hover overflow-hidden fadeIn">
      <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${author?.username || 'unknown'}`}>
            <Avatar>
              <AvatarImage src={author?.profilePicture} alt={author?.fullName || 'User'} />
              <AvatarFallback>{author ? getInitials(author.fullName) : 'U'}</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link to={`/profile/${author?.username || 'unknown'}`}>
              <p className="font-medium hover:underline">{author?.fullName || 'Unknown User'}</p>
            </Link>
            <p className="text-xs text-muted-foreground">
              {format(new Date(achievement.date), 'MMM d, yyyy')} • {achievement.category}
            </p>
          </div>
        </div>
        {isAuthor && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/achievement/edit/${achievement.id}`} className="w-full cursor-pointer">
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-destructive cursor-pointer">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>

      <CardContent className="p-4">
        <Link to={`/achievement/${achievement.id}`}>
          <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
            {achievement.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-3">
          {achievement.description.length > 200
            ? `${achievement.description.substring(0, 200)}...`
            : achievement.description}
        </p>
        
        {achievement.imageUrl && (
          <div className="mb-3 relative rounded-lg overflow-hidden">
            <img
              src={achievement.imageUrl}
              alt={achievement.title}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          {achievement.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="p-4 pt-0 flex justify-between items-center border-t">
          <div className="flex space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLikeToggle}
              className={isLiked ? 'text-achievement-primary' : ''}
            >
              <Heart
                className={`h-4 w-4 mr-1 ${isLiked ? 'fill-achievement-primary' : ''}`}
              />
              <span>{achievement.likes.length}</span>
            </Button>
            
            <Link to={`/achievement/${achievement.id}`}>
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-4 w-4 mr-1" />
                <span>{commentCount}</span>
              </Button>
            </Link>
          </div>
          
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AchievementCard;
