
export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: string;
}

// Para compatibilidade com o sistema de roles
export interface UserWithRole extends User {
  role: 'admin' | 'user';
}
