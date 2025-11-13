// Shared User Types

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "student" | "teacher" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  bio?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  enrolledClassrooms?: string[];
  teachingClassrooms?: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
