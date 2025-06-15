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

type ActiveTab = 'dashboard' | 'items' | 'add' | 'users' | 'addUser' | 'logs' | 'suppliers' | 'addSupplier' | 'addLocation' | 'import';

interface MainAppProps {
  currentUser: UserWithRole;
  onLogout: () => void;
}

export const MainApp = ({ currentUser, onLogout }: MainAppProps) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [editingItem, setEditingItem] = useState<PatrimonyItem | null>(null);
  const { items, addItem, addItemWithChapa, updateItem, deleteItem } = usePatrimonyData();
  const { logs, addLog } = useLogData();
  const { users, addUser, deleteUser } = useUserData();
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useSupplierData();
  const { locations, addLocation, deleteLocation } = useLocationData();
  const [isAddingLocation, setIsAddingLocation] = useState(false);

  useEffect(() => {
    console.log('MainApp - Componente renderizado, activeTab:', activeTab);
    console.log('MainApp - Total items no estado:', items.length);
    items.forEach((item, index) => {
      console.log(`MainApp - Item ${index + 1}:`, item);
    });
  }, [activeTab, items]);

  const hasPermission = (action: 'view' | 'edit' | 'delete' | 'admin'): boolean => {
    console.log('MainApp - Verificando permissão:', action, 'para usuário:', currentUser.role);
    
    if (currentUser.role === 'admin') return true;

    switch (action) {
      case 'view':
        return true;
      case 'edit':
        return currentUser.role === 'admin' || currentUser.role === 'user';
      case 'delete':
        return currentUser.role === 'admin';
      case 'admin':
        return currentUser.role === 'admin';
      default:
        return false;
    }
  };

  const handleAddItem = (item: Omit<PatrimonyItem, 'id' | 'numeroChapa'>) => {
    console.log('MainApp - handleAddItem INICIADO com:', item);
    console.log('MainApp - Total items ANTES da adição:', items.length);
    
    const newItem = addItem(item);
    console.log('MainApp - Item CRIADO:', newItem);
    
    // Aguardar um pouco para garantir que o estado foi atualizado
    setTimeout(() => {
      console.log('MainApp - Total items APÓS adição (timeout):', items.length);
    }, 100);
    
    addLog(
      'CREATE',
      'PATRIMONY',
      'Novo item adicionado ao patrimônio',
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
    
    // Mudar para a aba de itens para mostrar o novo item
    setActiveTab('items');
    console.log('MainApp - Mudando para aba items');
  };

  const handleUpdateItem = (id: string, updates: Partial<PatrimonyItem>) => {
    console.log('Atualizando item:', id, updates);
    updateItem(id, updates);
    
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
    
    // Resetar o item de edição após atualizar
    setEditingItem(null);
    setActiveTab('items');
  };

  const handleDeleteItem = (id: string) => {
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

  const handleEditItem = (item: PatrimonyItem) => {
    setEditingItem(item);
    setActiveTab('add');
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

  const handleImportItems = (importedItems: PatrimonyItem[]) => {
    console.log('Iniciando importação de', importedItems.length, 'itens');
    
    let successCount = 0;
    let errorCount = 0;
    
    importedItems.forEach((item, index) => {
      try {
        console.log(`Importando item ${index + 1}:`, item);
        const newItem = addItemWithChapa(item);
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
    
    setActiveTab('items');
  };

  const handleTabChange = (tab: string) => {
    console.log('MainApp - Mudando aba para:', tab);
    setActiveTab(tab as ActiveTab);
  };

  // Ordenar itens por chapa crescente
  const sortedItems = [...items].sort((a, b) => a.numeroChapa - b.numeroChapa);

  console.log('MainApp - Total de items atual:', items.length);
  console.log('MainApp - Items ordenados:', sortedItems.length);
  console.log('MainApp - Renderizando com aba ativa:', activeTab);

  return (
    <div className="flex flex-col h-screen">
      <Header currentUser={currentUser} onLogout={onLogout} onAddLocation={() => setIsAddingLocation(true)} />

      <Navigation activeTab={activeTab} setActiveTab={handleTabChange} hasPermission={hasPermission} />

      <main className="flex-grow overflow-y-auto p-4">
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

        {!isAddingLocation && (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard patrimonyItems={sortedItems} />
            )}

            {activeTab === 'items' && (
              <PatrimonyList
                items={sortedItems}
                onUpdate={handleUpdateItem}
                onDelete={handleDeleteItem}
                onEdit={handleEditItem}
              />
            )}

            {activeTab === 'add' && hasPermission('edit') && (
              <PatrimonyForm
                onSubmit={handleAddItem}
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

            {activeTab === 'import' && hasPermission('edit') && (
              <PatrimonyImport onImport={handleImportItems} />
            )}

            {activeTab === 'suppliers' && (
              <SupplierList
                suppliers={suppliers}
                onUpdate={handleUpdateSupplier}
                onDelete={handleDeleteSupplier}
              />
            )}

            {activeTab === 'addSupplier' && hasPermission('edit') && (
              <SupplierForm
                onSubmit={handleAddSupplier}
              />
            )}

            {activeTab === 'logs' && (
              <LogList logs={logs} />
            )}

            {activeTab === 'users' && hasPermission('admin') && (
              <UserList
                users={users}
                onDelete={handleDeleteUser}
              />
            )}

            {activeTab === 'addUser' && hasPermission('admin') && (
              <UserForm onSubmit={handleAddUser} />
            )}
          </>
        )}
      </main>
    </div>
  );
};
