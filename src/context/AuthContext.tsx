import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'علی محمدی',
    email: 'ali@example.com',
    phone: '09123456789',
    role: 'user',
    createdAt: new Date(),
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = MOCK_USERS.find(u => u.email === email);
    
    if (user && password === '123456') {
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }
    
    setState(prev => ({ ...prev, isLoading: false }));
    return false;
  }, []);

  const register = useCallback(async (
    name: string,
    email: string,
    phone: string,
    _password: string
  ): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      role: 'user',
      createdAt: new Date(),
    };
    
    MOCK_USERS.push(newUser);
    
    setState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
    });
    
    return true;
  }, []);

  const logout = useCallback(() => {
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const updateUser = useCallback((userData: Partial<User>) => {
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...userData } : null,
    }));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
