import Role from '../models/RoleModel.js';
import Permission from '../models/PermissionModel.js';

export const createRole = async (req, res) => {
  try {
    const { name, description, is_default, status } = req.body;

    // Check if role already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: 'Role with this name already exists'
      });
    }

    // Create role
    const role = new Role({
      name,
      description: description || '',
      is_default: is_default || false,
      status: status || 'active'
    });

    await role.save();

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: role
    });
  } catch (error) {
    console.error('Create role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create role',
      error: error.message
    });
  }
};

export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find({}).populate('permissions');

    // Get user count for each role
    const User = (await import('../models/UserModel.js')).default;
    const rolesWithUserCount = await Promise.all(
      roles.map(async (role) => {
        const userCount = await User.countDocuments({ role: role._id });
        return {
          ...role.toObject(),
          userCount
        };
      })
    );

    res.json({
      success: true,
      data: rolesWithUserCount
    });
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch roles',
      error: error.message
    });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id).populate('permissions');
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }
    res.json({
      success: true,
      data: role
    });
  } catch (error) {
    console.error('Get role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch role',
      error: error.message
    });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, is_default, status } = req.body;

    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Update fields
    if (name) role.name = name;
    if (description !== undefined) role.description = description;
    if (is_default !== undefined) role.is_default = is_default;
    if (status) role.status = status;

    await role.save();

    res.json({
      success: true,
      message: 'Role updated successfully',
      data: role
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update role',
      error: error.message
    });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Check if role is assigned to users
    const User = (await import('../models/UserModel.js')).default;
    const usersWithRole = await User.countDocuments({ role: id });
    if (usersWithRole > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete role that is assigned to users'
      });
    }

    // Delete associated permissions
    await Permission.deleteMany({ role: id });

    // Delete role
    await Role.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    console.error('Delete role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete role',
      error: error.message
    });
  }
};

export const getUsersByRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    const User = (await import('../models/UserModel.js')).default;
    const users = await User.find({ role: id }).select('first_name last_name username email phone_number status is_active');

    res.json({
      success: true,
      data: {
        role: role.name,
        users: users.map(user => ({
          id: user._id,
          name: `${user.first_name} ${user.last_name}`.trim(),
          username: user.username,
          email: user.email,
          phone_number: user.phone_number,
          status: user.status,
          is_active: user.is_active
        }))
      }
    });
  } catch (error) {
    console.error('Get users by role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users by role',
      error: error.message
    });
  }
};