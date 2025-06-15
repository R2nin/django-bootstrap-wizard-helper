
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Building, Users, TrendingUp, Plus, Search } from "lucide-react";
import { PatrimonyForm } from "@/components/PatrimonyForm";
import { PatrimonyList } from "@/components/PatrimonyList";
import { PatrimonyStats } from "@/components/PatrimonyStats";
import { UserForm } from "@/components/UserForm";
import { UserList } from "@/components/UserList";
import { User } from "@/types/user";

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

const Index = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'items' | 'add' | 'users' | 'addUser'>('dashboard');
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

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      fullName: 'João Silva',
      email: 'joao.silva@empresa.com',
      password: '123456',
      createdAt: '2023-01-10'
    },
    {
      id: '2',
      fullName: 'Maria Santos',
      email: 'maria.santos@empresa.com',
      password: '123456',
      createdAt: '2023-02-15'
    }
  ]);

  const addPatrimonyItem = (item: Omit<PatrimonyItem, 'id'>) => {
    const newItem = {
      ...item,
      id: Date.now().toString()
    };
    setPatrimonyItems([...patrimonyItems, newItem]);
    setActiveTab('items');
  };

  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setUsers([...users, newUser]);
    setActiveTab('users');
  };

  const updatePatrimonyItem = (id: string, updatedItem: Partial<PatrimonyItem>) => {
    setPatrimonyItems(items => 
      items.map(item => 
        item.id === id ? { ...item, ...updatedItem } : item
      )
    );
  };

  const deletePatrimonyItem = (id: string) => {
    setPatrimonyItems(items => items.filter(item => item.id !== id));
  };

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
            <div className="flex space-x-4">
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
              <Button
                variant={activeTab === 'add' ? 'default' : 'outline'}
                onClick={() => setActiveTab('add')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
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
            </div>
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
            onUpdate={updatePatrimonyItem}
            onDelete={deletePatrimonyItem}
          />
        )}

        {activeTab === 'add' && (
          <PatrimonyForm onSubmit={addPatrimonyItem} />
        )}

        {activeTab === 'users' && (
          <UserList users={users} />
        )}

        {activeTab === 'addUser' && (
          <UserForm onSubmit={addUser} />
        )}
      </main>
    </div>
  );
};

export default Index;
