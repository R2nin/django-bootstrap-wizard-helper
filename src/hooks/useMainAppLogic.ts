
import { useState } from "react";
import { PatrimonyItem } from "@/pages/Index";
import { useSupabasePatrimony } from "@/hooks/useSupabasePatrimony";
import { useSupplierData } from "@/hooks/useSupplierData";
import { useUserData } from "@/hooks/useUserData";
import { useLocationData } from "@/hooks/useLocationData";
import { useLogData } from "@/hooks/useLogData";
import { User } from "@/types/user";
import { Supplier } from "@/types/supplier";
import { toast } from "@/components/ui/use-toast";

export const useMainAppLogic = (currentUser: User) => {
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

  const handleAddItem = async (itemData: Omit<PatrimonyItem, 'id' | 'numeroChapa'>) => {
    console.log('MainApp - Adding item:', itemData);
    const newItem = await addItem(itemData);
    
    if (newItem) {
      addLog(
        'CREATE',
        'PATRIMONY',
        `Item "${newItem.name}" adicionado ao patrimônio`,
        currentUser.id,
        currentUser.fullName,
        newItem.id,
        newItem.name
      );
    }
  };

  const handleAddItemWithChapa = async (itemData: Omit<PatrimonyItem, 'id'>) => {
    console.log('MainApp - Adding item with specific chapa:', itemData);
    const newItem = await addItemWithChapa(itemData);
    
    if (newItem) {
      addLog(
        'CREATE',
        'PATRIMONY',
        `Item "${newItem.name}" adicionado com chapa ${newItem.numeroChapa}`,
        currentUser.id,
        currentUser.fullName,
        newItem.id,
        newItem.name
      );
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
      addLog(
        'IMPORT',
        'PATRIMONY',
        `${importedItems.length} itens importados com sucesso`,
        currentUser.id,
        currentUser.fullName
      );
    }
  };

  const handleUpdateItem = async (id: string, updates: Partial<PatrimonyItem>) => {
    console.log('MainApp - Updating item:', id, updates);
    await updateItem(id, updates);
    
    const itemName = patrimonyItems.find(item => item.id === id)?.name || 'Item desconhecido';
    addLog(
      'UPDATE',
      'PATRIMONY',
      `Item "${itemName}" foi atualizado`,
      currentUser.id,
      currentUser.fullName,
      id,
      itemName
    );

    setEditingItem(null);
  };

  const handleDeleteItem = async (id: string) => {
    console.log('MainApp - Deleting item:', id);
    const itemToDelete = patrimonyItems.find(item => item.id === id);
    
    await deleteItem(id);
    
    if (itemToDelete) {
      addLog(
        'DELETE',
        'PATRIMONY',
        `Item "${itemToDelete.name}" foi removido do patrimônio`,
        currentUser.id,
        currentUser.fullName,
        id,
        itemToDelete.name
      );
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
      addLog(
        'CREATE',
        'SUPPLIER',
        `Fornecedor "${newSupplier.name}" foi cadastrado`,
        currentUser.id,
        currentUser.fullName,
        newSupplier.id,
        newSupplier.name
      );
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
      addLog(
        'DELETE',
        'SUPPLIER',
        `Fornecedor "${supplierToDelete.name}" foi removido`,
        currentUser.id,
        currentUser.fullName,
        id,
        supplierToDelete.name
      );
    }
  };

  const handleAddUser = async (userData: Omit<User, 'id' | 'createdAt'> & { role: 'admin' | 'user' }) => {
    const newUser = await addUser(userData);
    if (newUser) {
      addLog(
        'CREATE',
        'USER',
        `Usuário "${newUser.fullName}" foi cadastrado`,
        currentUser.id,
        currentUser.fullName,
        newUser.id,
        newUser.fullName
      );
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
      addLog(
        'DELETE',
        'USER',
        `Usuário "${userToDelete.fullName}" foi removido`,
        currentUser.id,
        currentUser.fullName,
        id,
        userToDelete.fullName
      );
    }
  };

  const handleAddLocation = async (locationData: { name: string; responsibleId: string; responsibleName: string }) => {
    const newLocation = await addLocation(locationData);
    if (newLocation) {
      addLog(
        'CREATE',
        'LOCATION',
        `Localização "${newLocation.name}" foi cadastrada`,
        currentUser.id,
        currentUser.fullName,
        newLocation.id,
        newLocation.name
      );
      toast({
        title: "Sucesso!",
        description: "Localização cadastrada com sucesso",
      });
    }
  };

  return {
    currentSection,
    setCurrentSection,
    editingItem,
    setEditingItem,
    patrimonyItems,
    patrimonyLoading,
    suppliers,
    users,
    locations,
    logs,
    handleAddItem,
    handleAddItemWithChapa,
    handleImportItems,
    handleUpdateItem,
    handleDeleteItem,
    handleEditItem,
    handleCancelEdit,
    handleAddSupplier,
    handleDeleteSupplier,
    handleAddUser,
    handleDeleteUser,
    handleAddLocation
  };
};
