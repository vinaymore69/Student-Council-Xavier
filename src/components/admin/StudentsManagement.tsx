import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Eye, 
  Trash2, 
  Download, 
  Filter,
  RefreshCw,
  UserPlus
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Student {
  id: string;
  name: string;
  email: string;
  college_mail: string;
  department: string;
  class: string;
  division: string;
  roll_no: string;
  college_id: string;
  phone_no: string;
  gender: string;
  age: number;
  created_at: string;
}

const StudentsManagement: React.FC = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchQuery, filterClass, filterDepartment, students]);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setStudents(data || []);
      setFilteredStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to fetch students data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.college_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.roll_no.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Class filter
    if (filterClass !== 'all') {
      filtered = filtered.filter(student => student.class === filterClass);
    }

    // Department filter
    if (filterDepartment !== 'all') {
      filtered = filtered.filter(student => 
        student.department.toLowerCase().includes(filterDepartment.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  };

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailOpen(true);
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student deleted successfully.",
      });

      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Error",
        description: "Failed to delete student.",
        variant: "destructive"
      });
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'College ID', 'Class', 'Division', 'Department', 'Roll No', 'Phone', 'Gender', 'Age'];
    const csvData = filteredStudents.map(student => [
      student.name,
      student.email,
      student.college_id,
      student.class,
      student.division || 'N/A',
      student.department,
      student.roll_no,
      student.phone_no,
      student.gender,
      student.age
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Students data exported successfully.",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getUniqueClasses = () => {
    const classes = [...new Set(students.map(s => s.class))];
    return classes.filter(c => c);
  };

  const getUniqueDepartments = () => {
    const departments = [...new Set(students.map(s => s.department))];
    return departments.filter(d => d);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Students Management</h2>
          <p className="text-gray-600 mt-1">View and manage all registered students</p>
        </div>
        <Button onClick={fetchStudents} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">Total Students</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{filteredStudents.length}</div>
            <p className="text-xs text-muted-foreground">Filtered Results</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{getUniqueClasses().length}</div>
            <p className="text-xs text-muted-foreground">Classes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{getUniqueDepartments().length}</div>
            <p className="text-xs text-muted-foreground">Departments</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search by name, email, college ID, roll no..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Class Filter */}
            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger>
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {getUniqueClasses().map(cls => (
                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Department Filter */}
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {getUniqueDepartments().map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setFilterClass('all');
                setFilterDepartment('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Students ({filteredStudents.length})</CardTitle>
          <CardDescription>
            Click on a row to view detailed information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>College ID</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow 
                      key={student.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleViewDetails(student)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                            {student.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-xs text-gray-500">{student.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.college_id}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{student.class}</Badge>
                      </TableCell>
                      <TableCell>{student.department}</TableCell>
                      <TableCell>{student.roll_no}</TableCell>
                      <TableCell>{formatDate(student.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(student);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteStudent(student.id);
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <UserPlus className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No students found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>Complete information about the student</DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
                  {selectedStudent.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
                  <p className="text-sm text-gray-600">{selectedStudent.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">College ID</p>
                  <p className="text-base">{selectedStudent.college_id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Roll Number</p>
                  <p className="text-base">{selectedStudent.roll_no}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Class</p>
                  <p className="text-base">{selectedStudent.class}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Division</p>
                  <p className="text-base">{selectedStudent.division || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Department</p>
                  <p className="text-base">{selectedStudent.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Age</p>
                  <p className="text-base">{selectedStudent.age}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p className="text-base capitalize">{selectedStudent.gender}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone Number</p>
                  <p className="text-base">{selectedStudent.phone_no}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">College Email</p>
                  <p className="text-base">{selectedStudent.college_mail}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Registered On</p>
                  <p className="text-base">{formatDate(selectedStudent.created_at)}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  onClick={() => {
                    handleDeleteStudent(selectedStudent.id);
                    setIsDetailOpen(false);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Student
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsDetailOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentsManagement;