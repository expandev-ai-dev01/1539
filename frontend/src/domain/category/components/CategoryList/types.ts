import type { Category } from '../../types';

export interface CategoryListProps {
  categories: Category[];
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
  onSelect?: (category: Category) => void;
  selectedCategoryId?: number;
  className?: string;
}
