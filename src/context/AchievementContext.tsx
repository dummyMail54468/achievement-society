
import React, { createContext, useContext, useState, useEffect } from "react";
import { Achievement, Comment } from "../types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface AchievementContextType {
  achievements: Achievement[];
  userAchievements: (userId: string) => Achievement[];
  getAchievementById: (id: string) => Achievement | undefined;
  createAchievement: (achievement: Omit<Achievement, 'id' | 'createdAt' | 'likes'>) => Promise<void>;
  updateAchievement: (id: string, data: Partial<Achievement>) => Promise<void>;
  deleteAchievement: (id: string) => Promise<void>;
  likeAchievement: (id: string) => Promise<void>;
  unlikeAchievement: (id: string) => Promise<void>;
  comments: Comment[];
  getCommentsByAchievement: (achievementId: string) => Comment[];
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  loading: boolean;
}

// Mock data for development
const mockAchievements: Achievement[] = [
  {
    id: "a1",
    userId: "1",
    title: "First Place in University Hackathon",
    description: "Won first place in the annual university hackathon with our project 'EcoTrack', an app that helps users track and reduce their carbon footprint.",
    category: "Hackathon",
    imageUrl: "https://images.unsplash.com/photo-1490049350474-498de6046883",
    tags: ["Hackathon", "Sustainability", "App Development"],
    date: new Date("2023-11-15"),
    createdAt: new Date("2023-11-16"),
    likes: ["2"]
  },
  {
    id: "a2",
    userId: "2",
    title: "Research Paper Published",
    description: "My research paper on renewable energy solutions was published in the International Journal of Sustainable Engineering.",
    category: "Research",
    links: ["https://example.com/paper"],
    tags: ["Research", "Renewable Energy", "Publication"],
    date: new Date("2023-10-05"),
    createdAt: new Date("2023-10-10"),
    likes: ["1"]
  },
  {
    id: "a3",
    userId: "1",
    title: "Microsoft Imagine Cup Finalist",
    description: "Our team made it to the finals of the Microsoft Imagine Cup with our AI-powered healthcare solution.",
    category: "Competition",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    tags: ["Competition", "AI", "Healthcare"],
    collaborators: ["Jane Doe", "Mike Smith"],
    date: new Date("2023-09-20"),
    createdAt: new Date("2023-09-22"),
    likes: []
  }
];

const mockComments: Comment[] = [
  {
    id: "c1",
    achievementId: "a1",
    userId: "2",
    text: "Congratulations! This project sounds amazing.",
    createdAt: new Date("2023-11-17")
  },
  {
    id: "c2",
    achievementId: "a2",
    userId: "1",
    text: "Great work on getting published!",
    createdAt: new Date("2023-10-12")
  }
];

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export const AchievementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Load from localStorage if exists, otherwise use mock data
        const storedAchievements = localStorage.getItem("achievements");
        const storedComments = localStorage.getItem("comments");
        
        setAchievements(storedAchievements ? JSON.parse(storedAchievements) : mockAchievements);
        setComments(storedComments ? JSON.parse(storedComments) : mockComments);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load achievements");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("achievements", JSON.stringify(achievements));
      localStorage.setItem("comments", JSON.stringify(comments));
    }
  }, [achievements, comments, loading]);

  const userAchievements = (userId: string) => {
    return achievements.filter(achievement => achievement.userId === userId);
  };

  const getAchievementById = (id: string) => {
    return achievements.find(achievement => achievement.id === id);
  };

  const createAchievement = async (achievementData: Omit<Achievement, 'id' | 'createdAt' | 'likes'>) => {
    try {
      if (!user) throw new Error("You must be logged in to create an achievement");
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newAchievement: Achievement = {
        id: Math.random().toString(36).substring(2, 9),
        ...achievementData,
        createdAt: new Date(),
        likes: []
      };
      
      setAchievements(prev => [newAchievement, ...prev]);
      toast.success("Achievement created successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create achievement");
      throw error;
    }
  };

  const updateAchievement = async (id: string, data: Partial<Achievement>) => {
    try {
      if (!user) throw new Error("You must be logged in to update an achievement");
      
      const achievement = achievements.find(a => a.id === id);
      if (!achievement) throw new Error("Achievement not found");
      
      if (achievement.userId !== user.id) throw new Error("You can only update your own achievements");
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAchievements(prev =>
        prev.map(a => (a.id === id ? { ...a, ...data } : a))
      );
      
      toast.success("Achievement updated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update achievement");
      throw error;
    }
  };

  const deleteAchievement = async (id: string) => {
    try {
      if (!user) throw new Error("You must be logged in to delete an achievement");
      
      const achievement = achievements.find(a => a.id === id);
      if (!achievement) throw new Error("Achievement not found");
      
      if (achievement.userId !== user.id) throw new Error("You can only delete your own achievements");
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAchievements(prev => prev.filter(a => a.id !== id));
      // Also delete associated comments
      setComments(prev => prev.filter(c => c.achievementId !== id));
      
      toast.success("Achievement deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete achievement");
      throw error;
    }
  };

  const likeAchievement = async (id: string) => {
    try {
      if (!user) throw new Error("You must be logged in to like an achievement");
      
      const achievement = achievements.find(a => a.id === id);
      if (!achievement) throw new Error("Achievement not found");
      
      if (achievement.likes.includes(user.id)) {
        return; // Already liked
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAchievements(prev =>
        prev.map(a => 
          a.id === id 
            ? { ...a, likes: [...a.likes, user.id] } 
            : a
        )
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to like achievement");
      throw error;
    }
  };

  const unlikeAchievement = async (id: string) => {
    try {
      if (!user) throw new Error("You must be logged in to unlike an achievement");
      
      const achievement = achievements.find(a => a.id === id);
      if (!achievement) throw new Error("Achievement not found");
      
      if (!achievement.likes.includes(user.id)) {
        return; // Not liked yet
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAchievements(prev =>
        prev.map(a => 
          a.id === id 
            ? { ...a, likes: a.likes.filter(userId => userId !== user.id) } 
            : a
        )
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to unlike achievement");
      throw error;
    }
  };

  const getCommentsByAchievement = (achievementId: string) => {
    return comments.filter(comment => comment.achievementId === achievementId);
  };

  const addComment = async (commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    try {
      if (!user) throw new Error("You must be logged in to comment");
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newComment: Comment = {
        id: Math.random().toString(36).substring(2, 9),
        ...commentData,
        createdAt: new Date()
      };
      
      setComments(prev => [newComment, ...prev]);
      toast.success("Comment added");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add comment");
      throw error;
    }
  };

  const deleteComment = async (id: string) => {
    try {
      if (!user) throw new Error("You must be logged in to delete a comment");
      
      const comment = comments.find(c => c.id === id);
      if (!comment) throw new Error("Comment not found");
      
      if (comment.userId !== user.id) throw new Error("You can only delete your own comments");
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setComments(prev => prev.filter(c => c.id !== id));
      toast.success("Comment deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete comment");
      throw error;
    }
  };

  return (
    <AchievementContext.Provider
      value={{
        achievements,
        userAchievements,
        getAchievementById,
        createAchievement,
        updateAchievement,
        deleteAchievement,
        likeAchievement,
        unlikeAchievement,
        comments,
        getCommentsByAchievement,
        addComment,
        deleteComment,
        loading
      }}
    >
      {children}
    </AchievementContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (context === undefined) {
    throw new Error("useAchievements must be used within an AchievementProvider");
  }
  return context;
};
