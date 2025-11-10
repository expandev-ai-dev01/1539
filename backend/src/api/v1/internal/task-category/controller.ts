import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import {
  taskCategoryAssociate,
  taskCategoryRemove,
  taskCategoryList,
} from '@/services/taskCategory';

const securable = 'TASK';

const associateSchema = z.object({
  idTask: z.coerce.number().int().positive(),
  idCategory: z.coerce.number().int().positive(),
});

const removeSchema = z.object({
  idTask: z.coerce.number().int().positive(),
  idCategory: z.coerce.number().int().positive(),
});

const listSchema = z.object({
  idTask: z.coerce.number().int().positive(),
});

/**
 * @api {get} /api/v1/internal/task-category/:idTask List Task Categories
 * @apiName ListTaskCategories
 * @apiGroup TaskCategory
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves all categories associated with a specific task.
 *
 * @apiParam {Number} idTask Task identifier
 *
 * @apiSuccess {Array} categories List of associated categories
 * @apiSuccess {Number} categories.idCategory Category identifier
 * @apiSuccess {String} categories.name Category name
 * @apiSuccess {String} categories.color Category color code
 * @apiSuccess {String} categories.icon Category icon identifier
 *
 * @apiError {String} taskDoesntExist Task not found
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const [validated, error] = await operation.read(req, listSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const result = await taskCategoryList({
      idAccount: validated.credential.idAccount,
      idTask: validated.params.idTask,
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
 * @api {post} /api/v1/internal/task-category Associate Task Category
 * @apiName AssociateTaskCategory
 * @apiGroup TaskCategory
 * @apiVersion 1.0.0
 *
 * @apiDescription Associates a task with a category.
 *
 * @apiParam {Number} idTask Task identifier
 * @apiParam {Number} idCategory Category identifier
 *
 * @apiSuccess {Number} idTask Task identifier
 * @apiSuccess {Number} idCategory Category identifier
 *
 * @apiError {String} taskDoesntExist Task not found
 * @apiError {String} categoryDoesntExist Category not found
 * @apiError {String} taskCategoryAlreadyAssociated Association already exists
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'UPDATE' }]);

  const [validated, error] = await operation.create(req, associateSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const result = await taskCategoryAssociate({
      idAccount: validated.credential.idAccount,
      idTask: validated.params.idTask,
      idCategory: validated.params.idCategory,
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
 * @api {delete} /api/v1/internal/task-category/:idTask/:idCategory Remove Task Category
 * @apiName RemoveTaskCategory
 * @apiGroup TaskCategory
 * @apiVersion 1.0.0
 *
 * @apiDescription Removes the association between a task and a category.
 *
 * @apiParam {Number} idTask Task identifier
 * @apiParam {Number} idCategory Category identifier
 *
 * @apiSuccess {Number} idTask Task identifier
 * @apiSuccess {Number} idCategory Category identifier
 *
 * @apiError {String} taskCategoryAssociationDoesntExist Association not found
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'UPDATE' }]);

  const [validated, error] = await operation.delete(req, removeSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const result = await taskCategoryRemove({
      idAccount: validated.credential.idAccount,
      idTask: validated.params.idTask,
      idCategory: validated.params.idCategory,
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
