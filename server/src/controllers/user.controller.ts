import type { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

export const getUsers = async (req: Request, res: Response) => {
  try {
    // Fetch all users, but only return their ID and Name (Security best practice)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};