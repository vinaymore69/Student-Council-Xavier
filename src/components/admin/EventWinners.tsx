import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Trophy,
  Calendar,
  Filter,
  Edit,
  Upload,
  Loader2,
  Award,
  Medal,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Event {
  id: string;
  event_name: string;
  event_type: string;
  year: number;
}

interface SubEvent {
  id: string;
  event_id: string;
  sub_event_name: string;
}

interface Winner {
  id: string;
  event_id: string;
  sub_event_id: string | null;
  sub_event_name: string;
  winner_email: string;
  winner_name: string | null;
  position: string;
  prize: string | null;
  winner_image_url: string | null;
  winner_image_filename: string | null;
  created_at: string;
  created_by: string;
}

interface StudentData {
  name: string;
  email: string;
  roll_number: string;
  branch: string;
  year: number;
}

const EventWinners: React.FC = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [subEvents, setSubEvents] = useState<SubEvent[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [filteredWinners, setFilteredWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Filters
const [selectedEvent, setSelectedEvent] = useState<string>('all-events');
  const [selectedSubEvent, setSelectedSubEvent] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Add/Edit Winner Modal
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingWinner, setEditingWinner] = useState<Winner | null>(null);
  const [formData, setFormData] = useState({
    event_id: '',
    sub_event_id: '',
    sub_event_name: '',
    winner_email: '',
    winner_name: '',
    position: '',
    prize: '',
    winner_image_path: '',
    winner_image_url: '',
    winner_image_filename: ''
  });
  const [winnerImagePreview, setWinnerImagePreview] = useState<string>('');
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [fetchingStudent, setFetchingStudent] = useState(false);

  // Delete state
  const [winnerToDelete, setWinnerToDelete] = useState<Winner | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Predefined positions
  const positions = ['1st Place', '2nd Place', '3rd Place', 'Winner', 'Runner Up', 'Participant'];

  useEffect(() => {
    fetchEvents();
    fetchWinners();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchSubEvents(selectedEvent);
    } else {
      setSubEvents([]);
    }
  }, [selectedEvent]);

  useEffect(() => {
    filterWinners();
  }, [winners, selectedEvent, selectedSubEvent, searchQuery]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, event_name, event_type, year')
        .order('year', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive"
      });
    }
  };

  const fetchSubEvents = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('event_sub_events')
        .select('*')
        .eq('event_id', eventId)
        .order('sub_event_name', { ascending: true });

      if (error) throw error;
      setSubEvents(data || []);
    } catch (error: any) {
      console.error('Error fetching sub-events:', error);
    }
  };

  const fetchWinners = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('event_winners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWinners(data || []);
    } catch (error: any) {
      console.error('Error fetching winners:', error);
      toast({
        title: "Error",
        description: "Failed to fetch winners",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterWinners = () => {
    let filtered = [...winners];

    // Event filter
     if (selectedEvent && selectedEvent !== 'all-events') { // Added check
    filtered = filtered.filter(winner => winner.event_id === selectedEvent);
  }

    // Sub-event filter
    if (selectedSubEvent !== 'all') {
      if (selectedSubEvent === 'main') {
        filtered = filtered.filter(winner => !winner.sub_event_id);
      } else {
        filtered = filtered.filter(winner => winner.sub_event_id === selectedSubEvent);
      }
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(winner =>
        winner.winner_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        winner.winner_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        winner.sub_event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        winner.position.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredWinners(filtered);
  };

  const handleOpenAddModal = () => {
    if (!selectedEvent || selectedEvent === 'all-events') { // Added check
    toast({
      title: "Select an event",
      description: "Please select an event first",
      variant: "destructive"
    });
    return;
    }

    resetForm();
    setFormData(prev => ({ ...prev, event_id: selectedEvent }));
    setEditingWinner(null);
    setIsAddEditModalOpen(true);
  };

  const handleEditWinner = (winner: Winner) => {
    setEditingWinner(winner);
    setFormData({
      event_id: winner.event_id,
      sub_event_id: winner.sub_event_id || '',
      sub_event_name: winner.sub_event_name,
      winner_email: winner.winner_email,
      winner_name: winner.winner_name || '',
      position: winner.position,
      prize: winner.prize || '',
      winner_image_path: winner.winner_image_url || '',
      winner_image_url: winner.winner_image_url || '',
      winner_image_filename: winner.winner_image_filename || ''
    });
    setWinnerImagePreview(winner.winner_image_url || '');
    setIsAddEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      event_id: '',
      sub_event_id: '',
      sub_event_name: '',
      winner_email: '',
      winner_name: '',
      position: '',
      prize: '',
      winner_image_path: '',
      winner_image_url: '',
      winner_image_filename: ''
    });
    setWinnerImagePreview('');
    setStudentData(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

 const fetchStudentByEmail = async (email: string) => {
  if (!email || !email.includes('@')) return;

  try {
    setFetchingStudent(true);
    
    // Normalize the email (trim whitespace and convert to lowercase)
    const normalizedEmail = email.trim().toLowerCase();
    
    // Check if it's a college email or personal email
    const isCollegeEmail = normalizedEmail.includes('@student.xavier.ac.in');
    
    let query = supabase
      .from('students')
      .select('name, email, college_mail, roll_no, department, class, division, college_id');
    
    // Search by college_mail if it's a college email, otherwise by personal email
    if (isCollegeEmail) {
      query = query.eq('college_mail', normalizedEmail);
    } else {
      query = query.eq('email', normalizedEmail);
    }
    
    const { data, error } = await query.single();

    if (error) {
      // Student not found
      console.log('Student lookup error:', error);
      setStudentData(null);
      toast({
        title: "Student not found",
        description: `No student found with this ${isCollegeEmail ? 'college' : 'personal'} email. You can manually enter the name.`,
        variant: "default"
      });
      return;
    }

    // Map the data to match your StudentData interface
    const studentInfo = {
      name: data.name,
      email: data.college_mail, // Use college_mail as primary identifier
      roll_number: data.roll_no,
      branch: data.department,
      year: parseInt(data.class) || new Date().getFullYear()
    };

    setStudentData(studentInfo);
    setFormData(prev => ({
      ...prev,
      winner_name: data.name
    }));

    toast({
      title: "✓ Student Found",
      description: `${data.name} - Roll No: ${data.roll_no}`,
    });
  } catch (error: any) {
    console.error('Error fetching student:', error);
    setStudentData(null);
    toast({
      title: "Error",
      description: "Failed to fetch student data. You can manually enter the name.",
      variant: "destructive"
    });
  } finally {
    setFetchingStudent(false);
  }
};
  const handleWinnerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Winner image must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploadingImage(true);

      // Create FormData
      const formDataToSend = new FormData();
      formDataToSend.append('winnerImage', file);
      formDataToSend.append('eventId', formData.event_id);
      formDataToSend.append('subEventName', formData.sub_event_name);
      formDataToSend.append('winnerEmail', formData.winner_email);

      // Upload to server
      const response = await fetch('http://localhost:3001/api/upload-winner-image', {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();

      // Update form data
      setFormData(prev => ({
        ...prev,
        winner_image_path: result.filePath,
        winner_image_url: result.fileUrl,
        winner_image_filename: result.savedFileName
      }));

      setWinnerImagePreview(result.fileUrl);

      toast({
        title: "Success",
        description: "Winner image uploaded successfully"
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload winner image",
        variant: "destructive"
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.event_id || !formData.sub_event_name || !formData.winner_email || !formData.position) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setSaving(true);

      const winnerData = {
        event_id: formData.event_id,
        sub_event_id: formData.sub_event_id || null,
        sub_event_name: formData.sub_event_name,
        winner_email: formData.winner_email.toLowerCase(),
        winner_name: formData.winner_name || null,
        position: formData.position,
        prize: formData.prize || null,
        winner_image_path: formData.winner_image_path || null,
        winner_image_url: formData.winner_image_url || null,
        winner_image_filename: formData.winner_image_filename || null,
        created_by: 'vinaymore69'
      };

      if (editingWinner) {
        // Update existing winner
        const { error } = await supabase
          .from('event_winners')
          .update(winnerData)
          .eq('id', editingWinner.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Winner updated successfully"
        });
      } else {
        // Add new winner
        const { error } = await supabase
          .from('event_winners')
          .insert([winnerData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Winner added successfully"
        });
      }

      fetchWinners();
      setIsAddEditModalOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Error saving winner:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save winner",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (winner: Winner) => {
    setWinnerToDelete(winner);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!winnerToDelete) return;

    try {
      // Delete from database
      const { error } = await supabase
        .from('event_winners')
        .delete()
        .eq('id', winnerToDelete.id);

      if (error) throw error;

      // Delete image from server if exists
      if (winnerToDelete.winner_image_filename) {
        await fetch(`http://localhost:3001/api/delete-file/event-winner/${winnerToDelete.winner_image_filename}`, {
          method: 'DELETE'
        });
      }

      toast({
        title: "Success",
        description: "Winner deleted successfully"
      });

      fetchWinners();
    } catch (error: any) {
      console.error('Error deleting winner:', error);
      toast({
        title: "Error",
        description: "Failed to delete winner",
        variant: "destructive"
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setWinnerToDelete(null);
    }
  };

  const getPositionBadgeColor = (position: string) => {
    if (position.includes('1st')) return 'bg-yellow-500 text-white';
    if (position.includes('2nd')) return 'bg-gray-400 text-white';
    if (position.includes('3rd')) return 'bg-orange-600 text-white';
    if (position.includes('Winner')) return 'bg-green-500 text-white';
    return 'bg-blue-500 text-white';
  };

  const getPositionIcon = (position: string) => {
    if (position.includes('1st')) return <Trophy className="h-4 w-4" />;
    if (position.includes('2nd')) return <Medal className="h-4 w-4" />;
    if (position.includes('3rd')) return <Award className="h-4 w-4" />;
    return <Trophy className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading winners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Winners</h1>
          <p className="text-gray-500 mt-1">Manage event winners and rankings</p>
        </div>
       <Button onClick={handleOpenAddModal} disabled={!selectedEvent || selectedEvent === 'all-events'}>
  <Plus className="mr-2 h-4 w-4" />
  Add Winner
</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">{winners.length}</div>
            <p className="text-sm text-gray-500">Total Winners</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {winners.filter(w => w.position.includes('1st')).length}
            </div>
            <p className="text-sm text-gray-500">First Place</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-600">
              {winners.filter(w => w.position.includes('2nd')).length}
            </div>
            <p className="text-sm text-gray-500">Second Place</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">
              {winners.filter(w => w.position.includes('3rd')).length}
            </div>
            <p className="text-sm text-gray-500">Third Place</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Event Filter */}
            <div>
              <Label>Select Event *</Label>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-events">All Events</SelectItem>
                  {events.map(event => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.event_name} ({event.year})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sub-Event Filter */}
            <div>
              <Label>Sub-Event</Label>
            <Select 
  value={selectedSubEvent} 
  onValueChange={setSelectedSubEvent}
  disabled={!selectedEvent || selectedEvent === 'all-events'}
>
                <SelectTrigger>
                  <SelectValue placeholder="All sub-events" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sub-Events</SelectItem>
                  {Array.from(new Set(winners.filter(w => w.event_id === selectedEvent).map(w => w.sub_event_name))).map(name => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div>
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search winners..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Winners Table */}
      {selectedEvent === 'all-events' ? (
  <Card>
    <CardContent className="py-16 text-center">
      <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Select an event</h3>
      <p className="text-gray-500">Please select an event to view its winners</p>
    </CardContent>
  </Card>
) : filteredWinners.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No winners yet</h3>
            <p className="text-gray-500 mb-4">Add winners to get started</p>
            <Button onClick={handleOpenAddModal}>
              <Plus className="mr-2 h-4 w-4" />
              Add Winner
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Winner</TableHead>
                  <TableHead>Sub-Event</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Prize</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWinners.map((winner) => (
                  <TableRow key={winner.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {winner.winner_name ? winner.winner_name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-medium">{winner.winner_name || 'N/A'}</p>
                          <p className="text-sm text-gray-500">{winner.winner_email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{winner.sub_event_name}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPositionBadgeColor(winner.position)}>
                        <span className="flex items-center gap-1">
                          {getPositionIcon(winner.position)}
                          {winner.position}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>{winner.prize || '-'}</TableCell>
                    <TableCell>
                      {winner.winner_image_url ? (
                        <img 
                          src={winner.winner_image_url} 
                          alt={winner.winner_name || 'Winner'}
                          className="w-10 h-10 rounded object-cover"
                        />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditWinner(winner)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(winner)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Winner Modal */}
      <Dialog open={isAddEditModalOpen} onOpenChange={setIsAddEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingWinner ? 'Edit Winner' : 'Add Winner'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Event</Label>
                <Select 
                  value={formData.event_id} 
                  onValueChange={(value) => handleSelectChange('event_id', value)}
                  disabled={!!editingWinner}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map(event => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.event_name} ({event.year})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label>Sub-Event Name *</Label>
                <Input
                  name="sub_event_name"
                  value={formData.sub_event_name}
                  onChange={handleInputChange}
                  placeholder="e.g., Cricket, Dance, Coding Challenge"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the competition/event name
                </p>
              </div>

              <div className="col-span-2">
                <Label>Winner Email *</Label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    name="winner_email"
                    value={formData.winner_email}
                    onChange={handleInputChange}
                    onBlur={(e) => fetchStudentByEmail(e.target.value)}
                    placeholder="student@example.com"
                    required
                    className="flex-1"
                  />
                  {fetchingStudent && (
                    <Loader2 className="animate-spin h-5 w-5 text-primary mt-2" />
                  )}
                </div>
               {studentData && (
  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded text-sm">
    <p className="font-medium text-green-900">✓ Student Found</p>
    <p className="text-green-700 font-medium">{studentData.name}</p>
    <p className="text-green-600">Roll No: {studentData.roll_number}</p>
    <p className="text-green-600">{studentData.branch}</p>
  </div>
)}
              </div>

              <div className="col-span-2">
                <Label>Winner Name</Label>
                <Input
                  name="winner_name"
                  value={formData.winner_name}
                  onChange={handleInputChange}
                  placeholder="Auto-filled from email or enter manually"
                />
              </div>

              <div>
                <Label>Position *</Label>
                <Select 
                  value={formData.position} 
                  onValueChange={(value) => handleSelectChange('position', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map(pos => (
                      <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Prize</Label>
                <Input
                  name="prize"
                  value={formData.prize}
                  onChange={handleInputChange}
                  placeholder="e.g., ₹10,000 Cash Prize"
                />
              </div>

              <div className="col-span-2">
                <Label>Winner Image (Optional)</Label>
                <div className="space-y-3">
                  {winnerImagePreview && (
                    <div className="relative w-32 h-32 border rounded overflow-hidden">
                      <img
                        src={winnerImagePreview}
                        alt="Winner preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleWinnerImageUpload}
                      disabled={uploadingImage}
                    />
                    {uploadingImage && (
                      <Loader2 className="animate-spin h-5 w-5 text-primary" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Upload winner photo (Max 5MB)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddEditModalOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving || uploadingImage}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    {editingWinner ? 'Update Winner' : 'Add Winner'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Winner?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {winnerToDelete?.winner_name || winnerToDelete?.winner_email} from {winnerToDelete?.sub_event_name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
              Delete Winner
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EventWinners;