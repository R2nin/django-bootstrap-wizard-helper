
import { Button } from "@/components/ui/button";
import { Plus, Package, Users, FileText, Building2, Truck } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasPermission: (action: 'view' | 'edit' | 'delete' | 'admin') => boolean;
}

export const Navigation = ({ activeTab, setActiveTab, hasPermission }: NavigationProps) => {
  return (
    <nav className="bg-white border-b px-4 py-2">
      <div className="flex space-x-2 overflow-x-auto">
        <Button
          variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('dashboard')}
          className="whitespace-nowrap"
        >
          Dashboard
        </Button>
        
        <Button
          variant={activeTab === 'items' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('items')}
          className="whitespace-nowrap"
        >
          <Package className="h-4 w-4 mr-2" />
          Patrimônio
        </Button>
        
        {hasPermission('edit') && (
          <Button
            variant={activeTab === 'add' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('add')}
            className="whitespace-nowrap"
          >
            <Plus className="h-4 w-4 mr-2" />
            Editar Patrimônio
          </Button>
        )}
        
        <Button
          variant={activeTab === 'suppliers' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('suppliers')}
          className="whitespace-nowrap"
        >
          <Truck className="h-4 w-4 mr-2" />
          Fornecedores
        </Button>
        
        {hasPermission('edit') && (
          <Button
            variant={activeTab === 'addSupplier' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('addSupplier')}
            className="whitespace-nowrap"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Fornecedor
          </Button>
        )}
        
        <Button
          variant={activeTab === 'logs' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('logs')}
          className="whitespace-nowrap"
        >
          <FileText className="h-4 w-4 mr-2" />
          Logs
        </Button>
        
        {hasPermission('admin') && (
          <Button
            variant={activeTab === 'users' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('users')}
            className="whitespace-nowrap"
          >
            <Users className="h-4 w-4 mr-2" />
            Usuários
          </Button>
        )}
        
        {hasPermission('admin') && (
          <Button
            variant={activeTab === 'addUser' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('addUser')}
            className="whitespace-nowrap"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Usuário
          </Button>
        )}
      </div>
    </nav>
  );
};
