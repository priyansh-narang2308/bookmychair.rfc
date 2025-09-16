/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "employee" | "admin";
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  signup: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "https://bookmychair-rfc-1.onrender.com/api/auth";

const DEMO_USERS: User[] = [
  {
    id: "1",
    email: "admin@test.com",
    name: "Admin User",
    role: "admin",
  },
  {
    id: "2",
    email: "employee@test.com",
    name: "John Doe",
    role: "employee",
  },
  {
    id: "3",
    email: "jane.admin@test.com",
    name: "Jane Smith",
    role: "admin",
  },
  {
    id: "4",
    email: "mike@test.com",
    name: "Mike Johnson",
    role: "employee",
  },
];

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("chairscheduler_user");
    const storedToken = localStorage.getItem("chairscheduler_token");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedToken) {
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string,
    role: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/login`,
        { email, password, role },
        { withCredentials: true }
      );
      const user = res.data.user;
      const token = res.data.token;
      setUser(user);
      setToken(token);
      localStorage.setItem("chairscheduler_user", JSON.stringify(user));
      localStorage.setItem("chairscheduler_token", token);
      setIsLoading(false);
      return true;
    } catch (err) {
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      await axios.post(
        `${API_URL}/register`,
        { name, email, password, role },
        { withCredentials: true }
      );
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return {
        success: false,
        error: err?.response?.data?.message || "Signup failed",
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("chairscheduler_user");
    localStorage.removeItem("chairscheduler_token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isLoading, signup }}
    >
      {children}
    </AuthContext.Provider>
  );
}
