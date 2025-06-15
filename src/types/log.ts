
export type LogAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
export type LogEntity = 'PATRIMONY' | 'USER' | 'SYSTEM' | 'SUPPLIER';

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
  role: 'admin' | 'user';
}
