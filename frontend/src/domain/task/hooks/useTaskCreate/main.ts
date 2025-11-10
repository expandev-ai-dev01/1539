import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../../services/taskService';
import type { UseTaskCreateOptions, UseTaskCreateReturn } from './types';
import type { CreateTaskDto } from '../../types';

export const useTaskCreate = (options: UseTaskCreateOptions = {}): UseTaskCreateReturn => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateTaskDto) => taskService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  return {
    createTask: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};
