
import { useState, useEffect } from 'react';
import { LocalStorage } from '@/utils/localStorage';
import { PatrimonyItem } from '@/pages/Index';

export const usePatrimonyData = () => {
  const [items, setItems] = useState<PatrimonyItem[]>([]);

  useEffect(() => {
    const savedItems = LocalStorage.get<PatrimonyItem>('patrimony');
    console.log('usePatrimonyData - Carregando items do localStorage:', savedItems.length);
    
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
      console.log('usePatrimonyData - Items iniciais criados:', initialItems.length);
    } else {
      setItems(savedItems);
      console.log('usePatrimonyData - Items carregados:', savedItems.length);
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
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      numeroChapa: getNextChapa()
    };
    
    console.log('usePatrimonyData - Adicionando novo item:', newItem);
    
    const updatedItems = [...items, newItem];
    console.log('usePatrimonyData - Items antes da atualização:', items.length);
    console.log('usePatrimonyData - Items após criar array:', updatedItems.length);
    
    LocalStorage.set('patrimony', updatedItems);
    console.log('usePatrimonyData - Items salvos no localStorage');
    
    setItems(updatedItems);
    console.log('usePatrimonyData - Estado atualizado com', updatedItems.length, 'items');
    
    return newItem;
  };

  const addItemWithChapa = (item: Omit<PatrimonyItem, 'id'>) => {
    const newItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    
    console.log('usePatrimonyData - Adicionando item com chapa específica:', newItem);
    
    const updatedItems = [...items, newItem];
    LocalStorage.set('patrimony', updatedItems);
    setItems(updatedItems);
    console.log('usePatrimonyData - Items atualizados no localStorage:', updatedItems.length);
    
    return newItem;
  };

  const updateItem = (id: string, updates: Partial<PatrimonyItem>) => {
    console.log('usePatrimonyData - Atualizando item ID:', id, 'com dados:', updates);
    
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    
    LocalStorage.set('patrimony', updatedItems);
    setItems(updatedItems);
    console.log('usePatrimonyData - Item atualizado no localStorage. Total items:', updatedItems.length);
  };

  const deleteItem = (id: string) => {
    console.log('usePatrimonyData - Deletando item ID:', id);
    
    const updatedItems = items.filter(item => item.id !== id);
    LocalStorage.set('patrimony', updatedItems);
    setItems(updatedItems);
    console.log('usePatrimonyData - Item deletado. Total items restantes:', updatedItems.length);
  };

  console.log('usePatrimonyData - Hook retornando', items.length, 'items');

  return { items, addItem, addItemWithChapa, updateItem, deleteItem };
};
