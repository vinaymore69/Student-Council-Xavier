import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Award } from 'lucide-react';

interface EventInfoCardsProps {
  event: any;
}

const EventInfoCards: React.FC<EventInfoCardsProps> = ({ event }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-gray-100">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date</p>
              <p className="text-sm font-semibold text-gray-900">
                {event.date_time ? formatDate(event.date_time) : 'TBA'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-100">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Time</p>
              <p className="text-sm font-semibold text-gray-900">
                {event.date_time ? formatTime(event.date_time) : 'TBA'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-100">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Venue</p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {event.venue || 'TBA'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-100">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <Award className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Duration</p>
              <p className="text-sm font-semibold text-gray-900">
                {event.duration || 'TBA'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventInfoCards;