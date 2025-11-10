import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { taskCreate } from '@/services/task';
import { zString, zNullableString, zDateString, zNullableFK } from '@/utils/zodValidation';

const securable = 'TASK';

const createTaskSchema = z.object({
  title: zString.min(3, 'titleTooShort').max(100, 'titleTooLong'),
  description: zNullableString(1000),
  dueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'invalidDateFormat' })
    .nullable()
    .optional(),
  priority: z.number().int().min(0).max(2).optional(),
  estimatedTime: z.number().int().min(5).max(1440).nullable().optional(),
  recurrenceConfig: zNullableString(),
});

type TaskCreateRequest = z.infer<typeof createTaskSchema>;

/**
 * @api {post} /api/v1/internal/task Create Task
 * @apiName CreateTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new task with specified parameters including title,
 * description, due date, priority, estimated time, and recurrence configuration.
 *
 * @apiParam {String} title Task title (3-100 characters, required)
 * @apiParam {String} [description] Task description (max 1000 characters)
 * @apiParam {String} [dueDate] Due date in ISO format (YYYY-MM-DD)
 * @apiParam {Number} [priority] Priority level (0=Low, 1=Medium, 2=High, default=1)
 * @apiParam {Number} [estimatedTime] Estimated time in minutes (5-1440)
 * @apiParam {String} [recurrenceConfig] JSON configuration for recurring tasks
 *
 * @apiSuccess {Number} idTask Created task identifier
 *
 * @apiError {String} titleRequired Title is required
 * @apiError {String} titleTooShort Title must be at least 3 characters
 * @apiError {String} titleTooLong Title must not exceed 100 characters
 * @apiError {String} descriptionTooLong Description must not exceed 1000 characters
 * @apiError {String} dueDateInPast Due date cannot be in the past
 * @apiError {String} invalidPriority Priority must be 0, 1, or 2
 * @apiError {String} invalidEstimatedTime Estimated time must be between 5 and 1440 minutes
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'CREATE' }]);

  const [validated, error] = await operation.create(req, createTaskSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = validated.params as TaskCreateRequest;

    const result = await taskCreate({
      idAccount: validated.credential.idAccount,
      idUser: validated.credential.idUser,
      title: data.title,
      description: data.description || null,
      dueDate: data.dueDate || null,
      priority: data.priority !== undefined ? data.priority : 1,
      estimatedTime: data.estimatedTime || null,
      recurrenceConfig: data.recurrenceConfig || null,
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
