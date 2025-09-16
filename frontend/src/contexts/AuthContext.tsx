import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'employee' | 'admin';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded users for demo
const DEMO_USERS: User[] = [
  {
    id: '1',
    email: 'admin@test.com',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: '2',
    email: 'employee@test.com',
    name: 'John Doe',
    role: 'employee',
  },
  {
    id: '3',
    email: 'jane.admin@test.com',
    name: 'Jane Smith',
    role: 'admin',
  },
  {
    id: '4',
    email: 'mike@test.com',
    name: 'Mike Johnson',
    role: 'employee',
  },
];

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('chairscheduler_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email (case insensitive)
    const foundUser = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );
    
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('chairscheduler_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chairscheduler_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}