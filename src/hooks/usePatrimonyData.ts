
/**
 * HOOK DE GESTÃO DE DADOS PATRIMONIAIS
 * 
 * Responsável por gerenciar todos os dados relacionados aos itens patrimoniais.
 * Utiliza localStorage para persistência local dos dados.
 * 
 * FUNCIONALIDADES:
 * - Carregamento inicial dos dados
 * - Criação de itens (automática e manual)
 * - Atualização de itens existentes
 * - Exclusão de itens
 * - Cálculo automático de próximo número de chapa
 * 
 * SISTEMA DE NUMERAÇÃO:
 * - Numeração automática: Pega o maior número existente + 1
 * - Numeração manual: Aceita número específico fornecido pelo usuário
 * - Número inicial: 1001 (quando não há itens)
 */

import { useState, useEffect } from 'react';
import { LocalStorage } from '@/utils/localStorage';
import { PatrimonyItem } from '@/pages/Index';

export const usePatrimonyData = () => {
  // Estado principal que armazena todos os itens patrimoniais
  const [items, setItems] = useState<PatrimonyItem[]>([]);

  /**
   * INICIALIZAÇÃO DOS DADOS
   * 
   * Carrega os dados do localStorage na primeira renderização.
   * Se não existirem dados, cria itens de exemplo para demonstração.
   */
  useEffect(() => {
    console.log('usePatrimonyData - useEffect iniciado');
    const savedItems = LocalStorage.get<PatrimonyItem>('patrimony');
    console.log('usePatrimonyData - Carregando items do localStorage:', savedItems.length);
    
    if (savedItems.length === 0) {
      // DADOS INICIAIS DE DEMONSTRAÇÃO
      // Criados apenas quando não há dados salvos
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

  /**
   * LOGGING DE MUDANÇAS
   * 
   * Monitora todas as mudanças no estado dos itens para debug.
   * Executa sempre que o array de itens é modificado.
   */
  useEffect(() => {
    console.log('usePatrimonyData - Estado items atualizado. Total:', items.length);
    items.forEach((item, index) => {
      console.log(`usePatrimonyData - Item ${index + 1}: ${item.name} (Chapa: ${item.numeroChapa})`);
    });
  }, [items]);

  /**
   * CÁLCULO DO PRÓXIMO NÚMERO DE CHAPA
   * 
   * Determina qual será o próximo número de chapa disponível.
   * Usado para numeração automática.
   * 
   * @returns number - Próximo número de chapa disponível
   */
  const getNextChapa = () => {
    if (items.length === 0) return 1001; // Primeiro número se não há itens
    const maxChapa = Math.max(...items.map(item => item.numeroChapa || 0));
    return maxChapa + 1;
  };

  /**
   * CRIAÇÃO DE ITEM COM NUMERAÇÃO AUTOMÁTICA
   * 
   * Adiciona um novo item ao patrimônio usando numeração sequencial automática.
   * O número da chapa é calculado automaticamente.
   * 
   * @param item - Dados do item sem ID e sem numeroChapa
   * @returns PatrimonyItem - Item criado com ID e numeroChapa gerados
   */
  const addItem = (item: Omit<PatrimonyItem, 'id' | 'numeroChapa'>) => {
    // Gera ID único usando timestamp + string aleatória
    const newItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      numeroChapa: getNextChapa()
    };
    
    console.log('usePatrimonyData - Adicionando novo item:', newItem);
    console.log('usePatrimonyData - Items antes da atualização:', items.length);
    
    // Cria novo array com o item adicionado
    const updatedItems = [...items, newItem];
    console.log('usePatrimonyData - Items após criar array:', updatedItems.length);
    
    // Persiste no localStorage
    LocalStorage.set('patrimony', updatedItems);
    console.log('usePatrimonyData - Items salvos no localStorage');
    
    // Atualiza o estado React
    setItems(updatedItems);
    console.log('usePatrimonyData - setItems chamado com', updatedItems.length, 'items');
    
    // Verificação de integridade - confirma se foi salvo corretamente
    const verification = LocalStorage.get<PatrimonyItem>('patrimony');
    console.log('usePatrimonyData - Verificação localStorage após salvar:', verification.length);
    
    return newItem;
  };

  /**
   * CRIAÇÃO DE ITEM COM NUMERAÇÃO MANUAL
   * 
   * Adiciona um novo item ao patrimônio usando um número de chapa específico.
   * Usado quando o usuário define manualmente o número ou na importação.
   * 
   * @param item - Dados do item sem ID, mas COM numeroChapa específico
   * @returns PatrimonyItem - Item criado com ID gerado
   */
  const addItemWithChapa = (item: Omit<PatrimonyItem, 'id'>) => {
    // Gera apenas o ID, mantém o numeroChapa fornecido
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

  /**
   * ATUALIZAÇÃO DE ITEM EXISTENTE
   * 
   * Modifica um item existente com novos dados.
   * Preserva os dados não alterados.
   * 
   * @param id - ID único do item a ser atualizado
   * @param updates - Objeto com os campos que devem ser atualizados
   */
  const updateItem = (id: string, updates: Partial<PatrimonyItem>) => {
    console.log('usePatrimonyData - Atualizando item ID:', id, 'com dados:', updates);
    
    // Mapeia todos os itens, atualizando apenas o item com ID correspondente
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    
    LocalStorage.set('patrimony', updatedItems);
    setItems(updatedItems);
    console.log('usePatrimonyData - Item atualizado no localStorage. Total items:', updatedItems.length);
  };

  /**
   * EXCLUSÃO DE ITEM
   * 
   * Remove permanentemente um item do patrimônio.
   * 
   * @param id - ID único do item a ser removido
   */
  const deleteItem = (id: string) => {
    console.log('usePatrimonyData - Deletando item ID:', id);
    
    // Filtra todos os itens exceto o que deve ser removido
    const updatedItems = items.filter(item => item.id !== id);
    LocalStorage.set('patrimony', updatedItems);
    setItems(updatedItems);
    console.log('usePatrimonyData - Item deletado. Total items restantes:', updatedItems.length);
  };

  console.log('usePatrimonyData - Hook retornando', items.length, 'items no render');

  // Retorna os dados e funções para uso pelos componentes
  return { items, addItem, addItemWithChapa, updateItem, deleteItem };
};
