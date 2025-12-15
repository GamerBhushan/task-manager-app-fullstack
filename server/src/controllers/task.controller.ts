import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware.js';
import { Priority, Status } from '../../generated/prisma/index.js'; 
import prisma from '../lib/prisma.js';
import { io } from '../server.js';

// Helper to create real-time notifications
const createAssignmentNotification = async (taskId: string, assigneeId: string, taskTitle: string, creatorName: string) => {
  if (!assigneeId) return;

  const notification = await prisma.notification.create({
    data: {
      userId: assigneeId,
      taskId: taskId,
      message: `You were assigned to task "${taskTitle}" by ${creatorName}`,
    }
  });

  io.emit('notification', notification); 
};

// --- READ TASKS (VISIBILITY RESTRICTED) ---
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { status, priority } = req.query;
    const currentUserId = req.user!.id;

    const tasks = await prisma.task.findMany({
      where: {
        // 🔒 SECURITY RULE: 
        // Only return tasks where the user is the CREATOR or the ASSIGNEE.
        OR: [
          { creatorId: currentUserId },
          { assignedToId: currentUserId }
        ],
        // Apply existing filters
        ...(status ? { status: status as Status } : {}),
        ...(priority ? { priority: priority as Priority } : {})
      },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// --- CREATE TASK ---
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { dueDate, assignedToId, ...otherData } = req.body;
    const creatorId = req.user!.id;

    const task = await prisma.task.create({
      data: {
        ...otherData,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        creatorId,
        assignedToId: assignedToId || null,
      },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        creator: { select: { name: true } }
      }
    });

    // Notify assignee if it's not the creator
    if (assignedToId && assignedToId !== creatorId) {
      await createAssignmentNotification(task.id, assignedToId, task.title, req.user!.name);
    }

    io.emit('task_updated', { type: 'CREATE', task });
    res.status(201).json(task);
  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(400).json({ error: 'Failed to create task' });
  }
};

// --- UPDATE TASK ---
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Task ID is required' });

    const { dueDate, assignedToId, ...otherData } = req.body;
    
    // Check previous assignment for notification logic
    const oldTask = await prisma.task.findUnique({ where: { id } });

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...otherData,
        ...(dueDate !== undefined ? { dueDate: dueDate ? new Date(dueDate) : null } : {}),
        ...(assignedToId !== undefined ? { assignedToId: assignedToId || null } : {})
      },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        creator: { select: { name: true } }
      }
    });

    // Notify if assignee CHANGED
    if (assignedToId && oldTask?.assignedToId !== assignedToId && assignedToId !== req.user!.id) {
       await createAssignmentNotification(task.id, assignedToId, task.title, req.user!.name);
    }

    io.emit('task_updated', { type: 'UPDATE', task });
    res.json(task);
  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(400).json({ error: 'Failed to update task' });
  }
};

// --- DELETE TASK ---
export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Task ID is required' });
        return;
      }
      await prisma.task.delete({ where: { id } });
      io.emit('task_updated', { type: 'DELETE', id });
      res.json({ message: 'Task deleted' });
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete task' });
    }
};