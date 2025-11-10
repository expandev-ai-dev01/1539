import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../services/categoryService';
import type { UseCategoryUpdateOptions, UseCategoryUpdateReturn } from './types';
import type { UpdateCategoryDto } from '../../types';

export const useCategoryUpdate = (
  options: UseCategoryUpdateOptions = {}
): UseCategoryUpdateReturn => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateCategoryDto) => categoryService.update(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  return {
    updateCategory: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
};
