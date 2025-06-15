export type LogAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
export type LogEntity = 'PATRIMONY' | 'USER' | 'SYSTEM' | 'SUPPLIER' | 'LOCATION';

export interface LogEntry {
  id: string;
  timestamp: string;
  action: LogAction;
  entity: LogEntity;
  entityId?: string;
  entityName?: string;
  userId: string;
  userName: string;
  details: string;
}

export interface Log {
  id: string;
  action: LogAction;
  entity: LogEntity;
  description: string;
  userId: string;
  userName: string;
  timestamp: string;
  entityId?: string;
  entityName?: string;
}

export interface UserWithRole {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: string;
}
