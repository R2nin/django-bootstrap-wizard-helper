
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
  const [currentUser, setCurrentUser] = useState<UserWithRole | null>(null);

  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const hasPermission = (action: 'view' | 'edit' | 'delete' | 'admin'): boolean => {
    if (!currentUser) return false;
    
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

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};
