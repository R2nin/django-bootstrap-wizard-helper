
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = login(email, password);
    if (!success) {
      setError('Email ou senha incorretos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Login - Sistema de Patrimônio</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                required
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Admin:</strong> admin@empresa.com / admin123</p>
            <p><strong>Usuário:</strong> user@empresa.com / user123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
