import React, { useState, useEffect } from 'react';
import { X, Upload, Loader2, Calendar, MapPin, Clock, Award, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AddEditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any | null;
  onSuccess: () => void;
}

const AddEditEventModal: React.FC<AddEditEventModalProps> = ({
  isOpen,
  onClose,
  event,
  onSuccess
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    event_name: '',
    event_type: '',
    event_category_name: '',
    description: '',
    banner_image_path: '',
    banner_image_url: '',
    banner_filename: '',
    date_time: '',
    duration: '',
    venue: '',
    rules: '',
    code_of_conduct: '',
    prize_details: '',
    year: new Date().getFullYear(),
    status: 'upcoming',
    // Socials
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    // Contact
    email: '',
    phone: '',
    whatsapp: ''
  });

  // Predefined event types
  const eventTypes = ['Cultural', 'Technical', 'Sports'];
  const eventStatuses = ['upcoming', 'ongoing', 'completed'];

  // Generate years (current year and next 5 years)
  const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i);

  useEffect(() => {
    if (event) {
      // Populate form with existing event data
      setFormData({
        event_name: event.event_name || '',
        event_type: event.event_type || '',
        event_category_name: event.event_category_name || '',
        description: event.description || '',
        banner_image_path: event.banner_image_path || '',
        banner_image_url: event.banner_image_url || '',
        banner_filename: event.banner_filename || '',
        date_time: event.date_time ? event.date_time.slice(0, 16) : '',
        duration: event.duration || '',
        venue: event.venue || '',
        rules: event.rules || '',
        code_of_conduct: event.code_of_conduct || '',
        prize_details: event.prize_details || '',
        year: event.year || new Date().getFullYear(),
        status: event.status || 'upcoming',
        facebook: event.socials?.facebook || '',
        instagram: event.socials?.instagram || '',
        twitter: event.socials?.twitter || '',
        linkedin: event.socials?.linkedin || '',
        email: event.contact_details?.email || '',
        phone: event.contact_details?.phone || '',
        whatsapp: event.contact_details?.whatsapp || ''
      });
      setBannerPreview(event.banner_image_url || '');
    } else {
      // Reset form for new event
      resetForm();
    }
  }, [event]);

  const resetForm = () => {
    setFormData({
      event_name: '',
      event_type: '',
      event_category_name: '',
      description: '',
      banner_image_path: '',
      banner_image_url: '',
      banner_filename: '',
      date_time: '',
      duration: '',
      venue: '',
      rules: '',
      code_of_conduct: '',
      prize_details: '',
      year: new Date().getFullYear(),
      status: 'upcoming',
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
      email: '',
      phone: '',
      whatsapp: ''
    });
    setBannerPreview('');
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

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Banner image must be less than 10MB",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploadingBanner(true);

      // Create FormData
      const formDataToSend = new FormData();
      formDataToSend.append('banner', file);
      formDataToSend.append('eventId', event?.id || 'temp');
      formDataToSend.append('eventName', formData.event_name || 'event');

      // Upload to server
      const response = await fetch('http://localhost:3001/api/upload-event-banner', {
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
        banner_image_path: result.filePath,
        banner_image_url: result.fileUrl,
        banner_filename: result.savedFileName
      }));

      setBannerPreview(result.fileUrl);

      toast({
        title: "Success",
        description: "Banner uploaded successfully"
      });
    } catch (error: any) {
      console.error('Error uploading banner:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload banner",
        variant: "destructive"
      });
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.event_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Event name is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.event_type.trim()) {
      toast({
        title: "Validation Error",
        description: "Event type is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.event_category_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Event category name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      // Prepare socials and contact_details as JSON
      const socials = {
        facebook: formData.facebook,
        instagram: formData.instagram,
        twitter: formData.twitter,
        linkedin: formData.linkedin
      };

      const contact_details = {
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.whatsapp
      };

      const eventData = {
        event_name: formData.event_name,
        event_type: formData.event_type,
        event_category_name: formData.event_category_name,
        description: formData.description,
        banner_image_path: formData.banner_image_path,
        banner_image_url: formData.banner_image_url,
        banner_filename: formData.banner_filename,
        date_time: formData.date_time || null,
        duration: formData.duration,
        venue: formData.venue,
        rules: formData.rules,
        code_of_conduct: formData.code_of_conduct,
        prize_details: formData.prize_details,
        year: formData.year,
        status: formData.status,
        socials: socials,
        contact_details: contact_details,
        created_by: 'vinaymore69', // Current user
        updated_at: new Date().toISOString()
      };

      if (event) {
        // Update existing event
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', event.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Event updated successfully"
        });
      } else {
        // Create new event
        const { error } = await supabase
          .from('events')
          .insert([eventData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Event created successfully"
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving event:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save event",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {event ? 'Edit Event' : 'Add New Event'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="banner">Banner</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="event_name">Event Name *</Label>
                  <Input
                    id="event_name"
                    name="event_name"
                    value={formData.event_name}
                    onChange={handleInputChange}
                    placeholder="e.g., Spandan 2025"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="event_type">Event Type *</Label>
                  <Select 
                    value={formData.event_type} 
                    onValueChange={(value) => handleSelectChange('event_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.event_type === 'custom' && (
                    <Input
                      name="event_type"
                      value={formData.event_type}
                      onChange={handleInputChange}
                      placeholder="Enter custom type"
                      className="mt-2"
                    />
                  )}
                </div>

                <div>
                  <Label htmlFor="event_category_name">Category Name *</Label>
                  <Input
                    id="event_category_name"
                    name="event_category_name"
                    value={formData.event_category_name}
                    onChange={handleInputChange}
                    placeholder="e.g., Spandan, Transmission, Sparx"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="year">Year *</Label>
                  <Select 
                    value={formData.year.toString()} 
                    onValueChange={(value) => handleSelectChange('year', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventStatuses.map(status => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the event"
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date_time">Date & Time</Label>
                  <Input
                    id="date_time"
                    name="date_time"
                    type="datetime-local"
                    value={formData.date_time}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 3 days, 2 hours"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="venue">Venue</Label>
                  <Input
                    id="venue"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    placeholder="Event venue location"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="rules">Rules</Label>
                  <Textarea
                    id="rules"
                    name="rules"
                    value={formData.rules}
                    onChange={handleInputChange}
                    placeholder="Event rules and regulations"
                    rows={3}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="code_of_conduct">Code of Conduct</Label>
                  <Textarea
                    id="code_of_conduct"
                    name="code_of_conduct"
                    value={formData.code_of_conduct}
                    onChange={handleInputChange}
                    placeholder="Code of conduct for participants"
                    rows={3}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="prize_details">Prize Details</Label>
                  <Textarea
                    id="prize_details"
                    name="prize_details"
                    value={formData.prize_details}
                    onChange={handleInputChange}
                    placeholder="Prize information"
                    rows={2}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Social Media Links</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        name="facebook"
                        value={formData.facebook}
                        onChange={handleInputChange}
                        placeholder="Facebook URL"
                      />
                    </div>
                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleInputChange}
                        placeholder="Instagram URL"
                      />
                    </div>
                    <div>
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        name="twitter"
                        value={formData.twitter}
                        onChange={handleInputChange}
                        placeholder="Twitter URL"
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        placeholder="LinkedIn URL"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Contact Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="contact@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 1234567890"
                      />
                    </div>
                    <div>
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        placeholder="+91 1234567890"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Banner Tab */}
            <TabsContent value="banner" className="space-y-4">
              <div>
                <Label htmlFor="banner">Event Banner</Label>
                <div className="mt-2 space-y-4">
                  {bannerPreview && (
                    <div className="relative w-full h-64 border rounded-lg overflow-hidden">
                      <img
                        src={bannerPreview}
                        alt="Banner preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <Input
                      id="banner"
                      type="file"
                      accept="image/*"
                      onChange={handleBannerUpload}
                      disabled={uploadingBanner}
                      className="flex-1"
                    />
                    {uploadingBanner && (
                      <Loader2 className="animate-spin h-5 w-5 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Upload a banner image (Max 10MB, JPG/PNG)
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || uploadingBanner}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {event ? 'Update Event' : 'Create Event'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditEventModal;