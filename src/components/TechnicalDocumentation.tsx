
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Code, FileText } from "lucide-react";
import jsPDF from 'jspdf';

export const TechnicalDocumentation = () => {
  const generateTechnicalPDF = () => {
    const pdf = new jsPDF();
    const currentDate = new Date().toLocaleDateString('pt-BR');

    // Configurações de estilo
    const titleSize = 16;
    const headerSize = 12;
    const subHeaderSize = 10;
    const bodySize = 8;
    let yPosition = 20;

    // Função para adicionar nova página se necessário
    const checkPageBreak = (addHeight: number) => {
      if (yPosition + addHeight > 280) {
        pdf.addPage();
        yPosition = 20;
      }
    };

    // Função para adicionar texto com quebra de linha
    const addText = (text: string, fontSize: number, isBold = false) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      const lines = pdf.splitTextToSize(text, 170);
      checkPageBreak(lines.length * (fontSize * 0.4));
      pdf.text(lines, 20, yPosition);
      yPosition += lines.length * (fontSize * 0.4) + 3;
    };

    // Capa
    pdf.setFontSize(titleSize);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DOCUMENTAÇÃO TÉCNICA', 105, 30, { align: 'center' });
    pdf.text('SISTEMA DE GESTÃO PATRIMONIAL', 105, 45, { align: 'center' });
    
    pdf.setFontSize(bodySize);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Gerado em: ${currentDate}`, 105, 260, { align: 'center' });
    
    pdf.addPage();
    yPosition = 20;

    // Índice
    addText('ÍNDICE', headerSize, true);
    yPosition += 3;
    addText('1. Arquitetura Geral do Sistema', bodySize);
    addText('2. Hooks de Dados (Data Layer)', bodySize);
    addText('3. Componentes Principais', bodySize);
    addText('4. Sistema de Autenticação', bodySize);
    addText('5. Gerenciamento de Estado', bodySize);
    addText('6. Tipos e Interfaces', bodySize);
    addText('7. Utilitários e Helpers', bodySize);
    addText('8. Fluxo de Dados', bodySize);
    yPosition += 8;

    // 1. Arquitetura Geral
    addText('1. ARQUITETURA GERAL DO SISTEMA', headerSize, true);
    addText('O sistema segue uma arquitetura React moderna com separação clara de responsabilidades:', bodySize);
    yPosition += 2;
    
    addText('Estrutura de Pastas:', subHeaderSize, true);
    addText('• /src/components/ - Componentes React reutilizáveis', bodySize);
    addText('• /src/hooks/ - Custom hooks para lógica de estado', bodySize);
    addText('• /src/contexts/ - Context providers para estado global', bodySize);
    addText('• /src/types/ - Definições TypeScript', bodySize);
    addText('• /src/utils/ - Funções utilitárias', bodySize);
    addText('• /src/pages/ - Páginas principais da aplicação', bodySize);
    yPosition += 5;

    // 2. Hooks de Dados
    addText('2. HOOKS DE DADOS (DATA LAYER)', headerSize, true);
    
    addText('usePatrimonyData.ts', subHeaderSize, true);
    addText('Hook principal para gerenciamento de itens patrimoniais:', bodySize);
    addText('• Funcões: addItem(), addItemWithChapa(), updateItem(), deleteItem(), addMultipleItems()', bodySize);
    addText('• Persiste dados no localStorage com chave "patrimony-items"', bodySize);
    addText('• Gera IDs únicos usando timestamp + random', bodySize);
    addText('• Calcula próximo número de chapa automaticamente', bodySize);
    addText('• Valida numeração para evitar duplicatas', bodySize);
    yPosition += 3;

    addText('useUserData.ts', subHeaderSize, true);
    addText('Gerencia usuários do sistema:', bodySize);
    addText('• Funções: addUser(), deleteUser()', bodySize);
    addText('• Inclui usuários padrão (admin@empresa.com, user@empresa.com)', bodySize);
    addText('• Suporte a roles: admin, user', bodySize);
    yPosition += 3;

    addText('useLogData.ts', subHeaderSize, true);
    addText('Sistema de auditoria e logs:', bodySize);
    addText('• Função: addLog(action, entity, details, userId, userName)', bodySize);
    addText('• Registra todas as ações do sistema com timestamp', bodySize);
    addText('• Tipos: CREATE, UPDATE, DELETE, LOGIN', bodySize);
    yPosition += 3;

    addText('useSupplierData.ts', subHeaderSize, true);
    addText('Gerenciamento de fornecedores:', bodySize);
    addText('• Funções: addSupplier(), updateSupplier(), deleteSupplier()', bodySize);
    addText('• Armazena dados completos incluindo CNPJ, contato, endereço', bodySize);
    yPosition += 3;

    addText('useLocationData.ts', subHeaderSize, true);
    addText('Controle de localizações:', bodySize);
    addText('• Funções: addLocation(), deleteLocation()', bodySize);
    addText('• Vincula responsáveis às localizações', bodySize);
    yPosition += 5;

    // 3. Componentes Principais
    addText('3. COMPONENTES PRINCIPAIS', headerSize, true);
    
    addText('MainApp.tsx', subHeaderSize, true);
    addText('Componente raiz da aplicação:', bodySize);
    addText('• Gerencia estado global e navegação entre abas', bodySize);
    addText('• Controla permissões por role de usuário', bodySize);
    addText('• Centraliza handlers para todas as operações CRUD', bodySize);
    addText('• Renderização condicional baseada em permissões', bodySize);
    yPosition += 3;

    addText('Navigation.tsx', subHeaderSize, true);
    addText('Sistema de navegação com controle de acesso:', bodySize);
    addText('• Abas dinâmicas baseadas em permissões do usuário', bodySize);
    addText('• Dashboard, Patrimônio, Importação, Usuários, Logs', bodySize);
    yPosition += 3;

    addText('PatrimonyForm.tsx', subHeaderSize, true);
    addText('Formulário de criação/edição de itens:', bodySize);
    addText('• Suporte a numeração automática e manual', bodySize);
    addText('• Validação de campos obrigatórios', bodySize);
    addText('• Integração com fornecedores e localizações', bodySize);
    yPosition += 3;

    addText('PatrimonyList.tsx', subHeaderSize, true);
    addText('Listagem e visualização de itens:', bodySize);
    addText('• Tabela responsiva com paginação', bodySize);
    addText('• Filtros por categoria, localização, status', bodySize);
    addText('• Ações de editar/deletar com controle de permissão', bodySize);
    yPosition += 3;

    addText('PatrimonyImport.tsx', subHeaderSize, true);
    addText('Sistema de importação de arquivos:', bodySize);
    addText('• Suporte a Excel (.xlsx, .xls) e CSV', bodySize);
    addText('• Preview dos dados antes da importação', bodySize);
    addText('• Processamento em lote com validação', bodySize);
    yPosition += 5;

    // 4. Sistema de Autenticação
    addText('4. SISTEMA DE AUTENTICAÇÃO', headerSize, true);
    
    addText('AuthContext.tsx', subHeaderSize, true);
    addText('Context Provider para autenticação:', bodySize);
    addText('• Gerencia usuário logado e sessão', bodySize);
    addText('• Funções: login(), logout(), hasPermission()', bodySize);
    addText('• Verificação automática se usuário ainda existe', bodySize);
    yPosition += 3;

    addText('Hierarquia de Permissões:', subHeaderSize, true);
    addText('• Admin: Acesso total (view, edit, delete, admin)', bodySize);
    addText('• User: Visualizar e editar (view, edit)', bodySize);
    addText('• Futuro: Viewer apenas para visualização', bodySize);
    yPosition += 5;

    // 5. Gerenciamento de Estado
    addText('5. GERENCIAMENTO DE ESTADO', headerSize, true);
    addText('O sistema usa uma combinação de estratégias:', bodySize);
    yPosition += 2;
    
    addText('localStorage para Persistência:', subHeaderSize, true);
    addText('• patrimony-items: Itens patrimoniais', bodySize);
    addText('• users: Usuários do sistema', bodySize);
    addText('• suppliers: Fornecedores', bodySize);
    addText('• locations: Localizações', bodySize);
    addText('• logs: Logs de auditoria', bodySize);
    yPosition += 3;

    addText('React State para UI:', subHeaderSize, true);
    addText('• useState para estados locais de componentes', bodySize);
    addText('• Context API para estado global de autenticação', bodySize);
    addText('• Custom hooks para encapsular lógica de dados', bodySize);
    yPosition += 5;

    // 6. Tipos e Interfaces
    addText('6. TIPOS E INTERFACES', headerSize, true);
    
    addText('PatrimonyItem (types/log.ts):', subHeaderSize, true);
    addText('• id: string, numeroChapa: number, name: string', bodySize);
    addText('• category: string, location: string, status: string', bodySize);
    addText('• acquisitionDate: string, value: number', bodySize);
    addText('• description: string, responsible: string', bodySize);
    yPosition += 3;

    addText('UserWithRole (types/log.ts):', subHeaderSize, true);
    addText('• Estende User com campo role: "admin" | "user"', bodySize);
    addText('• Inclui fullName, email, password, createdAt', bodySize);
    yPosition += 3;

    addText('LogEntry (types/log.ts):', subHeaderSize, true);
    addText('• Sistema de auditoria com action, entity, timestamp', bodySize);
    addText('• Rastreamento de usuário e detalhes da operação', bodySize);
    yPosition += 3;

    addText('Supplier (types/supplier.ts):', subHeaderSize, true);
    addText('• Dados completos: CNPJ, endereço, contato', bodySize);
    addText('• Integração com itens patrimoniais', bodySize);
    yPosition += 5;

    // 7. Utilitários
    addText('7. UTILITÁRIOS E HELPERS', headerSize, true);
    
    addText('localStorage.ts', subHeaderSize, true);
    addText('Wrapper para operações do localStorage:', bodySize);
    addText('• Funções: get(), set(), add(), delete()', bodySize);
    addText('• Tratamento de erros e parsing JSON automático', bodySize);
    yPosition += 3;

    addText('fileProcessing.ts', subHeaderSize, true);
    addText('Processamento de arquivos Excel/CSV:', bodySize);
    addText('• Função: processFile() retorna array de itens', bodySize);
    addText('• Suporte a múltiplos formatos e separadores', bodySize);
    addText('• Parsing inteligente de datas e números', bodySize);
    yPosition += 5;

    // 8. Fluxo de Dados
    addText('8. FLUXO DE DADOS', headerSize, true);
    
    addText('Criação de Item:', subHeaderSize, true);
    addText('1. PatrimonyForm coleta dados do usuário', bodySize);
    addText('2. MainApp.handleAddItem() chama usePatrimonyData.addItem()', bodySize);
    addText('3. Hook gera ID único e próximo número de chapa', bodySize);
    addText('4. Salva no localStorage e atualiza estado React', bodySize);
    addText('5. Registra ação no log via useLogData.addLog()', bodySize);
    addText('6. Exibe toast de sucesso e redireciona para listagem', bodySize);
    yPosition += 3;

    addText('Importação de Arquivo:', subHeaderSize, true);
    addText('1. PatrimonyImport processa arquivo via fileProcessing.ts', bodySize);
    addText('2. Mostra preview dos dados para validação', bodySize);
    addText('3. MainApp.handleImportItems() usa addMultipleItems()', bodySize);
    addText('4. Processa todos os itens em lote evitando duplicatas', bodySize);
    addText('5. Registra logs individuais para cada item importado', bodySize);
    yPosition += 3;

    addText('Sistema de Permissões:', subHeaderSize, true);
    addText('1. AuthContext valida credenciais no login', bodySize);
    addText('2. MainApp.hasPermission() verifica role do usuário', bodySize);
    addText('3. Componentes renderizam condicionalmente baseado em permissões', bodySize);
    addText('4. Navigation oculta abas não permitidas para o usuário', bodySize);
    yPosition += 5;

    addText('CONSIDERAÇÕES TÉCNICAS:', subHeaderSize, true);
    addText('• Sistema totalmente client-side usando localStorage', bodySize);
    addText('• TypeScript para type safety em toda aplicação', bodySize);
    addText('• Tailwind CSS para estilização responsiva', bodySize);
    addText('• Shadcn/ui para componentes consistentes', bodySize);
    addText('• jsPDF para geração de relatórios', bodySize);
    addText('• xlsx para processamento de planilhas', bodySize);
    addText('• React Router para navegação (futuro)', bodySize);

    // Salvar PDF
    pdf.save(`documentacao-tecnica-patrimonio-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-6 w-6" />
            Documentação Técnica do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Documentação técnica completa do código fonte do Sistema de Gestão Patrimonial, 
              incluindo arquitetura, componentes, hooks e fluxo de dados.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Conteúdo Técnico:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Arquitetura geral do sistema</li>
                  <li>• Documentação de todos os hooks</li>
                  <li>• Descrição dos componentes principais</li>
                  <li>• Sistema de autenticação e permissões</li>
                  <li>• Fluxo de dados e estado</li>
                  <li>• Tipos e interfaces TypeScript</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Para Desenvolvedores:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Explicação simplificada do código</li>
                  <li>• Padrões e convenções utilizadas</li>
                  <li>• Estrutura de pastas e organização</li>
                  <li>• Tecnologias e bibliotecas usadas</li>
                  <li>• Considerações de manutenção</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={generateTechnicalPDF} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Baixar Documentação Técnica (PDF)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Resumo da Arquitetura
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Frontend</h4>
              <p className="text-sm text-gray-600">
                React + TypeScript + Tailwind CSS + Shadcn/ui para interface moderna e responsiva.
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Estado</h4>
              <p className="text-sm text-gray-600">
                Custom hooks + Context API + localStorage para persistência de dados.
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Funcionalidades</h4>
              <p className="text-sm text-gray-600">
                CRUD completo, importação Excel, relatórios PDF e sistema de permissões.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
