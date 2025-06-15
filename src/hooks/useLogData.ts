
import { useState, useEffect } from 'react';
import { LocalStorage } from '@/utils/localStorage';
import { LogEntry } from '@/types/log';

export const useLogData = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const savedLogs = LocalStorage.get<LogEntry>('logs');
    if (savedLogs.length === 0) {
      // Logs iniciais se não houver nada salvo
      const initialLogs: LogEntry[] = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          action: 'LOGIN',
          entity: 'SYSTEM',
          userId: '1',
          userName: 'João Silva',
          details: 'Usuário fez login no sistema'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          action: 'CREATE',
          entity: 'PATRIMONY',
          entityId: '1',
          entityName: 'Notebook Dell Inspiron',
          userId: '1',
          userName: 'João Silva',
          details: 'Criou item de patrimônio: Notebook Dell Inspiron'
        }
      ];
      LocalStorage.set('logs', initialLogs);
      setLogs(initialLogs);
    } else {
      setLogs(savedLogs);
    }
  }, []);

  const addLog = (action: LogEntry['action'], entity: LogEntry['entity'], details: string, userId: string, userName: string, entityId?: string, entityName?: string) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action,
      entity,
      entityId,
      entityName,
      userId,
      userName,
      details
    };
    
    LocalStorage.add('logs', newLog);
    setLogs(prev => [newLog, ...prev]);
  };

  return { logs, addLog };
};
