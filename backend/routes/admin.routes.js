import express from 'express';

const adminRoutes = express.Router();


adminRoutes.get('/dashboard', (req, res) => {
  res.json({ message: 'Admin dashboard - Coming soon' });
}); 

adminRoutes.get('/users', (req, res) => {
  res.json({ message: 'Users management - Coming soon' });
});

adminRoutes.get('/roles', (req, res) => {
  res.json({ message: 'Roles management - Coming soon' });
});

adminRoutes.get('/permissions', (req, res) => {
  res.json({ message: 'Permissions management - Coming soon' });
});

export default adminRoutes;