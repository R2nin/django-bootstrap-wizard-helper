
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MapPin, Plus } from "lucide-react";

interface Location {
  id: string;
  name: string;
  responsibleId: string;
  responsibleName: string;
  createdAt: string;
}

interface LocationDropdownProps {
  locations: Location[];
  onAddLocation: () => void;
}

export const LocationDropdown = ({ locations, onAddLocation }: LocationDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <MapPin className="h-4 w-4 mr-2" />
          Localizações
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border shadow-lg z-50">
        {locations.length > 0 ? (
          locations.map((location) => (
            <DropdownMenuItem key={location.id} className="cursor-pointer">
              <div className="flex flex-col">
                <span className="font-medium">{location.name}</span>
                <span className="text-sm text-gray-500">
                  Responsável: {location.responsibleName}
                </span>
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>
            Nenhuma localização cadastrada
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          onClick={onAddLocation}
          className="cursor-pointer border-t mt-1 pt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Localização
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
