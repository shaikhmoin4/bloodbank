import express from 'express';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';
import roleRoutes from './role.routes.js';
import permissionRoutes from './permission.routes.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Blood Bank API is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Test route
router.get('/test', (req, res) => {
  res.status(200).json({
    message: 'Test route working',
    data: {
      server: 'Blood Bank API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    }
  });
});


router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);

export default router;