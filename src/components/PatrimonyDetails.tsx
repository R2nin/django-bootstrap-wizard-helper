
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { X, Edit, Calendar, MapPin, User, Package, DollarSign } from "lucide-react";
import { PatrimonyItem } from "@/pages/Index";
import { PatrimonyForm } from "@/components/PatrimonyForm";

interface PatrimonyDetailsProps {
  item: PatrimonyItem;
  onClose: () => void;
  onUpdate: (item: Partial<PatrimonyItem>) => void;
}

export const PatrimonyDetails = ({ item, onClose, onUpdate }: PatrimonyDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Ativo</Badge>;
      case 'maintenance':
        return <Badge variant="secondary">Em Manutenção</Badge>;
      case 'retired':
        return <Badge variant="destructive">Inativo</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isEditing) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Editar Item</h2>
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-4">
            <PatrimonyForm
              initialData={item}
              onSubmit={(updatedItem) => {
                onUpdate(updatedItem);
                setIsEditing(false);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl">{item.name}</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-gray-400" />
                <div>
                  <Label className="text-sm text-gray-600">Categoria</Label>
                  <p className="font-medium">{item.category}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <Label className="text-sm text-gray-600">Localização</Label>
                  <p className="font-medium">{item.location}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <Label className="text-sm text-gray-600">Responsável</Label>
                  <p className="font-medium">{item.responsible}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <div>
                  <Label className="text-sm text-gray-600">Valor</Label>
                  <p className="font-medium">R$ {item.value.toLocaleString('pt-BR')}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <Label className="text-sm text-gray-600">Data de Aquisição</Label>
                  <p className="font-medium">{formatDate(item.acquisitionDate)}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm text-gray-600">Status</Label>
                <div className="mt-1">
                  {getStatusBadge(item.status)}
                </div>
              </div>
            </div>
          </div>

          {item.description && (
            <div>
              <Label className="text-sm text-gray-600">Descrição</Label>
              <p className="mt-2 text-gray-900 bg-gray-50 p-3 rounded-lg">
                {item.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
