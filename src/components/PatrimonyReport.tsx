
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Eye } from "lucide-react";
import { PatrimonyItem } from "@/pages/Index";
import jsPDF from 'jspdf';

interface PatrimonyReportProps {
  items: PatrimonyItem[];
}

export const PatrimonyReport = ({ items }: PatrimonyReportProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  // Obter todas as localizações únicas
  const locations = Array.from(new Set(items.map(item => item.location))).sort();

  // Filtrar itens por localização
  const filteredItems = selectedLocation === "all" 
    ? items 
    : items.filter(item => item.location === selectedLocation);

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

  const generatePDFReport = () => {
    const pdf = new jsPDF();
    const currentDate = new Date().toLocaleDateString('pt-BR');
    const totalValue = filteredItems.reduce((sum, item) => sum + item.value, 0);
    const activeItems = filteredItems.filter(item => item.status === 'active').length;
    const maintenanceItems = filteredItems.filter(item => item.status === 'maintenance').length;
    const retiredItems = filteredItems.filter(item => item.status === 'retired').length;

    // Título
    pdf.setFontSize(20);
    pdf.text('RELATÓRIO DE PATRIMÔNIO', 20, 30);
    
    // Data e filtro
    pdf.setFontSize(12);
    pdf.text(`Data de Geração: ${currentDate}`, 20, 45);
    if (selectedLocation !== "all") {
      pdf.text(`Localização: ${selectedLocation}`, 20, 55);
    }

    // Resumo
    pdf.setFontSize(16);
    pdf.text('RESUMO EXECUTIVO', 20, 75);
    pdf.setFontSize(12);
    
    let yPosition = 90;
    pdf.text(`Total de Itens: ${filteredItems.length}`, 20, yPosition);
    yPosition += 10;
    pdf.text(`Valor Total: R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, yPosition);
    yPosition += 10;
    pdf.text(`Itens Ativos: ${activeItems}`, 20, yPosition);
    yPosition += 10;
    pdf.text(`Itens em Manutenção: ${maintenanceItems}`, 20, yPosition);
    yPosition += 10;
    pdf.text(`Itens Inativos: ${retiredItems}`, 20, yPosition);
    yPosition += 20;

    // Listagem detalhada
    pdf.setFontSize(16);
    pdf.text('LISTAGEM DETALHADA', 20, yPosition);
    yPosition += 15;

    pdf.setFontSize(10);
    filteredItems.forEach((item, index) => {
      // Verificar se precisa de nova página
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.text(`${index + 1}. ${item.name}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`   Categoria: ${item.category}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`   Localização: ${item.location}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`   Responsável: ${item.responsible}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`   Data de Aquisição: ${new Date(item.acquisitionDate).toLocaleDateString('pt-BR')}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`   Valor: R$ ${item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`   Status: ${getStatusText(item.status)}`, 20, yPosition);
      yPosition += 6;
      if (item.description) {
        pdf.text(`   Descrição: ${item.description}`, 20, yPosition);
        yPosition += 6;
      }
      yPosition += 8; // Espaço entre itens
    });

    // Salvar PDF
    const locationSuffix = selectedLocation !== "all" ? `-${selectedLocation.replace(/\s+/g, '-')}` : "";
    pdf.save(`relatorio-patrimonio${locationSuffix}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-4">
      {/* Seletor de Localização */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros do Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Localização:</label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione uma localização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as localizações</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-gray-600 mt-6">
              {filteredItems.length} item(s) selecionado(s)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex gap-2">
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogTrigger asChild>
            <Button variant="outline" disabled={filteredItems.length === 0}>
              <Eye className="h-4 w-4 mr-2" />
              Preview do Relatório
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Preview do Relatório de Patrimônio
                {selectedLocation !== "all" && ` - ${selectedLocation}`}
              </DialogTitle>
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
                      <div className="text-2xl font-bold">{filteredItems.length}</div>
                      <div className="text-sm text-gray-600">Total de Itens</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        R$ {filteredItems.reduce((sum, item) => sum + item.value, 0).toLocaleString('pt-BR')}
                      </div>
                      <div className="text-sm text-gray-600">Valor Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {filteredItems.filter(item => item.status === 'active').length}
                      </div>
                      <div className="text-sm text-gray-600">Ativos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {filteredItems.filter(item => item.status === 'maintenance').length}
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
                      {filteredItems.map((item) => (
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

        <Button onClick={generatePDFReport} disabled={filteredItems.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Gerar Relatório PDF
        </Button>
      </div>
    </div>
  );
};
