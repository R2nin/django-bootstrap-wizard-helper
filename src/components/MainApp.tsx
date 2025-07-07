
import { useState } from "react";
import { Navigation } from "./Navigation";
import { Header } from "./Header";
import { Dashboard } from "./Dashboard";
import { PatrimonyForm } from "./PatrimonyForm";
import { PatrimonyList } from "./PatrimonyList";
import { PatrimonyReport } from "./PatrimonyReport";
import { PatrimonyImport } from "./PatrimonyImport";
import { PatrimonyComparison } from "./PatrimonyComparison";
import { SupplierForm } from "./SupplierForm";
import { SupplierList } from "./SupplierList";
import { UserForm } from "./UserForm";
import { UserList } from "./UserList";
import { LocationForm } from "./LocationForm";
import { LogList } from "./LogList";
import { SystemManual } from "./SystemManual";
import { TechnicalDocumentation } from "./TechnicalDocumentation";
import { PatrimonyItem } from "@/pages/Index";
import { useSupabasePatrimony } from "@/hooks/useSupabasePatrimony";
import { useSupplierData } from "@/hooks/useSupplierData";
import { useUserData } from "@/hooks/useUserData";
import { useLocationData } from "@/hooks/useLocationData";
import { useLogData } from "@/hooks/useLogData";
import { User } from "@/types/user";
import { Supplier } from "@/types/supplier";
import { toast } from "@/components/ui/use-toast";

interface MainAppProps {
  currentUser: User;
  onLogout: () => void;
}

export const MainApp = ({ currentUser, onLogout }: MainAppProps) => {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [editingItem, setEditingItem] = useState<PatrimonyItem | null>(null);

  // Hooks do Supabase
  const {
    items: patrimonyItems,
    loading: patrimonyLoading,
    addItem,
    addItemWithChapa,
    addMultipleItems,
    updateItem,
    deleteItem
  } = useSupabasePatrimony();

  const { suppliers, addSupplier, deleteSupplier } = useSupplierData();
  const { users, addUser, deleteUser } = useUserData();
  const { locations, addLocation } = useLocationData();
  const { logs, addLog } = useLogData();

  console.log('MainApp - Patrimony items:', patrimonyItems.length);
  console.log('MainApp - Loading:', patrimonyLoading);

  const handleAddItem = async (itemData: Omit<PatrimonyItem, 'id' | 'numeroChapa'>) => {
    console.log('MainApp - Adding item:', itemData);
    const newItem = await addItem(itemData);
    
    if (newItem) {
      addLog({
        action: 'CREATE',
        entityType: 'PATRIMONY',
        description: `Item "${newItem.name}" adicionado ao patrimônio`,
        userId: currentUser.id,
        userName: currentUser.fullName,
        entityId: newItem.id,
        entityName: newItem.name
      });
    }
  };

  const handleAddItemWithChapa = async (itemData: Omit<PatrimonyItem, 'id'>) => {
    console.log('MainApp - Adding item with specific chapa:', itemData);
    const newItem = await addItemWithChapa(itemData);
    
    if (newItem) {
      addLog({
        action: 'CREATE',
        entityType: 'PATRIMONY',
        description: `Item "${newItem.name}" adicionado com chapa ${newItem.numeroChapa}`,
        userId: currentUser.id,
        userName: currentUser.fullName,
        entityId: newItem.id,
        entityName: newItem.name
      });
    }
  };

  const handleImportItems = async (items: PatrimonyItem[]) => {
    console.log('MainApp - Importing items:', items.length);
    
    if (items.length === 0) {
      console.log('MainApp - No items to import');
      return;
    }

    const importedItems = await addMultipleItems(items);
    
    if (importedItems.length > 0) {
      addLog({
        action: 'IMPORT',
        entityType: 'PATRIMONY',
        description: `${importedItems.length} itens importados com sucesso`,
        userId: currentUser.id,
        userName: currentUser.fullName
      });
    }
  };

  const handleUpdateItem = async (id: string, updates: Partial<PatrimonyItem>) => {
    console.log('MainApp - Updating item:', id, updates);
    await updateItem(id, updates);
    
    const itemName = patrimonyItems.find(item => item.id === id)?.name || 'Item desconhecido';
    addLog({
      action: 'UPDATE',
      entityType: 'PATRIMONY',
      description: `Item "${itemName}" foi atualizado`,
      userId: currentUser.id,
      userName: currentUser.fullName,
      entityId: id,
      entityName: itemName
    });

    setEditingItem(null);
  };

  const handleDeleteItem = async (id: string) => {
    console.log('MainApp - Deleting item:', id);
    const itemToDelete = patrimonyItems.find(item => item.id === id);
    
    await deleteItem(id);
    
    if (itemToDelete) {
      addLog({
        action: 'DELETE',
        entityType: 'PATRIMONY',
        description: `Item "${itemToDelete.name}" foi removido do patrimônio`,
        userId: currentUser.id,
        userName: currentUser.fullName,
        entityId: id,
        entityName: itemToDelete.name
      });
    }
  };

  const handleEditItem = (item: PatrimonyItem) => {
    console.log('MainApp - Editing item:', item);
    setEditingItem(item);
    setCurrentSection('patrimony-form');
  };

  const handleCancelEdit = () => {
    console.log('MainApp - Canceling edit');
    setEditingItem(null);
  };

  const handleAddSupplier = async (supplierData: Omit<Supplier, 'id' | 'createdAt'>) => {
    const newSupplier = await addSupplier(supplierData);
    if (newSupplier) {
      addLog({
        action: 'CREATE',
        entityType: 'SUPPLIER',
        description: `Fornecedor "${newSupplier.name}" foi cadastrado`,
        userId: currentUser.id,
        userName: currentUser.fullName,
        entityId: newSupplier.id,
        entityName: newSupplier.name
      });
      toast({
        title: "Sucesso!",
        description: "Fornecedor cadastrado com sucesso",
      });
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    const supplierToDelete = suppliers.find(s => s.id === id);
    await deleteSupplier(id);
    
    if (supplierToDelete) {
      addLog({
        action: 'DELETE',
        entityType: 'SUPPLIER',
        description: `Fornecedor "${supplierToDelete.name}" foi removido`,
        userId: currentUser.id,
        userName: currentUser.fullName,
        entityId: id,
        entityName: supplierToDelete.name
      });
    }
  };

  const handleAddUser = async (userData: Omit<User, 'id' | 'createdAt'> & { role: 'admin' | 'user' }) => {
    const newUser = await addUser(userData);
    if (newUser) {
      addLog({
        action: 'CREATE',
        entityType: 'USER',
        description: `Usuário "${newUser.fullName}" foi cadastrado`,
        userId: currentUser.id,
        userName: currentUser.fullName,
        entityId: newUser.id,
        entityName: newUser.fullName
      });
      toast({
        title: "Sucesso!",
        description: "Usuário cadastrado com sucesso",
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    const userToDelete = users.find(u => u.id === id);
    await deleteUser(id);
    
    if (userToDelete) {
      addLog({
        action: 'DELETE',
        entityType: 'USER',
        description: `Usuário "${userToDelete.fullName}" foi removido`,
        userId: currentUser.id,
        userName: currentUser.fullName,
        entityId: id,
        entityName: userToDelete.fullName
      });
    }
  };

  const handleAddLocation = async (locationData: { name: string; responsibleId: string; responsibleName: string }) => {
    const newLocation = await addLocation(locationData);
    if (newLocation) {
      addLog({
        action: 'CREATE',
        entityType: 'LOCATION',
        description: `Localização "${newLocation.name}" foi cadastrada`,
        userId: currentUser.id,
        userName: currentUser.fullName,
        entityId: newLocation.id,
        entityName: newLocation.name
      });
      toast({
        title: "Sucesso!",
        description: "Localização cadastrada com sucesso",
      });
    }
  };

  const renderContent = () => {
    if (patrimonyLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando dados...</div>
        </div>
      );
    }

    switch (currentSection) {
      case 'dashboard':
        return <Dashboard patrimonyItems={patrimonyItems} />;
      
      case 'patrimony-form':
        return (
          <PatrimonyForm
            onSubmit={handleAddItem}
            onSubmitWithChapa={handleAddItemWithChapa}
            onUpdate={handleUpdateItem}
            existingItems={patrimonyItems}
            suppliers={suppliers}
            editingItem={editingItem}
            onCancelEdit={handleCancelEdit}
          />
        );
      
      case 'patrimony-list':
        return (
          <PatrimonyList
            items={patrimonyItems}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
            onUpdate={handleUpdateItem}
          />
        );
      
      case 'patrimony-import':
        return <PatrimonyImport onImport={handleImportItems} />;
      
      case 'patrimony-comparison':
        return <PatrimonyComparison />;
      
      case 'patrimony-report':
        return <PatrimonyReport items={patrimonyItems} />;
      
      case 'supplier-form':
        return <SupplierForm onSubmit={handleAddSupplier} />;
      
      case 'supplier-list':
        return <SupplierList suppliers={suppliers} onDelete={handleDeleteSupplier} />;
      
      case 'user-form':
        return <UserForm onSubmit={handleAddUser} />;
      
      case 'user-list':
        return <UserList users={users} onDelete={handleDeleteUser} />;
      
      case 'location-form':
        return (
          <LocationForm
            onSubmit={handleAddLocation}
            users={users}
            onCancel={() => setCurrentSection('dashboard')}
          />
        );
      
      case 'logs':
        return <LogList logs={logs} />;
      
      case 'manual':
        return <SystemManual />;
      
      case 'docs':
        return <TechnicalDocumentation />;
      
      default:
        return <Dashboard patrimonyItems={patrimonyItems} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentUser={currentUser} onLogout={onLogout} />
      <div className="flex">
        <Navigation
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
          userRole={currentUser.role}
        />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
