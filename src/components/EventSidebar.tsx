import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MessageCircle, Share2, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EventSidebarProps {
  event: any;
}

const EventSidebar: React.FC<EventSidebarProps> = ({ event }) => {
  const { toast } = useToast();

  const handleShare = async () => {
    const url = window.location.href;
    const text = `Check out ${event.event_name}!`;

    if (navigator.share) {
      try {
        await navigator.share({ title: event.event_name, text, url });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Event link copied to clipboard",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Share Card */}
      <Card className="border-gray-100">
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Share Event</h3>
          <Button 
            onClick={handleShare}
            className="w-full"
            variant="outline"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </CardContent>
      </Card>

      {/* Contact Information */}
      {event.contact_details && Object.keys(event.contact_details).length > 0 && (
        <Card className="border-gray-100">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              {event.contact_details.email && (
                <a 
                  href={`mailto:${event.contact_details.email}`}
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="truncate">{event.contact_details.email}</span>
                </a>
              )}
              {event.contact_details.phone && (
                <a 
                  href={`tel:${event.contact_details.phone}`}
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <Phone className="h-4 w-4 text-green-600" />
                  </div>
                  <span>{event.contact_details.phone}</span>
                </a>
              )}
              {event.contact_details.whatsapp && (
                <a 
                  href={`https://wa.me/${event.contact_details.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Social Media Links */}
      {event.socials && Object.values(event.socials).some(link => link) && (
        <Card className="border-gray-100">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Follow Event</h3>
            <div className="flex flex-wrap gap-2">
              {event.socials.facebook && (
                <a
                  href={event.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors"
                >
                  <Facebook className="h-5 w-5 text-blue-600" />
                </a>
              )}
              {event.socials.instagram && (
                <a
                  href={event.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-pink-50 hover:bg-pink-100 flex items-center justify-center transition-colors"
                >
                  <Instagram className="h-5 w-5 text-pink-600" />
                </a>
              )}
              {event.socials.twitter && (
                <a
                  href={event.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-sky-50 hover:bg-sky-100 flex items-center justify-center transition-colors"
                >
                  <Twitter className="h-5 w-5 text-sky-600" />
                </a>
              )}
              {event.socials.linkedin && (
                <a
                  href={event.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors"
                >
                  <Linkedin className="h-5 w-5 text-blue-700" />
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Info Summary */}
      <Card className="border-gray-100 bg-gray-50">
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Event Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span className="font-medium text-gray-900">{event.event_category_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-medium text-gray-900">{event.event_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Year:</span>
              <span className="font-medium text-gray-900">{event.year}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-gray-900 capitalize">{event.status}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventSidebar;