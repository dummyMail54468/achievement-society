
import React from 'react';
import { useAuth } from '../context/AuthContext';
import AchievementList from '../components/AchievementList';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trophy, Users, TrendingUp, Info } from 'lucide-react';

const HomePage = () => {
  const { user, status } = useAuth();
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-6">
      {status === 'authenticated' ? (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Achievement Feed</h2>
            <AchievementList />
          </div>
          
          <div className="hidden md:block">
            <div className="sticky top-24 space-y-6">
              {user && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border">
                  <div className="flex items-center space-x-3 mb-4">
                    <Trophy className="h-10 w-10 text-achievement-primary" />
                    <div>
                      <h3 className="font-semibold">Share Your Achievement</h3>
                      <p className="text-sm text-muted-foreground">
                        Won something? Let everyone know!
                      </p>
                    </div>
                  </div>
                  <Link to="/achievement/new">
                    <Button className="w-full">Post Achievement</Button>
                  </Link>
                </div>
              )}
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border">
                <div className="flex items-center space-x-3 mb-3">
                  <Users className="h-5 w-5 text-achievement-primary" />
                  <h3 className="font-semibold">Popular Categories</h3>
                </div>
                <div className="space-y-2">
                  <Link to="/search?category=Hackathon" className="block p-2 hover:bg-muted rounded-md text-sm">
                    Hackathons
                  </Link>
                  <Link to="/search?category=Competition" className="block p-2 hover:bg-muted rounded-md text-sm">
                    Competitions
                  </Link>
                  <Link to="/search?category=Research" className="block p-2 hover:bg-muted rounded-md text-sm">
                    Research Papers
                  </Link>
                  <Link to="/search?category=Project" className="block p-2 hover:bg-muted rounded-md text-sm">
                    Projects
                  </Link>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border">
                <div className="flex items-center space-x-3 mb-3">
                  <TrendingUp className="h-5 w-5 text-achievement-primary" />
                  <h3 className="font-semibold">Trending Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Link to="/search?tag=AI">
                    <Button variant="outline" size="sm">#AI</Button>
                  </Link>
                  <Link to="/search?tag=Sustainability">
                    <Button variant="outline" size="sm">#Sustainability</Button>
                  </Link>
                  <Link to="/search?tag=WebDev">
                    <Button variant="outline" size="sm">#WebDev</Button>
                  </Link>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground mt-4 p-4">
                <div className="flex items-center mb-2">
                  <Info className="h-4 w-4 mr-1" />
                  About Achievement Society
                </div>
                <p>
                  A platform for college students to showcase their accomplishments
                  and connect with like-minded peers.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold achievement-gradient text-transparent bg-clip-text mb-4">
            Showcase Your College Achievements
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Join Achievement Society to share your hackathon wins, research papers,
            competitions, and more with your college community.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login">
              <Button variant="outline" size="lg">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button size="lg">Sign Up</Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <Trophy className="h-10 w-10 text-achievement-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Share Achievements</h3>
              <p className="text-muted-foreground">
                Post your hackathon wins, competition results, and research papers.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <Users className="h-10 w-10 text-achievement-secondary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Connect with Peers</h3>
              <p className="text-muted-foreground">
                Find others with similar interests and achievements.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <TrendingUp className="h-10 w-10 text-achievement-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">Build Your Portfolio</h3>
              <p className="text-muted-foreground">
                Create a showcase of your academic and extracurricular accomplishments.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
