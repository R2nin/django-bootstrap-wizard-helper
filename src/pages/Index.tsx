
/**
 * PÁGINA PRINCIPAL DA APLICAÇÃO
 * 
 * Ponto de entrada principal que gerencia:
 * - Autenticação do usuário
 * - Carregamento de dados iniciais
 * - Renderização condicional entre login e aplicação principal
 * 
 * FLUXO DE INICIALIZAÇÃO:
 * 1. Carrega usuários do localStorage
 * 2. Fornece contexto de autenticação
 * 3. Renderiza LoginForm se não autenticado
 * 4. Renderiza MainApp se autenticado
 */

import { MainApp } from "@/components/MainApp";
import { LoginForm } from "@/components/LoginForm";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/hooks/useUserData";

/**
 * INTERFACE DO ITEM PATRIMONIAL
 * 
 * Define a estrutura completa de um item do patrimônio.
 * Usado em toda a aplicação para tipagem TypeScript.
 */
export interface PatrimonyItem {
  id: string;                    // Identificador único gerado automaticamente
  numeroChapa: number;           // Número da chapa (pode ser automático ou manual)
  name: string;                  // Nome/descrição do item
  category: string;              // Categoria (Informática, Mobiliário, etc.)
  location: string;              // Localização física do item
  acquisitionDate: string;       // Data de aquisição (formato ISO)
  value: number;                 // Valor monetário do item
  status: 'active' | 'maintenance' | 'retired';  // Status atual do item
  description: string;           // Descrição detalhada
  responsible: string;           // Nome do responsável pelo item
  supplierId?: string;          // ID do fornecedor (opcional)
}

/**
 * COMPONENTE INTERNO DA APLICAÇÃO
 * 
 * Gerencia a renderização condicional baseada no estado de autenticação.
 * Deve estar dentro do AuthProvider para acessar o contexto de autenticação.
 */
const AppContent = () => {
  const { currentUser, logout } = useAuth();
  
  // Se não há usuário logado, mostra tela de login
  if (!currentUser) {
    return <LoginForm />;
  }

  // Se há usuário logado, mostra a aplicação principal
  return <MainApp currentUser={currentUser} onLogout={logout} />;
};

/**
 * COMPONENTE PRINCIPAL DA PÁGINA
 * 
 * Configura o contexto de autenticação e renderiza o conteúdo da aplicação.
 * Carrega os usuários do localStorage antes de inicializar o contexto.
 */
const Index = () => {
  // Carrega usuários do localStorage através do hook especializado
  const { users } = useUserData();

  return (
    <AuthProvider users={users}>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
