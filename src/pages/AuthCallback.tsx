import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          // Check user role
          const { data: studentData } = await (supabase
            .from('students') as any)
            .select('*')
            .eq('auth_id', session.user.id)
            .single();

          if (studentData) {
            localStorage.setItem('userRole', 'student');
            localStorage.setItem('userData', JSON.stringify(studentData));
            navigate('/');
            return;
          }

          const { data: adminData } = await (supabase
            .from('admins') as any)
            .select('*')
            .eq('auth_id', session.user.id)
            .single();

          if (adminData) {
            if (!adminData.is_active) {
              toast({
                title: "Account Pending",
                description: "Your admin account is pending approval.",
                variant: "destructive"
              });
              await supabase.auth.signOut();
              navigate('/login');
              return;
            }
            localStorage.setItem('userRole', 'admin');
            localStorage.setItem('userData', JSON.stringify(adminData));
            navigate('/admin');
            return;
          }

          // No profile found - redirect to complete registration
          navigate('/complete-profile');
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast({
          title: "Authentication failed",
          description: "Please try logging in again.",
          variant: "destructive"
        });
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Authenticating...</p>
      </div>
    </div>
  );
};

export default AuthCallback;