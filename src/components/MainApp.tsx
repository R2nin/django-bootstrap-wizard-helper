
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

type ActiveTab = 'dashboard' | 'items' | 'add' | 'users' | 'addUser' | 'logs' | 'suppliers' | 'addSupplier' | 'addLocation';

interface MainAppProps {
  currentUser: UserWithRole;
  onLogout: () => void;
}

export const MainApp = ({ currentUser, onLogout }: MainAppProps) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
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
        return currentUser.role === 'admin';
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
    addLog({
      action: 'CREATE',
      entity: 'PATRIMONY',
      entityId: newItem.id,
      entityName: `${newItem.name} (Chapa: ${newItem.numeroChapa})`,
      description: 'Novo item adicionado ao patrimônio',
      userId: currentUser.id,
      userName: currentUser.fullName,
      timestamp: new Date().toISOString()
    });
    toast({
      title: "Sucesso!",
      description: "Item adicionado com sucesso ao patrimônio.",
    })
  };

  const handleUpdateItem = (id: string, updates: Partial<PatrimonyItem>) => {
    updateItem(id, updates);
    
    const updatedItem = items.find(item => item.id === id);
    if (updatedItem) {
      addLog({
        action: 'UPDATE',
        entity: 'PATRIMONY',
        entityId: id,
        entityName: `${updatedItem.name} (Chapa: ${updatedItem.numeroChapa})`,
        description: `Item atualizado: ${Object.keys(updates).join(', ')}`,
        userId: currentUser.id,
        userName: currentUser.fullName,
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleDeleteItem = (id: string) => {
    const deletedItem = items.find(item => item.id === id);
    deleteItem(id);
    if (deletedItem) {
      addLog({
        action: 'DELETE',
        entity: 'PATRIMONY',
        entityId: id,
        entityName: `${deletedItem.name} (Chapa: ${deletedItem.numeroChapa})`,
        description: 'Item removido do patrimônio',
        userId: currentUser.id,
        userName: currentUser.fullName,
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleAddUser = (user: Omit<UserWithRole, 'id' | 'createdAt'>) => {
    const newUser = addUser(user);
    addLog({
      action: 'CREATE',
      entity: 'USER',
      entityId: newUser.id,
      entityName: newUser.fullName,
      description: 'Novo usuário adicionado ao sistema',
      userId: currentUser.id,
      userName: currentUser.fullName,
      timestamp: new Date().toISOString()
    });
  };

  const handleDeleteUser = (id: string) => {
    const deletedUser = users.find(user => user.id === id);
    deleteUser(id);
    if (deletedUser) {
      addLog({
        action: 'DELETE',
        entity: 'USER',
        entityId: id,
        entityName: deletedUser.fullName,
        description: 'Usuário removido do sistema',
        userId: currentUser.id,
        userName: currentUser.fullName,
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleAddSupplier = (supplier: Omit<Supplier, 'id' | 'createdAt'>) => {
    const newSupplier = addSupplier(supplier);
     addLog({
       action: 'CREATE',
       entity: 'SUPPLIER',
       entityId: newSupplier.id,
       entityName: newSupplier.name,
       description: 'Novo fornecedor adicionado ao sistema',
       userId: currentUser.id,
       userName: currentUser.fullName,
       timestamp: new Date().toISOString()
     });
  };

  const handleUpdateSupplier = (id: string, updates: Partial<Supplier>) => {
    updateSupplier(id, updates);
    const updatedSupplier = suppliers.find(supplier => supplier.id === id);
    if (updatedSupplier) {
      addLog({
        action: 'UPDATE',
        entity: 'SUPPLIER',
        entityId: id,
        entityName: updatedSupplier.name,
        description: `Fornecedor atualizado: ${Object.keys(updates).join(', ')}`,
        userId: currentUser.id,
        userName: currentUser.fullName,
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleDeleteSupplier = (id: string) => {
    const deletedSupplier = suppliers.find(supplier => supplier.id === id);
    deleteSupplier(id);
    if (deletedSupplier) {
       addLog({
         action: 'DELETE',
         entity: 'SUPPLIER',
         entityId: id,
         entityName: deletedSupplier.name,
         description: 'Fornecedor removido do sistema',
         userId: currentUser.id,
         userName: currentUser.fullName,
         timestamp: new Date().toISOString()
       });
    }
  };

  const handleAddLocation = (location: Omit<{ name: string; responsibleId: string; responsibleName: string; }, 'id' | 'createdAt'>) => {
    const newLocation = addLocation(location);
    setIsAddingLocation(false);
    addLog({
      action: 'CREATE',
      entity: 'LOCATION',
      entityId: newLocation.id,
      entityName: newLocation.name,
      description: 'Nova localização adicionada ao sistema',
      userId: currentUser.id,
      userName: currentUser.fullName,
      timestamp: new Date().toISOString()
    });
  };

  const handleDeleteLocation = (id: string) => {
    const deletedLocation = locations.find(location => location.id === id);
    deleteLocation(id);
    if (deletedLocation) {
      addLog({
        action: 'DELETE',
        entity: 'LOCATION',
        entityId: id,
        entityName: deletedLocation.name,
        description: 'Localização removida do sistema',
        userId: currentUser.id,
        userName: currentUser.fullName,
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header currentUser={currentUser} onLogout={onLogout} onAddLocation={() => setIsAddingLocation(true)} />

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} hasPermission={hasPermission} />

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
              />
            )}

        {activeTab === 'add' && hasPermission('edit') && (
          <PatrimonyForm
            onSubmit={handleAddItem}
            onUpdate={handleUpdateItem}
            existingItems={items}
            suppliers={suppliers}
          />
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
