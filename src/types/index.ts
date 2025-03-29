
export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  college?: string;
  course?: string;
  gradYear?: number;
  createdAt: Date;
}

export interface Achievement {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;  // e.g., "Hackathon", "Competition", "Research", etc.
  imageUrl?: string;
  links?: string[];
  tags?: string[];
  collaborators?: string[];
  date: Date;
  createdAt: Date;
  likes: string[]; // Array of user IDs who liked this
}

export interface Comment {
  id: string;
  achievementId: string;
  userId: string;
  text: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: "like" | "comment" | "follow" | "mention";
  fromUserId: string;
  achievementId?: string;
  commentId?: string;
  read: boolean;
  createdAt: Date;
}

export type AuthStatus = "authenticated" | "unauthenticated" | "loading";
