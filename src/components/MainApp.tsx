import { useState } from "react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/components/Dashboard";
import { PatrimonyForm } from "@/components/PatrimonyForm";
import { PatrimonyList } from "@/components/PatrimonyList";
import { UserForm } from "@/components/UserForm";
import { UserList } from "@/components/UserList";
import { LogList } from "@/components/LogList";
import { SupplierForm } from "@/components/SupplierForm";
import { SupplierList } from "@/components/SupplierList";
import { useAuth } from "@/contexts/AuthContext";
import { usePatrimonyData } from "@/hooks/usePatrimonyData";
import { useUserData } from "@/hooks/useUserData";
import { useLogData } from "@/hooks/useLogData";
import { useSupplierData } from "@/hooks/useSupplierData";
import { User } from "@/types/user";
import { PatrimonyItem } from "@/pages/Index";

type ActiveTab = 'dashboard' | 'items' | 'add' | 'users' | 'addUser' | 'logs' | 'suppliers' | 'addSupplier';

export const MainApp = () => {
  const { currentUser, logout, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [availableLocations, setAvailableLocations] = useState<string[]>([
    'Escritório Central',
    'Almoxarifado',
    'Sala de Reuniões',
    'Departamento de TI'
  ]);
  const [availableResponsibles, setAvailableResponsibles] = useState<string[]>([]);
  
  // Debug log para verificar o estado atual
  console.log('MainApp - Current activeTab:', activeTab);
  console.log('MainApp - Current user:', currentUser);
  
  // Usando hooks customizados para persistência local
  const { items: patrimonyItems, addItem: addPatrimonyItem, updateItem: updatePatrimonyItem, deleteItem: deletePatrimonyItem } = usePatrimonyData();
  const { users, addUser } = useUserData();
  const { logs, addLog } = useLogData();
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useSupplierData();

  const handleLocationAdded = (location: string) => {
    if (!availableLocations.includes(location)) {
      setAvailableLocations(prev => [...prev, location]);
    }
  };

  const handleResponsibleAdded = (responsible: string) => {
    if (!availableResponsibles.includes(responsible)) {
      setAvailableResponsibles(prev => [...prev, responsible]);
    }
  };

  const handleAddPatrimonyItem = (item: Omit<PatrimonyItem, 'id'>) => {
    console.log('Adding patrimony item:', item);
    const newItem = addPatrimonyItem(item);
    if (currentUser) {
      addLog('CREATE', 'PATRIMONY', `Criou item de patrimônio: ${item.name}`, currentUser.id, currentUser.fullName, newItem.id, item.name);
    }
    setActiveTab('items');
  };

  const handleAddUser = (user: Omit<User, 'id' | 'createdAt'> & { role: 'admin' | 'user' }) => {
    const newUser = addUser(user);
    if (currentUser) {
      addLog('CREATE', 'USER', `Criou usuário: ${user.fullName} (${user.role === 'admin' ? 'Administrador' : 'Usuário'})`, currentUser.id, currentUser.fullName, newUser.id, user.fullName);
    }
    setActiveTab('users');
  };

  const handleUpdatePatrimonyItem = (id: string, updatedItem: Partial<PatrimonyItem>) => {
    const item = patrimonyItems.find(p => p.id === id);
    updatePatrimonyItem(id, updatedItem);
    if (item && currentUser) {
      addLog('UPDATE', 'PATRIMONY', `Editou item de patrimônio: ${item.name}`, currentUser.id, currentUser.fullName, id, item.name);
    }
  };

  const handleDeletePatrimonyItem = (id: string) => {
    const item = patrimonyItems.find(p => p.id === id);
    deletePatrimonyItem(id);
    if (item && currentUser) {
      addLog('DELETE', 'PATRIMONY', `Deletou item de patrimônio: ${item.name}`, currentUser.id, currentUser.fullName, id, item.name);
    }
  };

  const handleAddSupplier = (supplier: Omit<import("@/types/supplier").Supplier, 'id' | 'createdAt'>) => {
    const newSupplier = addSupplier(supplier);
    if (currentUser) {
      addLog('CREATE', 'SUPPLIER', `Criou fornecedor: ${supplier.name}`, currentUser.id, currentUser.fullName, newSupplier.id, supplier.name);
    }
    setActiveTab('suppliers');
  };

  const handleDeleteSupplier = (id: string) => {
    const supplier = suppliers.find(s => s.id === id);
    deleteSupplier(id);
    if (supplier && currentUser) {
      addLog('DELETE', 'SUPPLIER', `Deletou fornecedor: ${supplier.name}`, currentUser.id, currentUser.fullName, id, supplier.name);
    }
  };

  const handleLogout = () => {
    if (currentUser) {
      addLog('LOGOUT', 'SYSTEM', 'Usuário fez logout do sistema', currentUser.id, currentUser.fullName);
    }
    logout();
  };

  if (!currentUser) {
    return null;
  }

  const renderContent = () => {
    console.log('Rendering content for tab:', activeTab);
    
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard patrimonyItems={patrimonyItems} />;

      case 'items':
        return (
          <PatrimonyList 
            items={patrimonyItems}
            onUpdate={hasPermission('edit') ? handleUpdatePatrimonyItem : undefined}
            onDelete={hasPermission('delete') ? handleDeletePatrimonyItem : undefined}
          />
        );

      case 'add':
        console.log('Rendering PatrimonyForm with suppliers:', suppliers);
        return (
          <PatrimonyForm 
            onSubmit={handleAddPatrimonyItem} 
            existingItems={patrimonyItems}
            suppliers={suppliers}
            users={users}
            availableLocations={availableLocations}
            availableResponsibles={availableResponsibles}
          />
        );

      case 'users':
        if (!hasPermission('admin')) return null;
        return <UserList users={users} />;

      case 'addUser':
        if (!hasPermission('admin')) return null;
        return <UserForm onSubmit={handleAddUser} />;

      case 'logs':
        return <LogList logs={logs} />;

      case 'suppliers':
        return (
          <SupplierList 
            suppliers={suppliers}
            onDelete={hasPermission('delete') ? handleDeleteSupplier : undefined}
          />
        );

      case 'addSupplier':
        if (!hasPermission('edit')) return null;
        return <SupplierForm onSubmit={handleAddSupplier} />;

      default:
        console.log('Unknown tab, returning to dashboard');
        setActiveTab('dashboard');
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentUser={currentUser} 
        onLogout={handleLogout}
        users={users}
        onLocationAdded={handleLocationAdded}
        onResponsibleAdded={handleResponsibleAdded}
      />
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        hasPermission={hasPermission} 
      />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};
