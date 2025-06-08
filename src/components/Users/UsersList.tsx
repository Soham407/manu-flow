import React, { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus, Search } from 'lucide-react';
import UserForm from './UserForm';
import UserTableSection from './UserTableSection';
import { Input } from '@/components/ui/input';
import { useUsers } from '@/hooks/useUsers';

const UsersList = () => {
  const { user: currentUser } = useAuth();
  const { users, loading, error, refetch } = useUsers();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getRoleColor = (role: string) => {
    const colors = {
      super_admin: 'bg-red-100 text-red-800',
      admin: 'bg-purple-100 text-purple-800',
      accounts: 'bg-green-100 text-green-800',
      production_manager: 'bg-blue-100 text-blue-800',
      dispatch: 'bg-orange-100 text-orange-800',
      worker: 'bg-gray-100 text-gray-800',
      customer: 'bg-indigo-100 text-indigo-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', userId);

        if (error) throw error;
        refetch();
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user');
      }
    }
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const { error } = await supabase
        .from('users')
        .update({ is_active: !user.isActive })
        .eq('id', userId);

      if (error) throw error;
      refetch();
    } catch (err) {
      console.error('Error toggling user status:', err);
      alert('Failed to update user status');
    }
  };

  const handleSaveUser = async (userData: Partial<User>) => {
    try {
      if (editingUser) {
        const { error } = await supabase
          .from('users')
          .update({
            name: userData.name,
            email: userData.email,
            role: userData.role
          })
          .eq('id', editingUser.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('users')
          .insert([{
            name: userData.name,
            email: userData.email,
            role: userData.role,
            is_active: true
          }]);

        if (error) throw error;
      }
      refetch();
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Error saving user:', err);
      alert('Failed to save user');
    }
  };

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    
    const query = searchQuery.toLowerCase();
    return users.filter(user => 
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  if (!currentUser || (currentUser.role !== 'super_admin' && currentUser.role !== 'admin')) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Access denied. Admin privileges required.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Loading users...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  const adminUsers = filteredUsers.filter(u => u.role === 'super_admin' || u.role === 'admin');
  const accountUsers = filteredUsers.filter(u => u.role === 'accounts');
  const productionUsers = filteredUsers.filter(u => u.role === 'production_manager');
  const dispatchUsers = filteredUsers.filter(u => u.role === 'dispatch');
  const workerUsers = filteredUsers.filter(u => u.role === 'worker');

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-600">Manage system users and their roles</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddUser} className="w-full sm:w-auto">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Edit User' : 'Add New User'}
              </DialogTitle>
            </DialogHeader>
            <UserForm
              user={editingUser}
              onSave={handleSaveUser}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          type="text"
          placeholder="Search users by name, email, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-6">
        <UserTableSection
          title="Super Admin & Admin"
          users={adminUsers}
          getRoleColor={getRoleColor}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          onToggleStatus={handleToggleStatus}
        />
        
        <UserTableSection
          title="Accounts Manager"
          users={accountUsers}
          getRoleColor={getRoleColor}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          onToggleStatus={handleToggleStatus}
        />
        
        <UserTableSection
          title="Production Manager"
          users={productionUsers}
          getRoleColor={getRoleColor}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          onToggleStatus={handleToggleStatus}
        />
        
        <UserTableSection
          title="Dispatch User"
          users={dispatchUsers}
          getRoleColor={getRoleColor}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          onToggleStatus={handleToggleStatus}
        />
        
        <UserTableSection
          title="Worker"
          users={workerUsers}
          getRoleColor={getRoleColor}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          onToggleStatus={handleToggleStatus}
        />
      </div>
    </div>
  );
};

export default UsersList;
