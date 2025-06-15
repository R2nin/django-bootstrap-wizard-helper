
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Book } from "lucide-react";
import jsPDF from 'jspdf';

export const SystemManual = () => {
  const generateManualPDF = () => {
    const pdf = new jsPDF();
    const currentDate = new Date().toLocaleDateString('pt-BR');

    // Configurações de estilo
    const titleSize = 18;
    const headerSize = 14;
    const subHeaderSize = 12;
    const bodySize = 10;
    let yPosition = 30;

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
      checkPageBreak(lines.length * (fontSize * 0.5));
      pdf.text(lines, 20, yPosition);
      yPosition += lines.length * (fontSize * 0.5) + 5;
    };

    // Capa
    pdf.setFontSize(titleSize);
    pdf.setFont('helvetica', 'bold');
    pdf.text('MANUAL DO USUÁRIO', 105, 30, { align: 'center' });
    pdf.text('SISTEMA DE GESTÃO PATRIMONIAL', 105, 50, { align: 'center' });
    
    pdf.setFontSize(bodySize);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Data de Geração: ${currentDate}`, 105, 250, { align: 'center' });
    
    pdf.addPage();
    yPosition = 30;

    // Índice
    addText('ÍNDICE', headerSize, true);
    yPosition += 5;
    addText('1. Introdução', bodySize);
    addText('2. Login no Sistema', bodySize);
    addText('3. Dashboard - Visão Geral', bodySize);
    addText('4. Gestão de Patrimônio', bodySize);
    addText('5. Importação de Itens', bodySize);
    addText('6. Gestão de Fornecedores', bodySize);
    addText('7. Relatórios e Logs', bodySize);
    addText('8. Gestão de Usuários (Apenas Administradores)', bodySize);
    addText('9. Configurações do Sistema', bodySize);
    addText('10. Suporte e Contato', bodySize);
    yPosition += 10;

    // 1. Introdução
    addText('1. INTRODUÇÃO', headerSize, true);
    addText('O Sistema de Gestão Patrimonial é uma ferramenta completa para controle e gerenciamento dos bens de uma organização. Este manual irá guiá-lo através de todas as funcionalidades disponíveis.', bodySize);
    
    addText('Funcionalidades Principais:', subHeaderSize, true);
    addText('• Cadastro e controle de itens patrimoniais', bodySize);
    addText('• Sistema de numeração automática de chapas', bodySize);
    addText('• Importação em massa via Excel/CSV', bodySize);
    addText('• Gestão de fornecedores e localizações', bodySize);
    addText('• Relatórios detalhados e logs de auditoria', bodySize);
    addText('• Controle de permissões por usuário', bodySize);
    yPosition += 10;

    // 2. Login no Sistema
    addText('2. LOGIN NO SISTEMA', headerSize, true);
    addText('Para acessar o sistema, utilize suas credenciais de login:', bodySize);
    addText('• Email: Seu endereço de email cadastrado', bodySize);
    addText('• Senha: Sua senha pessoal', bodySize);
    yPosition += 5;
    
    addText('Usuários de Demonstração:', subHeaderSize, true);
    addText('• Administrador: admin@empresa.com / admin123', bodySize);
    addText('• Usuário: user@empresa.com / user123', bodySize);
    yPosition += 10;

    // 3. Dashboard
    addText('3. DASHBOARD - VISÃO GERAL', headerSize, true);
    addText('O Dashboard é a tela inicial que apresenta:', bodySize);
    addText('• Estatísticas gerais do patrimônio', bodySize);
    addText('• Gráficos de distribuição por categoria', bodySize);
    addText('• Valor total dos bens', bodySize);
    addText('• Status dos itens (Ativo, Manutenção, Inativo)', bodySize);
    addText('• Ações rápidas para relatórios', bodySize);
    yPosition += 10;

    // 4. Gestão de Patrimônio
    addText('4. GESTÃO DE PATRIMÔNIO', headerSize, true);
    
    addText('4.1 Visualizar Itens', subHeaderSize, true);
    addText('Na aba "Patrimônio", você pode:', bodySize);
    addText('• Visualizar todos os itens cadastrados', bodySize);
    addText('• Filtrar por categoria, localização ou status', bodySize);
    addText('• Pesquisar por nome ou número da chapa', bodySize);
    addText('• Visualizar detalhes completos de cada item', bodySize);
    yPosition += 5;

    addText('4.2 Adicionar Novo Item', subHeaderSize, true);
    addText('Na aba "Editar Patrimônio":', bodySize);
    addText('• Preencha todos os campos obrigatórios', bodySize);
    addText('• O número da chapa pode ser automático ou manual', bodySize);
    addText('• Automático: Sistema gera o próximo número disponível', bodySize);
    addText('• Manual: Digite um número específico (deve ser único)', bodySize);
    addText('• Selecione categoria, localização e responsável', bodySize);
    addText('• Informe valor de aquisição e data', bodySize);
    yPosition += 5;

    addText('4.3 Editar Item Existente', subHeaderSize, true);
    addText('• Na listagem, clique no botão "Editar" do item desejado', bodySize);
    addText('• Modifique os campos necessários', bodySize);
    addText('• Clique em "Atualizar Item" para salvar', bodySize);
    yPosition += 5;

    addText('4.4 Excluir Item (Apenas Administradores)', subHeaderSize, true);
    addText('• Na listagem, clique no botão "Deletar"', bodySize);
    addText('• Confirme a exclusão (ação irreversível)', bodySize);
    yPosition += 10;

    // 5. Importação
    addText('5. IMPORTAÇÃO DE ITENS', headerSize, true);
    addText('Na aba "Acrescentar Item", você pode importar múltiplos itens:', bodySize);
    addText('• Formatos aceitos: .xlsx, .xls, .csv', bodySize);
    addText('• Estrutura do arquivo:', bodySize);
    addText('  - Coluna 1: Número da Chapa', bodySize);
    addText('  - Coluna 2: Data de Aquisição (DD/MM/YYYY)', bodySize);
    addText('  - Coluna 3: Nome do Item', bodySize);
    addText('• Faça upload do arquivo e visualize o preview', bodySize);
    addText('• Confirme a importação para adicionar os itens', bodySize);
    yPosition += 10;

    // 6. Fornecedores
    addText('6. GESTÃO DE FORNECEDORES', headerSize, true);
    addText('• Visualize todos os fornecedores cadastrados', bodySize);
    addText('• Adicione novos fornecedores com dados completos', bodySize);
    addText('• Edite informações de fornecedores existentes', bodySize);
    addText('• Vincule fornecedores aos itens patrimoniais', bodySize);
    yPosition += 10;

    // 7. Relatórios e Logs
    addText('7. RELATÓRIOS E LOGS', headerSize, true);
    
    addText('7.1 Relatórios de Patrimônio', subHeaderSize, true);
    addText('• Acesse através do Dashboard', bodySize);
    addText('• Filtre por localização específica', bodySize);
    addText('• Visualize preview antes de gerar PDF', bodySize);
    addText('• Inclui resumo executivo e listagem detalhada', bodySize);
    yPosition += 5;

    addText('7.2 Logs do Sistema', subHeaderSize, true);
    addText('Na aba "Logs", visualize:', bodySize);
    addText('• Todas as ações realizadas no sistema', bodySize);
    addText('• Quem fez cada ação e quando', bodySize);
    addText('• Detalhes das modificações', bodySize);
    addText('• Histórico completo para auditoria', bodySize);
    yPosition += 10;

    // 8. Gestão de Usuários
    addText('8. GESTÃO DE USUÁRIOS (APENAS ADMINISTRADORES)', headerSize, true);
    addText('• Visualizar todos os usuários do sistema', bodySize);
    addText('• Adicionar novos usuários com diferentes perfis', bodySize);
    addText('• Definir permissões (Admin ou User)', bodySize);
    addText('• Remover usuários quando necessário', bodySize);
    yPosition += 5;

    addText('Tipos de Usuário:', subHeaderSize, true);
    addText('• Admin: Acesso completo a todas as funcionalidades', bodySize);
    addText('• User: Pode visualizar e editar, mas não deletar', bodySize);
    yPosition += 10;

    // 9. Configurações
    addText('9. CONFIGURAÇÕES DO SISTEMA', headerSize, true);
    addText('• Adicionar novas localizações através do cabeçalho', bodySize);
    addText('• Definir responsáveis para cada localização', bodySize);
    addText('• Configurar categorias de itens', bodySize);
    addText('• Gerenciar dados através do localStorage', bodySize);
    yPosition += 10;

    // 10. Suporte
    addText('10. SUPORTE E CONTATO', headerSize, true);
    addText('Em caso de dúvidas ou problemas:', bodySize);
    addText('• Consulte os logs do sistema para diagnóstico', bodySize);
    addText('• Verifique as permissões do seu usuário', bodySize);
    addText('• Entre em contato com o administrador do sistema', bodySize);
    addText('• Mantenha sempre backup dos dados importantes', bodySize);
    yPosition += 10;

    addText('Dicas Importantes:', subHeaderSize, true);
    addText('• Use numeração sequencial para melhor organização', bodySize);
    addText('• Mantenha os dados sempre atualizados', bodySize);
    addText('• Realize backups regulares', bodySize);
    addText('• Monitore os logs para detectar problemas', bodySize);

    // Salvar PDF
    pdf.save(`manual-sistema-patrimonio-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-6 w-6" />
            Manual do Sistema de Gestão Patrimonial
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Este manual contém instruções completas sobre como utilizar todas as funcionalidades 
              do Sistema de Gestão Patrimonial. Ideal para novos usuários e referência rápida.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">O que está incluído:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Instruções de login e navegação</li>
                  <li>• Gestão completa de patrimônio</li>
                  <li>• Importação de dados via Excel</li>
                  <li>• Geração de relatórios</li>
                  <li>• Controle de usuários e permissões</li>
                  <li>• Dicas e boas práticas</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Características:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Formato PDF para fácil impressão</li>
                  <li>• Índice organizado por seções</li>
                  <li>• Instruções passo a passo</li>
                  <li>• Exemplos práticos</li>
                  <li>• Informações de suporte</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={generateManualPDF} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Baixar Manual Completo (PDF)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Acesso Rápido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Novos Usuários</h4>
              <p className="text-sm text-gray-600 mb-3">
                Comece pelo login e dashboard para se familiarizar com o sistema.
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Gestão Diária</h4>
              <p className="text-sm text-gray-600 mb-3">
                Use as seções de patrimônio e fornecedores para operações do dia a dia.
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Administradores</h4>
              <p className="text-sm text-gray-600 mb-3">
                Explore todas as funcionalidades incluindo gestão de usuários e logs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
