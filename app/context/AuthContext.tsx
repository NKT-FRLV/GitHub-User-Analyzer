"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '../types/github';

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateAvatar: (avatarUrl: string) => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for user authentication when the application loads
  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        try {
          setLoading(true);
          const response = await fetch('/api/auth/verify', {
            method: 'GET',
            credentials: 'include',
          });
          
          const data = await response.json();
          
          if (data.success && data.user) {
            // Убедитесь, что все поля пользователя включены
            setUser({
              id: data.user.id,
              username: data.user.username,
              email: data.user.email,
              avatarUrl: data.user.avatarUrl,
              isAuthenticated: true
            });
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('Error checking authentication:', error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    };

    checkAuth();
  }, []);

  // Function for logging in
  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // for working with cookies
      });
      
      const data = await response.json();
      
      if (data.success && data.user) {
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function for registration
  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      const data = await response.json();
      
      return data.success === true;
    } catch (error) {
      console.error('Error during registration:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function for updating the user's avatar
  const updateAvatar = async (avatarUrl: string): Promise<boolean> => {
    if (!user) {
      console.log('Cannot update avatar: user is not authenticated');
      return false;
    }
    
    console.log('Starting avatar update. Current user:', user);
    console.log('New avatar URL:', avatarUrl);
    
    try {
      setLoading(true);
      const response = await fetch('/api/user/update-avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avatarUrl }),
        credentials: 'include',
      });
      
      console.log('API response status:', response.status);
      
      const data = await response.json();
      console.log('API response:', data);
      
      if (data.success && data.user) {
        console.log('Update successful, new user data:', data.user);
        
        // Create a new user object to avoid reference issues
        const updatedUser = {
          ...user,
          ...data.user
        };
        
        console.log('Updated user object:', updatedUser);
        setUser(updatedUser);
        return true;
      }
      
      console.error('Error updating avatar:', data.message);
      return false;
    } catch (error) {
      console.error('Error updating avatar:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function for logging out
  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateAvatar,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 