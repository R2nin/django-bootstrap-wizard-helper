import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Building, Users, TrendingUp, Plus, Search, LogOut, Shield, Activity, Truck } from "lucide-react";
import { PatrimonyForm } from "@/components/PatrimonyForm";
import { PatrimonyList } from "@/components/PatrimonyList";
import { PatrimonyStats } from "@/components/PatrimonyStats";
import { UserForm } from "@/components/UserForm";
import { UserList } from "@/components/UserList";
import { LoginForm } from "@/components/LoginForm";
import { LogList } from "@/components/LogList";
import { SupplierForm } from "@/components/SupplierForm";
import { SupplierList } from "@/components/SupplierList";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { usePatrimonyData } from "@/hooks/usePatrimonyData";
import { useUserData } from "@/hooks/useUserData";
import { useLogData } from "@/hooks/useLogData";
import { useSupplierData } from "@/hooks/useSupplierData";
import { User } from "@/types/user";
import { UserWithRole } from "@/types/log";
import { Supplier } from "@/types/supplier";
import { PatrimonyReport } from "@/components/PatrimonyReport";

export interface PatrimonyItem {
  id: string;
  name: string;
  category: string;
  location: string;
  acquisitionDate: string;
  value: number;
  status: 'active' | 'maintenance' | 'retired';
  description: string;
  responsible: string;
  supplierId?: string;
}

const MainApp = () => {
  const { currentUser, logout, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'items' | 'add' | 'users' | 'addUser' | 'logs' | 'suppliers' | 'addSupplier'>('dashboard');
  
  // Usando hooks customizados para persistência local
  const { items: patrimonyItems, addItem: addPatrimonyItem, updateItem: updatePatrimonyItem, deleteItem: deletePatrimonyItem } = usePatrimonyData();
  const { users, addUser } = useUserData();
  const { logs, addLog } = useLogData();
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useSupplierData();

  const handleAddPatrimonyItem = (item: Omit<PatrimonyItem, 'id'>) => {
    const newItem = addPatrimonyItem(item);
    if (currentUser) {
      addLog('CREATE', 'PATRIMONY', `Criou item de patrimônio: ${item.name}`, currentUser.id, currentUser.fullName, newItem.id, item.name);
    }
    setActiveTab('items');
  };

  const handleAddUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser = addUser(user);
    if (currentUser) {
      addLog('CREATE', 'USER', `Criou usuário: ${user.fullName}`, currentUser.id, currentUser.fullName, newUser.id, user.fullName);
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

  const handleAddSupplier = (supplier: Omit<Supplier, 'id' | 'createdAt'>) => {
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
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Sistema de Gestão Patrimonial
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">
                  {currentUser.fullName} ({currentUser.role === 'admin' ? 'Administrador' : 'Usuário'})
                </span>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
          <div className="flex space-x-4 pb-4">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </Button>
            <Button
              variant={activeTab === 'items' ? 'default' : 'outline'}
              onClick={() => setActiveTab('items')}
            >
              Patrimônio
            </Button>
            {hasPermission('edit') && (
              <Button
                variant={activeTab === 'add' ? 'default' : 'outline'}
                onClick={() => setActiveTab('add')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            )}
            <Button
              variant={activeTab === 'suppliers' ? 'default' : 'outline'}
              onClick={() => setActiveTab('suppliers')}
            >
              <Truck className="h-4 w-4 mr-2" />
              Fornecedores
            </Button>
            {hasPermission('edit') && (
              <Button
                variant={activeTab === 'addSupplier' ? 'default' : 'outline'}
                onClick={() => setActiveTab('addSupplier')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Fornecedor
              </Button>
            )}
            {hasPermission('admin') && (
              <>
                <Button
                  variant={activeTab === 'users' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('users')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Usuários
                </Button>
                <Button
                  variant={activeTab === 'addUser' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('addUser')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Usuário
                </Button>
              </>
            )}
            <Button
              variant={activeTab === 'logs' ? 'default' : 'outline'}
              onClick={() => setActiveTab('logs')}
            >
              <Activity className="h-4 w-4 mr-2" />
              Logs
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Dashboard</h2>
              <PatrimonyReport items={patrimonyItems} />
            </div>
            
            <PatrimonyStats items={patrimonyItems} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Itens Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {patrimonyItems.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.location}</p>
                        </div>
                        <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                          {item.status === 'active' ? 'Ativo' : 
                           item.status === 'maintenance' ? 'Manutenção' : 'Inativo'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Categorias Principais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from(new Set(patrimonyItems.map(item => item.category))).map((category) => {
                      const count = patrimonyItems.filter(item => item.category === category).length;
                      return (
                        <div key={category} className="flex justify-between items-center">
                          <span className="font-medium">{category}</span>
                          <Badge variant="outline">{count} itens</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'items' && (
          <PatrimonyList 
            items={patrimonyItems}
            onUpdate={hasPermission('edit') ? handleUpdatePatrimonyItem : undefined}
            onDelete={hasPermission('delete') ? handleDeletePatrimonyItem : undefined}
          />
        )}

        {activeTab === 'add' && hasPermission('edit') && (
          <PatrimonyForm 
            onSubmit={handleAddPatrimonyItem} 
            existingItems={patrimonyItems}
            suppliers={suppliers}
          />
        )}

        {activeTab === 'users' && hasPermission('admin') && (
          <UserList users={users} />
        )}

        {activeTab === 'addUser' && hasPermission('admin') && (
          <UserForm onSubmit={handleAddUser} />
        )}

        {activeTab === 'logs' && (
          <LogList logs={logs} />
        )}

        {activeTab === 'suppliers' && (
          <SupplierList 
            suppliers={suppliers}
            onDelete={hasPermission('delete') ? handleDeleteSupplier : undefined}
          />
        )}

        {activeTab === 'addSupplier' && hasPermission('edit') && (
          <SupplierForm onSubmit={handleAddSupplier} />
        )}
      </main>
    </div>
  );
};

const Index = () => {
  // Carregando usuários do localStorage através do hook
  const { users } = useUserData();

  return (
    <AuthProvider users={users}>
      <MainApp />
    </AuthProvider>
  );
};

export default Index;
