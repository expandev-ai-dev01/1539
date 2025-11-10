import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import {
  categoryCreate,
  categoryList,
  categoryGet,
  categoryUpdate,
  categoryDelete,
} from '@/services/category';
import { zString, zNullableString, zNullableFK } from '@/utils/zodValidation';

const securable = 'CATEGORY';

const createCategorySchema = z.object({
  name: zString.min(2, 'nameTooShort').max(50, 'nameTooLong'),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'invalidColorFormat')
    .optional(),
  icon: zNullableString(50),
  idParent: zNullableFK,
});

const updateCategorySchema = z.object({
  id: z.coerce.number().int().positive(),
  name: zString.min(2, 'nameTooShort').max(50, 'nameTooLong'),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'invalidColorFormat'),
  icon: zNullableString(50),
});

const getCategorySchema = z.object({
  id: z.coerce.number().int().positive(),
});

const deleteCategorySchema = z.object({
  id: z.coerce.number().int().positive(),
});

type CategoryCreateRequest = z.infer<typeof createCategorySchema>;
type CategoryUpdateRequest = z.infer<typeof updateCategorySchema>;

/**
 * @api {get} /api/v1/internal/category List Categories
 * @apiName ListCategories
 * @apiGroup Category
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves all categories for the authenticated user's account
 * with hierarchical information and task counts.
 *
 * @apiSuccess {Array} categories List of categories
 * @apiSuccess {Number} categories.idCategory Category identifier
 * @apiSuccess {String} categories.name Category name
 * @apiSuccess {String} categories.color Category color code
 * @apiSuccess {String} categories.icon Category icon identifier
 * @apiSuccess {Number} categories.idParent Parent category identifier
 * @apiSuccess {Number} categories.level Hierarchy level
 * @apiSuccess {Boolean} categories.isDefault System default flag
 * @apiSuccess {Number} categories.taskCount Number of active tasks
 *
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const [validated, error] = await operation.read(req, z.object({}));

  if (!validated) {
    return next(error);
  }

  try {
    const result = await categoryList({
      idAccount: validated.credential.idAccount,
    });

    res.json(successResponse(result));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {post} /api/v1/internal/category Create Category
 * @apiName CreateCategory
 * @apiGroup Category
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new category with specified name, color, icon, and
 * optional parent category for hierarchical organization.
 *
 * @apiParam {String} name Category name (2-50 characters, required)
 * @apiParam {String} [color] Hexadecimal color code (default: #3498db)
 * @apiParam {String} [icon] Icon identifier from system library
 * @apiParam {Number} [idParent] Parent category identifier for subcategories
 *
 * @apiSuccess {Number} idCategory Created category identifier
 *
 * @apiError {String} nameRequired Name is required
 * @apiError {String} nameTooShort Name must be at least 2 characters
 * @apiError {String} nameTooLong Name must not exceed 50 characters
 * @apiError {String} nameInvalidCharacters Name contains invalid characters
 * @apiError {String} invalidColorFormat Invalid color format
 * @apiError {String} categoryNameAlreadyExists Category name already exists
 * @apiError {String} categoryLimitReached Maximum 50 categories reached
 * @apiError {String} parentCategoryDoesntExist Parent category not found
 * @apiError {String} maximumHierarchyDepthExceeded Maximum 3 levels allowed
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'CREATE' }]);

  const [validated, error] = await operation.create(req, createCategorySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = validated.params as CategoryCreateRequest;

    const result = await categoryCreate({
      idAccount: validated.credential.idAccount,
      idUser: validated.credential.idUser,
      name: data.name,
      color: data.color || '#3498db',
      icon: data.icon || null,
      idParent: data.idParent || null,
    });

    res.status(201).json(successResponse(result));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {get} /api/v1/internal/category/:id Get Category
 * @apiName GetCategory
 * @apiGroup Category
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves detailed information for a specific category.
 *
 * @apiParam {Number} id Category identifier
 *
 * @apiSuccess {Number} idCategory Category identifier
 * @apiSuccess {String} name Category name
 * @apiSuccess {String} color Category color code
 * @apiSuccess {String} icon Category icon identifier
 * @apiSuccess {Number} idParent Parent category identifier
 * @apiSuccess {Number} level Hierarchy level
 * @apiSuccess {Boolean} isDefault System default flag
 * @apiSuccess {Number} taskCount Number of active tasks
 *
 * @apiError {String} categoryDoesntExist Category not found
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const [validated, error] = await operation.read(req, getCategorySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const result = await categoryGet({
      idAccount: validated.credential.idAccount,
      idCategory: validated.params.id,
    });

    res.json(successResponse(result));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {put} /api/v1/internal/category/:id Update Category
 * @apiName UpdateCategory
 * @apiGroup Category
 * @apiVersion 1.0.0
 *
 * @apiDescription Updates an existing category's name, color, and icon.
 *
 * @apiParam {Number} id Category identifier
 * @apiParam {String} name Updated category name (2-50 characters)
 * @apiParam {String} color Updated hexadecimal color code
 * @apiParam {String} [icon] Updated icon identifier
 *
 * @apiSuccess {Number} idCategory Updated category identifier
 *
 * @apiError {String} categoryDoesntExist Category not found
 * @apiError {String} nameRequired Name is required
 * @apiError {String} nameTooShort Name must be at least 2 characters
 * @apiError {String} nameTooLong Name must not exceed 50 characters
 * @apiError {String} categoryNameAlreadyExists Category name already exists
 * @apiError {String} invalidColorFormat Invalid color format
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function putHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'UPDATE' }]);

  const [validated, error] = await operation.update(req, updateCategorySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = validated.params as CategoryUpdateRequest;

    const result = await categoryUpdate({
      idAccount: validated.credential.idAccount,
      idCategory: data.id,
      name: data.name,
      color: data.color,
      icon: data.icon || null,
    });

    res.json(successResponse(result));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {delete} /api/v1/internal/category/:id Delete Category
 * @apiName DeleteCategory
 * @apiGroup Category
 * @apiVersion 1.0.0
 *
 * @apiDescription Soft deletes a category and removes all task associations.
 * Default categories cannot be deleted.
 *
 * @apiParam {Number} id Category identifier
 *
 * @apiSuccess {Number} idCategory Deleted category identifier
 *
 * @apiError {String} categoryDoesntExist Category not found
 * @apiError {String} cannotDeleteDefaultCategory Cannot delete default category
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'DELETE' }]);

  const [validated, error] = await operation.delete(req, deleteCategorySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const result = await categoryDelete({
      idAccount: validated.credential.idAccount,
      idCategory: validated.params.id,
    });

    res.json(successResponse(result));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}
