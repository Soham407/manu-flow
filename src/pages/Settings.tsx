
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, Eye, EyeOff, User, Shield } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [showHiddenTransactions, setShowHiddenTransactions] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your account and application preferences</p>
          </div>
          <SettingsIcon className="h-8 w-8 text-gray-400" />
        </div>

        {/* User Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>User Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Name</Label>
                <p className="text-gray-900">{user?.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Email</Label>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Role</Label>
                <Badge className="mt-1">
                  {user?.role?.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Status</Label>
                <Badge className={user?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {user?.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
            <Button variant="outline">Edit Profile</Button>
          </CardContent>
        </Card>

        {/* Super Admin Settings */}
        {user?.role === 'super_admin' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Super Admin Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {showHiddenTransactions ? (
                    <Eye className="h-5 w-5 text-green-600" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <Label htmlFor="hidden-transactions" className="text-sm font-medium">
                      Hidden Transactions
                    </Label>
                    <p className="text-sm text-gray-500">
                      Toggle visibility of hidden orders, invoices, and payments
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={showHiddenTransactions ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {showHiddenTransactions ? 'Visible' : 'Hidden'}
                  </Badge>
                  <Switch
                    id="hidden-transactions"
                    checked={showHiddenTransactions}
                    onCheckedChange={setShowHiddenTransactions}
                  />
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> When enabled, hidden transactions will be visible across all pages including Orders, Invoices, and Payments.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive email notifications for important updates</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Auto-save Forms</Label>
                  <p className="text-sm text-gray-500">Automatically save form data as you type</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Dark Mode</Label>
                  <p className="text-sm text-gray-500">Switch to dark theme</p>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline">Change Password</Button>
            <Button variant="outline">Two-Factor Authentication</Button>
            <Button variant="destructive">Sign Out</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
