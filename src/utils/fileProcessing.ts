
import * as XLSX from 'xlsx';

export interface ExcelRow {
  numeroChapa: number;
  acquisitionDate: string;
  name: string;
}

export const formatDate = (dateValue: string): string => {
  try {
    console.log('formatDate - Input value:', dateValue);
    
    // Se é uma data do Excel (número serial)
    if (!isNaN(Number(dateValue))) {
      const excelDate = XLSX.SSF.parse_date_code(Number(dateValue));
      if (excelDate) {
        const year = excelDate.y;
        const month = String(excelDate.m).padStart(2, '0');
        const day = String(excelDate.d).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        console.log('formatDate - Excel date converted:', formattedDate);
        return formattedDate;
      }
    }
    
    // Se está em formato DD/MM/YYYY ou DD/MM/YY
    if (dateValue.includes('/')) {
      const [day, month, year] = dateValue.split('/');
      let fullYear = year;
      
      // Converter anos de 2 dígitos para 4 dígitos
      if (year.length === 2) {
        const yearNum = parseInt(year);
        // Se for maior que 50, assume século passado (19xx), senão assume século atual (20xx)
        fullYear = yearNum > 50 ? `19${year}` : `20${year}`;
      }
      
      const formattedDate = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      console.log('formatDate - Slash date converted:', formattedDate);
      return formattedDate;
    }
    
    // Se está em formato DD-MM-YYYY ou DD-MM-YY
    if (dateValue.includes('-') && dateValue.length <= 10) {
      const parts = dateValue.split('-');
      if (parts.length === 3) {
        let [day, month, year] = parts;
        
        // Se o primeiro elemento tem 4 dígitos, é formato YYYY-MM-DD
        if (parts[0].length === 4) {
          [year, month, day] = parts;
        } else {
          // Converter anos de 2 dígitos para 4 dígitos
          if (year.length === 2) {
            const yearNum = parseInt(year);
            year = yearNum > 50 ? `19${year}` : `20${year}`;
          }
        }
        
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        console.log('formatDate - Dash date converted:', formattedDate);
        return formattedDate;
      }
    }
    
    // Tentar validar a data como está
    const dateObj = new Date(dateValue);
    if (!isNaN(dateObj.getTime())) {
      const formattedDate = dateObj.toISOString().split('T')[0];
      console.log('formatDate - Direct date converted:', formattedDate);
      return formattedDate;
    }
    
    throw new Error(`Invalid date format: ${dateValue}`);
  } catch (error) {
    console.error('formatDate - Error formatting date:', dateValue, error);
    // Se não conseguir converter, usar data atual
    const currentDate = new Date().toISOString().split('T')[0];
    console.log('formatDate - Using current date as fallback:', currentDate);
    return currentDate;
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
  const firstLine = lines[0].split(/[,;\t]/).map(col => col.trim().replace(/"/g, ''));
  const startIndex = isNaN(Number(firstLine[0])) ? 1 : 0;
  
  console.log('CSV - Primeira linha:', firstLine);
  console.log('CSV - Iniciando do índice:', startIndex);
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Detectar separador (vírgula, ponto e vírgula ou tab)
    let separator = ',';
    if (line.includes(';')) separator = ';';
    else if (line.includes('\t')) separator = '\t';
    
    const columns = line.split(separator).map(col => col.trim().replace(/^["']|["']$/g, ''));
    
    console.log(`CSV - Linha ${i + 1}:`, columns);
    
    if (columns.length >= 3) {
      const numeroChapa = parseInt(columns[0]);
      const acquisitionDate = columns[1];
      const name = columns[2];

      console.log(`CSV - Processando: Chapa=${numeroChapa}, Data=${acquisitionDate}, Nome=${name}`);

      if (!isNaN(numeroChapa) && acquisitionDate && name) {
        const formattedDate = formatDate(acquisitionDate);
        const processedRow = {
          numeroChapa,
          acquisitionDate: formattedDate,
          name: name.trim()
        };
        
        console.log('CSV - Item processado:', processedRow);
        parsedData.push(processedRow);
      } else {
        console.log(`CSV - Linha ${i + 1} ignorada: dados inválidos`);
      }
    } else {
      console.log(`CSV - Linha ${i + 1} ignorada: menos de 3 colunas`);
    }
  }

  console.log('CSV - Total de itens processados:', parsedData.length);
  return parsedData;
};

export const processExcelFile = async (file: File): Promise<ExcelRow[]> => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  
  // Pegar a primeira planilha
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  
  console.log('Excel - Nome da planilha:', firstSheetName);
  console.log('Excel - Worksheet:', worksheet);
  
  // Converter para JSON com cabeçalhos como array
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
    header: 1,
    defval: '',
    raw: false // Garantir que os valores sejam strings
  });
  
  console.log('Excel - Dados brutos:', jsonData);
  
  if (jsonData.length === 0) {
    throw new Error('Planilha vazia');
  }

  const parsedData: ExcelRow[] = [];

  // Determinar se há cabeçalho analisando a primeira linha
  const firstRow = jsonData[0] as any[];
  const hasHeader = firstRow.length >= 3 && isNaN(Number(firstRow[0]));
  const startIndex = hasHeader ? 1 : 0;
  
  console.log('Excel - Primeira linha:', firstRow);
  console.log('Excel - Tem cabeçalho:', hasHeader);
  console.log('Excel - Iniciando do índice:', startIndex);
  
  for (let i = startIndex; i < jsonData.length; i++) {
    const row = jsonData[i] as any[];
    
    console.log(`Excel - Linha ${i + 1}:`, row);
    
    // Verificar se a linha tem pelo menos 3 colunas e não está vazia
    if (row && row.length >= 3 && row[0] !== undefined && row[0] !== '' && row[1] !== undefined && row[2] !== undefined) {
      const numeroChapa = parseInt(String(row[0]).trim());
      const acquisitionDate = String(row[1]).trim();
      const name = String(row[2]).trim();

      console.log(`Excel - Processando: Chapa=${numeroChapa}, Data=${acquisitionDate}, Nome=${name}`);

      if (!isNaN(numeroChapa) && acquisitionDate && name) {
        const formattedDate = formatDate(acquisitionDate);
        const processedRow = {
          numeroChapa,
          acquisitionDate: formattedDate,
          name: name
        };
        
        console.log('Excel - Item processado:', processedRow);
        parsedData.push(processedRow);
      } else {
        console.log(`Excel - Linha ${i + 1} ignorada: dados inválidos`);
      }
    } else {
      console.log(`Excel - Linha ${i + 1} ignorada: linha vazia ou incompleta`);
    }
  }

  console.log('Excel - Total de itens processados:', parsedData.length);
  return parsedData;
};
