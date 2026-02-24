import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string | undefined, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Ali Mohammadi',
    email: 'ali@example.com',
    phone: '09123456789',
    role: 'user',
    createdAt: new Date(),
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true }));
    await new Promise((resolve) => setTimeout(resolve, 900));

    const user = MOCK_USERS.find((u) => u.email === email);
    if (user && password === '123456') {
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }

    setState((prev) => ({ ...prev, isLoading: false }));
    return false;
  }, []);

  const register = useCallback(
    async (name: string, email: string, phone: string | undefined, _password: string): Promise<boolean> => {
      setState((prev) => ({ ...prev, isLoading: true }));
      await new Promise((resolve) => setTimeout(resolve, 900));

      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        phone: phone?.trim() ? phone : undefined,
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
    },
    []
  );

  const loginWithGoogle = useCallback(async (): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true }));
    await new Promise((resolve) => setTimeout(resolve, 700));

    const googleUser: User = {
      id: `google-${Date.now()}`,
      name: 'Google User',
      email: `user${Math.floor(Math.random() * 10000)}@gmail.com`,
      role: 'user',
      createdAt: new Date(),
    };

    MOCK_USERS.push(googleUser);
    setState({
      user: googleUser,
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
    setState((prev) => ({
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
        loginWithGoogle,
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
