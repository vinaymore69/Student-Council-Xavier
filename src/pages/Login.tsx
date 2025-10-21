import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/supabaseClient';
import { AlertCircle, Mail } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type LoginMode = 'student' | 'admin';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMode, setLoginMode] = useState<LoginMode>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const { toast } = useToast();

  const handleResendVerification = async () => {
    setResendingEmail(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      toast({
        title: "Verification email sent!",
        description: "Please check your inbox and spam folder.",
      });
    } catch (error) {
      toast({
        title: "Failed to resend email",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setResendingEmail(false);
    }
  };
  
  
  const handleAdminLogin = async () => {
    // Use database function for secure admin login
    const { data: adminData, error: adminError } = await supabase
      .rpc('verify_admin_login', {
        p_email: email,
        p_password: password
      });

    if (adminError || !adminData || adminData.length === 0) {
      throw new Error('Invalid admin credentials');
    }

    const admin = adminData[0];

    // Check if admin is active
    if (!admin.is_active) {
      throw new Error('Your admin account is not active. Please contact support.');
    }

    // Store user info in localStorage BEFORE showing toast
    localStorage.setItem('userRole', 'admin');
    localStorage.setItem('userData', JSON.stringify(admin));

    console.log('Admin login successful:', admin); // Debug log

    // Dispatch custom event to notify navbar of login
    window.dispatchEvent(new Event('userLogin'));

    // Admin login successful
    toast({
      title: "Welcome back, Admin!",
      description: `Logged in as ${admin.name}`,
    });

    // Redirect to admin dashboard (changed from home to admin)
   setTimeout(() => navigate('/admin'), 1000);  
  };


  const handleStudentLogin = async () => {
    // Student login using Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      // Check if error is due to unconfirmed email
      if (authError.message.includes('Email not confirmed')) {
        setShowResendVerification(true);
        throw new Error('Please verify your email address before logging in. Check your inbox for the verification link.');
      }
      throw authError;
    }

    console.log('Auth successful:', authData);

    // Check if user is a student
    const { data: studentData, error: studentError } = await (supabase
      .from('students') as any)
      .select('*')
      .eq('auth_id', authData.user.id)
      .single();

    if (studentData && !studentError) {
      // Store user info in localStorage
      localStorage.setItem('userRole', 'student');
      localStorage.setItem('userData', JSON.stringify(studentData));

      console.log('Student login successful:', studentData); // Debug log
      
      // Dispatch custom event to notify navbar of login
      window.dispatchEvent(new Event('userLogin'));

      // User is a student
      toast({
        title: "Welcome back!",
        description: `Logged in as ${studentData.name}`,
      });
      
      // Redirect to home
      setTimeout(() => navigate('/'), 1000);
      return;
    }

    // User authenticated but no student profile found
    await supabase.auth.signOut();
    throw new Error('Student profile not found. Please complete your registration.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowResendVerification(false);

    try {
      if (loginMode === 'admin') {
        await handleAdminLogin();
      } else {
        await handleStudentLogin();
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid email or password.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (loginMode === 'admin') {
      toast({
        title: "Not available for admin",
        description: "Google login is only available for students.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) throw error;
    } catch (error) {
      toast({
        title: "Google login failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <img src="/logo.svg" alt="Logo" className="h-12" />
          </div>
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Login Mode Selection */}
            <div className="space-y-2">
              <Label>Login as</Label>
              <RadioGroup 
                value={loginMode} 
                onValueChange={(value) => setLoginMode(value as LoginMode)} 
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student-login" />
                  <Label htmlFor="student-login" className="cursor-pointer">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="admin-login" />
                  <Label htmlFor="admin-login" className="cursor-pointer">Admin</Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            {/* Email Verification Alert - Only for students */}
            {showResendVerification && loginMode === 'student' && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Email Verification Required</AlertTitle>
                <AlertDescription>
                  <p className="mb-2">Please verify your email address before logging in.</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResendVerification}
                    disabled={resendingEmail}
                    className="w-full"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    {resendingEmail ? 'Sending...' : 'Resend Verification Email'}
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder={loginMode === 'admin' ? 'admin@example.com' : 'student@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            
            {loginMode === 'student' && (
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link to="/forgot-password" className="text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : `Sign in as ${loginMode === 'admin' ? 'Admin' : 'Student'}`}
            </Button>
            
            {loginMode === 'student' && (
              <>
                <div className="relative">
                  <Separator />
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                    OR
                  </span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleLogin}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </>
            )}

            <div className="text-sm text-center text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
            <div className="text-center">
              <Link to="/" className="text-sm text-muted-foreground hover:underline">
                Back to home
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;