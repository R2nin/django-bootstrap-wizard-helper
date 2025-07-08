import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PatrimonyItem } from '@/pages/Index';
import { toast } from "@/components/ui/use-toast";

interface DBPatrimonyItem {
  id: string;
  numero_chapa: number;
  name: string;
  category: string;
  location: string;
  acquisition_date: string;
  value: number;
  status: string;
  description: string | null;
  responsible: string;
  supplier_id: string | null;
  created_at: string;
  updated_at: string;
}

export const useSupabasePatrimony = () => {
  const [items, setItems] = useState<PatrimonyItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Converter item do DB para formato da aplicação
  const convertFromDB = (dbItem: DBPatrimonyItem): PatrimonyItem => ({
    id: dbItem.id,
    numeroChapa: dbItem.numero_chapa,
    name: dbItem.name,
    category: dbItem.category,
    location: dbItem.location,
    acquisitionDate: dbItem.acquisition_date,
    value: dbItem.value,
    status: dbItem.status as 'active' | 'maintenance' | 'retired',
    description: dbItem.description || '',
    responsible: dbItem.responsible
  });

  // Converter item da aplicação para formato do DB
  const convertToDB = (item: PatrimonyItem) => ({
    numero_chapa: item.numeroChapa,
    name: item.name,
    category: item.category,
    location: item.location,
    acquisition_date: item.acquisitionDate,
    value: item.value,
    status: item.status,
    description: item.description,
    responsible: item.responsible
  });

  // Carregar itens do Supabase
  const loadItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('patrimony_items')
        .select('*')
        .order('numero_chapa', { ascending: true });

      if (error) {
        console.error('Erro ao carregar itens:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar itens do banco de dados",
          variant: "destructive"
        });
        return;
      }

      const convertedItems = data?.map(convertFromDB) || [];
      setItems(convertedItems);
      console.log('Itens carregados do Supabase:', convertedItems.length);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar itens",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Adicionar item
  const addItem = async (item: Omit<PatrimonyItem, 'id' | 'numeroChapa'>): Promise<PatrimonyItem | null> => {
    try {
      // Buscar próximo número de chapa
      const { data: maxData } = await supabase
        .from('patrimony_items')
        .select('numero_chapa')
        .order('numero_chapa', { ascending: false })
        .limit(1);

      const nextChapa = maxData && maxData.length > 0 ? maxData[0].numero_chapa + 1 : 1001;

      const dbItem = {
        ...convertToDB({ ...item, id: '', numeroChapa: nextChapa } as PatrimonyItem)
      };

      const { data, error } = await supabase
        .from('patrimony_items')
        .insert([dbItem])
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar item:', error);
        toast({
          title: "Erro",
          description: "Erro ao adicionar item",
          variant: "destructive"
        });
        return null;
      }

      const newItem = convertFromDB(data);
      setItems(prev => [...prev, newItem].sort((a, b) => a.numeroChapa - b.numeroChapa));
      
      toast({
        title: "Sucesso!",
        description: `Item "${newItem.name}" adicionado com chapa ${newItem.numeroChapa}`,
      });

      return newItem;
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar item",
        variant: "destructive"
      });
      return null;
    }
  };

  // Adicionar item com chapa específica
  const addItemWithChapa = async (item: Omit<PatrimonyItem, 'id'>): Promise<PatrimonyItem | null> => {
    try {
      // Verificar se chapa já existe
      const { data: existing } = await supabase
        .from('patrimony_items')
        .select('id, name')
        .eq('numero_chapa', item.numeroChapa)
        .maybeSingle();

      if (existing) {
        throw new Error(`Chapa ${item.numeroChapa} já existe para o item: ${existing.name}`);
      }

      const dbItem = convertToDB(item as PatrimonyItem);

      const { data, error } = await supabase
        .from('patrimony_items')
        .insert([dbItem])
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar item:', error);
        toast({
          title: "Erro",
          description: "Erro ao adicionar item",
          variant: "destructive"
        });
        return null;
      }

      const newItem = convertFromDB(data);
      setItems(prev => [...prev, newItem].sort((a, b) => a.numeroChapa - b.numeroChapa));
      
      toast({
        title: "Sucesso!",
        description: `Item "${newItem.name}" adicionado com chapa ${newItem.numeroChapa}`,
      });

      return newItem;
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao adicionar item",
        variant: "destructive"
      });
      return null;
    }
  };

  // Adicionar múltiplos itens
  const addMultipleItems = async (itemsData: PatrimonyItem[]): Promise<PatrimonyItem[]> => {
    console.log('useSupabasePatrimony - addMultipleItems called with:', itemsData.length, 'items');
    
    try {
      // Converter todos os itens para o formato do DB
      const dbItems = itemsData.map(item => {
        const dbItem = convertToDB(item);
        console.log('useSupabasePatrimony - Converting item:', item.name, 'to DB format:', dbItem);
        return dbItem;
      });

      console.log('useSupabasePatrimony - Inserting items into database...');
      
      const { data, error } = await supabase
        .from('patrimony_items')
        .insert(dbItems)
        .select();

      if (error) {
        console.error('useSupabasePatrimony - Database error:', error);
        throw error;
      }

      console.log('useSupabasePatrimony - Database insert successful, returned:', data?.length, 'items');

      const newItems = data?.map(convertFromDB) || [];
      console.log('useSupabasePatrimony - Converted items:', newItems.length);
      
      setItems(prev => {
        const updated = [...prev, ...newItems].sort((a, b) => a.numeroChapa - b.numeroChapa);
        console.log('useSupabasePatrimony - Updated items list length:', updated.length);
        return updated;
      });

      return newItems;
    } catch (error) {
      console.error('useSupabasePatrimony - Error in addMultipleItems:', error);
      throw error;
    }
  };

  // Atualizar item
  const updateItem = async (id: string, updates: Partial<PatrimonyItem>): Promise<void> => {
    try {
      const { numero_chapa, ...dbUpdates } = convertToDB(updates as PatrimonyItem);
      
      const updateData: any = {};
      Object.keys(dbUpdates).forEach(key => {
        if (dbUpdates[key as keyof typeof dbUpdates] !== undefined) {
          updateData[key] = dbUpdates[key as keyof typeof dbUpdates];
        }
      });
      
      if (updates.numeroChapa !== undefined) {
        updateData.numero_chapa = updates.numeroChapa;
      }

      const { error } = await supabase
        .from('patrimony_items')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar item:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar item",
          variant: "destructive"
        });
        return;
      }

      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ));

      toast({
        title: "Sucesso!",
        description: "Item atualizado com sucesso",
      });
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar item",
        variant: "destructive"
      });
    }
  };

  // Deletar item
  const deleteItem = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('patrimony_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar item:', error);
        toast({
          title: "Erro",
          description: "Erro ao deletar item",
          variant: "destructive"
        });
        return;
      }

      setItems(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Sucesso!",
        description: "Item removido com sucesso",
      });
    } catch (error) {
      console.error('Erro ao deletar item:', error);
      toast({
        title: "Erro",
        description: "Erro ao deletar item",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  return {
    items,
    loading,
    addItem,
    addItemWithChapa,
    addMultipleItems,
    updateItem,
    deleteItem,
    refetch: loadItems
  };
};
