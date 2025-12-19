import type { Request, Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware.js';
import { AuthService } from '../services/auth.service.js';
import { z } from 'zod'; // Import zod to check for validation errors

export const register = async (req: Request, res: Response) => {
  try {
    console.log("📝 Register Attempt:", req.body); // LOG 1: See what data arrives

    // 1. Create the user
    await AuthService.register(req.body);

    // 2. Log them in immediately to get the token
    const { user, token } = await AuthService.login({ 
      email: req.body.email, 
      password: req.body.password 
    });
    
    // 3. Set the cookie
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, 
      sameSite: 'lax'
    });

    // 4. Return user and token
    res.status(201).json({ user, token });

  } catch (e: any) {
    // 🔥 LOG THE REAL ERROR HERE
    console.error("❌ Registration Error:", e);

    // If it's a Validation Error (Zod), send specific details
    if (e instanceof z.ZodError) {
      return res.status(400).json({ 
        error: "Validation Failed", 
        details: e.issues 
      });
    }

    // If "User already exists" is thrown by AuthService
    if (e.message && e.message.includes('exists')) {
       return res.status(400).json({ error: e.message });
    }

    // Otherwise, send the actual error message
    res.status(500).json({ error: e.message || "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { user, token } = await AuthService.login(req.body);
    
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, 
      sameSite: 'lax'
    });

    res.json({ user, token });
  } catch (e: any) {
    console.error("❌ Login Error:", e); // Log login errors too
    res.status(401).json({ error: e.message || 'Invalid credentials' });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

export const getMe = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
     res.status(401).json({ error: 'Not authenticated' });
     return;
  }
  res.json(req.user);
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const updatedUser = await AuthService.updateProfile(req.user!.id, req.body);
    res.json(updatedUser);
  } catch (e) {
    console.error("Profile Update Error:", e);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  try {
    await AuthService.deleteAccount(req.user!.id);
    res.clearCookie('token'); 
    res.json({ message: 'Account deleted successfully' });
  } catch (e) {
    console.error("Delete Account Error:", e);
    res.status(500).json({ error: 'Failed to delete account' });
  }
};

export const updatePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    await AuthService.updatePassword(req.user!.id, oldPassword, newPassword);
    res.json({ message: 'Password updated successfully' });
  } catch (e: any) {
    console.error("Password Update Error:", e);
    res.status(400).json({ error: e.message });
  }
};