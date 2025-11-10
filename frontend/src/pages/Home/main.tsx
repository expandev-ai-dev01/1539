import { useNavigate } from 'react-router-dom';
import type { HomePageProps } from './types';

export const HomePage = (props: HomePageProps) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to TODO List App</h1>
        <p className="text-lg text-gray-600 mb-8">Sistema de gerenciamento de tarefas</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tarefas</h2>
            <p className="text-gray-600 mb-6">Crie e gerencie suas tarefas com facilidade.</p>
            <button
              onClick={() => navigate('/tasks/create')}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium w-full"
            >
              Criar Nova Tarefa
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Categorias</h2>
            <p className="text-gray-600 mb-6">
              Organize suas tarefas em categorias personalizadas.
            </p>
            <button
              onClick={() => navigate('/categories')}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium w-full"
            >
              Gerenciar Categorias
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
