"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import pb from "@/lib/pocketbase";
import {
  login as authLogin,
  logout as authLogout,
  getCurrentUser,
  type AuthUser,
  type UserRole,
} from "@/lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load current user from authStore on mount
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);

    // Listen for auth state changes
    const unsubscribe = pb.authStore.onChange(() => {
      const updatedUser = getCurrentUser();
      setUser(updatedUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const user = await authLogin(email, password);
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
