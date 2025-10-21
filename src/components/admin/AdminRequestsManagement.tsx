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
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Eye, 
  CheckCircle,
  XCircle,
  RefreshCw,
  Clock,
  UserCheck,
  UserX
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface AdminRequest {
  id: string;
  name: string;
  email: string;
  college_mail: string;
  department: string;
  college_id: string;
  phone_no: string;
  gender: string;
  password_hash: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
  reviewed_at?: string;
  rejection_reason?: string;
}

interface AdminRequestsManagementProps {
  onRequestUpdated?: () => void;
}

const AdminRequestsManagement: React.FC<AdminRequestsManagementProps> = ({ onRequestUpdated }) => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<AdminRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<AdminRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [searchQuery, requests, activeTab]);

  const fetchRequests = async () => {
  setIsLoading(true);
  try {
    const { data, error } = await supabase
      .from('admin_requests')
      .select('*')
      .order('requested_at', { ascending: false });  // Changed from created_at

    if (error) throw error;

    setRequests(data || []);
  } catch (error) {
    console.error('Error fetching admin requests:', error);
    toast({
      title: "Error",
      description: "Failed to fetch admin requests.",
      variant: "destructive"
    });
  } finally {
    setIsLoading(false);
  }
};

  const filterRequests = () => {
    let filtered = requests.filter(req => req.status === activeTab);

    if (searchQuery) {
      filtered = filtered.filter(request =>
        request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.college_id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  };

  const handleApproveRequest = async (request: AdminRequest) => {
    if (!confirm(`Are you sure you want to approve ${request.name} as an admin?`)) {
      return;
    }

    try {
      // Create admin record
      const { error: insertError } = await supabase
        .from('admins')
        .insert({
          name: request.name,
          department: request.department,
          college_id: request.college_id,
          college_mail: request.college_mail,
          gender: request.gender,
          phone_no: request.phone_no,
          email: request.email,
          password: request.password_hash,
          is_active: true,
          created_at: new Date().toISOString()
        });

      if (insertError) throw insertError;

      // Update request status
      const { error: updateError } = await supabase
        .from('admin_requests')
        .update({ 
          status: 'approved', 
          reviewed_at: new Date().toISOString() 
        })
        .eq('id', request.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: `${request.name} has been approved as an admin.`,
      });

      fetchRequests();
      if (onRequestUpdated) onRequestUpdated();
      setIsDetailOpen(false);
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: "Error",
        description: "Failed to approve admin request.",
        variant: "destructive"
      });
    }
  };

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;

    if (!rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('admin_requests')
        .update({ 
          status: 'rejected', 
          reviewed_at: new Date().toISOString(),
          rejection_reason: rejectionReason
        })
        .eq('id', selectedRequest.id);

      if (error) throw error;

      toast({
        title: "Request Rejected",
        description: `${selectedRequest.name}'s request has been rejected.`,
      });

      fetchRequests();
      if (onRequestUpdated) onRequestUpdated();
      setIsRejectDialogOpen(false);
      setIsDetailOpen(false);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: "Error",
        description: "Failed to reject admin request.",
        variant: "destructive"
      });
    }
  };

  const handleViewDetails = (request: AdminRequest) => {
    setSelectedRequest(request);
    setIsDetailOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Requests</h2>
          <p className="text-gray-600 mt-1">Review and manage admin registration requests</p>
        </div>
        <Button onClick={fetchRequests} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{pendingCount}</div>
                <p className="text-xs text-muted-foreground">Pending Requests</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{approvedCount}</div>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{rejectedCount}</div>
                <p className="text-xs text-muted-foreground">Rejected</p>
              </div>
              <UserX className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search by name, email, or college ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Requests Table with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">
                Pending ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approvedCount})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({rejectedCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredRequests.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>College ID</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Requested On</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.map((request) => (
                        <TableRow 
                          key={request.id}
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleViewDetails(request)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-sm">
                                {request.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium">{request.name}</p>
                                <p className="text-xs text-gray-500">{request.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{request.college_id}</TableCell>
                          <TableCell>{request.department}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={getStatusColor(request.status)}
                            >
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(request.requested_at)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(request);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {request.status === 'pending' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleApproveRequest(request);
                                    }}
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedRequest(request);
                                      setIsRejectDialogOpen(true);
                                    }}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <UserCheck className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No {activeTab} requests found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Request Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Admin Request Details</DialogTitle>
            <DialogDescription>Complete information about the admin request</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-2xl">
                  {selectedRequest.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{selectedRequest.name}</h3>
                  <p className="text-sm text-gray-600">{selectedRequest.email}</p>
                </div>
                <Badge 
                  variant="outline" 
                  className={getStatusColor(selectedRequest.status)}
                >
                  {selectedRequest.status.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">College ID</p>
                  <p className="text-base">{selectedRequest.college_id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Department</p>
                  <p className="text-base">{selectedRequest.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p className="text-base capitalize">{selectedRequest.gender}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone Number</p>
                  <p className="text-base">{selectedRequest.phone_no}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">College Email</p>
                  <p className="text-base">{selectedRequest.college_mail}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Requested On</p>
                  <p className="text-base">{formatDate(selectedRequest.requested_at)}</p>
                </div>
                {selectedRequest.reviewed_at && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">Reviewed On</p>
                    <p className="text-base">{formatDate(selectedRequest.reviewed_at)}</p>
                  </div>
                )}
                {selectedRequest.rejection_reason && (
                  <div className="col-span-2 p-4 bg-red-50 rounded-lg">
                    <p className="text-sm font-medium text-red-800 mb-2">Rejection Reason</p>
                    <p className="text-sm text-gray-700">{selectedRequest.rejection_reason}</p>
                  </div>
                )}
              </div>

              {selectedRequest.status === 'pending' && (
                <div className="flex gap-2 pt-4">
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleApproveRequest(selectedRequest)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Request
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => {
                      setIsRejectDialogOpen(true);
                    }}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Request
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Admin Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this request. This will help the applicant understand the decision.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsRejectDialogOpen(false);
              setRejectionReason('');
            }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectRequest}>
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRequestsManagement;