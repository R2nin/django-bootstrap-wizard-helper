
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { UserWithRole } from "@/types/log";

interface ResponsibleManagerProps {
  users: UserWithRole[];
  onResponsibleAdded: (responsible: string) => void;
}

export const ResponsibleManager = ({ users, onResponsibleAdded }: ResponsibleManagerProps) => {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [customResponsible, setCustomResponsible] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (useCustom && customResponsible.trim()) {
      onResponsibleAdded(customResponsible.trim());
      setCustomResponsible('');
    } else if (!useCustom && selectedUserId) {
      const selectedUser = users.find(user => user.id === selectedUserId);
      if (selectedUser) {
        onResponsibleAdded(selectedUser.fullName);
      }
    }
    
    setSelectedUserId('');
    setUseCustom(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Novo Responsável
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Responsável</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de Responsável</Label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={!useCustom ? "default" : "outline"}
                size="sm"
                onClick={() => setUseCustom(false)}
              >
                Usuário do Sistema
              </Button>
              <Button
                type="button"
                variant={useCustom ? "default" : "outline"}
                size="sm"
                onClick={() => setUseCustom(true)}
              >
                Nome Personalizado
              </Button>
            </div>
          </div>

          {!useCustom ? (
            <div className="space-y-2">
              <Label htmlFor="user">Selecionar Usuário</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um usuário" />
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
          ) : (
            <div className="space-y-2">
              <Label htmlFor="customResponsible">Nome do Responsável</Label>
              <Input
                id="customResponsible"
                value={customResponsible}
                onChange={(e) => setCustomResponsible(e.target.value)}
                placeholder="Ex: Ana Silva"
                required
              />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!useCustom ? !selectedUserId : !customResponsible.trim()}
            >
              Adicionar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
