
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileSpreadsheet, Upload, GitCompare } from "lucide-react";
import { PatrimonyItem } from "@/pages/Index";
import { toast } from "@/components/ui/use-toast";
import { processExcelFile, processCSVFile, ExcelRow } from "@/utils/fileProcessing";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ComparisonResult {
  onlyInFile1: PatrimonyItem[];
  onlyInFile2: PatrimonyItem[];
  different: {
    item1: PatrimonyItem;
    item2: PatrimonyItem;
    differences: string[];
  }[];
  common: PatrimonyItem[];
}

export const PatrimonyComparison = () => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);

  const handleFileChange = (fileNumber: 1 | 2) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/vnd.ms-excel' || 
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          selectedFile.name.endsWith('.csv') ||
          selectedFile.name.endsWith('.xlsx') ||
          selectedFile.name.endsWith('.xls')) {
        if (fileNumber === 1) {
          setFile1(selectedFile);
        } else {
          setFile2(selectedFile);
        }
      } else {
        toast({
          title: "Erro",
          description: "Por favor, selecione um arquivo Excel (.xlsx, .xls) ou CSV.",
          variant: "destructive"
        });
      }
    }
  };

  const processFile = async (file: File): Promise<PatrimonyItem[]> => {
    let parsedData: ExcelRow[] = [];

    if (file.name.endsWith('.csv')) {
      parsedData = await processCSVFile(file);
    } else {
      parsedData = await processExcelFile(file);
    }

    return parsedData.map(row => ({
      id: '',
      numeroChapa: row.numeroChapa,
      name: row.name,
      category: 'Outros',
      location: 'A definir',
      acquisitionDate: row.acquisitionDate,
      value: 0,
      status: 'active' as const,
      description: `Importado do arquivo: ${file.name}`,
      responsible: 'A definir'
    }));
  };

  const compareItems = (items1: PatrimonyItem[], items2: PatrimonyItem[]): ComparisonResult => {
    const map1 = new Map(items1.map(item => [item.numeroChapa, item]));
    const map2 = new Map(items2.map(item => [item.numeroChapa, item]));

    const onlyInFile1: PatrimonyItem[] = [];
    const onlyInFile2: PatrimonyItem[] = [];
    const different: ComparisonResult['different'] = [];
    const common: PatrimonyItem[] = [];

    // Itens apenas no arquivo 1
    items1.forEach(item => {
      if (!map2.has(item.numeroChapa)) {
        onlyInFile1.push(item);
      }
    });

    // Itens apenas no arquivo 2
    items2.forEach(item => {
      if (!map1.has(item.numeroChapa)) {
        onlyInFile2.push(item);
      }
    });

    // Itens em ambos os arquivos - verificar diferenças
    items1.forEach(item1 => {
      const item2 = map2.get(item1.numeroChapa);
      if (item2) {
        const differences: string[] = [];
        
        if (item1.name !== item2.name) {
          differences.push(`Nome: "${item1.name}" vs "${item2.name}"`);
        }
        if (item1.acquisitionDate !== item2.acquisitionDate) {
          differences.push(`Data: "${item1.acquisitionDate}" vs "${item2.acquisitionDate}"`);
        }
        if (item1.location !== item2.location) {
          differences.push(`Localização: "${item1.location}" vs "${item2.location}"`);
        }
        if (item1.responsible !== item2.responsible) {
          differences.push(`Responsável: "${item1.responsible}" vs "${item2.responsible}"`);
        }

        if (differences.length > 0) {
          different.push({ item1, item2, differences });
        } else {
          common.push(item1);
        }
      }
    });

    return { onlyInFile1, onlyInFile2, different, common };
  };

  const handleCompare = async () => {
    if (!file1 || !file2) {
      toast({
        title: "Erro",
        description: "Por favor, selecione ambos os arquivos para comparação.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      console.log('Processando arquivos para comparação...');
      
      const items1 = await processFile(file1);
      const items2 = await processFile(file2);

      console.log(`Arquivo 1: ${items1.length} itens`);
      console.log(`Arquivo 2: ${items2.length} itens`);

      const result = compareItems(items1, items2);
      setComparisonResult(result);

      toast({
        title: "Comparação concluída!",
        description: `Encontradas ${result.onlyInFile1.length + result.onlyInFile2.length + result.different.length} diferenças`,
      });

    } catch (error) {
      console.error('Erro na comparação:', error);
      toast({
        title: "Erro na comparação",
        description: "Ocorreu um erro ao comparar os arquivos. Verifique o formato dos arquivos.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetComparison = () => {
    setFile1(null);
    setFile2(null);
    setComparisonResult(null);
  };

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCompare className="h-5 w-5" />
          Comparação de Patrimônios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!comparisonResult ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="file1">Arquivo 1 (Excel/CSV)</Label>
                <Input
                  id="file1"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange(1)}
                />
                {file1 && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <FileSpreadsheet className="h-4 w-4" />
                    {file1.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="file2">Arquivo 2 (Excel/CSV)</Label>
                <Input
                  id="file2"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange(2)}
                />
                {file2 && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <FileSpreadsheet className="h-4 w-4" />
                    {file2.name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleCompare} 
                disabled={!file1 || !file2 || isProcessing}
                className="flex-1"
              >
                <GitCompare className="h-4 w-4 mr-2" />
                {isProcessing ? 'Comparando...' : 'Comparar Arquivos'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Resultado da Comparação</h3>
              <Button onClick={resetComparison} variant="outline">
                Nova Comparação
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Apenas no Arquivo 1</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="destructive" className="text-lg">
                    {comparisonResult.onlyInFile1.length}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Apenas no Arquivo 2</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="destructive" className="text-lg">
                    {comparisonResult.onlyInFile2.length}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Diferenças</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="text-lg">
                    {comparisonResult.different.length}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Idênticos</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="default" className="text-lg">
                    {comparisonResult.common.length}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {comparisonResult.onlyInFile1.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-red-600">
                    Itens apenas no Arquivo 1 ({file1?.name})
                  </h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Chapa</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comparisonResult.onlyInFile1.map(item => (
                        <TableRow key={item.numeroChapa}>
                          <TableCell>{item.numeroChapa}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.acquisitionDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {comparisonResult.onlyInFile2.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-red-600">
                    Itens apenas no Arquivo 2 ({file2?.name})
                  </h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Chapa</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comparisonResult.onlyInFile2.map(item => (
                        <TableRow key={item.numeroChapa}>
                          <TableCell>{item.numeroChapa}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.acquisitionDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {comparisonResult.different.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-yellow-600">
                    Itens com Diferenças
                  </h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Chapa</TableHead>
                        <TableHead>Diferenças</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comparisonResult.different.map(({ item1, differences }) => (
                        <TableRow key={item1.numeroChapa}>
                          <TableCell>{item1.numeroChapa}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {differences.map((diff, index) => (
                                <Badge key={index} variant="outline" className="block">
                                  {diff}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
