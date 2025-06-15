import { Button } from "@/components/ui/button";
import { Plus, Truck, Users, Activity } from "lucide-react";

type ActiveTab = 'dashboard' | 'items' | 'add' | 'users' | 'addUser' | 'logs' | 'suppliers' | 'addSupplier' | 'addLocation';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  hasPermission: (action: 'view' | 'edit' | 'delete' | 'admin') => boolean;
}

export const Navigation = ({ activeTab, setActiveTab, hasPermission }: NavigationProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            onClick={() => {
              console.log('Add button clicked, setting activeTab to add');
              setActiveTab('add');
            }}
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
  );
};
