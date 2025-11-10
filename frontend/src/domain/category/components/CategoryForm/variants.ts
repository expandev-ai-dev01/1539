import { clsx } from 'clsx';

export interface CategoryFormVariantProps {
  className?: string;
}

export function getCategoryFormClassName(props: CategoryFormVariantProps): string {
  const { className } = props;
  return clsx('space-y-6', className);
}

export function getFormFieldClassName(): string {
  return clsx('space-y-2');
}

export function getLabelClassName(): string {
  return clsx('block text-sm font-medium text-gray-700');
}

export function getInputClassName(hasError: boolean = false): string {
  return clsx(
    'w-full px-3 py-2 border rounded-md shadow-sm',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    'disabled:bg-gray-100 disabled:cursor-not-allowed',
    {
      'border-red-500': hasError,
      'border-gray-300': !hasError,
    }
  );
}

export function getSelectClassName(hasError: boolean = false): string {
  return clsx(
    'w-full px-3 py-2 border rounded-md shadow-sm',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    'disabled:bg-gray-100 disabled:cursor-not-allowed',
    {
      'border-red-500': hasError,
      'border-gray-300': !hasError,
    }
  );
}

export function getColorPickerClassName(): string {
  return clsx('flex flex-wrap gap-2');
}

export function getColorButtonClassName(isSelected: boolean): string {
  return clsx('w-10 h-10 rounded-md border-2 transition-all cursor-pointer', 'hover:scale-110', {
    'border-gray-900 ring-2 ring-gray-900': isSelected,
    'border-gray-300': !isSelected,
  });
}

export function getIconPickerClassName(): string {
  return clsx('flex flex-wrap gap-2');
}

export function getIconButtonClassName(isSelected: boolean): string {
  return clsx('px-4 py-2 rounded-md border transition-colors cursor-pointer', {
    'bg-blue-600 text-white border-blue-600': isSelected,
    'bg-white text-gray-700 border-gray-300 hover:bg-gray-50': !isSelected,
  });
}

export function getErrorClassName(): string {
  return clsx('text-sm text-red-600 mt-1');
}

export function getButtonGroupClassName(): string {
  return clsx('flex gap-4 justify-end pt-4');
}

export function getSubmitButtonClassName(isDisabled: boolean = false): string {
  return clsx(
    'px-6 py-2 rounded-md font-medium transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
    {
      'bg-blue-600 text-white hover:bg-blue-700': !isDisabled,
      'bg-gray-300 text-gray-500 cursor-not-allowed': isDisabled,
    }
  );
}

export function getCancelButtonClassName(): string {
  return clsx(
    'px-6 py-2 rounded-md font-medium transition-colors',
    'bg-gray-200 text-gray-900 hover:bg-gray-300',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
  );
}
