
/**
 * HOOK DE GERENCIAMENTO DE DADOS PATRIMONIAIS
 * 
 * Este hook centraliza toda a lógica de gerenciamento dos itens patrimoniais.
 * Utiliza localStorage para persistência dos dados e fornece operações CRUD completas.
 * 
 * FUNCIONALIDADES:
 * - Carregamento automático dos dados do localStorage na inicialização
 * - Criação de itens com numeração automática ou manual
 * - Atualização e exclusão de itens existentes
 * - Sincronização automática com localStorage em todas as operações
 * - Geração de IDs únicos para cada item
 * - Validação de numeração de chapas para evitar duplicatas
 * 
 * ESTRUTURA DE DADOS:
 * Cada item patrimonial contém:
 * - id: Identificador único gerado automaticamente
 * - numeroChapa: Número da chapa patrimonial (único)
 * - name: Nome/descrição do item
 * - category: Categoria do item
 * - location: Localização física do item
 * - acquisitionDate: Data de aquisição
 * - value: Valor monetário do item
 * - status: Status atual (active, inactive, maintenance, etc.)
 * - description: Descrição detalhada
 * - responsible: Responsável pelo item
 */

import { useState, useEffect } from 'react';
import { PatrimonyItem } from '@/pages/Index';

const STORAGE_KEY = 'patrimony-items';

/**
 * GERADOR DE ID ÚNICO
 * 
 * Gera um identificador único baseado em timestamp e string aleatória.
 * Garante que cada item tenha um ID único mesmo em operações simultâneas.
 * 
 * @returns string - ID único no formato timestamp + caracteres aleatórios
 */
const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

/**
 * CARREGADOR DE DADOS DO LOCALSTORAGE
 * 
 * Recupera os itens salvos no localStorage e os converte para o formato esperado.
 * Retorna array vazio se não houver dados ou se houver erro na deserialização.
 * 
 * @returns PatrimonyItem[] - Array de itens recuperados do localStorage
 */
const loadItems = (): PatrimonyItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const items = stored ? JSON.parse(stored) : [];
    console.log('usePatrimonyData - Carregando items do localStorage:', items.length);
    console.log('usePatrimonyData - Items carregados:', items.length);
    return items;
  } catch (error) {
    console.error('usePatrimonyData - Erro ao carregar items:', error);
    return [];
  }
};

/**
 * SALVADOR DE DADOS NO LOCALSTORAGE
 * 
 * Persiste os itens no localStorage de forma síncrona.
 * Inclui tratamento de erro para casos onde o localStorage não está disponível.
 * 
 * @param items - Array de itens para salvar no localStorage
 */
const saveItems = (items: PatrimonyItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    console.log('usePatrimonyData - Items atualizados no localStorage:', items.length);
  } catch (error) {
    console.error('usePatrimonyData - Erro ao salvar items:', error);
  }
};

/**
 * HOOK PRINCIPAL DE GERENCIAMENTO PATRIMONIAL
 * 
 * Fornece todas as operações necessárias para gerenciar o patrimônio:
 * - Estado reativo dos itens
 * - Funções de criação, atualização e exclusão
 * - Sincronização automática com localStorage
 * - Validações de negócio (numeração de chapas)
 * 
 * @returns Objeto com estado e funções de manipulação dos itens
 */
export const usePatrimonyData = () => {
  // Estado principal que armazena todos os itens patrimoniais
  const [items, setItems] = useState<PatrimonyItem[]>([]);

  /**
   * INICIALIZAÇÃO DO HOOK
   * 
   * Effect que carrega os dados do localStorage na primeira renderização.
   * Executado apenas uma vez quando o componente é montado.
   */
  useEffect(() => {
    console.log('usePatrimonyData - useEffect iniciado');
    const loadedItems = loadItems();
    setItems(loadedItems);
    console.log('usePatrimonyData - Estado items atualizado. Total:', loadedItems.length);
    
    // Debug: Lista todos os itens carregados
    loadedItems.forEach((item, index) => {
      console.log(`usePatrimonyData - Item ${index + 1}: ${item.name} (Chapa: ${item.numeroChapa})`);
    });
  }, []);

  /**
   * FUNÇÃO DE BUSCA DO PRÓXIMO NÚMERO DE CHAPA
   * 
   * Calcula automaticamente o próximo número de chapa disponível.
   * Busca o maior número existente e adiciona 1.
   * Se não houver itens, começa com 1001.
   * 
   * @returns number - Próximo número de chapa disponível
   */
  const getNextChapa = (): number => {
    if (items.length === 0) {
      console.log('usePatrimonyData - Nenhum item existente, usando chapa inicial: 1001');
      return 1001;
    }
    
    const maxChapa = Math.max(...items.map(item => item.numeroChapa));
    const nextChapa = maxChapa + 1;
    console.log('usePatrimonyData - Maior chapa existente:', maxChapa, '- Próxima chapa:', nextChapa);
    return nextChapa;
  };

  /**
   * CRIAÇÃO DE ITEM COM NUMERAÇÃO AUTOMÁTICA
   * 
   * Adiciona um novo item ao patrimônio usando numeração automática de chapa.
   * O número da chapa é calculado automaticamente (próximo disponível).
   * 
   * @param itemData - Dados do item sem ID e sem numeroChapa
   * @returns PatrimonyItem - Item criado com ID e numeroChapa gerados
   */
  const addItem = (itemData: Omit<PatrimonyItem, 'id' | 'numeroChapa'>): PatrimonyItem => {
    const newItem: PatrimonyItem = {
      ...itemData,
      id: generateId(),
      numeroChapa: getNextChapa()
    };

    console.log('usePatrimonyData - Adicionando item com chapa automática:', newItem);

    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    saveItems(updatedItems);

    console.log('usePatrimonyData - Item adicionado. Total de items:', updatedItems.length);
    return newItem;
  };

  /**
   * CRIAÇÃO DE ITEM COM NUMERAÇÃO MANUAL
   * 
   * Adiciona um novo item usando um número de chapa específico fornecido pelo usuário.
   * Valida se o número da chapa já existe antes de criar o item.
   * 
   * @param itemData - Dados completos do item incluindo numeroChapa específico
   * @returns PatrimonyItem - Item criado com o número de chapa fornecido
   * @throws Error - Se o número da chapa já existir
   */
  const addItemWithChapa = (itemData: Omit<PatrimonyItem, 'id'>): PatrimonyItem => {
    console.log('usePatrimonyData - Verificando chapa específica:', itemData.numeroChapa);
    
    // Validação: verifica se a chapa já existe
    const existingItem = items.find(item => item.numeroChapa === itemData.numeroChapa);
    if (existingItem) {
      const errorMsg = `Chapa ${itemData.numeroChapa} já existe para o item: ${existingItem.name}`;
      console.error('usePatrimonyData - ' + errorMsg);
      throw new Error(errorMsg);
    }

    const newItem: PatrimonyItem = {
      ...itemData,
      id: generateId()
    };

    console.log('usePatrimonyData - Adicionando item com chapa específica:', newItem);

    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    saveItems(updatedItems);

    console.log('usePatrimonyData - Item adicionado com chapa específica. Total de items:', updatedItems.length);
    return newItem;
  };

  /**
   * ADIÇÃO DE MÚLTIPLOS ITENS - NOVA FUNÇÃO PARA IMPORTAÇÃO
   * 
   * Adiciona múltiplos itens de uma vez, usado especialmente para importação de arquivos.
   * Processa todos os itens em lote para melhor performance e consistência.
   * 
   * @param itemsData - Array de itens para adicionar
   * @returns PatrimonyItem[] - Array dos itens criados
   */
  const addMultipleItems = (itemsData: PatrimonyItem[]): PatrimonyItem[] => {
    console.log('usePatrimonyData - Adicionando múltiplos itens:', itemsData.length);
    
    const newItems: PatrimonyItem[] = [];
    const existingChapas = new Set(items.map(item => item.numeroChapa));
    
    for (const itemData of itemsData) {
      // Verifica se a chapa já existe
      if (existingChapas.has(itemData.numeroChapa)) {
        console.warn(`usePatrimonyData - Chapa ${itemData.numeroChapa} já existe, pulando item: ${itemData.name}`);
        continue;
      }
      
      const newItem: PatrimonyItem = {
        ...itemData,
        id: generateId()
      };
      
      newItems.push(newItem);
      existingChapas.add(newItem.numeroChapa); // Adiciona ao set para evitar duplicatas no mesmo lote
      console.log(`usePatrimonyData - Item preparado: ${newItem.name} (Chapa: ${newItem.numeroChapa})`);
    }
    
    console.log('usePatrimonyData - Total de novos itens válidos:', newItems.length);
    
    // Adiciona todos os itens válidos de uma vez
    const updatedItems = [...items, ...newItems];
    setItems(updatedItems);
    saveItems(updatedItems);
    
    console.log('usePatrimonyData - Múltiplos itens adicionados. Total final:', updatedItems.length);
    return newItems;
  };

  /**
   * ATUALIZAÇÃO DE ITEM EXISTENTE
   * 
   * Atualiza um item existente com novos dados.
   * Mantém o ID original e permite atualização parcial dos campos.
   * 
   * @param id - ID único do item a ser atualizado
   * @param updates - Objeto com os campos que devem ser atualizados
   */
  const updateItem = (id: string, updates: Partial<PatrimonyItem>): void => {
    console.log('usePatrimonyData - Atualizando item:', id, updates);

    const updatedItems = items.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );

    setItems(updatedItems);
    saveItems(updatedItems);
    console.log('usePatrimonyData - Item atualizado. Total de items:', updatedItems.length);
  };

  /**
   * EXCLUSÃO DE ITEM
   * 
   * Remove um item do patrimônio permanentemente.
   * 
   * @param id - ID único do item a ser removido
   */
  const deleteItem = (id: string): void => {
    console.log('usePatrimonyData - Removendo item:', id);

    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    saveItems(updatedItems);
    console.log('usePatrimonyData - Item removido. Total de items:', updatedItems.length);
  };

  // Debug: Log do estado atual sempre que o hook é executado
  console.log('usePatrimonyData - Hook retornando', items.length, 'items no render');

  // Retorna o estado e todas as funções de manipulação
  return {
    items,
    addItem,
    addItemWithChapa,
    addMultipleItems, // Nova função para importação em lote
    updateItem,
    deleteItem
  };
};
