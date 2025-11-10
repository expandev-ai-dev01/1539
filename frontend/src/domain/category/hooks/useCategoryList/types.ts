import type { Category } from '../../types';

export interface UseCategoryListOptions {
  onSuccess?: (categories: Category[]) => void;
  onError?: (error: Error) => void;
}

export interface UseCategoryListReturn {
  categories: Category[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
