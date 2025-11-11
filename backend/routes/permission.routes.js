import express from 'express';
import {
  createPermission,
  getAllPermissions,
  getPermissionsByRole,
  updatePermission,
  deletePermission
} from '../controllers/permission.controller.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const permissionRoutes = express.Router();

// Permission CRUD routes
permissionRoutes.post('/', authenticateToken, createPermission);
permissionRoutes.get('/', authenticateToken, getAllPermissions);
permissionRoutes.get('/role/:role_name', authenticateToken, getPermissionsByRole);
permissionRoutes.put('/:id', authenticateToken, updatePermission);
permissionRoutes.delete('/:id', authenticateToken, deletePermission);

export default permissionRoutes;