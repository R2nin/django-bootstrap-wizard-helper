
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface LocationManagerProps {
  onLocationAdded: (location: string) => void;
}

export const LocationManager = ({ onLocationAdded }: LocationManagerProps) => {
  const [newLocation, setNewLocation] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLocation.trim()) {
      onLocationAdded(newLocation.trim());
      setNewLocation('');
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Nova Localização
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Localização</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Localização</Label>
            <Input
              id="location"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="Ex: Escritório - Sala 103"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Adicionar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
