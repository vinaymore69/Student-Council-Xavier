import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

const ReportsManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Reports</h2>
        <p className="text-gray-600 mt-1">Generate and view system reports</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Reports Dashboard
          </CardTitle>
          <CardDescription>
            Analytics and reports will be displayed here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">Reports Coming Soon</h3>
            <p>Report generation and analytics features will be available here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsManagement;