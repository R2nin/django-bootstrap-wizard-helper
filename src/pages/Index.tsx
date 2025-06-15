
import { MainApp } from "@/components/MainApp";
import { LoginForm } from "@/components/LoginForm";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/hooks/useUserData";

export interface PatrimonyItem {
  id: string;
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
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <LoginForm />;
  }

  return <MainApp />;
};

const Index = () => {
  // Carregando usuários do localStorage através do hook
  const { users } = useUserData();

  return (
    <AuthProvider users={users}>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
