// Fix: Import the shared instance we just created
import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Remove: const prisma = new PrismaClient(); 

export const AuthService = {
  // ... keep existing code ...
  async register(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return prisma.user.create({ // uses shared prisma
      data: { ...data, password: hashedPassword },
      select: { id: true, name: true, email: true }
    });
  },
  // ... keep existing code ...
  async login(data: any) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    return { user: { id: user.id, name: user.name, email: user.email }, token };
  },

  // Add this new function to AuthService object
  async updateProfile(userId: string, data: { name?: string; email?: string }) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, name: true, email: true }
    });
  },

  // Add to AuthService object:
  async deleteAccount(userId: string) {
    return prisma.user.delete({
      where: { id: userId }
    });
  }
  ,
  // Add this new function:
  async updatePassword(userId: string, oldPassword: string, newPassword: string) {
    // 1. Get the user to check current password
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    // 2. Verify Old Password
    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) throw new Error('Invalid current password');

    // 3. Hash New Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update
    return prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
  }

};

