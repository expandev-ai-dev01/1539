import { clsx } from 'clsx';

export interface CategoryListVariantProps {
  className?: string;
}

export function getCategoryListClassName(props: CategoryListVariantProps): string {
  const { className } = props;
  return clsx('space-y-2', className);
}

export function getCategoryItemClassName(isSelected: boolean, level: number): string {
  return clsx(
    'flex items-center justify-between p-4 rounded-lg border transition-all',
    'hover:shadow-md cursor-pointer',
    {
      'bg-blue-50 border-blue-500': isSelected,
      'bg-white border-gray-200': !isSelected,
      'ml-4': level === 1,
      'ml-8': level === 2,
      'ml-12': level >= 3,
    }
  );
}

export function getCategoryInfoClassName(): string {
  return clsx('flex items-center gap-3 flex-1');
}

export function getCategoryColorClassName(): string {
  return clsx('w-4 h-4 rounded-full flex-shrink-0');
}

export function getCategoryNameClassName(): string {
  return clsx('font-medium text-gray-900');
}

export function getCategoryIconClassName(): string {
  return clsx('text-sm text-gray-500');
}

export function getCategoryTaskCountClassName(): string {
  return clsx('text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded');
}

export function getCategoryActionsClassName(): string {
  return clsx('flex items-center gap-2');
}

export function getActionButtonClassName(): string {
  return clsx('px-3 py-1 text-sm rounded-md transition-colors', 'hover:bg-gray-100 text-gray-700');
}

export function getDeleteButtonClassName(): string {
  return clsx('px-3 py-1 text-sm rounded-md transition-colors', 'hover:bg-red-50 text-red-600');
}

export function getDefaultBadgeClassName(): string {
  return clsx('text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded');
}

export function getEmptyStateClassName(): string {
  return clsx('text-center py-12 text-gray-500');
}
