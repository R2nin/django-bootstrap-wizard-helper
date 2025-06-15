
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Edit, Trash2, Eye } from "lucide-react";
import { PatrimonyItem } from "@/pages/Index";
import { PatrimonyDetails } from "@/components/PatrimonyDetails";

interface PatrimonyListProps {
  items: PatrimonyItem[];
  onUpdate: (id: string, item: Partial<PatrimonyItem>) => void;
  onDelete: (id: string) => void;
  onEdit: (item: PatrimonyItem) => void;
}

export const PatrimonyList = ({ items, onUpdate, onDelete, onEdit }: PatrimonyListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<PatrimonyItem | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.responsible.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.numeroChapa.toString().includes(searchTerm)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Ativo</Badge>;
      case 'maintenance':
        return <Badge variant="secondary">Manutenção</Badge>;
      case 'retired':
        return <Badge variant="destructive">Inativo</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const handleViewDetails = (item: PatrimonyItem) => {
    setSelectedItem(item);
    setShowDetails(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lista do Patrimônio</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por chapa, nome, categoria, localização ou responsável..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chapa</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.numeroChapa}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.responsible}</TableCell>
                    <TableCell>R$ {item.value.toLocaleString('pt-BR')}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(item)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm('Tem certeza que deseja excluir este item?')) {
                              onDelete(item.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'Nenhum item encontrado para a busca.' : 'Nenhum item cadastrado ainda.'}
            </div>
          )}
        </CardContent>
      </Card>

      {showDetails && selectedItem && (
        <PatrimonyDetails
          item={selectedItem}
          onClose={() => setShowDetails(false)}
          onUpdate={(updatedItem) => {
            onUpdate(selectedItem.id, updatedItem);
            setShowDetails(false);
          }}
        />
      )}
    </div>
  );
};
