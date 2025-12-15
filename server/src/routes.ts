import { Router } from 'express';
import * as AuthController from './controllers/auth.controller.js';
import * as TaskController from './controllers/task.controller.js';
import { authenticate, validate } from './middleware/auth.middleware.js';
import { registerSchema, loginSchema, createTaskSchema, updateTaskSchema } from './validators/schemas.js';
import { getUsers } from './controllers/user.controller.js';
import { getNotifications, markAsRead } from './controllers/notification.controller.js';

const router = Router();

// Auth Routes
router.post('/auth/register', validate(registerSchema), AuthController.register);
router.post('/auth/login', validate(loginSchema), AuthController.login);
router.post('/auth/logout', AuthController.logout);
router.get('/auth/me', authenticate, AuthController.getMe);
// Add this route under Auth Routes
router.patch('/auth/me', authenticate, AuthController.updateProfile);
// Inside auth routes
router.delete('/auth/me', authenticate, AuthController.deleteAccount);

router.patch('/auth/password', authenticate, AuthController.updatePassword);

router.get('/users', authenticate, getUsers); // <--- Add this line

// Task Routes
router.use('/tasks', authenticate); // Protect all task routes
router.get('/tasks', TaskController.getTasks);
router.post('/tasks', validate(createTaskSchema), TaskController.createTask);
router.patch('/tasks/:id', validate(updateTaskSchema), TaskController.updateTask);
router.delete('/tasks/:id', TaskController.deleteTask);


router.get('/notifications', authenticate, getNotifications);
router.patch('/notifications/:id/read', authenticate, markAsRead);

export default router;