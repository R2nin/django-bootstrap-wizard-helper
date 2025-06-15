
import { MainApp } from "@/components/MainApp";
import { LoginForm } from "@/components/LoginForm";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/hooks/useUserData";
import { useEffect } from "react";

export interface PatrimonyItem {
  id: string;
  numeroChapa: number;
  name: string;
  category: string;
  location: string;
  acquisitionDate: string;
  value: number;
  status: 'active' | 'maintenance' | 'retired';
  description: string;
  responsible: string;
  supplierId?: string;
}

const AppContent = () => {
  console.log('AppContent component rendering');
  const { currentUser } = useAuth();
  
  console.log('AppContent - Current user:', currentUser);
  
  useEffect(() => {
    console.log('AppContent useEffect - User changed:', currentUser?.fullName || 'none');
  }, [currentUser]);
  
  try {
    if (!currentUser) {
      console.log('AppContent - No user, showing LoginForm');
      return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
          <LoginForm />
        </div>
      );
    }

    console.log('AppContent - User found, showing MainApp');
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <MainApp />
      </div>
    );
  } catch (error) {
    console.error('AppContent - Render error:', error);
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ 
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2>Erro no carregamento</h2>
          <p>Ocorreu um erro ao carregar a aplicação. Tente recarregar a página.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }
};

const Index = () => {
  console.log('Index component rendering - Start');
  
  try {
    // Carregando usuários do localStorage através do hook
    const { users } = useUserData();
    
    console.log('Index - Users loaded:', users.length);
    console.log('Index - Users data:', users);

    if (!users || users.length === 0) {
      console.warn('Index - No users found, this might cause login issues');
    }

    return (
      <div style={{ minHeight: '100vh' }}>
        <AuthProvider users={users}>
          <AppContent />
        </AuthProvider>
      </div>
    );
  } catch (error) {
    console.error('Index - Critical error:', error);
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ 
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#dc2626', marginBottom: '10px' }}>Erro Crítico</h1>
          <p>A aplicação não pôde ser inicializada.</p>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Limpar Cache e Recarregar
          </button>
        </div>
      </div>
    );
  }
};

export default Index;
