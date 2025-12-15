// Fix: Import the shared instance
import prisma from '../lib/prisma.js';
import { io } from '../server.js'; 

// Remove: const prisma = new PrismaClient(); 

export const TaskService = {
  // ... keep existing code ...
  async getAll(userId: string, filters: any) {
    return prisma.task.findMany({
      where: {
        OR: [
          { creatorId: userId },
          { assignedToId: userId }
        ],
        ...filters
      },
      include: { assignedTo: { select: { name: true, id: true } } },
      orderBy: { dueDate: 'asc' }
    });
  },
  // ... keep the rest of your methods (create, update, delete) exactly as they were ...
  async create(userId: string, data: any) {
    const task = await prisma.task.create({
      data: { ...data, creatorId: userId },
      include: { assignedTo: { select: { name: true, id: true } } }
    });
    io.emit('taskCreated', task);
    return task;
  },

  async update(id: string, data: any) {
    const task = await prisma.task.update({
      where: { id },
      data,
      include: { assignedTo: { select: { name: true, id: true } } }
    });
    io.emit('taskUpdated', task);
    if (data.assignedToId) {
      io.to(data.assignedToId).emit('notification', {
        message: `You have been assigned to task: ${task.title}`,
        taskId: task.id
      });
    }
    return task;
  },

  async delete(id: string) {
    await prisma.task.delete({ where: { id } });
    io.emit('taskDeleted', id);
  }
};