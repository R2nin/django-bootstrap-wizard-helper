
import { useState, useEffect } from 'react';
import { LocalStorage } from '@/utils/localStorage';
import { PatrimonyItem } from '@/pages/Index';

export const usePatrimonyData = () => {
  const [items, setItems] = useState<PatrimonyItem[]>([]);

  useEffect(() => {
    const savedItems = LocalStorage.get<PatrimonyItem>('patrimony');
    if (savedItems.length === 0) {
      // Dados iniciais se não houver nada salvo
      const initialItems: PatrimonyItem[] = [
        {
          id: '1',
          name: 'Notebook Dell Inspiron',
          category: 'Informática',
          location: 'Escritório - Sala 101',
          acquisitionDate: '2023-01-15',
          value: 3500,
          status: 'active',
          description: 'Notebook para desenvolvimento',
          responsible: 'João Silva'
        },
        {
          id: '2',
          name: 'Mesa de Escritório',
          category: 'Mobiliário',
          location: 'Escritório - Sala 102',
          acquisitionDate: '2022-11-20',
          value: 850,
          status: 'active',
          description: 'Mesa executiva em madeira',
          responsible: 'Maria Santos'
        }
      ];
      LocalStorage.set('patrimony', initialItems);
      setItems(initialItems);
    } else {
      setItems(savedItems);
    }
  }, []);

  const addItem = (item: Omit<PatrimonyItem, 'id'>) => {
    const newItem = {
      ...item,
      id: Date.now().toString()
    };
    LocalStorage.add('patrimony', newItem);
    setItems(prev => [...prev, newItem]);
    return newItem;
  };

  const updateItem = (id: string, updates: Partial<PatrimonyItem>) => {
    LocalStorage.update('patrimony', id, updates);
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteItem = (id: string) => {
    LocalStorage.delete('patrimony', id);
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return { items, addItem, updateItem, deleteItem };
};
