
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
  const { items, addItem, updateItem, deleteItem } = usePatrimonyData();
  const { logs, addLog } = useLogData();
  const { users, addUser, deleteUser } = useUserData();
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useSupplierData();
  const { locations, addLocation, deleteLocation } = useLocationData();
  const [isAddingLocation, setIsAddingLocation] = useState(false);

  useEffect(() => {
    console.log('Active Tab:', activeTab);
  }, []);

  const hasPermission = (action: 'view' | 'edit' | 'delete' | 'admin'): boolean => {
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
    const newItem = addItem(item);
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
      description: "Item adicionado com sucesso ao patrimônio.",
    })
  };

  const handleUpdateItem = (id: string, updates: Partial<PatrimonyItem>) => {
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
    
    // Resetar o item de edição após atualizar
    setEditingItem(null);
    setActiveTab('items');
  };

  const handleDeleteItem = (id: string) => {
    const deletedItem = items.find(item => id === id);
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

  const handleImportItems = (importedItems: Omit<PatrimonyItem, 'id' | 'numeroChapa'>[]) => {
    importedItems.forEach(item => {
      const newItem = addItem(item);
      addLog(
        'CREATE',
        'PATRIMONY',
        'Item importado do Excel',
        currentUser.id,
        currentUser.fullName,
        newItem.id,
        `${newItem.name} (Chapa: ${newItem.numeroChapa})`
      );
    });
    
    toast({
      title: "Sucesso!",
      description: `${importedItems.length} itens importados com sucesso.`,
    });
    
    setActiveTab('items');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as ActiveTab);
  };

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
              <Dashboard patrimonyItems={items} />
            )}

            {activeTab === 'items' && (
              <PatrimonyList
                items={items}
                onUpdate={handleUpdateItem}
                onDelete={handleDeleteItem}
                onEdit={handleEditItem}
              />
            )}

            {activeTab === 'add' && hasPermission('edit') && (
              <PatrimonyForm
                onSubmit={handleAddItem}
                onUpdate={handleUpdateItem}
                existingItems={items}
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
