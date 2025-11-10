import { dbRequest, ExpectedReturn } from '@/utils/database';

export interface TaskCategoryAssociateParams {
  idAccount: number;
  idTask: number;
  idCategory: number;
}

export interface TaskCategoryRemoveParams {
  idAccount: number;
  idTask: number;
  idCategory: number;
}

export interface TaskCategoryListParams {
  idAccount: number;
  idTask: number;
}

export interface TaskCategoryResult {
  idTask: number;
  idCategory: number;
}

/**
 * @summary
 * Associates a task with a category.
 *
 * @function taskCategoryAssociate
 * @module taskCategory
 *
 * @param {TaskCategoryAssociateParams} params - Association parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idTask - Task identifier
 * @param {number} params.idCategory - Category identifier
 *
 * @returns {Promise<TaskCategoryResult>} Association result
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {BusinessRuleError} When association already exists
 * @throws {DatabaseError} When database operation fails
 */
export async function taskCategoryAssociate(
  params: TaskCategoryAssociateParams
): Promise<TaskCategoryResult> {
  const result = await dbRequest(
    '[functional].[spTaskCategoryAssociate]',
    {
      idAccount: params.idAccount,
      idTask: params.idTask,
      idCategory: params.idCategory,
    },
    ExpectedReturn.Single
  );

  return result[0];
}

/**
 * @summary
 * Removes the association between a task and a category.
 *
 * @function taskCategoryRemove
 * @module taskCategory
 *
 * @param {TaskCategoryRemoveParams} params - Removal parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idTask - Task identifier
 * @param {number} params.idCategory - Category identifier
 *
 * @returns {Promise<TaskCategoryResult>} Removal result
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function taskCategoryRemove(
  params: TaskCategoryRemoveParams
): Promise<TaskCategoryResult> {
  const result = await dbRequest(
    '[functional].[spTaskCategoryRemove]',
    {
      idAccount: params.idAccount,
      idTask: params.idTask,
      idCategory: params.idCategory,
    },
    ExpectedReturn.Single
  );

  return result[0];
}

/**
 * @summary
 * Retrieves all categories associated with a specific task.
 *
 * @function taskCategoryList
 * @module taskCategory
 *
 * @param {TaskCategoryListParams} params - List parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idTask - Task identifier
 *
 * @returns {Promise<any[]>} List of associated categories
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function taskCategoryList(params: TaskCategoryListParams): Promise<any[]> {
  const result = await dbRequest(
    '[functional].[spTaskCategoryList]',
    {
      idAccount: params.idAccount,
      idTask: params.idTask,
    },
    ExpectedReturn.Single
  );

  return result;
}
