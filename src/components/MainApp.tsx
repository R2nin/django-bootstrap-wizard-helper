import { useState, useEffect } from "react";
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
  console.log('MainApp component rendering - Start');
  
  const { currentUser, logout, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [availableLocations, setAvailableLocations] = useState<string[]>([
    'Escritório Central',
    'Almoxarifado',
    'Sala de Reuniões',
    'Departamento de TI'
  ]);
  const [availableResponsibles, setAvailableResponsibles] = useState<string[]>([]);
  
  console.log('MainApp - Current activeTab:', activeTab);
  console.log('MainApp - Current user:', currentUser);
  
  // Usando hooks customizados para persistência local
  const { items: patrimonyItems, addItem: addPatrimonyItem, updateItem: updatePatrimonyItem, deleteItem: deletePatrimonyItem } = usePatrimonyData();
  const { users, addUser } = useUserData();
  const { logs, addLog } = useLogData();
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useSupplierData();

  console.log('MainApp - Hooks loaded, patrimonyItems length:', patrimonyItems.length);
  console.log('MainApp - Suppliers length:', suppliers.length);

  useEffect(() => {
    try {
      console.log('MainApp - Initialization effect running');
      // Simular um pequeno delay para garantir que tudo foi carregado
      setTimeout(() => {
        setIsLoading(false);
        console.log('MainApp - Initialization complete');
      }, 100);
    } catch (error) {
      console.error('MainApp - Initialization error:', error);
      setError('Erro ao inicializar a aplicação');
      setIsLoading(false);
    }
  }, []);

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
    try {
      const newItem = addPatrimonyItem(item);
      if (currentUser) {
        addLog('CREATE', 'PATRIMONY', `Criou item de patrimônio: ${item.name}`, currentUser.id, currentUser.fullName, newItem.id, item.name);
      }
      setActiveTab('items');
    } catch (error) {
      console.error('Error adding patrimony item:', error);
    }
  };

  const handleAddUser = (user: Omit<User, 'id' | 'createdAt'> & { role: 'admin' | 'user' }) => {
    try {
      const newUser = addUser(user);
      if (currentUser) {
        addLog('CREATE', 'USER', `Criou usuário: ${user.fullName} (${user.role === 'admin' ? 'Administrador' : 'Usuário'})`, currentUser.id, currentUser.fullName, newUser.id, user.fullName);
      }
      setActiveTab('users');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleUpdatePatrimonyItem = (id: string, updatedItem: Partial<PatrimonyItem>) => {
    try {
      const item = patrimonyItems.find(p => p.id === id);
      updatePatrimonyItem(id, updatedItem);
      if (item && currentUser) {
        addLog('UPDATE', 'PATRIMONY', `Editou item de patrimônio: ${item.name}`, currentUser.id, currentUser.fullName, id, item.name);
      }
    } catch (error) {
      console.error('Error updating patrimony item:', error);
    }
  };

  const handleDeletePatrimonyItem = (id: string) => {
    try {
      const item = patrimonyItems.find(p => p.id === id);
      deletePatrimonyItem(id);
      if (item && currentUser) {
        addLog('DELETE', 'PATRIMONY', `Deletou item de patrimônio: ${item.name}`, currentUser.id, currentUser.fullName, id, item.name);
      }
    } catch (error) {
      console.error('Error deleting patrimony item:', error);
    }
  };

  const handleAddSupplier = (supplier: Omit<import("@/types/supplier").Supplier, 'id' | 'createdAt'>) => {
    try {
      const newSupplier = addSupplier(supplier);
      if (currentUser) {
        addLog('CREATE', 'SUPPLIER', `Criou fornecedor: ${supplier.name}`, currentUser.id, currentUser.fullName, newSupplier.id, supplier.name);
      }
      setActiveTab('suppliers');
    } catch (error) {
      console.error('Error adding supplier:', error);
    }
  };

  const handleDeleteSupplier = (id: string) => {
    try {
      const supplier = suppliers.find(s => s.id === id);
      deleteSupplier(id);
      if (supplier && currentUser) {
        addLog('DELETE', 'SUPPLIER', `Deletou fornecedor: ${supplier.name}`, currentUser.id, currentUser.fullName, id, supplier.name);
      }
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  const handleLogout = () => {
    try {
      if (currentUser) {
        addLog('LOGOUT', 'SYSTEM', 'Usuário fez logout do sistema', currentUser.id, currentUser.fullName);
      }
      logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (!currentUser) {
    console.log('MainApp - No current user, returning null');
    return null;
  }

  if (isLoading) {
    console.log('MainApp - Still loading, showing spinner');
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 10px'
          }}></div>
          <p>Carregando aplicação...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('MainApp - Error state, showing error message');
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ 
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#dc2626', marginBottom: '10px' }}>Erro</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    console.log('MainApp - Rendering content for tab:', activeTab);
    
    try {
      switch (activeTab) {
        case 'dashboard':
          console.log('MainApp - Rendering Dashboard');
          return <Dashboard patrimonyItems={patrimonyItems} />;

        case 'items':
          console.log('MainApp - Rendering PatrimonyList');
          return (
            <PatrimonyList 
              items={patrimonyItems}
              onUpdate={hasPermission('edit') ? handleUpdatePatrimonyItem : undefined}
              onDelete={hasPermission('delete') ? handleDeletePatrimonyItem : undefined}
            />
          );

        case 'add':
          console.log('MainApp - Rendering PatrimonyForm');
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
          if (!hasPermission('admin')) {
            console.log('MainApp - No admin permission for users');
            return null;
          }
          console.log('MainApp - Rendering UserList');
          return <UserList users={users} />;

        case 'addUser':
          if (!hasPermission('admin')) {
            console.log('MainApp - No admin permission for addUser');
            return null;
          }
          console.log('MainApp - Rendering UserForm');
          return <UserForm onSubmit={handleAddUser} />;

        case 'logs':
          console.log('MainApp - Rendering LogList');
          return <LogList logs={logs} />;

        case 'suppliers':
          console.log('MainApp - Rendering SupplierList');
          return (
            <SupplierList 
              suppliers={suppliers}
              onDelete={hasPermission('delete') ? handleDeleteSupplier : undefined}
            />
          );

        case 'addSupplier':
          if (!hasPermission('edit')) {
            console.log('MainApp - No edit permission for addSupplier');
            return null;
          }
          console.log('MainApp - Rendering SupplierForm');
          return <SupplierForm onSubmit={handleAddSupplier} />;

        default:
          console.log('MainApp - Unknown tab, returning to dashboard');
          setActiveTab('dashboard');
          return null;
      }
    } catch (error) {
      console.error('MainApp - Error rendering content:', error);
      return (
        <div style={{ 
          padding: '20px',
          textAlign: 'center',
          backgroundColor: 'white',
          margin: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#dc2626' }}>Erro ao carregar conteúdo</h3>
          <p>Ocorreu um erro ao carregar esta seção. Tente novamente.</p>
          <button 
            onClick={() => setActiveTab('dashboard')}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Voltar ao Dashboard
          </button>
        </div>
      );
    }
  };

  console.log('MainApp - About to render main structure');

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
