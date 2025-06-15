
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserWithRole } from "@/types/log";

interface Location {
  id: string;
  name: string;
  responsibleId: string;
  responsibleName: string;
  createdAt: string;
}

interface LocationFormProps {
  onSubmit: (location: Omit<Location, 'id' | 'createdAt'>) => void;
  users: UserWithRole[];
  onCancel: () => void;
}

export const LocationForm = ({ onSubmit, users, onCancel }: LocationFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    responsibleId: '',
    responsibleName: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.responsibleId) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const selectedUser = users.find(user => user.id === formData.responsibleId);
    if (!selectedUser) {
      alert('Responsável selecionado inválido.');
      return;
    }

    onSubmit({
      name: formData.name,
      responsibleId: formData.responsibleId,
      responsibleName: selectedUser.fullName
    });

    setFormData({
      name: '',
      responsibleId: '',
      responsibleName: ''
    });
  };

  const handleResponsibleChange = (userId: string) => {
    const selectedUser = users.find(user => user.id === userId);
    setFormData({
      ...formData,
      responsibleId: userId,
      responsibleName: selectedUser ? selectedUser.fullName : ''
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Adicionar Nova Localização</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label htmlFor="name">Nome da Localização *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Digite o nome da localização"
                required
              />
            </div>

            <div>
              <Label htmlFor="responsible">Responsável *</Label>
              <Select 
                value={formData.responsibleId} 
                onValueChange={handleResponsibleChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o responsável" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.fullName} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              Adicionar Localização
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
