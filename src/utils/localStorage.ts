
// Simulação de banco de dados usando localStorage
export class LocalStorage {
  private static getKey(table: string): string {
    return `patrimony_system_${table}`;
  }

  static get<T>(table: string): T[] {
    try {
      const data = localStorage.getItem(this.getKey(table));
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Erro ao ler ${table} do localStorage:`, error);
      return [];
    }
  }

  static set<T>(table: string, data: T[]): void {
    try {
      localStorage.setItem(this.getKey(table), JSON.stringify(data));
    } catch (error) {
      console.error(`Erro ao salvar ${table} no localStorage:`, error);
    }
  }

  static add<T extends { id: string }>(table: string, item: T): void {
    const items = this.get<T>(table);
    items.push(item);
    this.set(table, items);
  }

  static update<T extends { id: string }>(table: string, id: string, updates: Partial<T>): void {
    const items = this.get<T>(table);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      this.set(table, items);
    }
  }

  static delete<T extends { id: string }>(table: string, id: string): void {
    const items = this.get<T>(table);
    const filtered = items.filter(item => item.id !== id);
    this.set(table, filtered);
  }

  static clear(table: string): void {
    localStorage.removeItem(this.getKey(table));
  }

  static clearAll(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('patrimony_system_')) {
        localStorage.removeItem(key);
      }
    });
  }
}
