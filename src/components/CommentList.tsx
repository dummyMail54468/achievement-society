
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { useAchievements } from '../context/AchievementContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

interface User {
  id: string;
  username: string;
  fullName: string;
  profilePicture?: string;
}

interface CommentListProps {
  achievementId: string;
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

const CommentList: React.FC<CommentListProps> = ({ achievementId }) => {
  const { user } = useAuth();
  const { comments, getCommentsByAchievement, addComment, deleteComment } = useAchievements();
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const achievementComments = getCommentsByAchievement(achievementId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim() || !user) return;
    
    try {
      setIsSubmitting(true);
      await addComment({
        achievementId,
        userId: user.id,
        text: commentText.trim(),
      });
      setCommentText('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await deleteComment(commentId);
    }
  };
  
  // Helper function to get user data
  const getUser = (userId: string) => {
    return mockUsers.find(user => user.id === userId);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      {user && (
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleCommentSubmit} className="space-y-3">
              <div className="flex space-x-3">
                <Avatar>
                  <AvatarImage src={user.profilePicture} alt={user.fullName} />
                  <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                </Avatar>
                <Textarea
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={!commentText.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <h3 className="font-medium text-lg">{comments.length} Comments</h3>
      
      {achievementComments.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-4">
          {achievementComments.map((comment) => {
            const commentUser = getUser(comment.userId);
            
            return (
              <div key={comment.id} className="flex space-x-3">
                <Avatar>
                  <AvatarImage src={commentUser?.profilePicture} alt={commentUser?.fullName || 'User'} />
                  <AvatarFallback>
                    {commentUser ? getInitials(commentUser.fullName) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">{commentUser?.fullName || 'Unknown User'}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {format(new Date(comment.createdAt), 'MMM d, yyyy • h:mm a')}
                        </span>
                      </div>
                      {user && user.id === comment.userId && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                    <p className="mt-1">{comment.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommentList;
