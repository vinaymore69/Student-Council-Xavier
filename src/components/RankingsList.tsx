import React, { useEffect, useRef, useState } from "react";
import { Trophy, Medal, Award, Star, Crown, Flame, Eye, ChevronDown, ChevronUp } from "lucide-react";

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

interface RankingsListProps {
  rankings: StudentRanking[];
  onViewDetails: (student: StudentRanking) => void;
}

// Replace the RankingCard component with this elegant version:

const RankingCard: React.FC<{ 
  student: StudentRanking; 
  index: number; 
  onViewDetails: () => void;
  onToggleExpand: () => void;
  isExpanded: boolean;
}> = ({ student, index, onViewDetails, onToggleExpand, isExpanded }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const getPositionBadgeColor = (position: string) => {
    const pos = position.toLowerCase();
    if (pos.includes('1st') || pos.includes('first') || pos === '1' || pos.includes('winner')) {
      return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
    }
    if (pos.includes('2nd') || pos.includes('second') || pos === '2' || pos.includes('runner')) {
      return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
    if (pos.includes('3rd') || pos.includes('third') || pos === '3') {
      return 'bg-orange-50 text-orange-700 border border-orange-200';
    }
    return 'bg-blue-50 text-blue-700 border border-blue-200';
  };

  const getPositionIcon = (position: string) => {
    const pos = position.toLowerCase();
    if (pos.includes('1st') || pos.includes('first') || pos === '1' || pos.includes('winner')) {
      return <Trophy className="w-3.5 h-3.5" />;
    }
    if (pos.includes('2nd') || pos.includes('second') || pos === '2' || pos.includes('runner')) {
      return <Medal className="w-3.5 h-3.5" />;
    }
    if (pos.includes('3rd') || pos.includes('third') || pos === '3') {
      return <Award className="w-3.5 h-3.5" />;
    }
    return <Star className="w-3.5 h-3.5" />;
  };

  const sortedWins = [...student.wins].sort((a, b) => {
    const getPriority = (position: string) => {
      const pos = position.toLowerCase();
      if (pos.includes('1st') || pos.includes('first') || pos === '1' || pos.includes('winner')) return 1;
      if (pos.includes('2nd') || pos.includes('second') || pos === '2' || pos.includes('runner')) return 2;
      if (pos.includes('3rd') || pos.includes('third') || pos === '3') return 3;
      return 4;
    };
    return getPriority(a.position) - getPriority(b.position);
  });

  return (
    <div 
      ref={cardRef}
      className="opacity-0 group relative bg-white border border-gray-100 rounded-3xl p-6 hover:border-pulse-200 hover:shadow-lg transition-all duration-300"
      style={{ animationDelay: `${0.05 * index}s` }}
    >
      {/* Rank Number - Large & Elegant */}
      <div className="absolute top-6 right-6 text-5xl font-light text-gray-100 group-hover:text-pulse-100 transition-colors">
        {student.rank}
      </div>

      {/* Student Header */}
      <div className="relative flex items-center gap-4 mb-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100">
            {student.imageUrl ? (
              <img 
                src={student.imageUrl} 
                alt={student.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pulse-400 to-pulse-600 flex items-center justify-center text-white text-xl font-medium">
                {student.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{student.name}</h3>
          <p className="text-sm text-gray-500 truncate">{student.email}</p>
        </div>
      </div>

      {/* Stats - Clean Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-semibold text-pulse-600 mb-1">{student.totalPoints}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Points</div>
        </div>
        <div className="text-center border-l border-r border-gray-100">
          <div className="text-2xl font-semibold text-gray-900 mb-1">{student.eventsParticipated}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Events</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-green-600 mb-1">{student.eventsWon}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Wins</div>
        </div>
      </div>

      {/* Medals - Minimal */}
      <div className="flex items-center justify-center gap-6 mb-6 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🥇</span>
          <span className="text-sm font-medium text-gray-700">{student.firstPlace}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🥈</span>
          <span className="text-sm font-medium text-gray-700">{student.secondPlace}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🥉</span>
          <span className="text-sm font-medium text-gray-700">{student.thirdPlace}</span>
        </div>
      </div>

      {/* Actions - Minimal Text Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onToggleExpand}
          className="flex-1 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {isExpanded ? 'Less' : 'More'}
        </button>
        <div className="w-px bg-gray-200"></div>
        <button
          onClick={onViewDetails}
          className="flex-1 py-2.5 text-sm font-medium text-pulse-600 hover:text-pulse-700 transition-colors flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          View All
        </button>
      </div>

      {/* Expanded Achievements - Clean List */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h4 className="text-xs uppercase tracking-wide text-gray-500 font-medium mb-4">Recent Achievements</h4>
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {sortedWins.slice(0, 5).map((win, idx) => (
              <div key={idx} className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getPositionIcon(win.position)}
                    <p className="text-sm font-medium text-gray-900 truncate">{win.sub_event_name}</p>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {win.events?.event_name} • {win.events?.year}
                  </p>
                  {win.prize && (
                    <p className="text-xs text-green-600 mt-1">🏆 {win.prize}</p>
                  )}
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${getPositionBadgeColor(win.position)}`}>
                  {win.position}
                </span>
              </div>
            ))}
            {sortedWins.length > 5 && (
              <button 
                onClick={onViewDetails}
                className="w-full text-center text-xs text-pulse-600 hover:text-pulse-700 font-medium py-2"
              >
                View all {sortedWins.length} achievements →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const PodiumCard: React.FC<{
  student: StudentRanking;
  position: 1 | 2 | 3;
}> = ({ student, position }) => {
  const configs = {
    1: {
      height: '400px',
      bgGradient: 'from-yellow-400 to-yellow-600',
      imageSize: 'w-28 h-28',
      nameSize: 'text-2xl',
      badgeSize: 'w-20 h-20',
      badgeText: 'text-3xl',
      transform: 'perspective(1000px)',
      label: '1st',
      icon: Trophy,
      showCrown: true,
      marginTop: '',
      number: '1',
      numberColor: 'text-yellow-500',
      numberSize: 'text-7xl'
    },
    2: {
      height: '320px',
      bgGradient: 'from-gray-300 to-gray-400',
      imageSize: 'w-24 h-24',
      nameSize: 'text-xl',
      badgeSize: 'w-16 h-16',
      badgeText: 'text-2xl',
      transform: 'perspective(1000px) rotateY(-2deg)',
      label: '2nd',
      icon: Medal,
      showCrown: false,
      marginTop: 'md:mt-12',
      number: '2',
      numberColor: 'text-gray-400',
      numberSize: 'text-6xl'
    },
    3: {
      height: '280px',
      bgGradient: 'from-orange-400 to-orange-600',
      imageSize: 'w-24 h-24',
      nameSize: 'text-xl',
      badgeSize: 'w-16 h-16',
      badgeText: 'text-2xl',
      transform: 'perspective(1000px) rotateY(2deg)',
      label: '3rd',
      icon: Award,
      showCrown: false,
      marginTop: 'md:mt-12',
      number: '3',
      numberColor: 'text-orange-500',
      numberSize: 'text-6xl'
    }
  };

  const config = configs[position];
  const Icon = config.icon;

  return (
    <div className={`${config.marginTop} transform hover:scale-105 transition-all duration-500`}>
      <div 
        className={`relative bg-gradient-to-b ${config.bgGradient} rounded-t-3xl overflow-hidden shadow-2xl`}
        style={{ 
          minHeight: config.height,
          transform: config.transform
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        
        {/* Crown for 1st place */}
        {config.showCrown && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-20">
            <Crown className="w-12 h-12 text-yellow-300 animate-bounce drop-shadow-lg" />
          </div>
        )}

        {/* Position Badge */}
        <div className="absolute top-4 right-4 z-10">
          <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className={`relative z-10 ${position === 1 ? 'p-8' : 'p-6'} text-center text-white`}>
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div className={`${config.badgeSize} rounded-full bg-gradient-to-br ${config.bgGradient} flex items-center justify-center shadow-xl border-4 border-white ${position === 1 ? 'ring-4 ring-yellow-200' : ''}`}>
              <span className={`${config.badgeText} font-bold`}>{config.label}</span>
            </div>
          </div>
          <div className={position === 1 ? 'mt-16' : 'mt-12'}>
            {student.imageUrl ? (
              <img 
                src={student.imageUrl} 
                alt={student.name}
                className={`${config.imageSize} rounded-full mx-auto mb-4 object-cover shadow-lg border-4 border-white ${position === 1 ? 'ring-4 ring-white/50' : ''}`}
              />
            ) : (
              <div className={`${config.imageSize} rounded-full bg-white mx-auto mb-4 flex items-center justify-center ${position === 1 ? 'text-4xl text-yellow-600' : 'text-3xl text-gray-700'} font-bold shadow-lg ${position === 1 ? 'ring-4 ring-white/50' : ''}`}>
                {student.name.charAt(0).toUpperCase()}
              </div>
            )}
            <h3 className={`${config.nameSize} font-bold mb-${position === 1 ? '2' : '1'} truncate px-2`}>{student.name}</h3>
            <p className={`${position === 1 ? 'text-sm' : 'text-xs'} opacity-90 mb-${position === 1 ? '4' : '3'} truncate px-2`}>{student.email}</p>
            <div className={`bg-white/${position === 1 ? '30' : '20'} rounded-full px-${position === 1 ? '6' : '4'} py-${position === 1 ? '3' : '2'} backdrop-blur-sm inline-block mb-${position === 1 ? '4' : '3'}`}>
              <p className={`${position === 1 ? 'text-3xl' : 'text-2xl'} font-bold`}>{student.totalPoints}</p>
              <p className={`${position === 1 ? 'text-sm' : 'text-xs'}`}>Points</p>
            </div>
            <div className={`flex justify-center gap-2 ${position === 1 ? 'text-sm mb-4' : 'text-xs'}`}>
              <span className="bg-white/20 px-3 py-1 rounded-full">🥇 {student.firstPlace}</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">🥈 {student.secondPlace}</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">🥉 {student.thirdPlace}</span>
            </div>
            {position === 1 && (
              <div className="flex justify-center gap-1">
                <Star className="w-5 h-5 fill-white" />
                <Star className="w-5 h-5 fill-white" />
                <Star className="w-5 h-5 fill-white" />
              </div>
            )}
          </div>
        </div>
        <div className={`absolute bottom-0 left-0 right-0 h-${position === 1 ? '24' : '20'} bg-gradient-to-t from-black/20 to-transparent`}></div>
      </div>
    </div>
  );
};

const RankingsList: React.FC<RankingsListProps> = ({ rankings, onViewDetails }) => {
  const [expandedStudents, setExpandedStudents] = useState<Set<string>>(new Set());

  const toggleExpand = (email: string) => {
    setExpandedStudents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(email)) {
        newSet.delete(email);
      } else {
        newSet.add(email);
      }
      return newSet;
    });
  };

  if (rankings.length === 0) {
    return (
      <section className="w-full py-8 sm:py-12 bg-gradient-to-b from-gray-50 to-white" id="rankings-list">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center py-20 bg-white rounded-3xl shadow-elegant">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <Trophy className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-display font-bold text-gray-900 mb-2">No Rankings Available</h3>
            <p className="text-gray-600">
              Check back after events are completed to see the rankings
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-8 sm:py-12 bg-gradient-to-b from-gray-50 to-white" id="rankings-list">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        
        {/* Stats Bar */}
        <div className="mb-8 p-4 bg-white rounded-2xl shadow-sm flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-2xl font-bold text-pulse-500">{rankings.length}</p>
              <p className="text-xs text-gray-600">Total Students</p>
            </div>
            <div className="h-10 w-px bg-gray-200"></div>
            <div>
              <p className="text-2xl font-bold text-yellow-500">{rankings.filter(r => r.firstPlace > 0).length}</p>
              <p className="text-xs text-gray-600">🥇 Gold Winners</p>
            </div>
            <div className="h-10 w-px bg-gray-200"></div>
            <div>
              <p className="text-2xl font-bold text-gray-500">{rankings.filter(r => r.secondPlace > 0).length}</p>
              <p className="text-xs text-gray-600">🥈 Silver Winners</p>
            </div>
            <div className="h-10 w-px bg-gray-200"></div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{rankings.filter(r => r.thirdPlace > 0).length}</p>
              <p className="text-xs text-gray-600">🥉 Bronze Winners</p>
            </div>
          </div>
        </div>

        {/* Display based on number of students */}
        {rankings.length === 1 ? (
          // Single student - show as featured card
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
                <Crown className="w-8 h-8 text-yellow-500" />
                Top Performer
                <Crown className="w-8 h-8 text-yellow-500" />
              </h2>
            </div>
            <div className="max-w-md mx-auto">
              <PodiumCard student={rankings[0]} position={1} />
            </div>
          </div>
        ) : rankings.length === 2 ? (
          // Two students - show 1st and 2nd
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
                <Flame className="w-8 h-8 text-orange-500" />
                Top Performers
                <Flame className="w-8 h-8 text-orange-500" />
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <PodiumCard student={rankings[1]} position={2} />
              <PodiumCard student={rankings[0]} position={1} />
            </div>
          </div>
        ) : (
          // Three or more students - show full podium
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
                <Flame className="w-8 h-8 text-orange-500" />
                Top Performers
                <Flame className="w-8 h-8 text-orange-500" />
              </h2>
              <p className="text-gray-600 mt-2">Ranked by total points earned across all events</p>
            </div>

            {/* 3D Podium Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <PodiumCard student={rankings[1]} position={2} />
              <PodiumCard student={rankings[0]} position={1} />
              <PodiumCard student={rankings[2]} position={3} />
            </div>
          </div>
        )}

        {/* Complete Rankings Grid - Show all students in cards */}
        {rankings.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 px-2 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-pulse-500" />
              {rankings.length <= 3 ? 'All Rankings' : 'Complete Rankings'}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {rankings.map((student, index) => (
                <RankingCard
                  key={student.email}
                  student={student}
                  index={index}
                  onViewDetails={() => onViewDetails(student)}
                  onToggleExpand={() => toggleExpand(student.email)}
                  isExpanded={expandedStudents.has(student.email)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RankingsList;