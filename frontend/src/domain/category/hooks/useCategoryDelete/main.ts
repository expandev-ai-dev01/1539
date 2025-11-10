import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../services/categoryService';
import type { UseCategoryDeleteOptions, UseCategoryDeleteReturn } from './types';

export const useCategoryDelete = (
  options: UseCategoryDeleteOptions = {}
): UseCategoryDeleteReturn => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => categoryService.delete(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  return {
    deleteCategory: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error,
  };
};
