import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { TaskFormProps } from './types';
import type { TaskFormData } from '../../types';
import {
  getTaskFormClassName,
  getFormFieldClassName,
  getLabelClassName,
  getInputClassName,
  getTextareaClassName,
  getSelectClassName,
  getErrorClassName,
  getButtonGroupClassName,
  getSubmitButtonClassName,
  getCancelButtonClassName,
} from './variants';

const taskFormSchema = z.object({
  title: z
    .string()
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(100, 'O título deve ter no máximo 100 caracteres'),
  description: z.string().max(1000, 'A descrição deve ter no máximo 1000 caracteres').optional(),
  dueDate: z.string().optional(),
  priority: z.union([z.literal(0), z.literal(1), z.literal(2)]),
  estimatedTime: z.string().optional(),
  recurrenceType: z.enum(['none', 'daily', 'weekly', 'monthly']),
  recurrenceInterval: z.string().optional(),
  recurrenceEnd: z.string().optional(),
  tags: z.array(z.string()).max(5, 'Máximo de 5 etiquetas por tarefa'),
});

export const TaskForm = (props: TaskFormProps) => {
  const { onSubmit, onCancel, isSubmitting = false, initialData } = props;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      dueDate: initialData?.dueDate || '',
      priority: initialData?.priority || 1,
      estimatedTime: initialData?.estimatedTime || '',
      recurrenceType: initialData?.recurrenceType || 'none',
      recurrenceInterval: initialData?.recurrenceInterval || '',
      recurrenceEnd: initialData?.recurrenceEnd || '',
      tags: initialData?.tags || [],
    },
  });

  const recurrenceType = watch('recurrenceType');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={getTaskFormClassName({})}>
      <div className={getFormFieldClassName()}>
        <label htmlFor="title" className={getLabelClassName()}>
          Título <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className={getInputClassName(!!errors.title)}
          disabled={isSubmitting}
          placeholder="Digite o título da tarefa"
        />
        {errors.title && <p className={getErrorClassName()}>{errors.title.message}</p>}
      </div>

      <div className={getFormFieldClassName()}>
        <label htmlFor="description" className={getLabelClassName()}>
          Descrição
        </label>
        <textarea
          id="description"
          {...register('description')}
          className={getTextareaClassName(!!errors.description)}
          disabled={isSubmitting}
          placeholder="Descreva os detalhes da tarefa"
        />
        {errors.description && <p className={getErrorClassName()}>{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={getFormFieldClassName()}>
          <label htmlFor="dueDate" className={getLabelClassName()}>
            Data de Vencimento
          </label>
          <input
            id="dueDate"
            type="date"
            {...register('dueDate')}
            className={getInputClassName(!!errors.dueDate)}
            disabled={isSubmitting}
          />
          {errors.dueDate && <p className={getErrorClassName()}>{errors.dueDate.message}</p>}
        </div>

        <div className={getFormFieldClassName()}>
          <label htmlFor="priority" className={getLabelClassName()}>
            Prioridade
          </label>
          <select
            id="priority"
            {...register('priority', { valueAsNumber: true })}
            className={getSelectClassName(!!errors.priority)}
            disabled={isSubmitting}
          >
            <option value={0}>Baixa</option>
            <option value={1}>Média</option>
            <option value={2}>Alta</option>
          </select>
          {errors.priority && <p className={getErrorClassName()}>{errors.priority.message}</p>}
        </div>
      </div>

      <div className={getFormFieldClassName()}>
        <label htmlFor="estimatedTime" className={getLabelClassName()}>
          Tempo Estimado (minutos)
        </label>
        <input
          id="estimatedTime"
          type="number"
          min="5"
          max="1440"
          {...register('estimatedTime')}
          className={getInputClassName(!!errors.estimatedTime)}
          disabled={isSubmitting}
          placeholder="Ex: 60"
        />
        {errors.estimatedTime && (
          <p className={getErrorClassName()}>{errors.estimatedTime.message}</p>
        )}
      </div>

      <div className={getFormFieldClassName()}>
        <label htmlFor="recurrenceType" className={getLabelClassName()}>
          Recorrência
        </label>
        <select
          id="recurrenceType"
          {...register('recurrenceType')}
          className={getSelectClassName(!!errors.recurrenceType)}
          disabled={isSubmitting}
        >
          <option value="none">Sem recorrência</option>
          <option value="daily">Diária</option>
          <option value="weekly">Semanal</option>
          <option value="monthly">Mensal</option>
        </select>
        {errors.recurrenceType && (
          <p className={getErrorClassName()}>{errors.recurrenceType.message}</p>
        )}
      </div>

      {recurrenceType !== 'none' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={getFormFieldClassName()}>
            <label htmlFor="recurrenceInterval" className={getLabelClassName()}>
              Intervalo
            </label>
            <input
              id="recurrenceInterval"
              type="number"
              min="1"
              {...register('recurrenceInterval')}
              className={getInputClassName(!!errors.recurrenceInterval)}
              disabled={isSubmitting}
              placeholder="Ex: 1"
            />
            {errors.recurrenceInterval && (
              <p className={getErrorClassName()}>{errors.recurrenceInterval.message}</p>
            )}
          </div>

          <div className={getFormFieldClassName()}>
            <label htmlFor="recurrenceEnd" className={getLabelClassName()}>
              Data de Término
            </label>
            <input
              id="recurrenceEnd"
              type="date"
              {...register('recurrenceEnd')}
              className={getInputClassName(!!errors.recurrenceEnd)}
              disabled={isSubmitting}
            />
            {errors.recurrenceEnd && (
              <p className={getErrorClassName()}>{errors.recurrenceEnd.message}</p>
            )}
          </div>
        </div>
      )}

      <div className={getButtonGroupClassName()}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={getCancelButtonClassName()}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className={getSubmitButtonClassName(isSubmitting)}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Criando...' : 'Criar Tarefa'}
        </button>
      </div>
    </form>
  );
};
