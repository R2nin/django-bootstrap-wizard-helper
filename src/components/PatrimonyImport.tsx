
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PatrimonyItem } from "@/pages/Index";
import { toast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';

interface PatrimonyImportProps {
  onImport: (items: Omit<PatrimonyItem, 'id' | 'numeroChapa'>[]) => void;
}

interface ExcelRow {
  numeroChapa: number;
  acquisitionDate: string;
  name: string;
}

export const PatrimonyImport = ({ onImport }: PatrimonyImportProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [location, setLocation] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<ExcelRow[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/vnd.ms-excel' || 
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          selectedFile.name.endsWith('.csv') ||
          selectedFile.name.endsWith('.xlsx') ||
          selectedFile.name.endsWith('.xls')) {
        setFile(selectedFile);
        setPreviewData([]);
      } else {
        toast({
          title: "Erro",
          description: "Por favor, selecione um arquivo Excel (.xlsx, .xls) ou CSV.",
          variant: "destructive"
        });
      }
    }
  };

  const processFile = async () => {
    if (!file || !location.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo e informe a localização.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      let parsedData: ExcelRow[] = [];

      if (file.name.endsWith('.csv')) {
        // Processar arquivo CSV
        const text = await file.text();
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length === 0) {
          throw new Error('Arquivo vazio');
        }

        // Skip header if it exists (check if first row contains non-numeric first column)
        const startIndex = isNaN(Number(lines[0].split(/[,;\t]/)[0])) ? 1 : 0;
        
        for (let i = startIndex; i < lines.length; i++) {
          const columns = lines[i].split(/[,;\t]/).map(col => col.trim().replace(/"/g, ''));
          
          if (columns.length >= 3) {
            const numeroChapa = parseInt(columns[0]);
            const acquisitionDate = columns[1];
            const name = columns[2];

            if (!isNaN(numeroChapa) && acquisitionDate && name) {
              let formattedDate = formatDate(acquisitionDate);
              parsedData.push({
                numeroChapa,
                acquisitionDate: formattedDate,
                name
              });
            }
          }
        }
      } else {
        // Processar arquivo Excel (.xlsx, .xls)
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        // Pegar a primeira planilha
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Converter para JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length === 0) {
          throw new Error('Planilha vazia');
        }

        // Determinar se há cabeçalho
        const firstRow = jsonData[0] as any[];
        const startIndex = (firstRow.length >= 3 && isNaN(Number(firstRow[0]))) ? 1 : 0;
        
        for (let i = startIndex; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          
          if (row && row.length >= 3 && row[0] !== undefined && row[1] !== undefined && row[2] !== undefined) {
            const numeroChapa = parseInt(String(row[0]));
            const acquisitionDate = String(row[1]);
            const name = String(row[2]);

            if (!isNaN(numeroChapa) && acquisitionDate && name) {
              let formattedDate = formatDate(acquisitionDate);
              parsedData.push({
                numeroChapa,
                acquisitionDate: formattedDate,
                name: name.trim()
              });
            }
          }
        }
      }

      if (parsedData.length === 0) {
        throw new Error('Nenhum dado válido encontrado no arquivo');
      }

      console.log('Dados processados:', parsedData);
      setPreviewData(parsedData);
      
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Erro ao processar arquivo",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateValue: string): string => {
    try {
      // Se é uma data do Excel (número serial)
      if (!isNaN(Number(dateValue))) {
        const excelDate = XLSX.SSF.parse_date_code(Number(dateValue));
        if (excelDate) {
          const year = excelDate.y;
          const month = String(excelDate.m).padStart(2, '0');
          const day = String(excelDate.d).padStart(2, '0');
          return `${year}-${month}-${day}`;
        }
      }
      
      // Se está em formato DD/MM/YYYY
      if (dateValue.includes('/')) {
        const [day, month, year] = dateValue.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      
      // Se está em formato DD-MM-YYYY
      if (dateValue.includes('-') && dateValue.length === 10) {
        const parts = dateValue.split('-');
        if (parts[0].length === 2) {
          // DD-MM-YYYY
          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      }
      
      // Tentar validar a data
      const dateObj = new Date(dateValue);
      if (!isNaN(dateObj.getTime())) {
        return dateValue;
      }
      
      throw new Error('Invalid date format');
    } catch {
      // Se não conseguir converter, usar data atual
      return new Date().toISOString().split('T')[0];
    }
  };

  const handleImport = () => {
    if (previewData.length === 0) {
      return;
    }

    const itemsToImport: Omit<PatrimonyItem, 'id' | 'numeroChapa'>[] = previewData.map(row => ({
      name: row.name,
      category: 'Outros',
      location: location.trim(),
      acquisitionDate: row.acquisitionDate,
      value: 0,
      status: 'active' as const,
      description: `Importado do arquivo: ${file?.name}`,
      responsible: 'A definir'
    }));

    onImport(itemsToImport);
    
    // Reset form
    setFile(null);
    setLocation('');
    setPreviewData([]);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Importar Itens do Excel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Formato esperado:</strong><br/>
            • Coluna 1: Número da Chapa<br/>
            • Coluna 2: Data de Aquisição (DD/MM/YYYY, DD-MM-YYYY ou formato Excel)<br/>
            • Coluna 3: Nome do Item<br/>
            Arquivos suportados: .xlsx, .xls, .csv
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="file">Arquivo Excel/CSV</Label>
            <Input
              id="file"
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Localização</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Escritório - Sala 101"
              required
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={processFile} 
            disabled={!file || !location.trim() || isProcessing}
            variant="outline"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isProcessing ? 'Processando...' : 'Processar Arquivo'}
          </Button>

          {previewData.length > 0 && (
            <Button onClick={handleImport}>
              Importar {previewData.length} Itens
            </Button>
          )}
        </div>

        {previewData.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Pré-visualização ({previewData.length} itens)</h3>
            <div className="border rounded-lg overflow-hidden">
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left">Chapa</th>
                      <th className="px-4 py-2 text-left">Data Aquisição</th>
                      <th className="px-4 py-2 text-left">Nome do Item</th>
                      <th className="px-4 py-2 text-left">Localização</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">{row.numeroChapa}</td>
                        <td className="px-4 py-2">{row.acquisitionDate}</td>
                        <td className="px-4 py-2">{row.name}</td>
                        <td className="px-4 py-2">{location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
