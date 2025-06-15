
import { MainApp } from "@/components/MainApp";
import { LoginForm } from "@/components/LoginForm";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/hooks/useUserData";

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
  
  if (!currentUser) {
    console.log('AppContent - No user, showing LoginForm');
    return <LoginForm />;
  }

  console.log('AppContent - User found, showing MainApp');
  return <MainApp />;
};

const Index = () => {
  console.log('Index component rendering');
  
  // Carregando usuários do localStorage através do hook
  const { users } = useUserData();
  
  console.log('Index - Users loaded:', users.length);

  return (
    <AuthProvider users={users}>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
