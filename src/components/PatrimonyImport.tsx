
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
  const [previewData, setPreviewData] = useState<ExcelRow[]>([]);

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
        parsedData = await processCSVFile(file);
      } else {
        parsedData = await processExcelFile(file);
      }

      if (parsedData.length === 0) {
        throw new Error('Nenhum dado válido encontrado no arquivo');
      }

      console.log('Dados processados:', parsedData);
      setPreviewData(parsedData);
      
      toast({
        title: "Arquivo processado!",
        description: `${parsedData.length} itens encontrados para importação.`,
      });
      
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

  const handleImport = async () => {
    if (previewData.length === 0) {
      toast({
        title: "Erro",
        description: "Nenhum item para importar. Processe um arquivo primeiro.",
        variant: "destructive"
      });
      return;
    }

    try {
      const itemsToImport: PatrimonyItem[] = previewData.map(row => ({
        id: '', // Será gerado pelo Supabase
        numeroChapa: row.numeroChapa,
        name: row.name,
        category: 'Outros',
        location: location.trim(),
        acquisitionDate: row.acquisitionDate,
        value: 0,
        status: 'active' as const,
        description: `Importado do arquivo: ${file?.name}`,
        responsible: 'A definir'
      }));

      console.log('PatrimonyImport - Itens para importar:', itemsToImport);
      
      // Chamar a função onImport passada como prop
      await onImport(itemsToImport);
      
      // Reset form após importação bem-sucedida
      setFile(null);
      setLocation('');
      setPreviewData([]);
      
    } catch (error) {
      console.error('Erro na importação:', error);
      toast({
        title: "Erro na importação",
        description: "Ocorreu um erro ao importar os itens. Tente novamente.",
        variant: "destructive"
      });
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
            <Button onClick={handleImport}>
              Importar {previewData.length} Itens
            </Button>
          )}
        </div>

        <ImportPreview previewData={previewData} location={location} />
      </CardContent>
    </Card>
  );
};
