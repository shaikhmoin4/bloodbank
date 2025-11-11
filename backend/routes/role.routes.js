import express from 'express';
import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  getUsersByRole
} from '../controllers/role.controller.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const roleRoutes = express.Router();

// Role CRUD routes
roleRoutes.post('/', authenticateToken, createRole);
roleRoutes.get('/', authenticateToken, getAllRoles);
roleRoutes.get('/:id', authenticateToken, getRoleById);
roleRoutes.put('/:id', authenticateToken, updateRole);
roleRoutes.delete('/:id', authenticateToken, deleteRole);
roleRoutes.get('/:id/users', authenticateToken, getUsersByRole);

export default roleRoutes;