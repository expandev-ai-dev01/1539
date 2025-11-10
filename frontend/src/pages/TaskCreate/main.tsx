import { useNavigate } from 'react-router-dom';
import { TaskForm } from '@/domain/task/components/TaskForm';
import { useTaskCreate } from '@/domain/task/hooks/useTaskCreate';
import type { TaskFormData, CreateTaskDto } from '@/domain/task/types';
import type { TaskCreatePageProps } from './types';

export const TaskCreatePage = (props: TaskCreatePageProps) => {
  const navigate = useNavigate();
  const { createTask, isCreating } = useTaskCreate({
    onSuccess: () => {
      navigate('/');
    },
    onError: (error: Error) => {
      alert(`Erro ao criar tarefa: ${error.message}`);
    },
  });

  const handleSubmit = async (data: TaskFormData) => {
    const recurrenceConfig =
      data.recurrenceType !== 'none'
        ? JSON.stringify({
            type: data.recurrenceType,
            interval: parseInt(data.recurrenceInterval || '1'),
            end: data.recurrenceEnd || null,
          })
        : null;

    const createData: CreateTaskDto = {
      title: data.title,
      description: data.description || null,
      dueDate: data.dueDate || null,
      priority: data.priority,
      estimatedTime: data.estimatedTime ? parseInt(data.estimatedTime) : null,
      recurrenceConfig,
    };

    await createTask(createData);
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar Nova Tarefa</h1>
          <p className="text-gray-600">Preencha os campos abaixo para criar uma nova tarefa</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <TaskForm onSubmit={handleSubmit} onCancel={handleCancel} isSubmitting={isCreating} />
        </div>
      </div>
    </div>
  );
};

export default TaskCreatePage;
