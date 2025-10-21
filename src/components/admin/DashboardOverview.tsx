import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Settings, TrendingUp, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DashboardOverviewProps {
  adminData: any;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ adminData }) => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingRequests: 0,
    activeAdmins: 0,
    newStudentsToday: 0,
    recentStudents: [] as any[],
    recentRequests: [] as any[]
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

const fetchDashboardData = async () => {
  setIsLoading(true);
  setError(null);

  try {
    // Fetch total students
    const { count: studentsCount, error: studentsError } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true });

    if (studentsError) {
      console.error('Error fetching students count:', studentsError);
    }

    // Fetch pending admin requests
    let requestsCount = 0;
    let recentRequests: any[] = [];
    
    try {
      const { count, error: requestsError } = await supabase
        .from('admin_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (requestsError) {
        console.error('Error fetching requests count:', requestsError);
      } else {
        requestsCount = count || 0;
      }

      // Fetch recent requests - USE requested_at
      const { data: requestsData, error: recentRequestsError } = await supabase
        .from('admin_requests')
        .select('*')
        .eq('status', 'pending')
        .order('requested_at', { ascending: false })
        .limit(5);

      if (recentRequestsError) {
        console.error('Error fetching recent requests:', recentRequestsError);
      } else {
        recentRequests = requestsData || [];
      }
    } catch (err) {
      console.error('Admin requests table error:', err);
    }

    // Fetch active admins
    let adminsCount = 0;
    try {
      const { count, error: adminsError } = await supabase
        .from('admins')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (adminsError) {
        console.error('Error fetching admins count:', adminsError);
      } else {
        adminsCount = count || 0;
      }
    } catch (err) {
      console.error('Error fetching admins:', err);
    }

    // Fetch new students today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: newStudentsCount } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    // Fetch recent students
    const { data: recentStudents } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    setStats({
      totalStudents: studentsCount || 0,
      pendingRequests: requestsCount,
      activeAdmins: adminsCount,
      newStudentsToday: newStudentsCount || 0,
      recentStudents: recentStudents || [],
      recentRequests: recentRequests
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    setError('Failed to load dashboard data');
  } finally {
    setIsLoading(false);
  }
};

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Welcome back, {adminData.name}!</h2>
        <p className="text-gray-600 mt-1">Here's what's happening with your platform today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="inline h-3 w-3 text-green-600" /> +{stats.newStudentsToday} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <UserCheck className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">Needs review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Admins</CardTitle>
            <Settings className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAdmins}</div>
            <p className="text-xs text-muted-foreground mt-1">Including you</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Today</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newStudentsToday}</div>
            <p className="text-xs text-muted-foreground mt-1">Student registrations</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Student Registrations</CardTitle>
            <CardDescription>Latest students who joined the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentStudents.length > 0 ? (
                stats.recentStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                        {student.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{student.class || 'N/A'}</Badge>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(student.created_at)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No recent students</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pending Admin Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Admin Requests</CardTitle>
            <CardDescription>Requests waiting for your approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentRequests.length > 0 ? (
                stats.recentRequests.map((request) => (
  <div key={request.id} className="flex items-center justify-between border-b pb-3 last:border-0">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold">
        {request.name?.charAt(0).toUpperCase()}
      </div>
      <div>
        <p className="text-sm font-medium">{request.name}</p>
        <p className="text-xs text-gray-500">{request.email}</p>
      </div>
    </div>
    <div className="text-right">
      <Badge variant="outline" className="text-orange-600 border-orange-600">Pending</Badge>
      <p className="text-xs text-gray-500 mt-1">{formatDate(request.requested_at)}</p>
    </div>
  </div>
))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No pending requests</p>
              )}
            </div>
            {stats.recentRequests.length > 0 && (
              <Button className="w-full mt-4" variant="outline">
                View All Requests
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;