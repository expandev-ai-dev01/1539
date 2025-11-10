import type { CategoryListProps } from './types';
import {
  getCategoryListClassName,
  getCategoryItemClassName,
  getCategoryInfoClassName,
  getCategoryColorClassName,
  getCategoryNameClassName,
  getCategoryIconClassName,
  getCategoryTaskCountClassName,
  getCategoryActionsClassName,
  getActionButtonClassName,
  getDeleteButtonClassName,
  getDefaultBadgeClassName,
  getEmptyStateClassName,
} from './variants';

export const CategoryList = (props: CategoryListProps) => {
  const { categories, onEdit, onDelete, onSelect, selectedCategoryId, className } = props;

  if (categories.length === 0) {
    return (
      <div className={getEmptyStateClassName()}>
        <p>Nenhuma categoria encontrada</p>
        <p className="text-sm mt-2">
          Crie sua primeira categoria para começar a organizar suas tarefas
        </p>
      </div>
    );
  }

  return (
    <div className={getCategoryListClassName({ className })}>
      {categories.map((category) => (
        <div
          key={category.idCategory}
          className={getCategoryItemClassName(
            selectedCategoryId === category.idCategory,
            category.level
          )}
          onClick={() => onSelect?.(category)}
        >
          <div className={getCategoryInfoClassName()}>
            <div
              className={getCategoryColorClassName()}
              style={{ backgroundColor: category.color }}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={getCategoryNameClassName()}>{category.name}</span>
                {category.isDefault && <span className={getDefaultBadgeClassName()}>Padrão</span>}
              </div>
              {category.icon && <span className={getCategoryIconClassName()}>{category.icon}</span>}
            </div>
            <span className={getCategoryTaskCountClassName()}>
              {category.taskCount} {category.taskCount === 1 ? 'tarefa' : 'tarefas'}
            </span>
          </div>

          <div className={getCategoryActionsClassName()}>
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(category);
                }}
                className={getActionButtonClassName()}
              >
                Editar
              </button>
            )}
            {onDelete && !category.isDefault && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(category);
                }}
                className={getDeleteButtonClassName()}
              >
                Excluir
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
