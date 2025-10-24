import React from 'react';
import { Calendar, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EventHeroProps {
  event: any;
}

const EventHero: React.FC<EventHeroProps> = ({ event }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
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
    switch (type?.toLowerCase()) {
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
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {event.banner_image_url ? (
          <>
            <img 
              src={event.banner_image_url} 
              alt={event.event_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"></div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/gallery')}
          className="mb-6 text-white hover:bg-white/20"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Gallery
        </Button>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Badge className={`${getStatusColor(event.status)} text-white px-3 py-1`}>
            {event.status?.charAt(0).toUpperCase() + event.status?.slice(1) || 'Upcoming'}
          </Badge>
          <Badge className={`${getTypeColor(event.event_type)} px-3 py-1`}>
            {event.event_type || 'Event'}
          </Badge>
          <Badge variant="outline" className="bg-white/10 text-white border-white/30 px-3 py-1">
            {event.year}
          </Badge>
        </div>

        {/* Event Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-4 max-w-4xl">
          {event.event_name}
        </h1>

        {/* Category */}
        <p className="text-xl text-white/90 mb-8">
          {event.event_category_name}
        </p>

        {/* Quick Info */}
        <div className="flex flex-wrap items-center gap-6 text-white/90">
          {event.date_time && (
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span className="text-sm">{formatDate(event.date_time)}</span>
            </div>
          )}
          {event.date_time && (
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="text-sm">{formatTime(event.date_time)}</span>
            </div>
          )}
          {event.venue && (
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span className="text-sm">{event.venue}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EventHero;