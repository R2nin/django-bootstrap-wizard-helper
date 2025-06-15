
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye } from "lucide-react";
import { PatrimonyItem } from "@/pages/Index";

interface PatrimonyReportProps {
  items: PatrimonyItem[];
}

export const PatrimonyReport = ({ items }: PatrimonyReportProps) => {
  const [showPreview, setShowPreview] = useState(false);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'maintenance': return 'Manutenção';
      case 'retired': return 'Inativo';
      default: return 'Desconhecido';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Ativo</Badge>;
      case 'maintenance':
        return <Badge variant="secondary">Manutenção</Badge>;
      case 'retired':
        return <Badge variant="destructive">Inativo</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const generateReport = () => {
    const currentDate = new Date().toLocaleDateString('pt-BR');
    const totalValue = items.reduce((sum, item) => sum + item.value, 0);
    const activeItems = items.filter(item => item.status === 'active').length;
    const maintenanceItems = items.filter(item => item.status === 'maintenance').length;
    const retiredItems = items.filter(item => item.status === 'retired').length;

    let reportContent = `RELATÓRIO DE PATRIMÔNIO
Data de Geração: ${currentDate}

RESUMO EXECUTIVO
================
Total de Itens: ${items.length}
Valor Total: R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Itens Ativos: ${activeItems}
Itens em Manutenção: ${maintenanceItems}
Itens Inativos: ${retiredItems}

LISTAGEM DETALHADA
==================
`;

    items.forEach((item, index) => {
      reportContent += `
${index + 1}. ${item.name}
   Categoria: ${item.category}
   Localização: ${item.location}
   Responsável: ${item.responsible}
   Data de Aquisição: ${new Date(item.acquisitionDate).toLocaleDateString('pt-BR')}
   Valor: R$ ${item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
   Status: ${getStatusText(item.status)}
   Descrição: ${item.description || 'Não informada'}
   ----------------------------------------`;
    });

    reportContent += `

CATEGORIAS
==========
`;
    const categories = Array.from(new Set(items.map(item => item.category)));
    categories.forEach(category => {
      const categoryItems = items.filter(item => item.category === category);
      const categoryValue = categoryItems.reduce((sum, item) => sum + item.value, 0);
      reportContent += `${category}: ${categoryItems.length} itens - R$ ${categoryValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
`;
    });

    reportContent += `
LOCALIZAÇÕES
============
`;
    const locations = Array.from(new Set(items.map(item => item.location)));
    locations.forEach(location => {
      const locationItems = items.filter(item => item.location === location);
      reportContent += `${location}: ${locationItems.length} itens
`;
    });

    // Criar e baixar arquivo
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-patrimonio-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2">
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview do Relatório
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview do Relatório de Patrimônio</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Resumo */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo Executivo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{items.length}</div>
                    <div className="text-sm text-gray-600">Total de Itens</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      R$ {items.reduce((sum, item) => sum + item.value, 0).toLocaleString('pt-BR')}
                    </div>
                    <div className="text-sm text-gray-600">Valor Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {items.filter(item => item.status === 'active').length}
                    </div>
                    <div className="text-sm text-gray-600">Ativos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {items.filter(item => item.status === 'maintenance').length}
                    </div>
                    <div className="text-sm text-gray-600">Manutenção</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Itens */}
            <Card>
              <CardHeader>
                <CardTitle>Listagem Completa</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{item.responsible}</TableCell>
                        <TableCell>R$ {item.value.toLocaleString('pt-BR')}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <Button onClick={generateReport}>
        <Download className="h-4 w-4 mr-2" />
        Gerar Relatório
      </Button>
    </div>
  );
};
