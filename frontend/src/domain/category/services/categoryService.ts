import { authenticatedClient } from '@/core/lib/api';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../types';

export const categoryService = {
  async list(): Promise<Category[]> {
    const response = await authenticatedClient.get('/category');
    return response.data.data;
  },

  async getById(id: number): Promise<Category> {
    const response = await authenticatedClient.get(`/category/${id}`);
    return response.data.data;
  },

  async create(data: CreateCategoryDto): Promise<{ idCategory: number }> {
    const payload = {
      name: data.name,
      color: data.color || '#3498db',
      icon: data.icon || null,
      idParent: data.idParent || null,
    };
    const response = await authenticatedClient.post('/category', payload);
    return response.data.data;
  },

  async update(data: UpdateCategoryDto): Promise<{ idCategory: number }> {
    const payload = {
      id: data.id,
      name: data.name,
      color: data.color,
      icon: data.icon || null,
    };
    const response = await authenticatedClient.put(`/category/${data.id}`, payload);
    return response.data.data;
  },

  async delete(id: number): Promise<{ idCategory: number }> {
    const response = await authenticatedClient.delete(`/category/${id}`);
    return response.data.data;
  },
};
