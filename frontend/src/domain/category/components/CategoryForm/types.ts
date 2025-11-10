import type { CategoryFormData } from '../../types';

export interface CategoryFormProps {
  onSubmit: (data: CategoryFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  initialData?: Partial<CategoryFormData>;
  availableParentCategories?: Array<{ idCategory: number; name: string; level: number }>;
}
