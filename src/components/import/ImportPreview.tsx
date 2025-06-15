
import { ExcelRow } from "@/utils/fileProcessing";

interface ImportPreviewProps {
  previewData: ExcelRow[];
  location: string;
}

export const ImportPreview = ({ previewData, location }: ImportPreviewProps) => {
  if (previewData.length === 0) return null;

  return (
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
  );
};
