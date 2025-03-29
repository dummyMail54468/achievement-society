
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthStatus, User } from "../types";
import { toast } from "sonner"; 

interface AuthContextType {
  user: User | null;
  status: AuthStatus;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: Partial<User>, password: string) => Promise<void>;
  signOut: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Mock data for development
const mockUsers: User[] = [
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setStatus("authenticated");
    } else {
      setStatus("unauthenticated");
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setStatus("loading");
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user with matching email
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error("Invalid email or password");
      }
      
      // In a real app, we would check password hash here
      
      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(foundUser));
      setUser(foundUser);
      setStatus("authenticated");
      toast.success("Signed in successfully");
    } catch (error) {
      setStatus("unauthenticated");
      toast.error(error instanceof Error ? error.message : "Failed to sign in");
      throw error;
    }
  };

  const signUp = async (userData: Partial<User>, password: string): Promise<void> => {
    try {
      setStatus("loading");
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      if (mockUsers.some(u => u.email === userData.email)) {
        throw new Error("Email already in use");
      }
      
      // Create new user (in a real app, we would send this to an API)
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        username: userData.username || "",
        fullName: userData.fullName || "",
        email: userData.email || "",
        createdAt: new Date(),
        ...userData
      };
      
      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      setStatus("authenticated");
      toast.success("Account created successfully");
    } catch (error) {
      setStatus("unauthenticated");
      toast.error(error instanceof Error ? error.message : "Failed to create account");
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem("user");
    setUser(null);
    setStatus("unauthenticated");
    toast.info("Signed out");
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    try {
      if (!user) throw new Error("Not authenticated");
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = { ...user, ...data };
      
      // Store updated user in localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        signIn,
        signUp,
        signOut,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
