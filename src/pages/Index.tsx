
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Building, Users, TrendingUp, Plus, Search, LogOut, Shield, Activity } from "lucide-react";
import { PatrimonyForm } from "@/components/PatrimonyForm";
import { PatrimonyList } from "@/components/PatrimonyList";
import { PatrimonyStats } from "@/components/PatrimonyStats";
import { UserForm } from "@/components/UserForm";
import { UserList } from "@/components/UserList";
import { LoginForm } from "@/components/LoginForm";
import { LogList } from "@/components/LogList";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { User } from "@/types/user";
import { UserWithRole, LogEntry } from "@/types/log";

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
}

const MainApp = () => {
  const { currentUser, logout, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'items' | 'add' | 'users' | 'addUser' | 'logs'>('dashboard');
  const [patrimonyItems, setPatrimonyItems] = useState<PatrimonyItem[]>([
    {
      id: '1',
      name: 'Notebook Dell Inspiron',
      category: 'Informática',
      location: 'Escritório - Sala 101',
      acquisitionDate: '2023-01-15',
      value: 3500,
      status: 'active',
      description: 'Notebook para desenvolvimento',
      responsible: 'João Silva'
    },
    {
      id: '2',
      name: 'Mesa de Escritório',
      category: 'Mobiliário',
      location: 'Escritório - Sala 102',
      acquisitionDate: '2022-11-20',
      value: 850,
      status: 'active',
      description: 'Mesa executiva em madeira',
      responsible: 'Maria Santos'
    }
  ]);

  const [users, setUsers] = useState<UserWithRole[]>([
    {
      id: '1',
      fullName: 'João Silva',
      email: 'admin@empresa.com',
      password: 'admin123',
      role: 'admin',
      createdAt: '2023-01-10'
    },
    {
      id: '2',
      fullName: 'Maria Santos',
      email: 'user@empresa.com',
      password: 'user123',
      role: 'user',
      createdAt: '2023-02-15'
    }
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      action: 'LOGIN',
      entity: 'SYSTEM',
      userId: '1',
      userName: 'João Silva',
      details: 'Usuário fez login no sistema'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      action: 'CREATE',
      entity: 'PATRIMONY',
      entityId: '1',
      entityName: 'Notebook Dell Inspiron',
      userId: '1',
      userName: 'João Silva',
      details: 'Criou item de patrimônio: Notebook Dell Inspiron'
    }
  ]);

  const addLog = (action: LogEntry['action'], entity: LogEntry['entity'], details: string, entityId?: string, entityName?: string) => {
    if (!currentUser) return;
    
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action,
      entity,
      entityId,
      entityName,
      userId: currentUser.id,
      userName: currentUser.fullName,
      details
    };
    
    setLogs(prev => [newLog, ...prev]);
  };

  const addPatrimonyItem = (item: Omit<PatrimonyItem, 'id'>) => {
    const newItem = {
      ...item,
      id: Date.now().toString()
    };
    setPatrimonyItems([...patrimonyItems, newItem]);
    addLog('CREATE', 'PATRIMONY', `Criou item de patrimônio: ${item.name}`, newItem.id, item.name);
    setActiveTab('items');
  };

  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: UserWithRole = {
      ...user,
      id: Date.now().toString(),
      role: 'user',
      createdAt: new Date().toISOString()
    };
    setUsers([...users, newUser]);
    addLog('CREATE', 'USER', `Criou usuário: ${user.fullName}`, newUser.id, user.fullName);
    setActiveTab('users');
  };

  const updatePatrimonyItem = (id: string, updatedItem: Partial<PatrimonyItem>) => {
    const item = patrimonyItems.find(p => p.id === id);
    setPatrimonyItems(items => 
      items.map(item => 
        item.id === id ? { ...item, ...updatedItem } : item
      )
    );
    if (item) {
      addLog('UPDATE', 'PATRIMONY', `Editou item de patrimônio: ${item.name}`, id, item.name);
    }
  };

  const deletePatrimonyItem = (id: string) => {
    const item = patrimonyItems.find(p => p.id === id);
    setPatrimonyItems(items => items.filter(item => item.id !== id));
    if (item) {
      addLog('DELETE', 'PATRIMONY', `Deletou item de patrimônio: ${item.name}`, id, item.name);
    }
  };

  const handleLogout = () => {
    addLog('LOGOUT', 'SYSTEM', 'Usuário fez logout do sistema');
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
            onUpdate={hasPermission('edit') ? updatePatrimonyItem : undefined}
            onDelete={hasPermission('delete') ? deletePatrimonyItem : undefined}
          />
        )}

        {activeTab === 'add' && hasPermission('edit') && (
          <PatrimonyForm onSubmit={addPatrimonyItem} />
        )}

        {activeTab === 'users' && hasPermission('admin') && (
          <UserList users={users} />
        )}

        {activeTab === 'addUser' && hasPermission('admin') && (
          <UserForm onSubmit={addUser} />
        )}

        {activeTab === 'logs' && (
          <LogList logs={logs} />
        )}
      </main>
    </div>
  );
};

const Index = () => {
  // Usuários iniciais com roles
  const initialUsers: UserWithRole[] = [
    {
      id: '1',
      fullName: 'João Silva',
      email: 'admin@empresa.com',
      password: 'admin123',
      role: 'admin',
      createdAt: '2023-01-10'
    },
    {
      id: '2',
      fullName: 'Maria Santos',
      email: 'user@empresa.com',
      password: 'user123',
      role: 'user',
      createdAt: '2023-02-15'
    }
  ];

  return (
    <AuthProvider users={initialUsers}>
      <MainApp />
    </AuthProvider>
  );
};

export default Index;
