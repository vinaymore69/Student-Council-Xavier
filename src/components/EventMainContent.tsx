import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, ShieldCheck, Trophy } from 'lucide-react';

interface EventMainContentProps {
  event: any;
}

const EventMainContent: React.FC<EventMainContentProps> = ({ event }) => {
  return (
    <div className="space-y-6">
      {/* Description */}
      {event.description && (
        <Card className="border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-gray-900">About Event</h2>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rules */}
      {event.rules && (
        <Card className="border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Rules & Regulations</h2>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {event.rules}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Code of Conduct */}
      {event.code_of_conduct && (
        <Card className="border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Code of Conduct</h2>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {event.code_of_conduct}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prize Details */}
      {event.prize_details && (
        <Card className="border-gray-100 bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <h2 className="text-lg font-semibold text-gray-900">Prize Details</h2>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                {event.prize_details}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventMainContent;