import { authenticatedClient } from '@/core/lib/api';
import type { Task, CreateTaskDto } from '../types';

export const taskService = {
  async create(data: CreateTaskDto): Promise<Task> {
    const payload: any = {
      title: data.title,
      description: data.description || null,
      dueDate: data.dueDate || null,
      priority: data.priority !== undefined ? data.priority : 1,
      estimatedTime: data.estimatedTime || null,
      recurrenceConfig: data.recurrenceConfig || null,
    };

    const response = await authenticatedClient.post('/task', payload);
    return response.data.data;
  },
};
