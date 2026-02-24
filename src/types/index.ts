export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  price?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  quote: string;
  rating: number;
}

export interface ProcessStep {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface Stat {
  id: string;
  value: string;
  label: string;
  icon: string;
}

export interface Case {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  description?: string;
}

export interface Activity {
  id: string;
  type: 'case_update' | 'document_upload' | 'message' | 'appointment';
  title: string;
  date: Date;
  status: 'completed' | 'pending' | 'urgent';
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
