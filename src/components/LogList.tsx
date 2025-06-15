
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Activity, User, Package } from 'lucide-react';
import { LogEntry } from '@/types/log';

interface LogListProps {
  logs: LogEntry[];
}

export const LogList = ({ logs }: LogListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(log =>
    log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActionBadgeVariant = (action: LogEntry['action']) => {
    switch (action) {
      case 'CREATE': return 'default';
      case 'UPDATE': return 'secondary';
      case 'DELETE': return 'destructive';
      case 'LOGIN': return 'outline';
      case 'LOGOUT': return 'outline';
      default: return 'outline';
    }
  };

  const getEntityIcon = (entity: LogEntry['entity']) => {
    switch (entity) {
      case 'PATRIMONY': return <Package className="h-4 w-4" />;
      case 'USER': return <User className="h-4 w-4" />;
      case 'SYSTEM': return <Activity className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  const getActionText = (action: LogEntry['action']) => {
    switch (action) {
      case 'CREATE': return 'Criou';
      case 'UPDATE': return 'Editou';
      case 'DELETE': return 'Deletou';
      case 'LOGIN': return 'Login';
      case 'LOGOUT': return 'Logout';
      default: return action;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Logs do Sistema</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredLogs.map((log) => (
          <Card key={log.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getEntityIcon(log.entity)}
                    <Badge variant={getActionBadgeVariant(log.action)}>
                      {getActionText(log.action)}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium">{log.details}</p>
                    <p className="text-sm text-gray-600">por {log.userName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{formatTimestamp(log.timestamp)}</p>
                  <Badge variant="outline" className="text-xs">
                    {log.entity}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-8">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm ? "Nenhum log encontrado com os critérios de busca." : "Nenhum log registrado ainda."}
          </p>
        </div>
      )}
    </div>
  );
};
