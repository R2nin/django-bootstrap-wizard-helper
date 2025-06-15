
import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [isInitialized, setIsInitialized] = useState(false);

  // Verificar se há usuário salvo no localStorage ao inicializar
  useEffect(() => {
    try {
      console.log('AuthProvider - Checking for saved user session');
      const savedUserId = localStorage.getItem('currentUserId');
      if (savedUserId && users.length > 0) {
        const savedUser = users.find(u => u.id === savedUserId);
        if (savedUser) {
          console.log('AuthProvider - Restored user session:', savedUser.fullName);
          setCurrentUser(savedUser);
        } else {
          console.log('AuthProvider - Saved user not found, clearing session');
          localStorage.removeItem('currentUserId');
        }
      }
      setIsInitialized(true);
    } catch (error) {
      console.error('AuthProvider - Error restoring session:', error);
      setIsInitialized(true);
    }
  }, [users]);

  const login = (email: string, password: string): boolean => {
    console.log('AuthProvider - Login attempt for:', email);
    try {
      if (!users || users.length === 0) {
        console.error('AuthProvider - No users available for login');
        return false;
      }

      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        console.log('AuthProvider - Login successful for:', user.fullName);
        setCurrentUser(user);
        localStorage.setItem('currentUserId', user.id);
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
    try {
      console.log('AuthProvider - Logging out user');
      setCurrentUser(null);
      localStorage.removeItem('currentUserId');
    } catch (error) {
      console.error('AuthProvider - Logout error:', error);
    }
  };

  const hasPermission = (action: 'view' | 'edit' | 'delete' | 'admin'): boolean => {
    if (!currentUser) {
      console.log('AuthProvider - No permission - no current user');
      return false;
    }
    
    try {
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
    } catch (error) {
      console.error('AuthProvider - Permission check error:', error);
      return false;
    }
  };

  console.log('AuthProvider - Current user state:', currentUser?.fullName || 'none');
  console.log('AuthProvider - Is initialized:', isInitialized);

  // Mostrar loading enquanto não inicializou
  if (!isInitialized) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 10px'
          }}></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};
