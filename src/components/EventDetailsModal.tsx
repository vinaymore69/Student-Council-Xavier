import React, { useEffect } from 'react';
import { X, Calendar, MapPin, Clock, Award, FileText, ShieldCheck, Trophy, Share2, Mail, Phone, MessageCircle, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface EventDetailsModalProps {
  event: any;
  isOpen: boolean;
  onClose: () => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, isOpen, onClose }) => {
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'upcoming':
        return 'bg-blue-500';
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'cultural':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'technical':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sports':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return 'Time TBA';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleShare = async () => {
    const text = `Check out ${event.title || event.event_name}!`;
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: event.title || event.event_name, text, url });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Page link copied to clipboard",
      });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-screen px-4 py-8">
        <div 
          className="bg-white rounded-3xl max-w-5xl mx-auto shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Image */}
          <div className="relative h-64 sm:h-80 bg-gradient-to-br from-primary/20 to-purple-600/20">
            {event.image && (
              <>
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              </>
            )}
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center transition-colors shadow-lg"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <Badge className={`${getStatusColor(event.status)} text-white px-3 py-1 shadow-lg`}>
                {event.status?.charAt(0).toUpperCase() + event.status?.slice(1) || 'Upcoming'}
              </Badge>
              <Badge className={`${getTypeColor(event.category)} px-3 py-1 border shadow-lg`}>
                {event.category || 'Event'}
              </Badge>
            </div>

            {/* Title */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {event.title || event.event_name}
              </h1>
              <p className="text-white/90 text-lg">
                {event.categoryIcon} {event.event_category_name || event.category}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-xs text-gray-500 mb-1">Date</p>
                <p className="text-sm font-semibold text-gray-900">{formatDate(event.date)}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Clock className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="text-xs text-gray-500 mb-1">Time</p>
                <p className="text-sm font-semibold text-gray-900">{event.time || formatTime(event.date_time)}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <MapPin className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-xs text-gray-500 mb-1">Venue</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{event.location || event.venue || 'TBA'}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Award className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                <p className="text-xs text-gray-500 mb-1">Duration</p>
                <p className="text-sm font-semibold text-gray-900">{event.duration || 'TBA'}</p>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                {event.description && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold text-gray-900">About Event</h2>
                    </div>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {event.description}
                    </p>
                  </div>
                )}

                {/* Rules */}
                {event.rules && (
                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <h2 className="text-lg font-semibold text-gray-900">Rules & Regulations</h2>
                    </div>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {event.rules}
                    </p>
                  </div>
                )}

                {/* Code of Conduct */}
                {event.code_of_conduct && (
                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                      <h2 className="text-lg font-semibold text-gray-900">Code of Conduct</h2>
                    </div>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {event.code_of_conduct}
                    </p>
                  </div>
                )}

                {/* Prize Details */}
                {event.prize_details && (
                  <div className="pt-6 border-t border-gray-100">
                    <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Trophy className="h-5 w-5 text-yellow-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Prize Details</h2>
                      </div>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                        {event.prize_details}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Share */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Share Event</h3>
                  <Button 
                    onClick={handleShare}
                    className="w-full"
                    variant="outline"
                    size="sm"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>

                {/* Contact Info */}
                {event.contact_details && Object.keys(event.contact_details).length > 0 && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact</h3>
                    <div className="space-y-3">
                      {event.contact_details.email && (
                        <a 
                          href={`mailto:${event.contact_details.email}`}
                          className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
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
                          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
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
                          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                            <MessageCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Social Media */}
                {event.socials && Object.values(event.socials).some(link => link) && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Follow Event</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.socials.facebook && (
                        <a
                          href={event.socials.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-lg bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
                        >
                          <Facebook className="h-5 w-5 text-blue-600" />
                        </a>
                      )}
                      {event.socials.instagram && (
                        <a
                          href={event.socials.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-lg bg-pink-100 hover:bg-pink-200 flex items-center justify-center transition-colors"
                        >
                          <Instagram className="h-5 w-5 text-pink-600" />
                        </a>
                      )}
                      {event.socials.twitter && (
                        <a
                          href={event.socials.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-lg bg-sky-100 hover:bg-sky-200 flex items-center justify-center transition-colors"
                        >
                          <Twitter className="h-5 w-5 text-sky-600" />
                        </a>
                      )}
                      {event.socials.linkedin && (
                        <a
                          href={event.socials.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-lg bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
                        >
                          <Linkedin className="h-5 w-5 text-blue-700" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Event Summary */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Event Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium text-gray-900">{event.category || event.event_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Year:</span>
                      <span className="font-medium text-gray-900">{event.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-gray-900 capitalize">{event.status}</span>
                    </div>
                    {event.participants && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Participants:</span>
                        <span className="font-medium text-gray-900">{event.participants}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;