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

type MockAccount = {
  user: User;
  password: string;
};

const SEEDED_ACCOUNTS: MockAccount[] = [
  {
    user: {
      id: 'admin-seed-1',
      name: 'Admin WebStruct',
      email: 'admin@webstruct.dev',
      role: 'admin',
      createdAt: new Date('2026-01-01'),
    },
    password: 'Admin@2026',
  },
  {
    user: {
      id: 'user-seed-1',
      name: 'Test User',
      email: 'user@webstruct.dev',
      role: 'user',
      createdAt: new Date('2026-01-01'),
    },
    password: 'User@2026',
  },
];

const MOCK_ACCOUNTS: MockAccount[] = [...SEEDED_ACCOUNTS];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true }));
    await new Promise((resolve) => setTimeout(resolve, 900));

    const account = MOCK_ACCOUNTS.find((a) => a.user.email === email && a.password === password);
    if (account) {
      setState({
        user: account.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }

    setState((prev) => ({ ...prev, isLoading: false }));
    return false;
  }, []);

  const register = useCallback(
    async (name: string, email: string, phone: string | undefined, password: string): Promise<boolean> => {
      setState((prev) => ({ ...prev, isLoading: true }));
      await new Promise((resolve) => setTimeout(resolve, 900));

      const normalizedEmail = email.trim().toLowerCase();
      const exists = MOCK_ACCOUNTS.some((a) => a.user.email.toLowerCase() === normalizedEmail);
      if (exists) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }

      const newUser: User = {
        id: Date.now().toString(),
        name,
        email: normalizedEmail,
        phone: phone?.trim() ? phone : undefined,
        role: 'user',
        createdAt: new Date(),
      };

      MOCK_ACCOUNTS.push({ user: newUser, password });
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

    MOCK_ACCOUNTS.push({ user: googleUser, password: `google-${Date.now()}-${Math.random()}` });
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
