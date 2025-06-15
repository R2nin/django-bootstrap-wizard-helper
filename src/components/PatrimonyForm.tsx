
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PatrimonyItem } from "@/pages/Index";
import { Supplier } from "@/types/supplier";
import { Search } from "lucide-react";

interface PatrimonyFormProps {
  onSubmit: (item: Omit<PatrimonyItem, 'id' | 'numeroChapa'>) => void;
  onUpdate: (id: string, item: Partial<PatrimonyItem>) => void;
  existingItems?: PatrimonyItem[];
  suppliers?: Supplier[];
}

export const PatrimonyForm = ({ onSubmit, onUpdate, existingItems = [], suppliers = [] }: PatrimonyFormProps) => {
  const [searchChapa, setSearchChapa] = useState('');
  const [editingItem, setEditingItem] = useState<PatrimonyItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    location: '',
    acquisitionDate: '',
    value: 0,
    status: 'active' as const,
    description: '',
    responsible: '',
    supplierId: 'none'
  });

  // Extrair dados únicos dos itens existentes
  const uniqueResponsibles = [...new Set(existingItems.map(item => item.responsible).filter(Boolean))];
  const uniqueLocations = [...new Set(existingItems.map(item => item.location).filter(Boolean))];

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
      // Item encontrado - modo edição
      setEditingItem(existingItem);
      setIsEditing(true);
      setFormData({
        name: existingItem.name,
        category: existingItem.category,
        location: existingItem.location,
        acquisitionDate: existingItem.acquisitionDate,
        value: existingItem.value,
        status: existingItem.status,
        description: existingItem.description || '',
        responsible: existingItem.responsible,
        supplierId: existingItem.supplierId || 'none'
      });
    } else {
      // Item não encontrado - modo criação com chapa específica
      setEditingItem(null);
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

  const handleClearForm = () => {
    setSearchChapa('');
    setEditingItem(null);
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && editingItem) {
      // Atualizar item existente
      const submitData = {
        ...formData,
        supplierId: formData.supplierId === 'none' ? undefined : formData.supplierId
      };
      onUpdate(editingItem.id, submitData);
    } else {
      // Criar novo item
      const submitData = {
        ...formData,
        supplierId: formData.supplierId === 'none' ? undefined : formData.supplierId
      };
      onSubmit(submitData);
    }
    
    handleClearForm();
  };

  const getCurrentChapa = () => {
    if (isEditing && editingItem) {
      return editingItem.numeroChapa;
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
        <CardTitle>
          {isEditing ? 'Editar Item do Patrimônio' : 'Adicionar/Buscar Item do Patrimônio'}
        </CardTitle>
        
        {/* Campo de busca por chapa */}
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Label htmlFor="searchChapa">Número da Chapa</Label>
            <Input
              id="searchChapa"
              type="number"
              value={searchChapa}
              onChange={(e) => setSearchChapa(e.target.value)}
              placeholder="Digite o número da chapa para buscar ou deixe vazio para criar novo"
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
        
        {isEditing && (
          <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
            Item encontrado! Você está editando o item da chapa {editingItem?.numeroChapa}.
          </div>
        )}
        
        {searchChapa && !isEditing && !existingItems.find(item => item.numeroChapa === parseInt(searchChapa)) && (
          <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
            Chapa não encontrada. Um novo item será criado com a chapa {searchChapa}.
          </div>
        )}
      </CardHeader>
      
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

          <Button type="submit" className="w-full">
            {isEditing ? 'Atualizar Item' : 'Adicionar ao Patrimônio'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
