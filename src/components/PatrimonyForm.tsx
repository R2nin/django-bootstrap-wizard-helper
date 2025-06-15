
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PatrimonyItem } from "@/pages/Index";
import { Supplier } from "@/types/supplier";

interface PatrimonyFormProps {
  onSubmit: (item: Omit<PatrimonyItem, 'id' | 'numeroChapa'>) => void;
  initialData?: PatrimonyItem;
  existingItems?: PatrimonyItem[];
  suppliers?: Supplier[];
}

export const PatrimonyForm = ({ onSubmit, initialData, existingItems = [], suppliers = [] }: PatrimonyFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || '',
    location: initialData?.location || '',
    acquisitionDate: initialData?.acquisitionDate || '',
    value: initialData?.value || 0,
    status: initialData?.status || 'active' as const,
    description: initialData?.description || '',
    responsible: initialData?.responsible || '',
    supplierId: initialData?.supplierId || 'none'
  });

  // Extrair dados únicos dos itens existentes
  const uniqueResponsibles = [...new Set(existingItems.map(item => item.responsible).filter(Boolean))];
  const uniqueLocations = [...new Set(existingItems.map(item => item.location).filter(Boolean))];

  const getNextChapa = () => {
    if (existingItems.length === 0) return 1001;
    const maxChapa = Math.max(...existingItems.map(item => item.numeroChapa || 0));
    return maxChapa + 1;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      supplierId: formData.supplierId === 'none' ? undefined : formData.supplierId
    };
    onSubmit(submitData);
    
    // Reset form if not editing
    if (!initialData) {
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
          {initialData ? 'Editar Item' : 'Adicionar Novo Item ao Patrimônio'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numeroChapa">Número da Chapa</Label>
              <Input
                id="numeroChapa"
                value={initialData?.numeroChapa || getNextChapa()}
                readOnly
                className="bg-gray-100"
                placeholder="Será gerado automaticamente"
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
            {initialData ? 'Atualizar Item' : 'Adicionar ao Patrimônio'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
