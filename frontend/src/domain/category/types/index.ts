export interface Category {
  idCategory: number;
  name: string;
  color: string;
  icon: string | null;
  idParent: number | null;
  level: number;
  isDefault: boolean;
  taskCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  color?: string;
  icon?: string | null;
  idParent?: number | null;
}

export interface UpdateCategoryDto {
  id: number;
  name: string;
  color: string;
  icon?: string | null;
}

export interface CategoryFormData {
  name: string;
  color: string;
  icon?: string;
  idParent?: number;
}

export interface CategoryFilterOptions {
  includeSubcategories?: boolean;
  sortBy?: 'name' | 'taskCount' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
}

export const DEFAULT_CATEGORY_COLOR = '#3498db';

export const CATEGORY_COLORS = [
  '#3498db',
  '#e74c3c',
  '#2ecc71',
  '#f39c12',
  '#9b59b6',
  '#1abc9c',
  '#34495e',
  '#e67e22',
];

export const CATEGORY_ICONS = [
  'work',
  'personal',
  'study',
  'health',
  'finance',
  'shopping',
  'home',
  'other',
];
