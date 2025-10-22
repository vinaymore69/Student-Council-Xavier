import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import emailjs from '@emailjs/browser';
import {
  Mail,
  Send,
  Clock,
  Paperclip,
  X,
  Upload,
  FileText,
  Image,
  Video,
  Download,
  Eye,
  Trash2,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  LinkIcon
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// EmailJS Configuration
const EMAIL_CONFIG = {
  serviceId: 'service_abb3y8s',
  templateId: 'template_twg03ab',
  publicKey: 'wdUryE-n6It7hgomx'
};

// Server URL
const SERVER_URL = 'http://localhost:3001';

interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  department: string;
}

interface FileAttachment {
  fileId: string;
  fileName: string;
  savedFileName: string;
  fileUrl: string;
  viewUrl: string;
  downloadUrl: string;
  filePath: string;
  mimeType: string;
  size: number;
}

interface EmailRecord {
  id: string;
  subject: string;
  message: string;
  recipients: string[];
  attachment?: FileAttachment;
  attachment_path?: string;
  status: 'sent' | 'scheduled' | 'failed' | 'draft' | 'partial';
  sent_at?: string;
  scheduled_at?: string;
  created_at: string;
  sent_by: string;
}

const EmailManagement: React.FC = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [uploadedFile, setUploadedFile] = useState<FileAttachment | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [emailHistory, setEmailHistory] = useState<EmailRecord[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    emailjs.init(EMAIL_CONFIG.publicKey);
    fetchStudents();
    fetchEmailHistory();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id, name, email, class, department')
        .order('name');

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive"
      });
    }
  };

  const fetchEmailHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('email_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmailHistory(data || []);
    } catch (error) {
      console.error('Error fetching email history:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 100MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${SERVER_URL}/api/upload-to-drive`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result: FileAttachment = await response.json();
      setUploadedFile(result);

      toast({
        title: "✅ Upload Successful",
        description: `${result.fileName} uploaded to server`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = async () => {
    if (!uploadedFile) return;

    try {
      // Optional: Delete file from server
      const response = await fetch(`${SERVER_URL}/api/delete-file/${uploadedFile.savedFileName}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "File removed",
          description: "Attachment has been removed from server",
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      // Still remove from UI even if server delete fails
    } finally {
      setUploadedFile(null);
    }
  };

  const getFilteredStudents = () => {
    return students.filter(student => {
      const classMatch = filterClass === 'all' || student.class === filterClass;
      const deptMatch = filterDepartment === 'all' || student.department === filterDepartment;
      return classMatch && deptMatch;
    });
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectAll = () => {
    const filtered = getFilteredStudents();
    setSelectedStudents(filtered.map(s => s.id));
  };

  const deselectAll = () => {
    setSelectedStudents([]);
  };

  const sendEmail = async () => {
    if (selectedStudents.length === 0) {
      toast({
        title: "No recipients",
        description: "Please select at least one student",
        variant: "destructive"
      });
      return;
    }

    if (!subject || !message) {
      toast({
        title: "Missing fields",
        description: "Please fill in subject and message",
        variant: "destructive"
      });
      return;
    }

    if (isScheduled && (!scheduleDate || !scheduleTime)) {
      toast({
        title: "Missing schedule",
        description: "Please set schedule date and time",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);

    try {
      const recipients = students.filter(s => selectedStudents.includes(s.id));
      let successCount = 0;
      let failCount = 0;

      // Prepare message with attachment link
      let emailMessage = message;
      if (uploadedFile) {
        emailMessage += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        emailMessage += `📎 ATTACHMENT\n\n`;
        emailMessage += `File: ${uploadedFile.fileName}\n`;
        emailMessage += `Size: ${formatFileSize(uploadedFile.size)}\n\n`;
        emailMessage += `🔗 View/Download:\n${uploadedFile.downloadUrl}\n`;
        emailMessage += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
      }

      for (const student of recipients) {
        try {
          const templateParams = {
            to_email: student.email,
            to_name: student.name,
            subject: subject,
            message: emailMessage,
            from_name: 'Admin - Xavier College'
          };

          const response = await emailjs.send(
            EMAIL_CONFIG.serviceId,
            EMAIL_CONFIG.templateId,
            templateParams
          );

          if (response.status === 200) {
            successCount++;
          } else {
            failCount++;
          }

          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Failed to send to ${student.email}:`, error);
          failCount++;
        }
      }

      // Save to email history
      const emailRecord = {
        subject,
        message: emailMessage,
        recipients: recipients.map(r => r.email),
        attachment: uploadedFile,
        attachment_path: uploadedFile?.filePath || null,
        status: successCount > 0 ? (failCount > 0 ? 'partial' : 'sent') : 'failed',
        sent_at: new Date().toISOString(),
        sent_by: localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')!).name : 'Admin',
        created_at: new Date().toISOString()
      };

      const { error: insertError } = await supabase
        .from('email_history')
        .insert(emailRecord);

      if (insertError) {
        console.error('Error saving to history:', insertError);
      }

      toast({
        title: "✅ Email sent successfully",
        description: `Delivered to ${successCount} of ${recipients.length} recipients`,
      });

      // Reset form
      setSubject('');
      setMessage('');
      setUploadedFile(null);
      setSelectedStudents([]);
      setScheduleDate('');
      setScheduleTime('');
      setIsScheduled(false);

      fetchEmailHistory();
    } catch (error) {
      console.error('Error sending emails:', error);
      toast({
        title: "Error",
        description: "Failed to send emails",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (mimeType.startsWith('video/')) return <Video className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'partial':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'scheduled':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredStudents = getFilteredStudents();
  const selectedCount = selectedStudents.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Email Management</h2>
        <p className="text-gray-600 mt-1">Send emails with file attachments</p>
      </div>

      <Tabs defaultValue="compose" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="compose">Compose Email</TabsTrigger>
          <TabsTrigger value="history">Email History</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Select Recipients
              </CardTitle>
              <CardDescription>
                Choose students to send email to ({selectedCount} selected)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={filterClass} onValueChange={setFilterClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {[...new Set(students.map(s => s.class))].map(cls => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {[...new Set(students.map(s => s.department))].map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button onClick={selectAll} variant="outline" className="flex-1">
                    Select All ({filteredStudents.length})
                  </Button>
                  <Button onClick={deselectAll} variant="outline" className="flex-1">
                    Clear
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg max-h-64 overflow-y-auto">
                {filteredStudents.map(student => (
                  <div
                    key={student.id}
                    className={`flex items-center gap-3 p-3 border-b last:border-0 cursor-pointer hover:bg-gray-50 ${
                      selectedStudents.includes(student.id) ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => toggleStudentSelection(student.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => toggleStudentSelection(student.id)}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{student.class}</Badge>
                      <p className="text-xs text-gray-500 mt-1">{student.department}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Compose Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Subject *</label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message *</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message here..."
                  rows={8}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Attachment (Stored on Server)
                </label>
                {uploadedFile ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      {getFileIcon(uploadedFile.mimeType)}
                      <div className="flex-1">
                        <p className="font-medium text-green-900">{uploadedFile.fileName}</p>
                        <p className="text-sm text-green-700">{formatFileSize(uploadedFile.size)}</p>
                        <p className="text-xs text-gray-500 mt-1">Saved as: {uploadedFile.savedFileName}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(uploadedFile.viewUrl, '_blank')}
                        className="text-green-700 hover:text-green-900"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveFile}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <LinkIcon className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div className="flex-1 text-sm">
                        <p className="font-medium text-blue-900 mb-1">Download link (will be sent in email):</p>
                        <p className="text-blue-700 break-all font-mono text-xs">{uploadedFile.downloadUrl}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-3 p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors">
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                        <span>Uploading to server...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">Click to upload file (Max 100MB)</span>
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          className="hidden"
                          accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.txt"
                        />
                      </>
                    )}
                  </label>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  ℹ️ File will be stored on the server with a unique ID to prevent duplicates
                </p>
              </div>

              <Button
                onClick={sendEmail}
                disabled={isSending || selectedCount === 0}
                className="w-full"
                size="lg"
              >
                {isSending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending emails...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send to {selectedCount} Recipients
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Email History</CardTitle>
              <CardDescription>View all sent emails with attachments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emailHistory.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No emails sent yet</p>
                ) : (
                  emailHistory.map(email => (
                    <div
                      key={email.id}
                      className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedEmail(email);
                        setIsDetailOpen(true);
                      }}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        {getStatusIcon(email.status)}
                        <div className="flex-1">
                          <h3 className="font-medium">{email.subject}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{email.message}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>{email.recipients.length} recipients</span>
                            <span>{formatDate(email.created_at)}</span>
                            <span>By: {email.sent_by}</span>
                            {email.attachment && (
                              <span className="flex items-center gap-1 text-blue-600">
                                <Paperclip className="w-3 h-3" />
                                {email.attachment.fileName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge variant={email.status === 'sent' ? 'default' : email.status === 'partial' ? 'secondary' : 'destructive'}>
                        {email.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Email Details</DialogTitle>
          </DialogHeader>
          {selectedEmail && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{selectedEmail.subject}</h3>
                <Badge>{selectedEmail.status}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Message</p>
                <p className="mt-1 whitespace-pre-wrap">{selectedEmail.message}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Recipients ({selectedEmail.recipients.length})</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {selectedEmail.recipients.map((email, idx) => (
                    <Badge key={idx} variant="outline">{email}</Badge>
                  ))}
                </div>
              </div>
              {selectedEmail.attachment && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Attachment</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                      {getFileIcon(selectedEmail.attachment.mimeType)}
                      <div className="flex-1">
                        <p className="font-medium">{selectedEmail.attachment.fileName}</p>
                        <p className="text-sm text-gray-600">{formatFileSize(selectedEmail.attachment.size)}</p>
                        {selectedEmail.attachment_path && (
                          <p className="text-xs text-gray-400 mt-1">Path: {selectedEmail.attachment_path}</p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(selectedEmail.attachment!.downloadUrl, '_blank')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    <div className="flex items-start gap-2 p-2 bg-blue-50 rounded text-xs">
                      <LinkIcon className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                      <a 
                        href={selectedEmail.attachment.downloadUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:underline break-all font-mono"
                      >
                        {selectedEmail.attachment.downloadUrl}
                      </a>
                    </div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm font-medium text-gray-500">Sent At</p>
                  <p className="mt-1">{selectedEmail.sent_at ? formatDate(selectedEmail.sent_at) : 'Not sent'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Sent By</p>
                  <p className="mt-1">{selectedEmail.sent_by}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailManagement;