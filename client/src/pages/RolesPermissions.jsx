import { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import apiService from '../services/api';

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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rolesRes, permissionsRes] = await Promise.all([
        apiService.getRoles(),
        apiService.getPermissions()
      ]);

      if (rolesRes.success) {
        setRoles(rolesRes.data);
      }

      if (permissionsRes.success) {
        setPermissions(permissionsRes.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRole) {
        await apiService.updateRole(editingRole._id, roleForm);
      } else {
        await apiService.createRole(roleForm);
      }
      await loadData();
      setShowRoleModal(false);
      setEditingRole(null);
      setRoleForm({ name: '', description: '', is_default: false, status: 'active' });
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setRoleForm({
      name: role.name,
      description: role.description || '',
      is_default: role.is_default,
      status: role.status
    });
    setShowRoleModal(true);
  };

  const handleDeleteRole = async (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await apiService.deleteRole(roleId);
        await loadData();
      } catch (error) {
        console.error('Error deleting role:', error);
      }
    }
  };

  const loadUsersByRole = async (roleId) => {
    try {
      const response = await apiService.getUsersByRole(roleId);
      if (response.success) {
        setUsersByRole(response.data.users);
      }
    } catch (error) {
      console.error('Error loading users by role:', error);
    }
  };

  const tabs = [
    { id: 'roles', label: 'Roles', count: roles.length },
    { id: 'permissions', label: 'Permissions', count: permissions.length },
    { id: 'users', label: 'Users by Role', count: usersByRole.length }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
        <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />

        {/* Content */}
        <main className="pt-20 px-6 pb-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Role & Permissions Management</h1>
              <p className="text-gray-600">Manage user roles and their permissions</p>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
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
            </div>

            {/* Tab Content */}
            {activeTab === 'roles' && (
              <div className="space-y-6">
                {/* Add Role Button */}
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Roles</h2>
                  <Button
                    onClick={() => {
                      setEditingRole(null);
                      setRoleForm({ name: '', description: '', is_default: false, status: 'active' });
                      setShowRoleModal(true);
                    }}
                  >
                    Add New Role
                  </Button>
                </div>

                {/* Roles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {roles.map((role) => (
                    <Card key={role._id} className="hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800">{role.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{role.description || 'No description'}</p>
                          <div className="flex items-center space-x-2 mt-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              role.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {role.status}
                            </span>
                            {role.is_default && (
                              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            {role.userCount || 0} users assigned
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => loadUsersByRole(role._id)}
                          >
                            View Users
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditRole(role)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteRole(role._id)}
                            disabled={role.is_default}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'permissions' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Permissions</h2>

                {/* Permissions List */}
                <Card>
                  <div className="space-y-4">
                    {permissions.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No permissions found</p>
                    ) : (
                      permissions.map((permission) => (
                        <div key={permission._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-800">{permission.module}</h4>
                            <p className="text-sm text-gray-600">Role: {permission.role?.name || 'Unknown'}</p>
                          </div>
                          <div className="flex space-x-2">
                            {permission.can_create && <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Create</span>}
                            {permission.can_read && <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Read</span>}
                            {permission.can_update && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Update</span>}
                            {permission.can_delete && <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Delete</span>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Users by Role</h2>

                {/* Users List */}
                <Card>
                  <div className="space-y-4">
                    {usersByRole.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">Select a role to view users</p>
                    ) : (
                      usersByRole.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-800">{user.name}</h4>
                            <p className="text-sm text-gray-600">@{user.username} • {user.email}</p>
                            <p className="text-sm text-gray-500">{user.phone_number}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              user.is_active ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                <input
                  type="text"
                  value={roleForm.name}
                  onChange={(e) => setRoleForm({...roleForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={roleForm.description}
                  onChange={(e) => setRoleForm({...roleForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows="3"
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={roleForm.is_default}
                    onChange={(e) => setRoleForm({...roleForm, is_default: e.target.checked})}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Default Role</span>
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
    </div>
  );
};

export default RolesPermissions;