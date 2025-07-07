/**
 * SISTEMA DE GESTÃO PATRIMONIAL COM SUPABASE
 * 
 * Componente principal da aplicação que gerencia todo o fluxo de patrimônio.
 * Agora integrado com Supabase para persistência de dados.
 */

import { useState } from 'react';
import { Navigation } from './Navigation';
import { Header } from './Header';
import { PatrimonyList } from './PatrimonyList';
import { PatrimonyForm } from './PatrimonyForm';
import { LogList } from './LogList';
import { UserList } from './UserList';
import { UserForm } from './UserForm';
import { Dashboard } from './Dashboard';
import { PatrimonyComparison } from './PatrimonyComparison';
import { useSupabasePatrimony } from '@/hooks/useSupabasePatrimony';
import { useLogData } from '@/hooks/useLogData';
import { useUserData } from '@/hooks/useUserData';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserWithRole } from '@/types/log';
import { PatrimonyItem } from '@/pages/Index';
import { useSupplierData } from '@/hooks/useSupplierData';
import { SupplierList } from './SupplierList';
import { SupplierForm } from './SupplierForm';
import { useLocationData } from '@/hooks/useLocationData';
import { LocationForm } from './LocationForm';
import { toast } from "@/components/ui/use-toast"
import { Supplier } from '@/types/supplier';
import { PatrimonyImport } from './PatrimonyImport';
import { SystemManual } from './SystemManual';
import { TechnicalDocumentation } from './TechnicalDocumentation';

// Definição dos tipos de abas disponíveis no sistema
type ActiveTab = 'dashboard' | 'items' | 'add' | 'users' | 'addUser' | 'logs' | 'suppliers' | 'addSupplier' | 'addLocation' | 'import' | 'manual' | 'technical' | 'compare';

interface MainAppProps {
  currentUser: UserWithRole;
  onLogout: () => void;
}

export const MainApp = ({ currentUser, onLogout }: MainAppProps) => {
  // Estado para controlar qual aba está ativa
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  
  // Estado para controlar qual item está sendo editado (null = criando novo)
  const [editingItem, setEditingItem] = useState<PatrimonyItem | null>(null);
  
  // Hooks para gerenciamento de dados - agora usando Supabase
  const { items, loading, addItem, addItemWithChapa, updateItem, deleteItem, addMultipleItems } = useSupabasePatrimony();
  const { logs, addLog } = useLogData();
  const { users, addUser, deleteUser } = useUserData();
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useSupplierData();
  const { locations, addLocation, deleteLocation } = useLocationData();
  
  // Estado para controlar modal de adicionar localização
  const [isAddingLocation, setIsAddingLocation] = useState(false);

  /**
   * SISTEMA DE CONTROLE DE PERMISSÕES
   */
  const hasPermission = (action: 'view' | 'edit' | 'delete' | 'admin'): boolean => {
    console.log('MainApp - Verificando permissão:', action, 'para usuário:', currentUser.role);
    
    // Admin tem acesso total
    if (currentUser.role === 'admin') return true;

    switch (action) {
      case 'view':
        return true; // Todos podem visualizar
      case 'edit':
        return currentUser.role === 'user'; // User também pode editar
      case 'delete':
        return false; // Apenas admin pode deletar
      case 'admin':
        return false; // Apenas admin tem acesso a funções administrativas
      default:
        return false;
    }
  };

  /**
   * CRIAÇÃO DE ITEM COM NUMERAÇÃO AUTOMÁTICA
   */
  const handleAddItem = async (item: Omit<PatrimonyItem, 'id' | 'numeroChapa'>) => {
    console.log('MainApp - handleAddItem INICIADO com:', item);
    
    const newItem = await addItem(item);
    
    if (newItem) {
      // Registra a ação no log para auditoria
      addLog(
        'CREATE',
        'PATRIMONY',
        'Novo item adicionado ao patrimônio',
        currentUser.id,
        currentUser.fullName,
        newItem.id,
        `${newItem.name} (Chapa: ${newItem.numeroChapa})`
      );
      
      // Redireciona para a aba de itens para mostrar o resultado
      setActiveTab('items');
    }
  };

  /**
   * CRIAÇÃO DE ITEM COM NUMERAÇÃO MANUAL
   */
  const handleAddItemWithChapa = async (item: Omit<PatrimonyItem, 'id'>) => {
    console.log('MainApp - handleAddItemWithChapa INICIADO com:', item);
    
    const newItem = await addItemWithChapa(item);
    
    if (newItem) {
      // Registra no log com descrição específica
      addLog(
        'CREATE',
        'PATRIMONY',
        'Novo item adicionado ao patrimônio com chapa específica',
        currentUser.id,
        currentUser.fullName,
        newItem.id,
        `${newItem.name} (Chapa: ${newItem.numeroChapa})`
      );
      
      // Redireciona para a aba de itens
      setActiveTab('items');
    }
  };

  /**
   * ATUALIZAÇÃO DE ITEM EXISTENTE
   */
  const handleUpdateItem = async (id: string, updates: Partial<PatrimonyItem>) => {
    console.log('Atualizando item:', id, updates);
    await updateItem(id, updates);
    
    // Busca o item atualizado para logging
    const updatedItem = items.find(item => item.id === id);
    if (updatedItem) {
      addLog(
        'UPDATE',
        'PATRIMONY',
        `Item atualizado: ${Object.keys(updates).join(', ')}`,
        currentUser.id,
        currentUser.fullName,
        id,
        `${updatedItem.name} (Chapa: ${updatedItem.numeroChapa})`
      );
    }
    
    // Limpa o estado de edição e volta para a listagem
    setEditingItem(null);
    setActiveTab('items');
  };

  /**
   * EXCLUSÃO DE ITEM
   */
  const handleDeleteItem = async (id: string) => {
    // Busca o item antes de deletar para logging
    const deletedItem = items.find(item => item.id === id);
    await deleteItem(id);
    
    if (deletedItem) {
      addLog(
        'DELETE',
        'PATRIMONY',
        'Item removido do patrimônio',
        currentUser.id,
        currentUser.fullName,
        id,
        `${deletedItem.name} (Chapa: ${deletedItem.numeroChapa})`
      );
    }
  };

  /**
   * PREPARAÇÃO PARA EDIÇÃO
   */
  const handleEditItem = (item: PatrimonyItem) => {
    setEditingItem(item);
    setActiveTab('add'); // Reutiliza o formulário de criação para edição
  };

  const handleAddUser = (user: Omit<UserWithRole, 'id' | 'createdAt'>) => {
    const newUser = addUser(user);
    addLog(
      'CREATE',
      'USER',
      'Novo usuário adicionado ao sistema',
      currentUser.id,
      currentUser.fullName,
      newUser.id,
      newUser.fullName
    );
  };

  const handleDeleteUser = (id: string) => {
    const deletedUser = users.find(user => user.id === id);
    deleteUser(id);
    if (deletedUser) {
      addLog(
        'DELETE',
        'USER',
        'Usuário removido do sistema',
        currentUser.id,
        currentUser.fullName,
        id,
        deletedUser.fullName
      );
    }
  };

  const handleAddSupplier = (supplier: Omit<Supplier, 'id' | 'createdAt'>) => {
    const newSupplier = addSupplier(supplier);
    addLog(
      'CREATE',
      'SUPPLIER',
      'Novo fornecedor adicionado ao sistema',
      currentUser.id,
      currentUser.fullName,
      newSupplier.id,
      newSupplier.name
    );
  };

  const handleUpdateSupplier = (id: string, updates: Partial<Supplier>) => {
    updateSupplier(id, updates);
    const updatedSupplier = suppliers.find(supplier => supplier.id === id);
    if (updatedSupplier) {
      addLog(
        'UPDATE',
        'SUPPLIER',
        `Fornecedor atualizado: ${Object.keys(updates).join(', ')}`,
        currentUser.id,
        currentUser.fullName,
        id,
        updatedSupplier.name
      );
    }
  };

  const handleDeleteSupplier = (id: string) => {
    const deletedSupplier = suppliers.find(supplier => supplier.id === id);
    deleteSupplier(id);
    if (deletedSupplier) {
      addLog(
        'DELETE',
        'SUPPLIER',
        'Fornecedor removido do sistema',
        currentUser.id,
        currentUser.fullName,
        id,
        deletedSupplier.name
      );
    }
  };

  const handleAddLocation = (location: Omit<{ name: string; responsibleId: string; responsibleName: string; }, 'id' | 'createdAt'>) => {
    const newLocation = addLocation(location);
    setIsAddingLocation(false);
    addLog(
      'CREATE',
      'LOCATION',
      'Nova localização adicionada ao sistema',
      currentUser.id,
      currentUser.fullName,
      newLocation.id,
      newLocation.name
    );
  };

  const handleDeleteLocation = (id: string) => {
    const deletedLocation = locations.find(location => location.id === id);
    deleteLocation(id);
    if (deletedLocation) {
      addLog(
        'DELETE',
        'LOCATION',
        'Localização removida do sistema',
        currentUser.id,
        currentUser.fullName,
        id,
        deletedLocation.name
      );
    }
  };

  /**
   * IMPORTAÇÃO EM MASSA DE ITENS
   */
  const handleImportItems = async (importedItems: PatrimonyItem[]) => {
    console.log('MainApp - Iniciando importação de', importedItems.length, 'itens');
    
    try {
      const addedItems = await addMultipleItems(importedItems);
      console.log('MainApp - Itens adicionados com sucesso:', addedItems.length);
      
      // Registra a importação no log
      addedItems.forEach((item) => {
        addLog(
          'CREATE',
          'PATRIMONY',
          'Item importado do Excel/CSV',
          currentUser.id,
          currentUser.fullName,
          item.id,
          `${item.name} (Chapa: ${item.numeroChapa})`
        );
      });
      
    } catch (error) {
      console.error('MainApp - Erro durante a importação:', error);
    }
    
    // Vai para listagem para ver os resultados
    setActiveTab('items');
  };

  /**
   * MUDANÇA DE ABA
   */
  const handleTabChange = (tab: string) => {
    console.log('MainApp - Mudando aba para:', tab);
    setActiveTab(tab as ActiveTab);
  };

  // ORDENAÇÃO DOS ITENS
  const sortedItems = [...items].sort((a, b) => a.numeroChapa - b.numeroChapa);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Carregando dados...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* CABEÇALHO: Informações do usuário e ações globais */}
      <Header currentUser={currentUser} onLogout={onLogout} onAddLocation={() => setIsAddingLocation(true)} />

      {/* NAVEGAÇÃO: Abas principais do sistema com controle de permissões */}
      <Navigation activeTab={activeTab} setActiveTab={handleTabChange} hasPermission={hasPermission} />

      {/* CONTEÚDO PRINCIPAL: Renderização condicional baseada na aba ativa */}
      <main className="flex-grow overflow-y-auto p-4">
        {/* MODAL DE NOVA LOCALIZAÇÃO: Sobrepõe o conteúdo principal quando ativo */}
        {isAddingLocation && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Adicionar Nova Localização</CardTitle>
            </CardHeader>
            <CardContent>
              <LocationForm 
                onSubmit={handleAddLocation} 
                users={users} 
                onCancel={() => setIsAddingLocation(false)} 
              />
            </CardContent>
          </Card>
        )}

        {/* CONTEÚDO PRINCIPAL DAS ABAS */}
        {!isAddingLocation && (
          <>
            {/* ABA DASHBOARD: Visão geral e estatísticas */}
            {activeTab === 'dashboard' && (
              <Dashboard patrimonyItems={sortedItems} />
            )}

            {/* ABA ITENS: Listagem completa do patrimônio */}
            {activeTab === 'items' && (
              <PatrimonyList
                items={sortedItems}
                onUpdate={handleUpdateItem}
                onDelete={handleDeleteItem}
                onEdit={handleEditItem}
              />
            )}

            {/* ABA FORMULÁRIO: Criação/edição de itens */}
            {activeTab === 'add' && hasPermission('edit') && (
              <PatrimonyForm
                onSubmit={handleAddItem}
                onSubmitWithChapa={handleAddItemWithChapa}
                onUpdate={handleUpdateItem}
                existingItems={sortedItems}
                suppliers={suppliers}
                editingItem={editingItem}
                onCancelEdit={() => {
                  setEditingItem(null);
                  setActiveTab('items');
                }}
              />
            )}

            {/* ABA IMPORTAÇÃO: Upload de arquivos Excel/CSV */}
            {activeTab === 'import' && hasPermission('edit') && (
              <PatrimonyImport onImport={handleImportItems} />
            )}

            {/* ABA COMPARAÇÃO: Nova funcionalidade para comparar arquivos */}
            {activeTab === 'compare' && hasPermission('edit') && (
              <PatrimonyComparison />
            )}

            {/* ABA FORNECEDORES: Gestão de fornecedores */}
            {activeTab === 'suppliers' && (
              <SupplierList
                suppliers={suppliers}
                onUpdate={handleUpdateSupplier}
                onDelete={handleDeleteSupplier}
              />
            )}

            {/* ABA NOVO FORNECEDOR: Formulário de criação */}
            {activeTab === 'addSupplier' && hasPermission('edit') && (
              <SupplierForm
                onSubmit={handleAddSupplier}
              />
            )}

            {/* ABA LOGS: Auditoria do sistema */}
            {activeTab === 'logs' && (
              <LogList logs={logs} />
            )}

            {/* ABA USUÁRIOS: Gestão de usuários (apenas para admins) */}
            {activeTab === 'users' && hasPermission('admin') && (
              <UserList
                users={users}
                onDelete={handleDeleteUser}
              />
            )}

            {/* ABA NOVO USUÁRIO: Criação de usuários (apenas para admins) */}
            {activeTab === 'addUser' && hasPermission('admin') && (
              <UserForm onSubmit={handleAddUser} />
            )}

            {/* ABA MANUAL: Manual do usuário */}
            {activeTab === 'manual' && (
              <SystemManual />
            )}

            {/* ABA DOCUMENTAÇÃO TÉCNICA: Documentação do código */}
            {activeTab === 'technical' && (
              <TechnicalDocumentation />
            )}
          </>
        )}
      </main>
    </div>
  );
};
