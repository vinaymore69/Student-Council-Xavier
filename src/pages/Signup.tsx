import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/lib/supabaseClient';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  collegeMail: string;
  gender: string;
  phoneNo: string;
  department: string;
  collegeId: string;
}

interface StudentData {
  class: string;
  division: string;
  rollNo: string;
  age: string;
}

type UserRole = 'student' | 'admin';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>('student');
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    collegeMail: '',
    gender: '',
    phoneNo: '',
    department: '',
    collegeId: '',
  });

  const [studentData, setStudentData] = useState<StudentData>({
    class: '',
    division: '',
    rollNo: '',
    age: '',
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStudentInputChange = (field: keyof StudentData, value: string) => {
    setStudentData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      if (userRole === 'student') {
        await handleStudentSignup();
      } else {
        await handleAdminSignup();
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "An error occurred during signup.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentSignup = async () => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          role: 'student',
          name: formData.name,
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

    // Prepare student data
    const studentRecord = {
      auth_id: authData.user.id,
      name: formData.name,
      class: studentData.class,
      division: studentData.division || null,
      department: formData.department,
      roll_no: studentData.rollNo,
      college_id: formData.collegeId,
      age: studentData.age ? parseInt(studentData.age) : null,
      college_mail: formData.collegeMail,
      gender: formData.gender,
      phone_no: formData.phoneNo,
      email: formData.email,
    };

    // Insert with type bypass
    const { error: insertError } = await (supabase
      .from('students') as any)
      .insert(studentRecord);

    if (insertError) throw insertError;

    toast({
      title: "Account created successfully!",
      description: "Please check your email to verify your account.",
    });

    setTimeout(() => navigate('/login'), 2000);
  };

  const handleAdminSignup = async () => {
    // Prepare admin request data
    const adminRequest = {
      name: formData.name,
      department: formData.department || null,
      college_id: formData.collegeId,
      college_mail: formData.collegeMail,
      gender: formData.gender,
      phone_no: formData.phoneNo,
      email: formData.email,
      password_hash: formData.password,
      status: 'pending',
    };

    // Insert with type bypass
    const { error: requestError } = await (supabase
      .from('admin_requests') as any)
      .insert(adminRequest);

    if (requestError) throw requestError;

    toast({
      title: "Admin request submitted!",
      description: "Your request is pending approval. You'll be notified once it's reviewed.",
    });

    setTimeout(() => navigate('/'), 2000);
  };

  const handleGoogleSignup = async () => {
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
        title: "Google signup failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <img src="/logo.svg" alt="Logo" className="h-12" />
          </div>
          <CardTitle className="text-2xl text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your details to get started
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label>I am a</Label>
              <RadioGroup value={userRole} onValueChange={(value) => setUserRole(value as UserRole)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="admin" />
                  <Label htmlFor="admin">Admin</Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  placeholder="Computer Science"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="collegeId">College ID *</Label>
                <Input
                  id="collegeId"
                  placeholder="CS2024001"
                  value={formData.collegeId}
                  onChange={(e) => handleInputChange('collegeId', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="collegeMail">College Email *</Label>
                <Input
                  id="collegeMail"
                  type="email"
                  placeholder="student@college.edu"
                  value={formData.collegeMail}
                  onChange={(e) => handleInputChange('collegeMail', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Personal Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNo">Phone Number *</Label>
                <Input
                  id="phoneNo"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.phoneNo}
                  onChange={(e) => handleInputChange('phoneNo', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Student-specific fields */}
              {userRole === 'student' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="class">Class *</Label>
                    <Input
                      id="class"
                      placeholder="FE / SE / TE / BE"
                      value={studentData.class}
                      onChange={(e) => handleStudentInputChange('class', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="division">Division</Label>
                    <Input
                      id="division"
                      placeholder="A / B / C (Optional)"
                      value={studentData.division}
                      onChange={(e) => handleStudentInputChange('division', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rollNo">Roll Number *</Label>
                    <Input
                      id="rollNo"
                      placeholder="2024001"
                      value={studentData.rollNo}
                      onChange={(e) => handleStudentInputChange('rollNo', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="18"
                      min="16"
                      max="100"
                      value={studentData.age}
                      onChange={(e) => handleStudentInputChange('age', e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            {userRole === 'admin' && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Note:</strong> Admin registrations require approval. Your request will be pending until reviewed by an existing admin.
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : userRole === 'admin' ? "Submit Request" : "Create Account"}
            </Button>
            
            <div className="relative w-full">
              <Separator />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                OR
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignup}
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

            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
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

export default Signup;