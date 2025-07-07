
import { Button } from "@/components/ui/button";
import { Package, Shield, LogOut } from "lucide-react";
import { User } from "@/types/user";
import { LocationDropdown } from "./LocationDropdown";

interface Location {
  id: string;
  name: string;
  responsibleId: string;
  responsibleName: string;
  createdAt: string;
}

interface HeaderProps {
  currentUser: User;
  onLogout: () => void;
  onAddLocation: () => void;
  locations: Location[];
}

export const Header = ({ currentUser, onLogout, onAddLocation, locations }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">
              Sistema de Gestão Patrimonial
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <LocationDropdown 
              locations={locations}
              onAddLocation={onAddLocation}
            />
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">
                {currentUser.fullName} ({currentUser.role === 'admin' ? 'Administrador' : 'Usuário'})
              </span>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
