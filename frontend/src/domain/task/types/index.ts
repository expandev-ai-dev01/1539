export interface Task {
  idTask: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: 0 | 1 | 2;
  estimatedTime: number | null;
  recurrenceConfig: string | null;
  status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
  createdAt: string;
  idUser: string;
  idAccount: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority?: 0 | 1 | 2;
  estimatedTime?: number | null;
  recurrenceConfig?: string | null;
}

export interface TaskFormData {
  title: string;
  description?: string;
  dueDate?: string;
  priority: 0 | 1 | 2;
  estimatedTime?: string;
  recurrenceType: 'none' | 'daily' | 'weekly' | 'monthly';
  recurrenceInterval?: string;
  recurrenceEnd?: string;
  tags: string[];
}

export type PriorityLevel = 0 | 1 | 2;

export const PRIORITY_LABELS: Record<PriorityLevel, string> = {
  0: 'Baixa',
  1: 'Média',
  2: 'Alta',
};

export const PRIORITY_COLORS: Record<PriorityLevel, string> = {
  0: 'bg-green-100 text-green-800',
  1: 'bg-yellow-100 text-yellow-800',
  2: 'bg-red-100 text-red-800',
};
