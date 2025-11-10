export interface UseCategoryDeleteOptions {
  onSuccess?: (result: { idCategory: number }) => void;
  onError?: (error: Error) => void;
}

export interface UseCategoryDeleteReturn {
  deleteCategory: (id: number) => Promise<{ idCategory: number }>;
  isDeleting: boolean;
  error: Error | null;
}
