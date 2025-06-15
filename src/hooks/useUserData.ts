
import { useState, useEffect } from 'react';
import { LocalStorage } from '@/utils/localStorage';
import { UserWithRole } from '@/types/log';
import { User } from '@/types/user';

export const useUserData = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);

  useEffect(() => {
    const savedUsers = LocalStorage.get<UserWithRole>('users');
    if (savedUsers.length === 0) {
      // Usuários iniciais se não houver nada salvo
      const initialUsers: UserWithRole[] = [
        {
          id: '1',
          fullName: 'João Silva',
          email: 'admin@empresa.com',
          password: 'admin123',
          role: 'admin',
          createdAt: '2023-01-10'
        },
        {
          id: '2',
          fullName: 'Maria Santos',
          email: 'user@empresa.com',
          password: 'user123',
          role: 'user',
          createdAt: '2023-02-15'
        }
      ];
      LocalStorage.set('users', initialUsers);
      setUsers(initialUsers);
    } else {
      setUsers(savedUsers);
    }
  }, []);

  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: UserWithRole = {
      ...user,
      id: Date.now().toString(),
      role: 'user',
      createdAt: new Date().toISOString()
    };
    LocalStorage.add('users', newUser);
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  return { users, addUser };
};
