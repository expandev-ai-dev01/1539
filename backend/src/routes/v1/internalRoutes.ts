import { Router } from 'express';
import * as taskController from '@/api/v1/internal/task/controller';

const router = Router();

// Task routes
router.post('/task', taskController.postHandler);

export default router;
