import { dbRequest, ExpectedReturn } from '@/utils/database';

export interface CategoryCreateParams {
  idAccount: number;
  idUser: number;
  name: string;
  color: string;
  icon: string | null;
  idParent: number | null;
}

export interface CategoryUpdateParams {
  idAccount: number;
  idCategory: number;
  name: string;
  color: string;
  icon: string | null;
}

export interface CategoryGetParams {
  idAccount: number;
  idCategory: number;
}

export interface CategoryListParams {
  idAccount: number;
}

export interface CategoryDeleteParams {
  idAccount: number;
  idCategory: number;
}

export interface CategoryResult {
  idCategory: number;
}

/**
 * @summary
 * Creates a new category with specified name, color, icon, and optional parent category.
 *
 * @function categoryCreate
 * @module category
 *
 * @param {CategoryCreateParams} params - Category creation parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {string} params.name - Category name (2-50 characters)
 * @param {string} params.color - Hexadecimal color code
 * @param {string | null} params.icon - Icon identifier
 * @param {number | null} params.idParent - Parent category identifier
 *
 * @returns {Promise<CategoryResult>} Created category with identifier
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {BusinessRuleError} When business rules are violated
 * @throws {DatabaseError} When database operation fails
 *
 * @example
 * const category = await categoryCreate({
 *   idAccount: 1,
 *   idUser: 1,
 *   name: 'Projects',
 *   color: '#3498db',
 *   icon: 'folder',
 *   idParent: null
 * });
 */
export async function categoryCreate(params: CategoryCreateParams): Promise<CategoryResult> {
  const result = await dbRequest(
    '[functional].[spCategoryCreate]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      name: params.name,
      color: params.color,
      icon: params.icon,
      idParent: params.idParent,
    },
    ExpectedReturn.Single
  );

  return result[0];
}

/**
 * @summary
 * Retrieves all categories for a specific account with hierarchical information.
 *
 * @function categoryList
 * @module category
 *
 * @param {CategoryListParams} params - Category list parameters
 * @param {number} params.idAccount - Account identifier
 *
 * @returns {Promise<any[]>} List of categories with hierarchy and task counts
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function categoryList(params: CategoryListParams): Promise<any[]> {
  const result = await dbRequest(
    '[functional].[spCategoryList]',
    {
      idAccount: params.idAccount,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Retrieves detailed information for a specific category.
 *
 * @function categoryGet
 * @module category
 *
 * @param {CategoryGetParams} params - Category get parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idCategory - Category identifier
 *
 * @returns {Promise<any>} Category details with hierarchy and task count
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function categoryGet(params: CategoryGetParams): Promise<any> {
  const result = await dbRequest(
    '[functional].[spCategoryGet]',
    {
      idAccount: params.idAccount,
      idCategory: params.idCategory,
    },
    ExpectedReturn.Single
  );

  return result[0];
}

/**
 * @summary
 * Updates an existing category's name, color, and icon.
 *
 * @function categoryUpdate
 * @module category
 *
 * @param {CategoryUpdateParams} params - Category update parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idCategory - Category identifier
 * @param {string} params.name - Updated category name
 * @param {string} params.color - Updated color code
 * @param {string | null} params.icon - Updated icon identifier
 *
 * @returns {Promise<CategoryResult>} Updated category identifier
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {BusinessRuleError} When business rules are violated
 * @throws {DatabaseError} When database operation fails
 */
export async function categoryUpdate(params: CategoryUpdateParams): Promise<CategoryResult> {
  const result = await dbRequest(
    '[functional].[spCategoryUpdate]',
    {
      idAccount: params.idAccount,
      idCategory: params.idCategory,
      name: params.name,
      color: params.color,
      icon: params.icon,
    },
    ExpectedReturn.Single
  );

  return result[0];
}

/**
 * @summary
 * Soft deletes a category and removes all task associations.
 *
 * @function categoryDelete
 * @module category
 *
 * @param {CategoryDeleteParams} params - Category delete parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idCategory - Category identifier
 *
 * @returns {Promise<CategoryResult>} Deleted category identifier
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {BusinessRuleError} When attempting to delete default category
 * @throws {DatabaseError} When database operation fails
 */
export async function categoryDelete(params: CategoryDeleteParams): Promise<CategoryResult> {
  const result = await dbRequest(
    '[functional].[spCategoryDelete]',
    {
      idAccount: params.idAccount,
      idCategory: params.idCategory,
    },
    ExpectedReturn.Single
  );

  return result[0];
}
