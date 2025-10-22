import React from 'react';
import { X, Edit, Calendar, MapPin, Clock, Award, Mail, Phone, MessageCircle, Facebook, Instagram, Twitter, Linkedin, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface ViewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  onEdit: () => void;
}

const ViewEventModal: React.FC<ViewEventModalProps> = ({
  isOpen,
  onClose,
  event,
  onEdit
}) => {
  if (!event) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500';
      case 'ongoing':
        return 'bg-green-500';
      case 'completed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'cultural':
        return 'bg-purple-100 text-purple-800';
      case 'technical':
        return 'bg-blue-100 text-blue-800';
      case 'sports':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{event.event_name}</DialogTitle>
              <div className="flex items-center gap-2">
                <Badge className={`${getStatusColor(event.status)} text-white`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </Badge>
                <Badge className={getTypeColor(event.event_type)}>
                  {event.event_type}
                </Badge>
                <Badge variant="outline">
                  {event.year}
                </Badge>
              </div>
            </div>
            <Button onClick={onEdit} size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit Event
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Banner Image */}
          {event.banner_image_url && (
            <div className="w-full h-64 rounded-lg overflow-hidden border">
              <img
                src={event.banner_image_url}
                alt={event.event_name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Basic Info Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Category Name</p>
                <p className="font-medium">{event.event_category_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Event Type</p>
                <p className="font-medium">{event.event_type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="font-medium">{event.year}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium capitalize">{event.status}</p>
              </div>
            </div>
            {event.description && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="text-gray-700">{event.description}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Event Details Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              Event Details
            </h3>
            <div className="space-y-3">
              {event.date_time && (
                <div className="flex items-start">
                  <Calendar className="mr-3 h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium">{formatDateTime(event.date_time)}</p>
                  </div>
                </div>
              )}
              
              {event.duration && (
                <div className="flex items-start">
                  <Clock className="mr-3 h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{event.duration}</p>
                  </div>
                </div>
              )}
              
              {event.venue && (
                <div className="flex items-start">
                  <MapPin className="mr-3 h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Venue</p>
                    <p className="font-medium">{event.venue}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Rules & Conduct Section */}
          {(event.rules || event.code_of_conduct || event.prize_details) && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5 text-primary" />
                  Rules & Information
                </h3>
                <div className="space-y-4">
                  {event.rules && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-blue-900 mb-2">Rules</p>
                      <p className="text-sm text-blue-800 whitespace-pre-wrap">{event.rules}</p>
                    </div>
                  )}
                  
                  {event.code_of_conduct && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-purple-900 mb-2">Code of Conduct</p>
                      <p className="text-sm text-purple-800 whitespace-pre-wrap">{event.code_of_conduct}</p>
                    </div>
                  )}
                  
                  {event.prize_details && (
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <Award className="mr-2 h-5 w-5 text-amber-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-amber-900 mb-2">Prize Details</p>
                          <p className="text-sm text-amber-800 whitespace-pre-wrap">{event.prize_details}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Contact Information Section */}
          {(event.contact_details?.email || event.contact_details?.phone || event.contact_details?.whatsapp) && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Phone className="mr-2 h-5 w-5 text-primary" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {event.contact_details?.email && (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Mail className="mr-3 h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <a 
                          href={`mailto:${event.contact_details.email}`}
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          {event.contact_details.email}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {event.contact_details?.phone && (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Phone className="mr-3 h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <a 
                          href={`tel:${event.contact_details.phone}`}
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          {event.contact_details.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {event.contact_details?.whatsapp && (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <MessageCircle className="mr-3 h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">WhatsApp</p>
                        <a 
                          href={`https://wa.me/${event.contact_details.whatsapp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-green-600 hover:underline"
                        >
                          {event.contact_details.whatsapp}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Social Media Section */}
          {(event.socials?.facebook || event.socials?.instagram || event.socials?.twitter || event.socials?.linkedin) && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3">Social Media</h3>
                <div className="flex flex-wrap gap-3">
                  {event.socials?.facebook && (
                    <a
                      href={event.socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Facebook className="h-4 w-4" />
                      <span className="text-sm">Facebook</span>
                    </a>
                  )}
                  
                  {event.socials?.instagram && (
                    <a
                      href={event.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
                    >
                      <Instagram className="h-4 w-4" />
                      <span className="text-sm">Instagram</span>
                    </a>
                  )}
                  
                  {event.socials?.twitter && (
                    <a
                      href={event.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                    >
                      <Twitter className="h-4 w-4" />
                      <span className="text-sm">Twitter</span>
                    </a>
                  )}
                  
                  {event.socials?.linkedin && (
                    <a
                      href={event.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span className="text-sm">LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Metadata Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Event Metadata</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Created By</p>
                <p className="font-medium">{event.created_by || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500">Created At</p>
                <p className="font-medium">
                  {event.created_at ? new Date(event.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Last Updated</p>
                <p className="font-medium">
                  {event.updated_at ? new Date(event.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Event ID</p>
                <p className="font-mono text-xs">{event.id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewEventModal;