import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Supplier } from "@/types/supplier";
import { UserWithRole } from "@/types/log";
import { PatrimonyItem } from "@/pages/Index";

interface PatrimonyFormProps {
  onSubmit: (item: Omit<PatrimonyItem, 'id'>) => void;
  existingItems: PatrimonyItem[];
  suppliers: Supplier[];
  users: UserWithRole[];
  availableLocations: string[];
  availableResponsibles: string[];
}

export const PatrimonyForm = ({ 
  onSubmit, 
  existingItems, 
  suppliers, 
  users, 
  availableLocations, 
  availableResponsibles 
}: PatrimonyFormProps) => {
  const [formData, setFormData] = useState({
    numeroChapa: 0,
    name: '',
    category: '',
    location: '',
    acquisitionDate: format(new Date(), "yyyy-MM-dd"),
    value: 0,
    status: 'active' as 'active' | 'maintenance' | 'retired',
    description: '',
    responsible: '',
    supplierId: undefined
  });
  const [date, setDate] = useState<Date>(new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.numeroChapa ||
      !formData.name ||
      !formData.category ||
      !formData.location ||
      !formData.acquisitionDate ||
      !formData.value ||
      !formData.status ||
      !formData.responsible
    ) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    onSubmit({
      numeroChapa: formData.numeroChapa,
      name: formData.name,
      category: formData.category,
      location: formData.location,
      acquisitionDate: formData.acquisitionDate,
      value: formData.value,
      status: formData.status,
      description: formData.description,
      responsible: formData.responsible,
      supplierId: formData.supplierId
    });

    setFormData({
      numeroChapa: 0,
      name: '',
      category: '',
      location: '',
      acquisitionDate: format(new Date(), "yyyy-MM-dd"),
      value: 0,
      status: 'active',
      description: '',
      responsible: '',
      supplierId: undefined
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Adicionar Novo Item ao Patrimônio</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="numeroChapa">Número da Chapa *</Label>
              <Input
                id="numeroChapa"
                type="number"
                value={formData.numeroChapa === 0 ? '' : formData.numeroChapa}
                onChange={(e) => setFormData({ ...formData, numeroChapa: Number(e.target.value) })}
                placeholder="Digite o número da chapa"
                required
              />
            </div>

            <div>
              <Label htmlFor="name">Nome do Item *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Computador Dell"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Categoria *</Label>
              <Input
                id="category"
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Ex: Eletrônicos"
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Localização *</Label>
              <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a localização" />
                </SelectTrigger>
                <SelectContent>
                  {availableLocations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="acquisitionDate">Data de Aquisição *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecione a data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center" side="bottom">
                  <Calendar
                    mode="single"
                    locale={ptBR}
                    selected={date}
                    onSelect={(date) => {
                      setDate(date);
                      setFormData({ ...formData, acquisitionDate: format(date, "yyyy-MM-dd") })
                    }}
                    disabled={(date) =>
                      date > new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="value">Valor (R$) *</Label>
              <Input
                id="value"
                type="number"
                value={formData.value === 0 ? '' : formData.value}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                placeholder="Digite o valor em reais"
                required
              />
            </div>

            <div>
              <Label>Status *</Label>
              <RadioGroup 
                value={formData.status} 
                onValueChange={(value: 'active' | 'maintenance' | 'retired') => setFormData({ ...formData, status: value })}
                className="flex space-x-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="active" id="active" />
                  <Label htmlFor="active">Ativo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="maintenance" id="maintenance" />
                  <Label htmlFor="maintenance">Em Manutenção</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="retired" id="retired" />
                  <Label htmlFor="retired">Retirado</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="responsible">Responsável *</Label>
              <Select value={formData.responsible} onValueChange={(value) => setFormData({ ...formData, responsible: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o responsável" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.fullName}>
                      {user.fullName} ({user.email})
                    </SelectItem>
                  ))}
                  {availableResponsibles.map((responsible) => (
                    <SelectItem key={responsible} value={responsible}>
                      {responsible}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="supplier">Fornecedor</Label>
              <Select value={formData.supplierId || ''} onValueChange={(value) => setFormData({ ...formData, supplierId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Digite a descrição do item"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">Adicionar Item</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
