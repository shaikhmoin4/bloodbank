import { useState, useEffect, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';

import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../services/api';

const RolesPermissions = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('roles');
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [usersByRole, setUsersByRole] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    is_default: false,
    status: 'active'
  });

  // Permission Modal States
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);

  const [permissionForm, setPermissionForm] = useState({
    role: '',
    module: '',
    can_create: false,
    can_view: false,
    can_read: true,
    can_update: false,
    can_delete: false
  });

  // Available modules for permissions
  const availableModules = [
    'dashboard',
    'reception',
    'patient-history',
    'blood-request',
    'roles-permissions',
    'users',
    'donor',
    'camp',
    'serology',
    'quarantine',
    'component',
    'reports',
    'admin',
    'configuration'
  ];

  useEffect(() => {
    fetchRoleData();
    fetchPermissionData();
  }, []);

  // Fetch Roles
  const fetchRoleData = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/roles');
      setRoles(data.data || data);
    } catch (err) {
      console.error("Failed to fetch roles:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Permissions
  const fetchPermissionData = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/permissions');
      setPermissions(data.data || data);
    } catch (err) {
      console.error("Failed to fetch permissions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create Role
  const createRole = async (roleData) => {
    try {
      const { data } = await api.post('/roles', roleData);
      return data;
    } catch (err) {
      console.error("Failed to create role:", err);
      throw err;
    }
  };

  // Update Role
  const updateRole = async (roleId, roleData) => {
    try {
      const { data } = await api.put(`/roles/${roleId}`, roleData);
      return data;
    } catch (err) {
      console.error("Failed to update role:", err);
      throw err;
    }
  };

  // Delete Role
  const deleteRole = async (roleId) => {
    try {
      const { data } = await api.delete(`/roles/${roleId}`);
      return data;
    } catch (err) {
      console.error("Failed to delete role:", err);
      throw err;
    }
  };

  // Create Permission
  const createPermission = async (permissionData) => {
    try {
      const { data } = await api.post('/permissions', permissionData);
      return data;
    } catch (err) {
      console.error("Failed to create permission:", err);
      throw err;
    }
  };

  // Update Permission
  const updatePermission = async (permissionId, permissionData) => {
    try {
      const { data } = await api.put(`/permissions/${permissionId}`, permissionData);
      return data;
    } catch (err) {
      console.error("Failed to update permission:", err);
      throw err;
    }
  };

  // Delete Permission
  const deletePermission = async (permissionId) => {
    try {
      const { data } = await api.delete(`/permissions/${permissionId}`);
      return data;
    } catch (err) {
      console.error("Failed to delete permission:", err);
      throw err;
    }
  };

  // Get Users by Role
  const getUsersByRole = async (roleId) => {
    try {
      const { data } = await api.get(`/roles/${roleId}/users`);
      return data;
    } catch (err) {
      console.error("Failed to fetch users by role:", err);
      throw err;
    }
  };

  // Role Form Submit Handler
  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRole) {
        await updateRole(editingRole._id, roleForm);
      } else {
        await createRole(roleForm);
      }
      await fetchRoleData();
      setShowRoleModal(false);
      setEditingRole(null);
      setRoleForm({ 
        name: '', 
        description: '', 
        is_default: false, 
        status: 'active' 
      });
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  // Edit Role Handler
  const handleEditRole = (role) => {
    setEditingRole(role);
    setRoleForm({
      name: role.name,
      description: role.description || '',
      is_default: role.is_default || false,
      status: role.status || 'active'
    });
    setShowRoleModal(true);
  };

  // Delete Role Handler
  const handleDeleteRole = async (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await deleteRole(roleId);
        await fetchRoleData();
      } catch (error) {
        console.error('Error deleting role:', error);
      }
    }
  };

  // Permission Form Submit Handler
  const handlePermissionSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPermission) {
        await updatePermission(editingPermission._id, permissionForm);
      } else {
        await createPermission(permissionForm);
      }
      await fetchPermissionData();
      setShowPermissionModal(false);
      setEditingPermission(null);
      setPermissionForm({
        role: '',
        module: '',
        can_create: false,
        can_view: false,
        can_read: true,
        can_update: false,
        can_delete: false
      });
    } catch (error) {
      console.error('Error saving permission:', error);
    }
  };

  // Edit Permission Handler
  const handleEditPermission = (permission) => {
    setEditingPermission(permission);
    setPermissionForm({
      role: permission.role?._id || permission.role,
      module: permission.module,
      can_create: permission.can_create,
      can_view: permission.can_view,
      can_read: permission.can_read,
      can_update: permission.can_update,
      can_delete: permission.can_delete
    });
    setShowPermissionModal(true);
  };

  // Delete Permission Handler
  const handleDeletePermission = async (permissionId) => {
    if (window.confirm('Are you sure you want to delete this permission?')) {
      try {
        await deletePermission(permissionId);
        await fetchPermissionData();
      } catch (error) {
        console.error('Error deleting permission:', error);
      }
    }
  };

  // Load Users by Role
  const loadUsersByRole = async (roleId) => {
    try {
      const response = await getUsersByRole(roleId);
      setUsersByRole(response.data?.users || response.users || []);
      setActiveTab('users');
    } catch (error) {
      console.error('Error loading users by role:', error);
    }
  };

  const tabs = [
    { id: 'roles', label: 'Roles', count: roles.length },
    { id: 'permissions', label: 'Permissions', count: permissions.length },
    { id: 'users', label: 'Users by Role', count: usersByRole.length }
  ];

  // --- React Table Setup for Roles ---
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Role Name',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: (info) => info.getValue() || '—',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              row.original.status === 'active'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {row.original.status}
          </span>
        ),
      },
      {
        accessorKey: 'is_default',
        header: 'Default',
        cell: ({ row }) =>
          row.original.is_default ? (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">Yes</span>
          ) : (
            'No'
          ),
      },
      {
        accessorKey: 'userCount',
        header: 'Users',
        cell: ({ row }) => row.original.userCount || 0,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => loadUsersByRole(row.original._id)}
            >
              View Users
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEditRole(row.original)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleDeleteRole(row.original._id)}
              disabled={row.original.is_default}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  // --- React Table Setup for Permissions ---
  const permissionColumns = useMemo(
    () => [
      {
        accessorKey: 'module',
        header: 'Module',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'role.name',
        header: 'Role',
        cell: (info) => info.getValue() || '—',
      },
      {
        accessorKey: 'can_read',
        header: 'Read',
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              row.original.can_read
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {row.original.can_read ? 'Yes' : 'No'}
          </span>
        ),
      },
      {
        accessorKey: 'can_create',
        header: 'Create',
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              row.original.can_create
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {row.original.can_create ? 'Yes' : 'No'}
          </span>
        ),
      },
      {
        accessorKey: 'can_update',
        header: 'Update',
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              row.original.can_update
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {row.original.can_update ? 'Yes' : 'No'}
          </span>
        ),
      },
      {
        accessorKey: 'can_delete',
        header: 'Delete',
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              row.original.can_delete
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {row.original.can_delete ? 'Yes' : 'No'}
          </span>
        ),
      },
      {
        accessorKey: 'can_view',
        header: 'View',
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              row.original.can_view
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {row.original.can_view ? 'Yes' : 'No'}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEditPermission(row.original)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleDeletePermission(row.original._id)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: roles,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const permissionTable = useReactTable({
    data: permissions,
    columns: permissionColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      {/* <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      /> */}

      {/* Main Content */}
      <div className={`transition-all duration-300 `}>
        {/* <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} /> */}

        <main className="pt-20 px-6 pb-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Role & Permissions Management
              </h1>
              <p className="text-gray-600">Manage user roles and their permissions</p>
            </div>

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </nav>
            </div>


            {/* Roles Table */}
            {activeTab === 'roles' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Roles</h2>
                  <Button
                    onClick={() => {
                      setEditingRole(null);
                      setRoleForm({
                        name: '',
                        description: '',
                        is_default: false,
                        status: 'active',
                      });
                      setShowRoleModal(true);
                    }}
                  >
                    Add New Role
                  </Button>
                </div>

                <Card>
                  {loading ? (
                    <p className="text-center py-6 text-gray-500">Loading...</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                              {headerGroup.headers.map((header) => (
                                <th
                                  key={header.id}
                                  onClick={header.column.getToggleSortingHandler()}
                                  className="px-4 py-2 text-left text-sm font-semibold text-gray-700 cursor-pointer select-none"
                                >
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                                  {{
                                    asc: ' 🔼',
                                    desc: ' 🔽',
                                  }[header.column.getIsSorted()] ?? null}
                                </th>
                              ))}
                            </tr>
                          ))}
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                              <tr key={row.id} className="hover:bg-gray-50">
                                {row.getVisibleCells().map((cell) => (
                                  <td
                                    key={cell.id}
                                    className="px-4 py-2 text-sm text-gray-700"
                                  >
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext()
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={columns.length}
                                className="text-center py-6 text-gray-500"
                              >
                                No roles found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* Permissions Tab */}
            {activeTab === 'permissions' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Permissions</h2>
                  <Button
                    onClick={() => {
                      setEditingPermission(null);
                      setPermissionForm({
                        role: '',
                        module: '',
                        can_create: false,
                        can_read: true,
                        can_update: false,
                        can_delete: false
                      });
                      setShowPermissionModal(true);
                    }}
                  >
                    Add New Permission
                  </Button>
                </div>

                <Card>
                  {loading ? (
                    <p className="text-center py-6 text-gray-500">Loading...</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          {permissionTable.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                              {headerGroup.headers.map((header) => (
                                <th
                                  key={header.id}
                                  onClick={header.column.getToggleSortingHandler()}
                                  className="px-4 py-2 text-left text-sm font-semibold text-gray-700 cursor-pointer select-none"
                                >
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                                  {{
                                    asc: ' 🔼',
                                    desc: ' 🔽',
                                  }[header.column.getIsSorted()] ?? null}
                                </th>
                              ))}
                            </tr>
                          ))}
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {permissionTable.getRowModel().rows.length ? (
                            permissionTable.getRowModel().rows.map((row) => (
                              <tr key={row.id} className="hover:bg-gray-50">
                                {row.getVisibleCells().map((cell) => (
                                  <td
                                    key={cell.id}
                                    className="px-4 py-2 text-sm text-gray-700"
                                  >
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext()
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={permissionColumns.length}
                                className="text-center py-6 text-gray-500"
                              >
                                No permissions found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* Users by Role */}
            {activeTab === 'users' && (
              <Card>
                <div className="space-y-4">
                  {usersByRole.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Select a role to view users
                    </p>
                  ) : (
                    usersByRole.map((user) => (
                      <div
                        key={user._id || user.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium text-gray-800">{user.name}</h4>
                          <p className="text-sm text-gray-600">
                            @{user.username} • {user.email}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              user.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {user.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {editingRole ? 'Edit Role' : 'Add New Role'}
            </h3>
            <form onSubmit={handleRoleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Name
                </label>
                <input
                  type="text"
                  value={roleForm.name}
                  onChange={(e) =>
                    setRoleForm({ ...roleForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={roleForm.description}
                  onChange={(e) =>
                    setRoleForm({ ...roleForm, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows="3"
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={roleForm.is_default}
                    onChange={(e) =>
                      setRoleForm({
                        ...roleForm,
                        is_default: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Default Role
                  </span>
                </label>
                <label className="flex items-center">
                  <select
                    value={roleForm.status}
                    onChange={(e) =>
                      setRoleForm({ ...roleForm, status: e.target.value })
                    }
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRoleModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingRole ? 'Update' : 'Create'} Role
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permission Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {editingPermission ? 'Edit Permission' : 'Add New Permission'}
            </h3>
            <form onSubmit={handlePermissionSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={permissionForm.role}
                  onChange={(e) =>
                    setPermissionForm({ ...permissionForm, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Module
                </label>
                <select
                  value={permissionForm.module}
                  onChange={(e) =>
                    setPermissionForm({ ...permissionForm, module: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Select Module</option>
                  {availableModules.map((module) => (
                    <option key={module} value={module}>
                      {module.charAt(0).toUpperCase() + module.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={permissionForm.can_read}
                    onChange={(e) =>
                      setPermissionForm({
                        ...permissionForm,
                        can_read: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Read</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={permissionForm.can_create}
                    onChange={(e) =>
                      setPermissionForm({
                        ...permissionForm,
                        can_create: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Create</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={permissionForm.can_view}
                    onChange={(e) =>
                      setPermissionForm({
                        ...permissionForm,
                        can_view: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">View</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={permissionForm.can_update}
                    onChange={(e) =>
                      setPermissionForm({
                        ...permissionForm,
                        can_update: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Update</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={permissionForm.can_delete}
                    onChange={(e) =>
                      setPermissionForm({
                        ...permissionForm,
                        can_delete: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Delete</span>
                </label>
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPermissionModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPermission ? 'Update' : 'Create'} Permission
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesPermissions;