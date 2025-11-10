import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../services/categoryService';
import type { UseCategoryCreateOptions, UseCategoryCreateReturn } from './types';
import type { CreateCategoryDto } from '../../types';

export const useCategoryCreate = (
  options: UseCategoryCreateOptions = {}
): UseCategoryCreateReturn => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateCategoryDto) => categoryService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  return {
    createCategory: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};
