
import { FunctionComponent } from 'react';

interface NavigationProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  userRole: 'admin' | 'user';
}

export const Navigation: FunctionComponent<NavigationProps> = ({ currentSection, onSectionChange, userRole }) => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          <button
            onClick={() => onSectionChange('dashboard')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              currentSection === 'dashboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => onSectionChange('patrimony-list')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              currentSection === 'patrimony-list'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Patrimônio
          </button>

          {userRole === 'admin' && (
            <>
              <button
                onClick={() => onSectionChange('patrimony-form')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  currentSection === 'patrimony-form'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Adicionar Patrimônio
              </button>

              <button
                onClick={() => onSectionChange('patrimony-import')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  currentSection === 'patrimony-import'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Importar Itens
              </button>

              <button
                onClick={() => onSectionChange('patrimony-comparison')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  currentSection === 'patrimony-comparison'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Comparar Arquivos
              </button>
            </>
          )}

          <button
            onClick={() => onSectionChange('supplier-list')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              currentSection === 'supplier-list'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Fornecedores
          </button>

          {userRole === 'admin' && (
            <>
              <button
                onClick={() => onSectionChange('supplier-form')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  currentSection === 'supplier-form'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Novo Fornecedor
              </button>

              <button
                onClick={() => onSectionChange('user-form')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  currentSection === 'user-form'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Novo Usuário
              </button>

              <button
                onClick={() => onSectionChange('user-list')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  currentSection === 'user-list'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Usuários
              </button>

              <button
                onClick={() => onSectionChange('location-form')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  currentSection === 'location-form'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Nova Localização
              </button>
            </>
          )}

          <button
            onClick={() => onSectionChange('logs')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              currentSection === 'logs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Logs
          </button>

          <button
            onClick={() => onSectionChange('manual')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              currentSection === 'manual'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Manual
          </button>

          <button
            onClick={() => onSectionChange('docs')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              currentSection === 'docs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Documentação Técnica
          </button>
        </div>
      </div>
    </nav>
  );
};
