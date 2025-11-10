import type { UpdateCategoryDto } from '../../types';

export interface UseCategoryUpdateOptions {
  onSuccess?: (result: { idCategory: number }) => void;
  onError?: (error: Error) => void;
}

export interface UseCategoryUpdateReturn {
  updateCategory: (data: UpdateCategoryDto) => Promise<{ idCategory: number }>;
  isUpdating: boolean;
  error: Error | null;
}
