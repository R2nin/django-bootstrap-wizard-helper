
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const ImportInstructions = () => {
  return (
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
  );
};
