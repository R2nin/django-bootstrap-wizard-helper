
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

interface FileUploadSectionProps {
  file: File | null;
  location: string;
  onFileChange: (file: File | null) => void;
  onLocationChange: (location: string) => void;
}

export const FileUploadSection = ({ file, location, onFileChange, onLocationChange }: FileUploadSectionProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/vnd.ms-excel' || 
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          selectedFile.name.endsWith('.csv') ||
          selectedFile.name.endsWith('.xlsx') ||
          selectedFile.name.endsWith('.xls')) {
        onFileChange(selectedFile);
      } else {
        toast({
          title: "Erro",
          description: "Por favor, selecione um arquivo Excel (.xlsx, .xls) ou CSV.",
          variant: "destructive"
        });
      }
    }
  };

  return (
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
          onChange={(e) => onLocationChange(e.target.value)}
          placeholder="Ex: Escritório - Sala 101"
          required
        />
      </div>
    </div>
  );
};
