
export interface LogEntry {
  id: string;
  timestamp: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
  entity: 'PATRIMONY' | 'USER' | 'SYSTEM';
  entityId?: string;
  entityName?: string;
  userId: string;
  userName: string;
  details: string;
}

export type UserRole = 'admin' | 'user';

export interface UserWithRole {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
}
