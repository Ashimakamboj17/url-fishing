import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000' : window.location.origin);
const API_URL = `${API_BASE}/api`;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('pg_token'));
  const [loading, setLoading] = useState(true);

  // Set default auth headers on mount/token change
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('pg_token', token);
      
      // Fetch user info
      axios.get(`${API_URL}/auth/me`)
        .then(res => {
          setUser(res.data);
        })
        .catch(err => {
          console.error("Failed to load user profile with token", err);
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('pg_token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      setToken(res.data.token);
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || "Invalid email or password");
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { email, password });
      setToken(res.data.token);
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || "Registration failed");
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
