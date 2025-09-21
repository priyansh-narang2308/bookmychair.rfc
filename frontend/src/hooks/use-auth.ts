import { useState } from "react";
import axios from "axios";

const API_URL = "https://bookmychair-rfc-1.onrender.com/api/auth";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: string
  ) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        role,
      });
      setIsLoading(false);
      return { success: true };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setIsLoading(false);
      return {
        success: false,
        error: err.response?.data?.message || "Signup failed",
      };
    }
  };

  const login = async (email: string, password: string, role: string) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/login`, {
        email,
        password,
        role,
      });
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      setIsLoading(false);
      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return { user, isLoading, signup, login, logout };
}
