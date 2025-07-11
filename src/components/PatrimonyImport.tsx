
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileSpreadsheet } from "lucide-react";
import { PatrimonyItem } from "@/pages/Index";
import { toast } from "@/components/ui/use-toast";
import { ExcelRow, processCSVFile, processExcelFile } from "@/utils/fileProcessing";
import { FileUploadSection } from "./import/FileUploadSection";
import { ImportPreview } from "./import/ImportPreview";
import { ImportInstructions } from "./import/ImportInstructions";

interface PatrimonyImportProps {
  onImport: (items: PatrimonyItem[]) => void;
}

export const PatrimonyImport = ({ onImport }: PatrimonyImportProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [location, setLocation] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [previewData, setPreviewData] = useState<ExcelRow[]>([]);

  const processFile = async () => {
    console.log('PatrimonyImport - Starting file processing');
    console.log('PatrimonyImport - File:', file?.name);
    console.log('PatrimonyImport - Location:', location);

    if (!file || !location.trim()) {
      console.log('PatrimonyImport - Missing file or location');
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

      console.log('PatrimonyImport - Processing file type:', file.type);
      
      if (file.name.endsWith('.csv')) {
        console.log('PatrimonyImport - Processing CSV file');
        parsedData = await processCSVFile(file);
      } else {
        console.log('PatrimonyImport - Processing Excel file');
        parsedData = await processExcelFile(file);
      }

      console.log('PatrimonyImport - Parsed data length:', parsedData.length);
      console.log('PatrimonyImport - First 3 parsed items:', parsedData.slice(0, 3));

      if (parsedData.length === 0) {
        throw new Error('Nenhum dado válido encontrado no arquivo');
      }

      setPreviewData(parsedData);
      
      toast({
        title: "Arquivo processado!",
        description: `${parsedData.length} itens encontrados para importação.`,
      });
      
    } catch (error) {
      console.error('PatrimonyImport - Error processing file:', error);
      toast({
        title: "Erro ao processar arquivo",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    console.log('PatrimonyImport - Starting import process');
    console.log('PatrimonyImport - Preview data length:', previewData.length);

    if (previewData.length === 0) {
      console.log('PatrimonyImport - No items to import');
      toast({
        title: "Erro",
        description: "Nenhum item para importar. Processe um arquivo primeiro.",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);

    try {
      // Criar os itens com todos os campos obrigatórios
      const itemsToImport: PatrimonyItem[] = previewData.map((row, index) => {
        console.log(`PatrimonyImport - Processing row ${index + 1}:`, row);
        
        const item: PatrimonyItem = {
          id: '', // Será gerado pelo Supabase
          numeroChapa: row.numeroChapa,
          name: row.name.trim(),
          category: 'Outros',
          location: location.trim(),
          acquisitionDate: row.acquisitionDate,
          value: 0,
          status: 'active' as const,
          description: `Importado do arquivo: ${file?.name || 'arquivo'}`,
          responsible: 'A definir'
        };
        
        console.log(`PatrimonyImport - Item ${index + 1} created:`, item);
        return item;
      });

      console.log('PatrimonyImport - Total items to import:', itemsToImport.length);
      console.log('PatrimonyImport - Calling onImport...');
      
      // Chamar a função onImport passada como prop
      await onImport(itemsToImport);
      
      console.log('PatrimonyImport - Import completed successfully');
      
      // Reset form após importação bem-sucedida
      setFile(null);
      setLocation('');
      setPreviewData([]);
      
      toast({
        title: "Sucesso!",
        description: `${itemsToImport.length} itens importados com sucesso.`,
      });
      
    } catch (error) {
      console.error('PatrimonyImport - Error during import:', error);
      
      let errorMessage = "Ocorreu um erro ao importar os itens. Tente novamente.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Tratar erros específicos
        if (error.message.includes('duplicate key')) {
          errorMessage = "Alguns números de chapa já existem no sistema. Verifique os dados.";
        } else if (error.message.includes('date/time field value out of range')) {
          errorMessage = "Algumas datas estão em formato inválido. Verifique as datas no arquivo.";
        } else if (error.message.includes('chapas já existem')) {
          errorMessage = error.message; // Usar a mensagem específica sobre chapas duplicadas
        }
      }
      
      toast({
        title: "Erro na importação",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
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
        <ImportInstructions />

        <FileUploadSection
          file={file}
          location={location}
          onFileChange={setFile}
          onLocationChange={setLocation}
        />

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
            <Button 
              onClick={handleImport}
              disabled={isImporting}
            >
              {isImporting ? 'Importando...' : `Importar ${previewData.length} Itens`}
            </Button>
          )}
        </div>

        <ImportPreview previewData={previewData} location={location} />
      </CardContent>
    </Card>
  );
};
