import { dbRequest, ExpectedReturn } from '@/utils/database';

export interface TaskCreateParams {
  idAccount: number;
  idUser: number;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: number;
  estimatedTime: number | null;
  recurrenceConfig: string | null;
}

export interface TaskCreateResult {
  idTask: number;
}

/**
 * @summary
 * Creates a new task with all specified attributes including title, description,
 * due date, priority, estimated time, and recurrence configuration.
 *
 * @function taskCreate
 * @module task
 *
 * @param {TaskCreateParams} params - Task creation parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {string} params.title - Task title (3-100 characters)
 * @param {string | null} params.description - Task description (max 1000 characters)
 * @param {string | null} params.dueDate - Due date in ISO format
 * @param {number} params.priority - Priority level (0=Low, 1=Medium, 2=High)
 * @param {number | null} params.estimatedTime - Estimated time in minutes (5-1440)
 * @param {string | null} params.recurrenceConfig - JSON recurrence configuration
 *
 * @returns {Promise<TaskCreateResult>} Created task with identifier
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {BusinessRuleError} When business rules are violated
 * @throws {DatabaseError} When database operation fails
 *
 * @example
 * const task = await taskCreate({
 *   idAccount: 1,
 *   idUser: 1,
 *   title: 'Complete project documentation',
 *   description: 'Write comprehensive documentation for the project',
 *   dueDate: '2024-12-31',
 *   priority: 2,
 *   estimatedTime: 120,
 *   recurrenceConfig: null
 * });
 */
export async function taskCreate(params: TaskCreateParams): Promise<TaskCreateResult> {
  const result = await dbRequest(
    '[functional].[spTaskCreate]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      title: params.title,
      description: params.description,
      dueDate: params.dueDate,
      priority: params.priority,
      estimatedTime: params.estimatedTime,
      recurrenceConfig: params.recurrenceConfig,
    },
    ExpectedReturn.Single
  );

  return result[0];
}
