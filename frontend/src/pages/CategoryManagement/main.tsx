import { useState } from 'react';
import { CategoryList } from '@/domain/category/components/CategoryList';
import { CategoryForm } from '@/domain/category/components/CategoryForm';
import { useCategoryList } from '@/domain/category/hooks/useCategoryList';
import { useCategoryCreate } from '@/domain/category/hooks/useCategoryCreate';
import { useCategoryUpdate } from '@/domain/category/hooks/useCategoryUpdate';
import { useCategoryDelete } from '@/domain/category/hooks/useCategoryDelete';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import { ErrorMessage } from '@/core/components/ErrorMessage';
import type { Category, CategoryFormData } from '@/domain/category/types';
import type { CategoryManagementPageProps } from './types';

export const CategoryManagementPage = (props: CategoryManagementPageProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();

  const { categories, isLoading, error, refetch } = useCategoryList();

  const { createCategory, isCreating } = useCategoryCreate({
    onSuccess: () => {
      setIsFormOpen(false);
      refetch();
    },
    onError: (error: Error) => {
      alert(`Erro ao criar categoria: ${error.message}`);
    },
  });

  const { updateCategory, isUpdating } = useCategoryUpdate({
    onSuccess: () => {
      setIsFormOpen(false);
      setEditingCategory(null);
      refetch();
    },
    onError: (error: Error) => {
      alert(`Erro ao atualizar categoria: ${error.message}`);
    },
  });

  const { deleteCategory, isDeleting } = useCategoryDelete({
    onSuccess: () => {
      refetch();
    },
    onError: (error: Error) => {
      alert(`Erro ao excluir categoria: ${error.message}`);
    },
  });

  const handleSubmit = async (data: CategoryFormData) => {
    if (editingCategory) {
      await updateCategory({
        id: editingCategory.idCategory,
        name: data.name,
        color: data.color,
        icon: data.icon,
      });
    } else {
      await createCategory({
        name: data.name,
        color: data.color,
        icon: data.icon,
        idParent: data.idParent,
      });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = async (category: Category) => {
    if (window.confirm(`Tem certeza que deseja excluir a categoria "${category.name}"?`)) {
      await deleteCategory(category.idCategory);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  const handleNewCategory = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const availableParentCategories =
    categories
      ?.filter(
        (cat) =>
          cat.level < 2 && (!editingCategory || cat.idCategory !== editingCategory.idCategory)
      )
      .map((cat) => ({
        idCategory: cat.idCategory,
        name: cat.name,
        level: cat.level,
      })) || [];

  if (error) {
    return (
      <ErrorMessage title="Erro ao carregar categorias" message={error.message} onRetry={refetch} />
    );
  }

  if (isLoading) {
    return <LoadingSpinner size="large" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciar Categorias</h1>
            <p className="text-gray-600">Organize suas tarefas em categorias personalizadas</p>
          </div>
          <button
            onClick={handleNewCategory}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Nova Categoria
          </button>
        </div>

        {isFormOpen && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </h2>
            <CategoryForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={isCreating || isUpdating}
              initialData={
                editingCategory
                  ? {
                      name: editingCategory.name,
                      color: editingCategory.color,
                      icon: editingCategory.icon || undefined,
                      idParent: editingCategory.idParent || undefined,
                    }
                  : undefined
              }
              availableParentCategories={availableParentCategories}
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Suas Categorias</h2>
          <CategoryList
            categories={categories || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelect={(category) => setSelectedCategoryId(category.idCategory)}
            selectedCategoryId={selectedCategoryId}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryManagementPage;
