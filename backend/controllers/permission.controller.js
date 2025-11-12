import Permission from '../models/PermissionModel.js';
import Role from '../models/RoleModel.js';

// export const createPermission = async (req, res) => {
//   try {
//     const { role_name, module, can_create, can_read, can_update, can_delete } = req.body;

//     // Find role by name
//     const roleDoc = await Role.findOne({ name: role_name, status: 'active' });
//     if (!roleDoc) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid role specified'
//       });
//     }

//     // Check if permission already exists for this role and module
//     const existingPermission = await Permission.findOne({ role: roleDoc._id, module });
//     if (existingPermission) {
//       return res.status(400).json({
//         success: false,
//         message: 'Permission already exists for this role and module'
//       });
//     }

//     // Create permission
//     const permission = new Permission({
//       role: roleDoc._id,
//       module,
//       can_create: can_create || false,
//       can_read: can_read !== undefined ? can_read : true,
//       can_update: can_update || false,
//       can_delete: can_delete || false
//     });

//     await permission.save();

//     // Add permission to role
//     roleDoc.permissions.push(permission._id);
//     await roleDoc.save();

//     res.status(201).json({
//       success: true,
//       message: 'Permission created successfully',
//       data: permission
//     });
//   } catch (error) {
//     console.error('Create permission error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create permission',
//       error: error.message
//     });
//   }
// };


export const createPermission = async (req, res) => {
  try {
    const { role, role_name, module, can_create, can_read, can_update, can_delete, can_view } = req.body;

    let roleDoc;

    if (role) {
      // If frontend sends role ID
      roleDoc = await Role.findById(role);
    } else if (role_name) {
      // If frontend sends role name
      roleDoc = await Role.findOne({ name: role_name, status: 'active' });
    }

    if (!roleDoc) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified',
      });
    }

    const existingPermission = await Permission.findOne({ role: roleDoc._id, module });
    if (existingPermission) {
      return res.status(400).json({
        success: false,
        message: 'Permission already exists for this role and module',
      });
    }

    const permission = new Permission({
      role: roleDoc._id,
      module,
      can_create: can_create || false,
      can_read: can_read !== undefined ? can_read : true,
      can_update: can_update || false,
      can_delete: can_delete || false,
      can_view: can_view || false
    });

    await permission.save();

    roleDoc.permissions.push(permission._id);
    await roleDoc.save();

    res.status(201).json({
      success: true,
      message: 'Permission created successfully',
      data: permission,
    });
  } catch (error) {
    console.error('Create permission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create permission',
      error: error.message,
    });
  }
};

export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find({}).populate('role', 'name');
    res.json({
      success: true,
      data: permissions
    });
  } catch (error) {
    console.error('Get permissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch permissions',
      error: error.message
    });
  }
};

export const getPermissionsByRole = async (req, res) => {
  try {
    const { role_name } = req.params;
    const role = await Role.findOne({ name: role_name });
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    const permissions = await Permission.find({ role: role._id });
    res.json({
      success: true,
      data: permissions
    });
  } catch (error) {
    console.error('Get permissions by role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch permissions',
      error: error.message
    });
  }
};

export const updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, module, can_create, can_read, can_update, can_delete,can_view } = req.body;

    const permission = await Permission.findById(id);
    if (!permission) {
      return res.status(404).json({
        success: false,
        message: 'Permission not found'
      });
    }

    // Update fields
    if (role) permission.role = role;
    if (module) permission.module = module;
    if (can_create !== undefined) permission.can_create = can_create;
    if (can_read !== undefined) permission.can_read = can_read;
    if (can_update !== undefined) permission.can_update = can_update;
    if (can_delete !== undefined) permission.can_delete = can_delete;
    if(can_view !== undefined) permission.can_view = can_view

    await permission.save();

    res.json({
      success: true,
      message: 'Permission updated successfully',
      data: permission
    });
  } catch (error) {
    console.error('Update permission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update permission',
      error: error.message
    });
  }
};

export const deletePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const permission = await Permission.findById(id);
    if (!permission) {
      return res.status(404).json({
        success: false,
        message: 'Permission not found'
      });
    }

    // Remove permission from role
    await Role.findByIdAndUpdate(permission.role, {
      $pull: { permissions: permission._id }
    });

    // Delete permission
    await Permission.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Permission deleted successfully'
    });
  } catch (error) {
    console.error('Delete permission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete permission',
      error: error.message
    });
  }
};