
import { useState, useEffect } from 'react';
import { LocalStorage } from '@/utils/localStorage';

interface Location {
  id: string;
  name: string;
  responsibleId: string;
  responsibleName: string;
  createdAt: string;
}

export const useLocationData = () => {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const savedLocations = LocalStorage.get<Location>('locations');
    setLocations(savedLocations);
  }, []);

  const addLocation = (location: Omit<Location, 'id' | 'createdAt'>) => {
    const newLocation: Location = {
      ...location,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    LocalStorage.add('locations', newLocation);
    setLocations(prev => [...prev, newLocation]);
    return newLocation;
  };

  const deleteLocation = (id: string) => {
    LocalStorage.delete('locations', id);
    setLocations(prev => prev.filter(location => location.id !== id));
  };

  return { locations, addLocation, deleteLocation };
};
