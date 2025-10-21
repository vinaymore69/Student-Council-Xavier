import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

interface SettingsManagementProps {
  adminData: any;
}

const SettingsManagement: React.FC<SettingsManagementProps> = ({ adminData }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-1">Manage your admin account settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Admin Profile
          </CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-lg">{adminData?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-lg">{adminData?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Department</p>
              <p className="text-lg">{adminData?.department || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">College ID</p>
              <p className="text-lg">{adminData?.college_id || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="text-lg">{adminData?.phone_no || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">College Email</p>
              <p className="text-lg">{adminData?.college_mail || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsManagement;