import React, { useEffect } from "react";
import { X, Trophy, Medal, Award, Star } from "lucide-react";

interface StudentRanking {
  email: string;
  name: string;
  totalPoints: number;
  eventsParticipated: number;
  eventsWon: number;
  firstPlace: number;
  secondPlace: number;
  thirdPlace: number;
  wins: any[];
  imageUrl: string | null;
  rank: number;
}

interface StudentDetailsModalProps {
  student: StudentRanking;
  onClose: () => void;
}

const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({ student, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const getPositionBadgeColor = (position: string) => {
    if (position.includes('1st') || position.includes('Winner')) return 'bg-yellow-500 text-white';
    if (position.includes('2nd')) return 'bg-gray-400 text-white';
    if (position.includes('3rd')) return 'bg-orange-600 text-white';
    return 'bg-blue-500 text-white';
  };

  const getPositionIcon = (position: string) => {
    if (position.includes('1st') || position.includes('Winner')) return <Trophy className="w-4 h-4" />;
    if (position.includes('2nd')) return <Medal className="w-4 h-4" />;
    if (position.includes('3rd')) return <Award className="w-4 h-4" />;
    return <Star className="w-4 h-4" />;
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 animate-fade-in flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-pulse-500 to-purple-600 p-6 rounded-t-3xl text-white z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white/50">
                {student.imageUrl ? (
                  <img src={student.imageUrl} alt={student.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/20 flex items-center justify-center text-3xl font-bold">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{student.name}</h2>
                <p className="text-white/80 text-sm">{student.email}</p>
                <div className="mt-2 inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                  Rank #{student.rank}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="text-2xl font-bold">{student.totalPoints}</div>
              <div className="text-xs text-white/80">Total Points</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="text-2xl font-bold">{student.eventsWon}</div>
              <div className="text-xs text-white/80">Wins</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="text-2xl font-bold">{student.firstPlace}</div>
              <div className="text-xs text-white/80">1st Place</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="text-2xl font-bold">{student.eventsParticipated}</div>
              <div className="text-xs text-white/80">Events</div>
            </div>
          </div>
        </div>

        {/* Achievements List */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-pulse-500" />
            All Achievements ({student.wins.length})
          </h3>
          <div className="space-y-3">
            {student.wins.map((win, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getPositionIcon(win.position)}
                      <h4 className="font-semibold text-gray-900">{win.sub_event_name}</h4>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                      <span>{win.events?.event_name}</span>
                      <span>•</span>
                      <span className="px-2 py-0.5 bg-gray-200 rounded">{win.events?.event_type}</span>
                      <span>•</span>
                      <span>{win.events?.year}</span>
                    </div>
                    {win.prize && (
                      <p className="text-sm text-green-600 mt-2 font-medium">🏆 {win.prize}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getPositionBadgeColor(win.position)}`}>
                    {win.position}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsModal;