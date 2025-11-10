import { Router } from 'express';
import * as taskController from '@/api/v1/internal/task/controller';
import * as categoryController from '@/api/v1/internal/category/controller';
import * as taskCategoryController from '@/api/v1/internal/task-category/controller';

const router = Router();

// Task routes
router.post('/task', taskController.postHandler);

// Category routes
router.get('/category', categoryController.listHandler);
router.post('/category', categoryController.postHandler);
router.get('/category/:id', categoryController.getHandler);
router.put('/category/:id', categoryController.putHandler);
router.delete('/category/:id', categoryController.deleteHandler);

// Task-Category association routes
router.get('/task-category/:idTask', taskCategoryController.listHandler);
router.post('/task-category', taskCategoryController.postHandler);
router.delete('/task-category/:idTask/:idCategory', taskCategoryController.deleteHandler);

export default router;
