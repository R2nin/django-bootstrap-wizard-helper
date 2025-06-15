
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PatrimonyItem } from "@/pages/Index";
import { Supplier } from "@/types/supplier";
import { Search, Edit, Plus, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PatrimonyFormProps {
  onSubmit: (item: Omit<PatrimonyItem, 'id' | 'numeroChapa'>) => void;
  onUpdate: (id: string, item: Partial<PatrimonyItem>) => void;
  existingItems?: PatrimonyItem[];
  suppliers?: Supplier[];
  editingItem?: PatrimonyItem | null;
  onCancelEdit?: () => void;
}

export const PatrimonyForm = ({ 
  onSubmit, 
  onUpdate, 
  existingItems = [], 
  suppliers = [], 
  editingItem = null,
  onCancelEdit 
}: PatrimonyFormProps) => {
  const [searchChapa, setSearchChapa] = useState('');
  const [foundItem, setFoundItem] = useState<PatrimonyItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    location: '',
    acquisitionDate: '',
    value: 0,
    status: 'active' as PatrimonyItem['status'],
    description: '',
    responsible: '',
    supplierId: 'none'
  });

  // Extrair dados únicos dos itens existentes
  const uniqueResponsibles = [...new Set(existingItems.map(item => item.responsible).filter(Boolean))];
  const uniqueLocations = [...new Set(existingItems.map(item => item.location).filter(Boolean))];

  // Se está editando um item específico (vindo da lista)
  useEffect(() => {
    if (editingItem) {
      setIsEditing(true);
      setSearchChapa(editingItem.numeroChapa.toString());
      setFoundItem(editingItem);
      setShowEditButton(false);
      setFormData({
        name: editingItem.name,
        category: editingItem.category,
        location: editingItem.location,
        acquisitionDate: editingItem.acquisitionDate,
        value: editingItem.value,
        status: editingItem.status,
        description: editingItem.description || '',
        responsible: editingItem.responsible,
        supplierId: editingItem.supplierId || 'none'
      });
    } else {
      handleClearForm();
    }
  }, [editingItem]);

  const getNextChapa = () => {
    if (existingItems.length === 0) return 1001;
    const maxChapa = Math.max(...existingItems.map(item => item.numeroChapa || 0));
    return maxChapa + 1;
  };

  const handleSearchChapa = () => {
    const chapaNumber = parseInt(searchChapa);
    if (!chapaNumber) return;

    const existingItem = existingItems.find(item => item.numeroChapa === chapaNumber);
    
    if (existingItem) {
      // Item encontrado - mostrar botão de edição
      setFoundItem(existingItem);
      setShowEditButton(true);
      setIsEditing(false);
    } else {
      // Item não encontrado - modo criação com chapa específica
      setFoundItem(null);
      setShowEditButton(false);
      setIsEditing(false);
      setFormData({
        name: '',
        category: '',
        location: '',
        acquisitionDate: '',
        value: 0,
        status: 'active',
        description: '',
        responsible: '',
        supplierId: 'none'
      });
    }
  };

  const handleStartEdit = () => {
    if (foundItem) {
      setIsEditing(true);
      setShowEditButton(false);
      setFormData({
        name: foundItem.name,
        category: foundItem.category,
        location: foundItem.location,
        acquisitionDate: foundItem.acquisitionDate,
        value: foundItem.value,
        status: foundItem.status,
        description: foundItem.description || '',
        responsible: foundItem.responsible,
        supplierId: foundItem.supplierId || 'none'
      });
    }
  };

  const handleClearForm = () => {
    setSearchChapa('');
    setFoundItem(null);
    setIsEditing(false);
    setShowEditButton(false);
    setFormData({
      name: '',
      category: '',
      location: '',
      acquisitionDate: '',
      value: 0,
      status: 'active',
      description: '',
      responsible: '',
      supplierId: 'none'
    });
  };

  const handleCancelEdit = () => {
    if (editingItem && onCancelEdit) {
      onCancelEdit();
    } else {
      handleClearForm();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && (foundItem || editingItem)) {
      // Atualizar item existente
      const itemToUpdate = foundItem || editingItem!;
      const submitData = {
        ...formData,
        supplierId: formData.supplierId === 'none' ? undefined : formData.supplierId
      };
      onUpdate(itemToUpdate.id, submitData);
    } else {
      // Criar novo item
      const submitData = {
        ...formData,
        supplierId: formData.supplierId === 'none' ? undefined : formData.supplierId
      };
      onSubmit(submitData);
    }
    
    if (!editingItem) {
      handleClearForm();
    }
  };

  const getCurrentChapa = () => {
    if (isEditing && (foundItem || editingItem)) {
      return foundItem?.numeroChapa || editingItem?.numeroChapa || 0;
    }
    if (searchChapa && !isNaN(parseInt(searchChapa))) {
      return parseInt(searchChapa);
    }
    return getNextChapa();
  };

  const categories = [
    'Informática',
    'Mobiliário',
    'Equipamentos',
    'Veículos',
    'Imóveis',
    'Outros'
  ];

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {isEditing ? 'Editar Item do Patrimônio' : 'Buscar/Adicionar Item do Patrimônio'}
          {editingItem && onCancelEdit && (
            <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
        
        {/* Campo de busca por chapa - apenas se não estiver editando item específico */}
        {!editingItem && (
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Label htmlFor="searchChapa">Número da Chapa</Label>
              <Input
                id="searchChapa"
                type="number"
                value={searchChapa}
                onChange={(e) => setSearchChapa(e.target.value)}
                placeholder="Digite o número da chapa para buscar"
              />
            </div>
            <Button type="button" onClick={handleSearchChapa} disabled={!searchChapa}>
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
            <Button type="button" variant="outline" onClick={handleClearForm}>
              Limpar
            </Button>
          </div>
        )}
        
        {/* Mostrar item encontrado e botão de edição */}
        {showEditButton && foundItem && (
          <Alert>
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <strong>Item encontrado:</strong> Chapa {foundItem.numeroChapa} - {foundItem.name}
                  <br />
                  <small className="text-gray-600">
                    Categoria: {foundItem.category} | Localização: {foundItem.location} | Responsável: {foundItem.responsible}
                  </small>
                </div>
                <Button onClick={handleStartEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Item
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {isEditing && (
          <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
            Editando item da chapa {getCurrentChapa()}. Você pode alterar ou complementar os dados existentes.
          </div>
        )}
        
        {searchChapa && !showEditButton && !isEditing && !editingItem && !existingItems.find(item => item.numeroChapa === parseInt(searchChapa)) && (
          <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
            Chapa não encontrada. Um novo item será criado com a chapa {searchChapa}.
          </div>
        )}
      </CardHeader>
      
      {/* Mostrar formulário quando estiver editando, criando ou quando item específico for passado */}
      {(isEditing || (!showEditButton && searchChapa) || editingItem) && (
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numeroChapa">Número da Chapa</Label>
                <Input
                  id="numeroChapa"
                  value={getCurrentChapa()}
                  readOnly
                  className="bg-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome do Item</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Notebook Dell Inspiron"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ex: Escritório - Sala 101"
                  required
                  list="locations-datalist"
                />
                <datalist id="locations-datalist">
                  {uniqueLocations.map((location, index) => (
                    <option key={index} value={location} />
                  ))}
                </datalist>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsible">Responsável</Label>
                <Input
                  id="responsible"
                  value={formData.responsible}
                  onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                  placeholder="Ex: João Silva"
                  required
                  list="responsibles-datalist"
                />
                <datalist id="responsibles-datalist">
                  {uniqueResponsibles.map((responsible, index) => (
                    <option key={index} value={responsible} />
                  ))}
                </datalist>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">Fornecedor</Label>
                <Select 
                  value={formData.supplierId} 
                  onValueChange={(value) => setFormData({ ...formData, supplierId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um fornecedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem fornecedor</SelectItem>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="acquisitionDate">Data de Aquisição</Label>
                <Input
                  id="acquisitionDate"
                  type="date"
                  value={formData.acquisitionDate}
                  onChange={(e) => setFormData({ ...formData, acquisitionDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Valor (R$)</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                  placeholder="0,00"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'active' | 'maintenance' | 'retired') => 
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="maintenance">Em Manutenção</SelectItem>
                  <SelectItem value="retired">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição detalhada do item..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {isEditing ? (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar ao Patrimônio
                  </>
                )}
              </Button>
              
              {(isEditing || editingItem) && (
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      )}
    </Card>
  );
};
