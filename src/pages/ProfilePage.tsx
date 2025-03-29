
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAchievements } from '../context/AchievementContext';
import { useAuth } from '../context/AuthContext';
import AchievementList from '../components/AchievementList';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { User, GraduationCap, Calendar, Building, Edit, Loader } from 'lucide-react';

// Mock user data for development
const mockUsers = [
  {
    id: "1",
    username: "johndoe",
    fullName: "John Doe",
    email: "john@college.edu",
    profilePicture: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
    bio: "Computer Science student passionate about AI and machine learning",
    college: "Tech University",
    course: "Computer Science",
    gradYear: 2025,
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "2",
    username: "janedoe",
    fullName: "Jane Doe",
    email: "jane@college.edu",
    profilePicture: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
    bio: "Engineering student with interest in renewable energy",
    college: "Engineering Institute",
    course: "Electrical Engineering",
    gradYear: 2024,
    createdAt: new Date("2023-02-22"),
  }
];

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const { userAchievements, loading: achievementsLoading } = useAchievements();
  
  const [profileUser, setProfileUser] = useState<typeof mockUsers[0] | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundUser = mockUsers.find(user => user.username === username);
        setProfileUser(foundUser || null);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (username) {
      fetchUser();
    }
  }, [username]);
  
  const isOwnProfile = profileUser && currentUser && profileUser.id === currentUser.id;
  
  const achievements = profileUser ? userAchievements(profileUser.id) : [];
  
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
  
  if (!profileUser) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The user you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex flex-col items-center text-center md:w-1/3">
              <Avatar className="h-32 w-32 md:h-40 md:w-40">
                <AvatarImage src={profileUser.profilePicture} alt={profileUser.fullName} />
                <AvatarFallback className="text-2xl">
                  {getInitials(profileUser.fullName)}
                </AvatarFallback>
              </Avatar>
              
              <h1 className="text-2xl font-bold mt-4">{profileUser.fullName}</h1>
              <p className="text-muted-foreground mb-4">@{profileUser.username}</p>
              
              {isOwnProfile && (
                <Link to="/profile/edit">
                  <Button variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              )}
            </div>
            
            <div className="md:w-2/3">
              {profileUser.bio && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">About</h2>
                  <p>{profileUser.bio}</p>
                </div>
              )}
              
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <GraduationCap className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground mr-2">Studies:</span>
                  <span className="font-medium">{profileUser.course}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Building className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground mr-2">College:</span>
                  <span className="font-medium">{profileUser.college}</span>
                </div>
                
                {profileUser.gradYear && (
                  <div className="flex items-center text-sm">
                    <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground mr-2">Graduation Year:</span>
                    <span className="font-medium">{profileUser.gradYear}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <Tabs defaultValue="achievements">
          <TabsList className="mb-6">
            <TabsTrigger value="achievements">
              Achievements ({achievements.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="achievements">
            {achievementsLoading ? (
              <div className="flex justify-center py-12">
                <Loader className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : achievements.length === 0 ? (
              <div className="text-center py-12 bg-muted rounded-lg">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No achievements yet</h3>
                <p className="text-muted-foreground mb-6">
                  {isOwnProfile 
                    ? "You haven't posted any achievements yet." 
                    : `${profileUser.fullName} hasn't posted any achievements yet.`}
                </p>
                {isOwnProfile && (
                  <Link to="/achievement/new">
                    <Button>Post Your First Achievement</Button>
                  </Link>
                )}
              </div>
            ) : (
              <AchievementList userId={profileUser.id} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
