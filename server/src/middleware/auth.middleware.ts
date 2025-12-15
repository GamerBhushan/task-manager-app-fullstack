import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { ZodType } from 'zod';
import prisma from '../lib/prisma.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // FIX 1: Use optional chaining (?.) for cookies to prevent crash if cookie-parser is missing
    // FIX 2: handle the Authorization header safely
    const authHeader = req.headers.authorization;
    
    // Check cookie OR Bearer token
    const token = req.cookies?.token || (authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

    if (!token) {
      res.status(401).json({ error: 'Authentication required' });
      return; 
    }

    // 2. Verify token
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };

    // 3. Find User
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    // console.error('Auth Error:', error); // Optional: Comment out to reduce noise in terminal
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Keep the validate middleware here since it was in your old file
export const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error: any) {
    return res.status(400).json({ error: error.errors || 'Invalid data' });
  }
};