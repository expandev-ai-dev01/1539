import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { CategoryFormProps } from './types';
import type { CategoryFormData } from '../../types';
import { CATEGORY_COLORS, CATEGORY_ICONS, DEFAULT_CATEGORY_COLOR } from '../../types';
import {
  getCategoryFormClassName,
  getFormFieldClassName,
  getLabelClassName,
  getInputClassName,
  getSelectClassName,
  getColorPickerClassName,
  getColorButtonClassName,
  getIconPickerClassName,
  getIconButtonClassName,
  getErrorClassName,
  getButtonGroupClassName,
  getSubmitButtonClassName,
  getCancelButtonClassName,
} from './variants';

const categoryFormSchema = z.object({
  name: z
    .string()
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(50, 'O nome deve ter no máximo 50 caracteres')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Nome contém caracteres inválidos'),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Formato de cor inválido'),
  icon: z.string().optional(),
  idParent: z.number().optional(),
});

export const CategoryForm = (props: CategoryFormProps) => {
  const {
    onSubmit,
    onCancel,
    isSubmitting = false,
    initialData,
    availableParentCategories = [],
  } = props;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      color: initialData?.color || DEFAULT_CATEGORY_COLOR,
      icon: initialData?.icon || '',
      idParent: initialData?.idParent,
    },
  });

  const selectedColor = watch('color');
  const selectedIcon = watch('icon');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={getCategoryFormClassName({})}>
      <div className={getFormFieldClassName()}>
        <label htmlFor="name" className={getLabelClassName()}>
          Nome da Categoria <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className={getInputClassName(!!errors.name)}
          disabled={isSubmitting}
          placeholder="Digite o nome da categoria"
        />
        {errors.name && <p className={getErrorClassName()}>{errors.name.message}</p>}
      </div>

      <div className={getFormFieldClassName()}>
        <label className={getLabelClassName()}>
          Cor <span className="text-red-500">*</span>
        </label>
        <div className={getColorPickerClassName()}>
          {CATEGORY_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setValue('color', color)}
              className={getColorButtonClassName(selectedColor === color)}
              style={{ backgroundColor: color }}
              disabled={isSubmitting}
              aria-label={`Selecionar cor ${color}`}
            />
          ))}
        </div>
        {errors.color && <p className={getErrorClassName()}>{errors.color.message}</p>}
      </div>

      <div className={getFormFieldClassName()}>
        <label className={getLabelClassName()}>Ícone</label>
        <div className={getIconPickerClassName()}>
          {CATEGORY_ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => setValue('icon', icon)}
              className={getIconButtonClassName(selectedIcon === icon)}
              disabled={isSubmitting}
            >
              {icon}
            </button>
          ))}
        </div>
        {errors.icon && <p className={getErrorClassName()}>{errors.icon.message}</p>}
      </div>

      {availableParentCategories.length > 0 && (
        <div className={getFormFieldClassName()}>
          <label htmlFor="idParent" className={getLabelClassName()}>
            Categoria Pai (Opcional)
          </label>
          <select
            id="idParent"
            {...register('idParent', { valueAsNumber: true })}
            className={getSelectClassName(!!errors.idParent)}
            disabled={isSubmitting}
          >
            <option value="">Nenhuma (Categoria Principal)</option>
            {availableParentCategories.map((cat) => (
              <option key={cat.idCategory} value={cat.idCategory}>
                {'  '.repeat(cat.level)}
                {cat.name}
              </option>
            ))}
          </select>
          {errors.idParent && <p className={getErrorClassName()}>{errors.idParent.message}</p>}
        </div>
      )}

      <div className={getButtonGroupClassName()}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={getCancelButtonClassName()}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className={getSubmitButtonClassName(isSubmitting)}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : initialData ? 'Atualizar Categoria' : 'Criar Categoria'}
        </button>
      </div>
    </form>
  );
};
