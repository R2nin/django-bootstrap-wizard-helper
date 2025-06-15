/**
 * SISTEMA DE GESTÃO PATRIMONIAL
 * 
 * Componente principal da aplicação que gerencia todo o fluxo de patrimônio.
 * 
 * FUNCIONALIDADES PRINCIPAIS:
 * - Dashboard com estatísticas e relatórios
 * - Gestão de itens patrimoniais (CRUD completo)
 * - Sistema de numeração de chapas automático e manual
 * - Importação de itens via Excel/CSV
 * - Gestão de fornecedores e usuários
 * - Sistema de logs para auditoria
 * - Controle de permissões por role (admin/user)
 * 
 * FLUXO DE CRIAÇÃO DE ITENS:
 * 1. handleAddItem: Cria item com numeração automática (próximo número disponível)
 * 2. handleAddItemWithChapa: Cria item com numeração manual específica
 * 3. handleImportItems: Importa múltiplos itens via arquivo
 * 
 * CONTROLE DE PERMISSÕES:
 * - view: Todos podem visualizar
 * - edit: Admin e User podem editar
 * - delete: Apenas Admin pode deletar
 * - admin: Apenas Admin tem acesso a funções administrativas
 */

import { useState, useEffect } from 'react';
import { Navigation } from './Navigation';
import { Header } from './Header';
import { PatrimonyList } from './PatrimonyList';
import { PatrimonyForm } from './PatrimonyForm';
import { LogList } from './LogList';
import { UserList } from './UserList';
import { UserForm } from './UserForm';
import { Dashboard } from './Dashboard';
import { usePatrimonyData } from '@/hooks/usePatrimonyData';
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

// Definição dos tipos de abas disponíveis no sistema
type ActiveTab = 'dashboard' | 'items' | 'add' | 'users' | 'addUser' | 'logs' | 'suppliers' | 'addSupplier' | 'addLocation' | 'import';

interface MainAppProps {
  currentUser: UserWithRole;
  onLogout: () => void;
}

export const MainApp = ({ currentUser, onLogout }: MainAppProps) => {
  // Estado para controlar qual aba está ativa
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  
  // Estado para controlar qual item está sendo editado (null = criando novo)
  const [editingItem, setEditingItem] = useState<PatrimonyItem | null>(null);
  
  // Hooks para gerenciamento de dados - cada um gerencia seu próprio localStorage
  const { items, addItem, addItemWithChapa, updateItem, deleteItem } = usePatrimonyData();
  const { logs, addLog } = useLogData();
  const { users, addUser, deleteUser } = useUserData();
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useSupplierData();
  const { locations, addLocation, deleteLocation } = useLocationData();
  
  // Estado para controlar modal de adicionar localização
  const [isAddingLocation, setIsAddingLocation] = useState(false);

  // Debug: Log do estado atual sempre que mudanças importantes acontecem
  useEffect(() => {
    console.log('MainApp - Componente renderizado, activeTab:', activeTab);
    console.log('MainApp - Total items no estado:', items.length);
    items.forEach((item, index) => {
      console.log(`MainApp - Item ${index + 1}:`, item);
    });
  }, [activeTab, items]);

  /**
   * SISTEMA DE CONTROLE DE PERMISSÕES
   * 
   * Verifica se o usuário atual tem permissão para realizar uma ação específica.
   * 
   * @param action - Tipo de ação que se deseja verificar
   * @returns boolean - true se tem permissão, false caso contrário
   * 
   * HIERARQUIA DE PERMISSÕES:
   * - Admin: Pode fazer tudo
   * - User: Pode visualizar e editar, mas não deletar ou acessar funções admin
   * - Viewer: Apenas visualização (futuro)
   */
  const hasPermission = (action: 'view' | 'edit' | 'delete' | 'admin'): boolean => {
    console.log('MainApp - Verificando permissão:', action, 'para usuário:', currentUser.role);
    
    // Admin tem acesso total
    if (currentUser.role === 'admin') return true;

    switch (action) {
      case 'view':
        return true; // Todos podem visualizar
      case 'edit':
        return currentUser.role === 'admin' || currentUser.role === 'user';
      case 'delete':
        return currentUser.role === 'admin'; // Apenas admin pode deletar
      case 'admin':
        return currentUser.role === 'admin'; // Apenas admin tem acesso a funções administrativas
      default:
        return false;
    }
  };

  /**
   * CRIAÇÃO DE ITEM COM NUMERAÇÃO AUTOMÁTICA
   * 
   * Cria um novo item patrimonial usando o próximo número de chapa disponível.
   * O número é calculado automaticamente pelo hook usePatrimonyData.
   * 
   * @param item - Dados do item sem ID e sem numeroChapa
   */
  const handleAddItem = (item: Omit<PatrimonyItem, 'id' | 'numeroChapa'>) => {
    console.log('MainApp - handleAddItem INICIADO com:', item);
    console.log('MainApp - Total items ANTES da adição:', items.length);
    
    // Cria o item com numeração automática
    const newItem = addItem(item);
    console.log('MainApp - Item CRIADO:', newItem);
    
    // Aguarda um pouco para garantir que o estado foi atualizado
    setTimeout(() => {
      console.log('MainApp - Total items APÓS adição (timeout):', items.length);
    }, 100);
    
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
    
    // Exibe notificação de sucesso para o usuário
    toast({
      title: "Sucesso!",
      description: `Item "${newItem.name}" adicionado com chapa ${newItem.numeroChapa}.`,
    });
    
    console.log('MainApp - Toast exibido para item:', newItem.name);
    
    // Redireciona para a aba de itens para mostrar o resultado
    setActiveTab('items');
    console.log('MainApp - Mudando para aba items');
  };

  /**
   * CRIAÇÃO DE ITEM COM NUMERAÇÃO MANUAL
   * 
   * Cria um novo item patrimonial usando um número de chapa específico informado pelo usuário.
   * Usado quando o usuário quer definir manualmente o número da chapa.
   * 
   * @param item - Dados do item sem ID, mas COM numeroChapa específico
   */
  const handleAddItemWithChapa = (item: Omit<PatrimonyItem, 'id'>) => {
    console.log('MainApp - handleAddItemWithChapa INICIADO com:', item);
    console.log('MainApp - Total items ANTES da adição:', items.length);
    
    // Cria o item com a chapa específica fornecida
    const newItem = addItemWithChapa(item);
    console.log('MainApp - Item CRIADO com chapa específica:', newItem);
    
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
    
    toast({
      title: "Sucesso!",
      description: `Item "${newItem.name}" adicionado com chapa ${newItem.numeroChapa}.`,
    });
    
    console.log('MainApp - Toast exibido para item:', newItem.name);
    
    // Redireciona para a aba de itens
    setActiveTab('items');
    console.log('MainApp - Mudando para aba items');
  };

  /**
   * ATUALIZAÇÃO DE ITEM EXISTENTE
   * 
   * Atualiza um item patrimonial existente com novos dados.
   * Registra as mudanças no log de auditoria.
   * 
   * @param id - ID único do item a ser atualizado
   * @param updates - Objeto com os campos que devem ser atualizados
   */
  const handleUpdateItem = (id: string, updates: Partial<PatrimonyItem>) => {
    console.log('Atualizando item:', id, updates);
    updateItem(id, updates);
    
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
    
    toast({
      title: "Sucesso!",
      description: "Item atualizado com sucesso.",
    });
    
    // Limpa o estado de edição e volta para a listagem
    setEditingItem(null);
    setActiveTab('items');
  };

  /**
   * EXCLUSÃO DE ITEM
   * 
   * Remove um item do patrimônio permanentemente.
   * Apenas usuários com permissão de 'delete' podem executar esta ação.
   * 
   * @param id - ID único do item a ser removido
   */
  const handleDeleteItem = (id: string) => {
    // Busca o item antes de deletar para logging
    const deletedItem = items.find(item => item.id === id);
    deleteItem(id);
    
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
      
      toast({
        title: "Sucesso!",
        description: "Item removido com sucesso do patrimônio.",
      })
    }
  };

  /**
   * PREPARAÇÃO PARA EDIÇÃO
   * 
   * Configura o formulário para editar um item existente.
   * Define o item no estado e muda para a aba de formulário.
   * 
   * @param item - Item completo que será editado
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
   * 
   * Processa uma lista de itens vindos de importação (Excel/CSV) e os adiciona ao sistema.
   * Cada item é adicionado individualmente e registrado no log.
   * 
   * @param importedItems - Array de itens já processados do arquivo
   */
  const handleImportItems = (importedItems: PatrimonyItem[]) => {
    console.log('Iniciando importação de', importedItems.length, 'itens');
    
    let successCount = 0;
    let errorCount = 0;
    
    // Processa cada item individualmente
    importedItems.forEach((item, index) => {
      try {
        console.log(`Importando item ${index + 1}:`, item);
        const newItem = addItemWithChapa(item); // Usa chapa específica do arquivo
        
        addLog(
          'CREATE',
          'PATRIMONY',
          'Item importado do Excel',
          currentUser.id,
          currentUser.fullName,
          newItem.id,
          `${newItem.name} (Chapa: ${newItem.numeroChapa})`
        );
        successCount++;
      } catch (error) {
        console.error(`Erro ao importar item ${index + 1}:`, error);
        errorCount++;
      }
    });
    
    console.log(`Importação concluída: ${successCount} sucessos, ${errorCount} erros`);
    
    // Feedback para o usuário sobre o resultado da importação
    if (successCount > 0) {
      toast({
        title: "Sucesso!",
        description: `${successCount} itens importados com sucesso.`,
      });
    }
    
    if (errorCount > 0) {
      toast({
        title: "Atenção",
        description: `${errorCount} itens falharam na importação.`,
        variant: "destructive"
      });
    }
    
    setActiveTab('items'); // Vai para listagem para ver os resultados
  };

  /**
   * MUDANÇA DE ABA
   * 
   * Controla a navegação entre as diferentes seções do sistema.
   * 
   * @param tab - Nome da aba para onde navegar
   */
  const handleTabChange = (tab: string) => {
    console.log('MainApp - Mudando aba para:', tab);
    setActiveTab(tab as ActiveTab);
  };

  // ORDENAÇÃO DOS ITENS
  // Sempre exibe os itens ordenados por número de chapa crescente para melhor visualização
  const sortedItems = [...items].sort((a, b) => a.numeroChapa - b.numeroChapa);

  console.log('MainApp - Total de items atual:', items.length);
  console.log('MainApp - Items ordenados:', sortedItems.length);
  console.log('MainApp - Renderizando com aba ativa:', activeTab);

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

            {/* ABA FORMULÁRIO: Criação/edição de itens (apenas para usuários com permissão) */}
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

            {/* ABA IMPORTAÇÃO: Upload de arquivos Excel/CSV (apenas para usuários com permissão) */}
            {activeTab === 'import' && hasPermission('edit') && (
              <PatrimonyImport onImport={handleImportItems} />
            )}

            {/* ABA FORNECEDORES: Gestão de fornecedores */}
            {activeTab === 'suppliers' && (
              <SupplierList
                suppliers={suppliers}
                onUpdate={handleUpdateSupplier}
                onDelete={handleDeleteSupplier}
              />
            )}

            {/* ABA NOVO FORNECEDOR: Formulário de criação (apenas para usuários com permissão) */}
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
          </>
        )}
      </main>
    </div>
  );
};
