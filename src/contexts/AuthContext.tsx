
import React, { createContext, useContext, useState } from 'react';
import { UserWithRole } from '@/types/log';

interface AuthContextType {
  currentUser: UserWithRole | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  hasPermission: (action: 'view' | 'edit' | 'delete' | 'admin') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
  users: UserWithRole[];
}

export const AuthProvider = ({ children, users }: AuthProviderProps) => {
  console.log('AuthProvider rendering with users:', users.length);
  
  const [currentUser, setCurrentUser] = useState<UserWithRole | null>(null);

  const login = (email: string, password: string): boolean => {
    console.log('AuthProvider - Login attempt for:', email);
    try {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        console.log('AuthProvider - Login successful for:', user.fullName);
        setCurrentUser(user);
        return true;
      }
      console.log('AuthProvider - Login failed - user not found');
      return false;
    } catch (error) {
      console.error('AuthProvider - Login error:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('AuthProvider - Logging out user');
    setCurrentUser(null);
  };

  const hasPermission = (action: 'view' | 'edit' | 'delete' | 'admin'): boolean => {
    if (!currentUser) {
      console.log('AuthProvider - No permission - no current user');
      return false;
    }
    
    switch (action) {
      case 'view':
        return true; // Ambos admin e user podem visualizar
      case 'edit':
      case 'delete':
      case 'admin':
        return currentUser.role === 'admin';
      default:
        return false;
    }
  };

  console.log('AuthProvider - Current user state:', currentUser?.fullName || 'none');

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};
