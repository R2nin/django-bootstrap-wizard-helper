
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
import { User } from "@/types/user";
import { Supplier } from "@/types/supplier";

interface ContentRendererProps {
  currentSection: string;
  patrimonyLoading: boolean;
  patrimonyItems: PatrimonyItem[];
  suppliers: Supplier[];
  users: User[];
  logs: any[];
  editingItem: PatrimonyItem | null;
  onAddItem: (itemData: Omit<PatrimonyItem, 'id' | 'numeroChapa'>) => Promise<void>;
  onAddItemWithChapa: (itemData: Omit<PatrimonyItem, 'id'>) => Promise<void>;
  onUpdateItem: (id: string, updates: Partial<PatrimonyItem>) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  onEditItem: (item: PatrimonyItem) => void;
  onCancelEdit: () => void;
  onImportItems: (items: PatrimonyItem[]) => Promise<void>;
  onAddSupplier: (supplierData: Omit<Supplier, 'id' | 'createdAt'>) => Promise<void>;
  onDeleteSupplier: (id: string) => Promise<void>;
  onAddUser: (userData: Omit<User, 'id' | 'createdAt'> & { role: 'admin' | 'user' }) => Promise<void>;
  onDeleteUser: (id: string) => Promise<void>;
  onAddLocation: (locationData: { name: string; responsibleId: string; responsibleName: string }) => Promise<void>;
  onSectionChange: (section: string) => void;
}

export const ContentRenderer = ({
  currentSection,
  patrimonyLoading,
  patrimonyItems,
  suppliers,
  users,
  logs,
  editingItem,
  onAddItem,
  onAddItemWithChapa,
  onUpdateItem,
  onDeleteItem,
  onEditItem,
  onCancelEdit,
  onImportItems,
  onAddSupplier,
  onDeleteSupplier,
  onAddUser,
  onDeleteUser,
  onAddLocation,
  onSectionChange
}: ContentRendererProps) => {
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
          onSubmit={onAddItem}
          onSubmitWithChapa={onAddItemWithChapa}
          onUpdate={onUpdateItem}
          existingItems={patrimonyItems}
          suppliers={suppliers}
          editingItem={editingItem}
          onCancelEdit={onCancelEdit}
        />
      );
    
    case 'patrimony-list':
      return (
        <PatrimonyList
          items={patrimonyItems}
          onEdit={onEditItem}
          onDelete={onDeleteItem}
          onUpdate={onUpdateItem}
        />
      );
    
    case 'patrimony-import':
      return <PatrimonyImport onImport={onImportItems} />;
    
    case 'patrimony-comparison':
      return <PatrimonyComparison />;
    
    case 'patrimony-report':
      return <PatrimonyReport items={patrimonyItems} />;
    
    case 'supplier-form':
      return <SupplierForm onSubmit={onAddSupplier} />;
    
    case 'supplier-list':
      return <SupplierList suppliers={suppliers} onDelete={onDeleteSupplier} />;
    
    case 'user-form':
      return <UserForm onSubmit={onAddUser} />;
    
    case 'user-list':
      return <UserList users={users} onDelete={onDeleteUser} />;
    
    case 'location-form':
      return (
        <LocationForm
          onSubmit={onAddLocation}
          users={users}
          onCancel={() => onSectionChange('dashboard')}
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
