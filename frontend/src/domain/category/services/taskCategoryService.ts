import { authenticatedClient } from '@/core/lib/api';
import type { Category } from '../types';

export const taskCategoryService = {
  async listTaskCategories(idTask: number): Promise<Category[]> {
    const response = await authenticatedClient.get(`/task-category/${idTask}`);
    return response.data.data;
  },

  async associate(
    idTask: number,
    idCategory: number
  ): Promise<{ idTask: number; idCategory: number }> {
    const response = await authenticatedClient.post('/task-category', {
      idTask,
      idCategory,
    });
    return response.data.data;
  },

  async remove(
    idTask: number,
    idCategory: number
  ): Promise<{ idTask: number; idCategory: number }> {
    const response = await authenticatedClient.delete(`/task-category/${idTask}/${idCategory}`);
    return response.data.data;
  },
};
