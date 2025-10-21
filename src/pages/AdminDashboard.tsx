import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Mail, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

// Import all admin components
import {
  DashboardOverview,
  StudentsManagement,
  AdminRequestsManagement,
  EmailManagement,
  ReportsManagement,
  SettingsManagement
} from '@/components/admin';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminData, setAdminData] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);

  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { id: 'students', label: 'Students', icon: <Users size={20} />, path: '/admin/students' },
    { id: 'admin-requests', label: 'Admin Requests', icon: <UserCheck size={20} />, path: '/admin/requests' },
    { id: 'email', label: 'Email Management', icon: <Mail size={20} />, path: '/admin/email' },
    { id: 'reports', label: 'Reports', icon: <FileText size={20} />, path: '/admin/reports' },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  useEffect(() => {
    checkAdminAuth();
    fetchNotifications();
  }, []);

  const checkAdminAuth = () => {
    const role = localStorage.getItem('userRole');
    const data = localStorage.getItem('userData');

    console.log('Admin Dashboard - Role:', role, 'Data:', data); // Debug

    if (role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    try {
      setAdminData(data ? JSON.parse(data) : null);
    } catch (error) {
      console.error('Error parsing admin data:', error);
      navigate('/');
    }
  };

  const fetchNotifications = async () => {
    try {
      const { count } = await supabase
        .from('admin_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      setNotifications(count || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out.",
    });
    navigate('/');
  };

  const handleSidebarItemClick = (itemId: string) => {
    setActiveTab(itemId);
    setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview adminData={adminData} />;
      case 'students':
        return <StudentsManagement />;
      case 'admin-requests':
        return <AdminRequestsManagement onRequestUpdated={fetchNotifications} />;
      case 'email':
        return <EmailManagement />;
      case 'reports':
        return <ReportsManagement />;
      case 'settings':
        return <SettingsManagement adminData={adminData} />;
      default:
        return <DashboardOverview adminData={adminData} />;
    }
  };

  if (!adminData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex"
            >
              <Menu size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="Logo" className="h-8" />
              <h1 className="text-xl font-bold hidden sm:block">Admin Panel</h1>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 text-gray-400" size={18} />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 w-64"
              />
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => setActiveTab('admin-requests')}
            >
              <Bell size={20} />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </Button>
            <div className="flex items-center gap-2 pl-4 border-l">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                {adminData.name?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{adminData.name}</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          "fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 transition-all duration-300 z-20 hidden lg:block",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSidebarItemClick(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                activeTab === item.id
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              {item.icon}
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
              {item.id === 'admin-requests' && notifications > 0 && isSidebarOpen && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {notifications}
                </span>
              )}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-8"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </nav>
      </aside>

      {/* Sidebar - Mobile */}
      <aside
        className={cn(
          "fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 w-64 transition-transform duration-300 z-20 lg:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSidebarItemClick(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                activeTab === item.id
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
              {item.id === 'admin-requests' && notifications > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {notifications}
                </span>
              )}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-8"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main
        className={cn(
          "pt-16 transition-all duration-300 min-h-screen",
          isSidebarOpen ? "lg:pl-64" : "lg:pl-20"
        )}
      >
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;