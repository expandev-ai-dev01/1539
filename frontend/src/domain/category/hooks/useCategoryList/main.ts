import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import type { UseCategoryListOptions, UseCategoryListReturn } from './types';

export const useCategoryList = (options: UseCategoryListOptions = {}): UseCategoryListReturn => {
  const { onSuccess, onError } = options;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.list(),
    staleTime: 2 * 60 * 1000,
  });

  useEffect(() => {
    if (data && onSuccess) {
      onSuccess(data);
    }
  }, [data, onSuccess]);

  useEffect(() => {
    if (error && onError) {
      onError(error as Error);
    }
  }, [error, onError]);

  return {
    categories: data,
    isLoading,
    error: error as Error | null,
    refetch,
  };
};
