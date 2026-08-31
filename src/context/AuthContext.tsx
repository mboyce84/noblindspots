import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { userService, authService, DatabaseUser } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Convert database user to app user format
const convertDatabaseUser = (dbUser: DatabaseUser): User => ({
  id: dbUser.id,
  name: dbUser.name,
  email: dbUser.email,
  role: dbUser.role
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session and validate with database
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('fbasu-user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Validate user still exists in database
          const dbUser = await userService.getById(parsedUser.id);
          if (dbUser) {
            setUser(convertDatabaseUser(dbUser));
          } else {
            // User no longer exists, clear storage
            localStorage.removeItem('fbasu-user');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('fbasu-user');
      } finally {
        setIsLoading(false);
      }
    }
    
    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { user: dbUser, error } = await authService.signInWithEmail(email, password);
      
      if (error || !dbUser) {
        setIsLoading(false);
        return false;
      }
      
      const appUser = convertDatabaseUser(dbUser);
      setUser(appUser);
      localStorage.setItem('fbasu-user', JSON.stringify(appUser));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fbasu-user');
    authService.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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