
import * as XLSX from 'xlsx';

export interface ExcelRow {
  numeroChapa: number;
  acquisitionDate: string;
  name: string;
}

export const formatDate = (dateValue: string): string => {
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

export const processCSVFile = async (file: File): Promise<ExcelRow[]> => {
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
        const formattedDate = formatDate(acquisitionDate);
        parsedData.push({
          numeroChapa,
          acquisitionDate: formattedDate,
          name
        });
      }
    }
  }

  return parsedData;
};

export const processExcelFile = async (file: File): Promise<ExcelRow[]> => {
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

  const parsedData: ExcelRow[] = [];

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
        const formattedDate = formatDate(acquisitionDate);
        parsedData.push({
          numeroChapa,
          acquisitionDate: formattedDate,
          name: name.trim()
        });
      }
    }
  }

  return parsedData;
};
