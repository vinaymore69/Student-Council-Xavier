import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Calendar, MapPin, Gift, Loader2, X } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

interface StudentWinningsProps {
  studentData: any;
}

const StudentWinnings: React.FC<StudentWinningsProps> = ({ studentData }) => {
  const [winnings, setWinnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWinning, setSelectedWinning] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (studentData?.college_mail) {
      fetchWinnings();
    }
  }, [studentData]);

  const fetchWinnings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('event_winners')
        .select(`
          *,
          events (
            event_name,
            event_type,
            year,
            venue,
            date_time
          )
        `)
        .eq('winner_email', studentData.college_mail.toLowerCase())
        .order('created_at', { ascending: false});

      if (error) throw error;
      setWinnings(data || []);
    } catch (error) {
      console.error('Error fetching winnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPositionBadge = (position: string) => {
    const pos = position.toLowerCase();
    if (pos.includes('1st') || pos.includes('first') || pos === '1' || pos.includes('winner')) {
      return { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: '🥇' };
    }
    if (pos.includes('2nd') || pos.includes('second') || pos === '2' || pos.includes('runner')) {
      return { color: 'bg-gray-50 text-gray-700 border-gray-200', icon: '🥈' };
    }
    if (pos.includes('3rd') || pos.includes('third') || pos === '3') {
      return { color: 'bg-orange-50 text-orange-700 border-orange-200', icon: '🥉' };
    }
    return { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: '🏅' };
  };

  const handleViewDetails = (winning: any) => {
    setSelectedWinning(winning);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">My Achievements</h1>
        <p className="text-sm text-gray-500">
          {winnings.length > 0 
            ? `${winnings.length} achievement${winnings.length > 1 ? 's' : ''} across various events`
            : "No achievements yet"
          }
        </p>
      </div>

      {/* Achievements Grid */}
      {winnings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {winnings.map((winning, index) => {
            const badge = getPositionBadge(winning.position);
            return (
              <Card 
                key={index} 
                className="border-gray-100 hover:border-gray-200 transition-all cursor-pointer overflow-hidden group" 
                onClick={() => handleViewDetails(winning)}
              >
                {/* Image */}
                {winning.winner_image_url ? (
                  <div className="h-40 overflow-hidden bg-gray-50">
                    <img 
                      src={winning.winner_image_url} 
                      alt={winning.sub_event_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <Trophy className="h-12 w-12 text-gray-300" />
                  </div>
                )}

                <CardContent className="p-4">
                  {/* Badge & Year */}
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={`${badge.color} border text-xs font-medium`}>
                      {badge.icon} {winning.position}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {(winning as any).events?.year}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">{winning.sub_event_name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {(winning as any).events?.event_name}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar className="h-3 w-3" />
                      {(winning as any).events?.event_type}
                    </div>
                    {winning.prize && (
                      <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium pt-1">
                        <Gift className="h-3 w-3" />
                        {winning.prize}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-gray-100">
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">No achievements yet</h3>
            <p className="text-sm text-gray-500">Participate in events to earn your first achievement</p>
          </CardContent>
        </Card>
      )}

      {/* Details Modal */}
      {selectedWinning && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl p-0 overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Image */}
            {selectedWinning.winner_image_url && (
              <div className="w-full h-64 bg-gray-100">
                <img 
                  src={selectedWinning.winner_image_url} 
                  alt={selectedWinning.sub_event_name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 space-y-6">
              {/* Badge */}
              <div className="flex justify-center">
                <Badge className={`${getPositionBadge(selectedWinning.position).color} border px-4 py-1.5 text-sm font-semibold`}>
                  {getPositionBadge(selectedWinning.position).icon} {selectedWinning.position}
                </Badge>
              </div>

              {/* Title */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{selectedWinning.sub_event_name}</h3>
                <p className="text-sm text-gray-600">{(selectedWinning as any).events?.event_name}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Event Type</p>
                    <p className="text-sm font-medium text-gray-900">{(selectedWinning as any).events?.event_type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <Trophy className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Year</p>
                    <p className="text-sm font-medium text-gray-900">{(selectedWinning as any).events?.year}</p>
                  </div>
                </div>
                {(selectedWinning as any).events?.venue && (
                  <div className="flex items-center gap-3 col-span-2">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Venue</p>
                      <p className="text-sm font-medium text-gray-900">{(selectedWinning as any).events?.venue}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Prize */}
              {selectedWinning.prize && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                      <Gift className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-green-600 font-medium">Prize</p>
                      <p className="text-base font-semibold text-green-900">{selectedWinning.prize}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default StudentWinnings;