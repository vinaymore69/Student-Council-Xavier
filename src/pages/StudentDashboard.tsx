import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Trophy, 
  LogOut,
  Menu,
  X,
  Bell,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

// Import student dashboard components
import StudentOverview from '@/components/student/StudentOverview';
import StudentProfile from '@/components/student/StudentProfile';
import StudentWinnings from '@/components/student/StudentWinnings';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [studentData, setStudentData] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [winningsCount, setWinningsCount] = useState(0);

  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'winnings', label: 'Achievements', icon: <Trophy size={18} /> },
  ];

  useEffect(() => {
    checkStudentAuth();
  }, []);

  useEffect(() => {
    if (studentData) {
      fetchWinningsCount();
    }
  }, [studentData]);

  const checkStudentAuth = () => {
    const role = localStorage.getItem('userRole');
    const data = localStorage.getItem('userData');

    if (role !== 'student') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    try {
      const parsedData = data ? JSON.parse(data) : null;
      setStudentData(parsedData);
    } catch (error) {
      console.error('Error parsing student data:', error);
      navigate('/');
    }
  };

  const fetchWinningsCount = async () => {
    if (!studentData?.college_mail) return;

    try {
      const { count } = await supabase
        .from('event_winners')
        .select('*', { count: 'exact', head: true })
        .eq('winner_email', studentData.college_mail.toLowerCase());
      
      setWinningsCount(count || 0);
    } catch (error) {
      console.error('Error fetching winnings count:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      
      window.dispatchEvent(new Event('userLogout'));
      
      toast({
        title: "Logged out",
        description: "See you soon!",
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSidebarItemClick = (itemId: string) => {
    setActiveTab(itemId);
    setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <StudentOverview studentData={studentData} winningsCount={winningsCount} />;
      case 'profile':
        return <StudentProfile studentData={studentData} onUpdate={checkStudentAuth} />;
      case 'winnings':
        return <StudentWinnings studentData={studentData} />;
      default:
        return <StudentOverview studentData={studentData} winningsCount={winningsCount} />;
    }
  };

  if (!studentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto mb-3"></div>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-md border-b border-gray-100 z-30">
        <div className="h-full px-4 sm:px-6 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex h-8 w-8"
            >
              <Menu size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden h-8 w-8"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </Button>
            <Link to="/" className="flex items-center">
              <img src="/xiesc.png" alt="Logo" className="h-10" />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="relative h-8 w-8"
              onClick={() => setActiveTab('winnings')}
            >
              <Bell size={18} />
              {winningsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full text-white text-[10px] flex items-center justify-center font-medium">
                  {winningsCount > 9 ? '9+' : winningsCount}
                </span>
              )}
            </Button>
            <div className="h-6 w-px bg-gray-200 mx-2"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/90 to-primary flex items-center justify-center text-white text-sm font-medium">
                {studentData.name?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium leading-none">{studentData.name?.split(' ')[0]}</p>
                <p className="text-xs text-gray-500 leading-none mt-0.5">{studentData.roll_no}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Minimal Sidebar - Desktop */}
      <aside
        className={cn(
          "fixed left-0 top-14 bottom-0 bg-white border-r border-gray-100 transition-all duration-300 z-20 hidden lg:block",
          isSidebarOpen ? "w-56" : "w-16"
        )}
      >
        <nav className="p-3 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSidebarItemClick(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
                activeTab === item.id
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              {item.icon}
              {isSidebarOpen && <span>{item.label}</span>}
              {item.id === 'winnings' && winningsCount > 0 && isSidebarOpen && (
                <span className="ml-auto bg-green-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {winningsCount}
                </span>
              )}
            </button>
          ))}
          
          <div className="pt-3 mt-3 border-t border-gray-100">
            <Link to="/">
              <button
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Home size={18} />
                {isSidebarOpen && <span>Home</span>}
              </button>
            </Link>
          </div>

          <div className={cn("pt-2", isSidebarOpen ? "" : "pt-6")}>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut size={18} />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </nav>
      </aside>

      {/* Minimal Sidebar - Mobile */}
      <aside
        className={cn(
          "fixed left-0 top-14 bottom-0 bg-white border-r border-gray-100 w-56 transition-transform duration-300 z-20 lg:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="p-3 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSidebarItemClick(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
                activeTab === item.id
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.id === 'winnings' && winningsCount > 0 && (
                <span className="ml-auto bg-green-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {winningsCount}
                </span>
              )}
            </button>
          ))}
          
          <div className="pt-3 mt-3 border-t border-gray-100">
            <Link to="/">
              <button
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <Home size={18} />
                <span>Home</span>
              </button>
            </Link>
          </div>

          <div className="pt-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-10 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main
        className={cn(
          "pt-14 transition-all duration-300 min-h-screen bg-gray-50",
          isSidebarOpen ? "lg:pl-56" : "lg:pl-16"
        )}
      >
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;