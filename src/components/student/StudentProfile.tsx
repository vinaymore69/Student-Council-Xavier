import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Edit2, Save, X, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

interface StudentProfileProps {
  studentData: any;
  onUpdate: () => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ studentData, onUpdate }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: studentData.name || '',
    phone_no: studentData.phone_no || '',
    email: studentData.email || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('students')
        .update({
          name: formData.name,
          phone_no: formData.phone_no,
          email: formData.email,
          updated_at: new Date().toISOString()
        })
        .eq('id', studentData.id);

      if (error) throw error;

      const updatedData = { ...studentData, ...formData };
      localStorage.setItem('userData', JSON.stringify(updatedData));

      toast({
        title: "Profile updated",
        description: "Changes saved successfully",
      });

      setIsEditing(false);
      onUpdate();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: studentData.name || '',
      phone_no: studentData.phone_no || '',
      email: studentData.email || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Profile Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your personal information</p>
        </div>
        {!isEditing ? (
          <Button size="sm" onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleCancel} disabled={loading}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Saving
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <Card className="border-gray-100">
        <CardContent className="p-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-4 pb-6 mb-6 border-b border-gray-100">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white text-2xl font-semibold">
              {studentData.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{studentData.name}</h3>
              <p className="text-sm text-gray-500">{studentData.roll_no} • {studentData.department}</p>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-medium text-gray-700 uppercase tracking-wide">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="pl-10 h-9 text-sm border-gray-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_no" className="text-xs font-medium text-gray-700 uppercase tracking-wide">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone_no"
                    name="phone_no"
                    value={formData.phone_no}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="pl-10 h-9 text-sm border-gray-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium text-gray-700 uppercase tracking-wide">Personal Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="pl-10 h-9 text-sm border-gray-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700 uppercase tracking-wide">College Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    value={studentData.college_mail}
                    disabled
                    className="pl-10 h-9 text-sm bg-gray-50 border-gray-100 text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Information */}
      <Card className="border-gray-100">
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-5">Academic Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Roll Number</p>
              <p className="text-sm font-medium text-gray-900">{studentData.roll_no}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">College ID</p>
              <p className="text-sm font-medium text-gray-900">{studentData.college_id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Department</p>
              <p className="text-sm font-medium text-gray-900">{studentData.department}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Class</p>
              <p className="text-sm font-medium text-gray-900">{studentData.class} - {studentData.division}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Gender</p>
              <p className="text-sm font-medium text-gray-900 capitalize">{studentData.gender}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Age</p>
              <p className="text-sm font-medium text-gray-900">{studentData.age} years</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfile;