
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PatrimonyItem } from "@/pages/Index";
import { toast } from "@/components/ui/use-toast";

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
          selectedFile.name.endsWith('.csv')) {
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
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        throw new Error('Arquivo vazio');
      }

      const parsedData: ExcelRow[] = [];
      
      // Skip header if it exists (check if first row contains non-numeric first column)
      const startIndex = isNaN(Number(lines[0].split(/[,;\t]/)[0])) ? 1 : 0;
      
      for (let i = startIndex; i < lines.length; i++) {
        const columns = lines[i].split(/[,;\t]/).map(col => col.trim().replace(/"/g, ''));
        
        if (columns.length >= 3) {
          const numeroChapa = parseInt(columns[0]);
          const acquisitionDate = columns[1];
          const name = columns[2];

          if (!isNaN(numeroChapa) && acquisitionDate && name) {
            // Try to parse the date in various formats
            let formattedDate = acquisitionDate;
            try {
              // If it's in DD/MM/YYYY format, convert to YYYY-MM-DD
              if (acquisitionDate.includes('/')) {
                const [day, month, year] = acquisitionDate.split('/');
                formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
              }
              // Validate the date
              const dateObj = new Date(formattedDate);
              if (isNaN(dateObj.getTime())) {
                throw new Error('Invalid date');
              }
            } catch {
              // If date parsing fails, use current date
              formattedDate = new Date().toISOString().split('T')[0];
            }

            parsedData.push({
              numeroChapa,
              acquisitionDate: formattedDate,
              name
            });
          }
        }
      }

      if (parsedData.length === 0) {
        throw new Error('Nenhum dado válido encontrado no arquivo');
      }

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

  const handleImport = () => {
    if (previewData.length === 0) {
      return;
    }

    const itemsToImport: Omit<PatrimonyItem, 'id' | 'numeroChapa'>[] = previewData.map(row => ({
      name: row.name,
      category: 'Outros', // Default category
      location: location.trim(),
      acquisitionDate: row.acquisitionDate,
      value: 0, // Default value
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
            • Coluna 2: Data de Aquisição (DD/MM/YYYY ou YYYY-MM-DD)<br/>
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
