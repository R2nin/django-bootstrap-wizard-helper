
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { UserWithRole } from "@/types/log";

interface ResponsibleManagerProps {
  users: UserWithRole[];
  onResponsibleAdded: (responsible: string) => void;
}

export const ResponsibleManager = ({ users, onResponsibleAdded }: ResponsibleManagerProps) => {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedUserId) {
      const selectedUser = users.find(user => user.id === selectedUserId);
      if (selectedUser) {
        onResponsibleAdded(selectedUser.fullName);
      }
    }
    
    setSelectedUserId('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <UserPlus className="h-4 w-4 mr-1" />
          Associar Responsável
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Associar Usuário como Responsável</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user">Selecionar Usuário</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um usuário do sistema" />
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

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!selectedUserId}
            >
              Associar como Responsável
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
