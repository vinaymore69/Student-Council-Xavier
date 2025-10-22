import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Search, 
  Trash2, 
  Image as ImageIcon,
  Calendar,
  Filter,
  X,
  Loader2,
  Eye
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

interface GalleryImage {
  id: string;
  event_id: string;
  sub_event_id: string | null;
  sub_event_name: string | null;
  image_url: string;
  image_filename: string;
  caption: string | null;
  uploaded_at: string;
  uploaded_by: string;
}

const EventGallery: React.FC = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [subEvents, setSubEvents] = useState<SubEvent[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Filters
const [selectedEvent, setSelectedEvent] = useState<string>('all-events'); // Changed from ''
  const [selectedSubEvent, setSelectedSubEvent] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadEventId, setUploadEventId] = useState<string>('');
  const [uploadSubEventId, setUploadSubEventId] = useState<string>('');
  const [uploadSubEventName, setUploadSubEventName] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadCaption, setUploadCaption] = useState<string>('');

  // View modal state
  const [viewImage, setViewImage] = useState<GalleryImage | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Delete state
  const [imageToDelete, setImageToDelete] = useState<GalleryImage | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
    fetchGalleryImages();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchSubEvents(selectedEvent);
    } else {
      setSubEvents([]);
    }
  }, [selectedEvent]);

  useEffect(() => {
    filterImages();
  }, [galleryImages, selectedEvent, selectedSubEvent, searchQuery]);

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

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('event_gallery')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setGalleryImages(data || []);
    } catch (error: any) {
      console.error('Error fetching gallery images:', error);
      toast({
        title: "Error",
        description: "Failed to fetch gallery images",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterImages = () => {
    let filtered = [...galleryImages];

    // Event filter
   if (selectedEvent && selectedEvent !== 'all-events') { // Added check
    filtered = filtered.filter(img => img.event_id === selectedEvent);
  }

    // Sub-event filter
    if (selectedSubEvent !== 'all') {
      if (selectedSubEvent === 'main') {
        filtered = filtered.filter(img => !img.sub_event_id);
      } else {
        filtered = filtered.filter(img => img.sub_event_id === selectedSubEvent);
      }
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(img =>
        img.sub_event_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.caption?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredImages(filtered);
  };

  const handleOpenUploadModal = () => {
    if (!selectedEvent) {
      toast({
        title: "Select an event",
        description: "Please select an event first",
        variant: "destructive"
      });
      return;
    }
    setUploadEventId(selectedEvent);
    setUploadSubEventId('');
    setUploadSubEventName('');
    setSelectedFiles(null);
    setUploadCaption('');
    setIsUploadModalOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Validate file count
      if (files.length > 50) {
        toast({
          title: "Too many files",
          description: "You can upload maximum 50 images at once",
          variant: "destructive"
        });
        return;
      }

      // Validate file types and sizes
      for (let i = 0; i < files.length; i++) {
        if (!files[i].type.startsWith('image/')) {
          toast({
            title: "Invalid file type",
            description: "Please upload only image files",
            variant: "destructive"
          });
          return;
        }
        if (files[i].size > 10 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${files[i].name} is larger than 10MB`,
            variant: "destructive"
          });
          return;
        }
      }

      setSelectedFiles(files);
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select images to upload",
        variant: "destructive"
      });
      return;
    }

    if (!uploadEventId) {
      toast({
        title: "No event selected",
        description: "Please select an event",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);

      // Create FormData
      const formData = new FormData();
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('images', selectedFiles[i]);
      }
      formData.append('eventId', uploadEventId);
      if (uploadSubEventId) {
        formData.append('subEventId', uploadSubEventId);
      }
      if (uploadSubEventName) {
        formData.append('subEventName', uploadSubEventName);
      }

      // Upload to server
      const response = await fetch('http://localhost:3001/api/upload-event-gallery', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();

      // Save to database
      const galleryEntries = result.files.map((file: any) => ({
        event_id: uploadEventId,
        sub_event_id: uploadSubEventId || null,
        sub_event_name: uploadSubEventName || null,
        image_path: file.filePath,
        image_url: file.fileUrl,
        image_filename: file.savedFileName,
        caption: uploadCaption || null,
        uploaded_by: 'vinaymore69'
      }));

      const { error } = await supabase
        .from('event_gallery')
        .insert(galleryEntries);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${result.files.length} image(s) uploaded successfully`
      });

      fetchGalleryImages();
      setIsUploadModalOpen(false);
      setSelectedFiles(null);
      setUploadCaption('');
    } catch (error: any) {
      console.error('Error uploading images:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload images",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = (image: GalleryImage) => {
    setImageToDelete(image);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!imageToDelete) return;

    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('event_gallery')
        .delete()
        .eq('id', imageToDelete.id);

      if (dbError) throw dbError;

      // Delete from server
      const filename = imageToDelete.image_filename;
      await fetch(`http://localhost:3001/api/delete-file/event-gallery/${filename}`, {
        method: 'DELETE'
      });

      toast({
        title: "Success",
        description: "Image deleted successfully"
      });

      fetchGalleryImages();
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive"
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setImageToDelete(null);
    }
  };

  const handleViewImage = (image: GalleryImage) => {
    setViewImage(image);
    setIsViewModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Gallery</h1>
          <p className="text-gray-500 mt-1">Manage event photos and images</p>
        </div>
        <Button onClick={handleOpenUploadModal} disabled={!selectedEvent}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Images
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">{galleryImages.length}</div>
            <p className="text-sm text-gray-500">Total Images</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {galleryImages.filter(img => !img.sub_event_id).length}
            </div>
            <p className="text-sm text-gray-500">Main Event Images</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {galleryImages.filter(img => img.sub_event_id).length}
            </div>
            <p className="text-sm text-gray-500">Sub-Event Images</p>
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
                disabled={!selectedEvent}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All sub-events" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sub-Events</SelectItem>
                  <SelectItem value="main">Main Event Only</SelectItem>
                  {subEvents.map(subEvent => (
                    <SelectItem key={subEvent.id} value={subEvent.id}>
                      {subEvent.sub_event_name}
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
                  placeholder="Search captions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      {selectedEvent === 'all-events' ? (
  <Card>
    <CardContent className="py-16 text-center">
      <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Select an event</h3>
      <p className="text-gray-500">Please select an event to view its gallery</p>
    </CardContent>
  </Card>
) : filteredImages.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No images found</h3>
            <p className="text-gray-500 mb-4">Upload images to get started</p>
            <Button onClick={handleOpenUploadModal}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Images
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image) => (
            <Card key={image.id} className="overflow-hidden group relative">
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                  src={image.image_url}
                  alt={image.caption || 'Gallery image'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleViewImage(image)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteClick(image)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Info Badge */}
              {image.sub_event_name && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-black/70 text-white">
                    {image.sub_event_name}
                  </Badge>
                </div>
              )}
              
              {image.caption && (
                <CardContent className="p-2">
                  <p className="text-xs text-gray-600 line-clamp-2">{image.caption}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Gallery Images</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Event</Label>
              <Select value={uploadEventId} onValueChange={setUploadEventId}>
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

            <div>
              <Label>Sub-Event (Optional)</Label>
              <Input
                value={uploadSubEventName}
                onChange={(e) => setUploadSubEventName(e.target.value)}
                placeholder="e.g., Cricket, Dance Competition, etc."
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty for main event gallery
              </p>
            </div>

            <div>
              <Label>Caption (Optional)</Label>
              <Textarea
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
                placeholder="Add a caption for all images"
                rows={2}
              />
            </div>

            <div>
              <Label>Select Images</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                disabled={uploading}
              />
              {selectedFiles && (
                <p className="text-sm text-gray-600 mt-2">
                  {selectedFiles.length} file(s) selected
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Max 50 images, 10MB each
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsUploadModalOpen(false)}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={uploading || !selectedFiles}>
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Image Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Image Details</DialogTitle>
          </DialogHeader>
          {viewImage && (
            <div className="space-y-4">
              <div className="w-full max-h-[60vh] overflow-hidden rounded-lg">
                <img
                  src={viewImage.image_url}
                  alt={viewImage.caption || 'Gallery image'}
                  className="w-full h-full object-contain"
                />
              </div>
              {viewImage.sub_event_name && (
                <div>
                  <Label>Sub-Event</Label>
                  <p className="text-sm">{viewImage.sub_event_name}</p>
                </div>
              )}
              {viewImage.caption && (
                <div>
                  <Label>Caption</Label>
                  <p className="text-sm">{viewImage.caption}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <Label>Uploaded By</Label>
                  <p>{viewImage.uploaded_by}</p>
                </div>
                <div>
                  <Label>Uploaded At</Label>
                  <p>{new Date(viewImage.uploaded_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this image. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EventGallery;