import type { Request, Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware.js';
import { AuthService } from '../services/auth.service.js';

export const register = async (req: Request, res: Response) => {
  try {
    // 1. Create the user
    await AuthService.register(req.body);

    // 2. Log them in immediately to get the token
    // We reuse the login logic here to ensure consistency
    const { user, token } = await AuthService.login({ 
      email: req.body.email, 
      password: req.body.password 
    });
    
    // 3. Set the cookie (Just like in login)
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 Day
      sameSite: 'lax'
    });

    // 4. Return user and token
    res.status(201).json({ user, token });

  } catch (e) {
    res.status(400).json({ error: 'User already exists or invalid data' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { user, token } = await AuthService.login(req.body);
    
    // Set HttpOnly Cookie
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 Day
      sameSite: 'lax' // FIX: 'lax' is required for localhost login to work reliably
    });

    // FIX: Return BOTH user and token in the JSON body
    // The frontend expects: { user: {...}, token: "..." }
    res.json({ user, token });
  } catch (e) {
    res.status(401).json({ error: 'Invalid credentials' });
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
  
  // FIX: Return the FULL user object (name, email), not just ID
  // The dashboard needs 'req.user.name' to display the profile
  res.json(req.user);
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const updatedUser = await AuthService.updateProfile(req.user!.id, req.body);
    res.json(updatedUser);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  try {
    await AuthService.deleteAccount(req.user!.id);
    res.clearCookie('token'); // Clear auth cookie
    res.json({ message: 'Account deleted successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete account' });
  }
};

export const updatePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    await AuthService.updatePassword(req.user!.id, oldPassword, newPassword);
    res.json({ message: 'Password updated successfully' });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};