import type { CreateCategoryDto } from '../../types';

export interface UseCategoryCreateOptions {
  onSuccess?: (result: { idCategory: number }) => void;
  onError?: (error: Error) => void;
}

export interface UseCategoryCreateReturn {
  createCategory: (data: CreateCategoryDto) => Promise<{ idCategory: number }>;
  isCreating: boolean;
  error: Error | null;
}
