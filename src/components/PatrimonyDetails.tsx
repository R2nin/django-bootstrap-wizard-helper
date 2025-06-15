
import { useState } from "react";
import { PatrimonyItem } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit2, Save, X } from "lucide-react";
import { PatrimonyForm } from "./PatrimonyForm";
import { Supplier } from "@/types/supplier";
import { UserWithRole } from "@/types/user";

interface PatrimonyDetailsProps {
  item: PatrimonyItem;
  onUpdate?: (id: string, updatedItem: Partial<PatrimonyItem>) => void;
  suppliers?: Supplier[];
  users?: UserWithRole[];
  availableLocations?: string[];
  availableResponsibles?: string[];
}

export const PatrimonyDetails = ({ 
  item, 
  onUpdate, 
  suppliers = [], 
  users = [], 
  availableLocations = [], 
  availableResponsibles = [] 
}: PatrimonyDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'retired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'maintenance': return 'Manutenção';
      case 'retired': return 'Retirado';
      default: return status;
    }
  };

  const handleEditSubmit = (updatedData: Omit<PatrimonyItem, 'id'>) => {
    if (onUpdate) {
      onUpdate(item.id, updatedData);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Editar Item</h2>
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        </div>
        <PatrimonyForm
          onSubmit={handleEditSubmit}
          existingItems={[]}
          suppliers={suppliers}
          users={users}
          availableLocations={availableLocations}
          availableResponsibles={availableResponsibles}
          editingItem={item}
        />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">{item.name}</CardTitle>
        {onUpdate && (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Editar
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Número da Chapa</label>
            <p className="text-lg font-semibold">{item.numeroChapa}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Categoria</label>
            <p>{item.category}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Localização</label>
            <p>{item.location}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <Badge className={getStatusColor(item.status)}>
              {getStatusLabel(item.status)}
            </Badge>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Data de Aquisição</label>
            <p>{new Date(item.acquisitionDate).toLocaleDateString('pt-BR')}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Valor</label>
            <p>R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Responsável</label>
            <p>{item.responsible}</p>
          </div>
          {item.supplierId && (
            <div>
              <label className="text-sm font-medium text-gray-500">Fornecedor</label>
              <p>{suppliers.find(s => s.id === item.supplierId)?.name || 'N/A'}</p>
            </div>
          )}
        </div>
        {item.description && (
          <div>
            <label className="text-sm font-medium text-gray-500">Descrição</label>
            <p className="mt-1">{item.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
