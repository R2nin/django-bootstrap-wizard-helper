
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
          numeroChapa: 1001,
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
          numeroChapa: 1002,
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

  const getNextChapa = () => {
    if (items.length === 0) return 1001;
    const maxChapa = Math.max(...items.map(item => item.numeroChapa || 0));
    return maxChapa + 1;
  };

  const addItem = (item: Omit<PatrimonyItem, 'id' | 'numeroChapa'>) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      numeroChapa: getNextChapa()
    };
    const updatedItems = [...items, newItem];
    LocalStorage.set('patrimony', updatedItems);
    setItems(updatedItems);
    return newItem;
  };

  const updateItem = (id: string, updates: Partial<PatrimonyItem>) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    LocalStorage.set('patrimony', updatedItems);
    setItems(updatedItems);
  };

  const deleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    LocalStorage.set('patrimony', updatedItems);
    setItems(updatedItems);
  };

  return { items, addItem, updateItem, deleteItem };
};
