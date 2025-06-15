
import { useState, useEffect } from 'react';
import { Supplier } from '@/types/supplier';

export const useSupplierData = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('suppliers');
    if (stored) {
      setSuppliers(JSON.parse(stored));
    }
  }, []);

  const saveToStorage = (newSuppliers: Supplier[]) => {
    localStorage.setItem('suppliers', JSON.stringify(newSuppliers));
    setSuppliers(newSuppliers);
  };

  const addSupplier = (supplier: Omit<Supplier, 'id' | 'createdAt'>): Supplier => {
    const newSupplier: Supplier = {
      ...supplier,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    const updatedSuppliers = [...suppliers, newSupplier];
    saveToStorage(updatedSuppliers);
    return newSupplier;
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    const updatedSuppliers = suppliers.map(supplier =>
      supplier.id === id ? { ...supplier, ...updates } : supplier
    );
    saveToStorage(updatedSuppliers);
  };

  const deleteSupplier = (id: string) => {
    const updatedSuppliers = suppliers.filter(supplier => supplier.id !== id);
    saveToStorage(updatedSuppliers);
  };

  return {
    suppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
  };
};
