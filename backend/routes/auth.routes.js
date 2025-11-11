import express from 'express';
import { register, login, logout, getProfile } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const authRoutes = express.Router();

// Auth routes
authRoutes.post('/register', register);
authRoutes.post('/login', login);

// Protected routes
authRoutes.post('/logout', authenticateToken, logout);
authRoutes.get('/profile', authenticateToken, getProfile);

export default authRoutes;