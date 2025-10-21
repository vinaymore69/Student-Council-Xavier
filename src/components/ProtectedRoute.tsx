import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // FIRST: Check localStorage for user role
        const userRole = localStorage.getItem('userRole');
        const userData = localStorage.getItem('userData');

        console.log('ProtectedRoute Check - Role:', userRole, 'Data exists:', !!userData); // Debug

        // If user is admin in localStorage, they're authenticated
        if (userRole === 'admin' && userData) {
          console.log('Admin authenticated via localStorage'); // Debug
          setIsAuthenticated(true);
          setIsAdmin(true);
          setIsLoading(false);
          return;
        }

        // If user is student in localStorage, verify with Supabase session
        if (userRole === 'student' && userData) {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            console.log('Student authenticated via Supabase session'); // Debug
            setIsAuthenticated(true);
            setIsAdmin(false);
            setIsLoading(false);
            return;
          } else {
            console.log('Student in localStorage but no Supabase session'); // Debug
            // Clear invalid localStorage
            localStorage.removeItem('userRole');
            localStorage.removeItem('userData');
          }
        }

        // Fallback: Check Supabase session (for students who might not have localStorage set)
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('User has Supabase session'); // Debug
          setIsAuthenticated(true);
          
          // Check if user is admin in database
          const { data: adminData } = await supabase
            .from('admins')
            .select('*')
            .eq('auth_id', session.user.id)
            .single();
          
          if (adminData && adminData.is_active) {
            console.log('User is admin from database'); // Debug
            setIsAdmin(true);
          } else {
            console.log('User is student from session'); // Debug
            setIsAdmin(false);
          }
        } else {
          console.log('No authentication found'); // Debug
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  console.log('ProtectedRoute Result - Auth:', isAuthenticated, 'Admin:', isAdmin, 'Require Admin:', requireAdmin); // Debug

  if (!isAuthenticated) {
    console.log('❌ Not authenticated - Redirecting to login'); // Debug
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    console.log('❌ Admin required but user is not admin - Redirecting to home'); // Debug
    return <Navigate to="/" replace />;
  }

  console.log('✅ Access granted'); // Debug
  return <>{children}</>;
};

export default ProtectedRoute;