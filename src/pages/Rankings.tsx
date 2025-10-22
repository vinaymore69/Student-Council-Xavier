import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RankingsHero from '@/components/RankingsHero';
import RankingsFilters from '@/components/RankingsFilters';
import RankingsList from '@/components/RankingsList';
import StudentDetailsModal from '@/components/StudentDetailsModal';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';

interface Winner {
  id: string;
  event_id: string;
  sub_event_id: string;
  sub_event_name: string;
  winner_email: string;
  winner_name: string;
  position: string;
  prize: string | null;
  winner_image_url: string | null;
  created_at: string;
  events?: {
    event_name: string;
    event_type: string;
    year: number;
  };
}

interface StudentRanking {
  email: string;
  name: string;
  totalPoints: number;
  eventsParticipated: number;
  eventsWon: number;
  firstPlace: number;
  secondPlace: number;
  thirdPlace: number;
  wins: Winner[];
  imageUrl: string | null;
  rank: number;
}

const calculatePoints = (position: string): number => {
  const pos = position.toLowerCase();
  if (pos.includes('1st') || pos.includes('first') || pos === '1' || pos.includes('winner')) return 100;
  if (pos.includes('2nd') || pos.includes('second') || pos === '2' || pos.includes('runner')) return 75;
  if (pos.includes('3rd') || pos.includes('third') || pos === '3') return 50;
  return 25;
};

const Rankings = () => {
  const currentYear = new Date().getFullYear();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentRanking | null>(null);
  const [rankings, setRankings] = useState<StudentRanking[]>([]);
  const [filteredRankings, setFilteredRankings] = useState<StudentRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRankings();
  }, []);

  useEffect(() => {
    filterRankings();
  }, [rankings, selectedCategory, selectedYear]);

  const fetchRankings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: winners, error: winnersError } = await supabase
        .from('event_winners')
        .select(`
          *,
          events (
            event_name,
            event_type,
            year
          )
        `)
        .order('created_at', { ascending: false });

      if (winnersError) throw winnersError;

      if (!winners || winners.length === 0) {
        setRankings([]);
        setLoading(false);
        return;
      }

      const studentMap = new Map<string, StudentRanking>();

      winners.forEach((winner: any) => {
        const email = winner.winner_email;
        
        if (!studentMap.has(email)) {
          studentMap.set(email, {
            email,
            name: winner.winner_name || email.split('@')[0],
            totalPoints: 0,
            eventsParticipated: 0,
            eventsWon: 0,
            firstPlace: 0,
            secondPlace: 0,
            thirdPlace: 0,
            wins: [],
            imageUrl: winner.winner_image_url,
            rank: 0,
          });
        }

        const student = studentMap.get(email)!;
        const points = calculatePoints(winner.position);
        
        student.totalPoints += points;
        student.eventsParticipated += 1;
        student.wins.push(winner);

        const pos = winner.position.toLowerCase();
        if (pos.includes('1st') || pos.includes('first') || pos === '1' || pos.includes('winner')) {
          student.eventsWon += 1;
          student.firstPlace += 1;
        } else if (pos.includes('2nd') || pos.includes('second') || pos === '2' || pos.includes('runner')) {
          student.secondPlace += 1;
        } else if (pos.includes('3rd') || pos.includes('third') || pos === '3') {
          student.thirdPlace += 1;
        }
      });

      const rankingsArray = Array.from(studentMap.values())
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .map((student, index) => ({
          ...student,
          rank: index + 1,
        }));

      setRankings(rankingsArray);
    } catch (err: any) {
      console.error('Error fetching rankings:', err);
      setError(err.message || 'Failed to load rankings');
    } finally {
      setLoading(false);
    }
  };

  const filterRankings = () => {
    let filtered = [...rankings];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.map(student => {
        const filteredWins = student.wins.filter(
          (win: any) => win.events?.event_type === selectedCategory
        );
        
        if (filteredWins.length === 0) return null;

        let points = 0;
        let first = 0, second = 0, third = 0, won = 0;

        filteredWins.forEach(win => {
          points += calculatePoints(win.position);
          const pos = win.position.toLowerCase();
          if (pos.includes('1st') || pos.includes('first') || pos === '1' || pos.includes('winner')) {
            first++;
            won++;
          } else if (pos.includes('2nd') || pos.includes('second') || pos === '2' || pos.includes('runner')) {
            second++;
          } else if (pos.includes('3rd') || pos.includes('third') || pos === '3') {
            third++;
          }
        });

        return {
          ...student,
          totalPoints: points,
          eventsParticipated: filteredWins.length,
          eventsWon: won,
          firstPlace: first,
          secondPlace: second,
          thirdPlace: third,
          wins: filteredWins
        };
      }).filter(Boolean) as StudentRanking[];

      filtered.sort((a, b) => b.totalPoints - a.totalPoints);
      filtered = filtered.map((student, index) => ({
        ...student,
        rank: index + 1
      }));
    }

    // Year filter
    if (selectedYear !== 'all') {
      const year = parseInt(selectedYear);
      filtered = filtered.map(student => {
        const filteredWins = student.wins.filter(
          (win: any) => win.events?.year === year
        );
        
        if (filteredWins.length === 0) return null;

        let points = 0;
        let first = 0, second = 0, third = 0, won = 0;

        filteredWins.forEach(win => {
          points += calculatePoints(win.position);
          const pos = win.position.toLowerCase();
          if (pos.includes('1st') || pos.includes('first') || pos === '1' || pos.includes('winner')) {
            first++;
            won++;
          } else if (pos.includes('2nd') || pos.includes('second') || pos === '2' || pos.includes('runner')) {
            second++;
          } else if (pos.includes('3rd') || pos.includes('third') || pos === '3') {
            third++;
          }
        });

        return {
          ...student,
          totalPoints: points,
          eventsParticipated: filteredWins.length,
          eventsWon: won,
          firstPlace: first,
          secondPlace: second,
          thirdPlace: third,
          wins: filteredWins
        };
      }).filter(Boolean) as StudentRanking[];

      filtered.sort((a, b) => b.totalPoints - a.totalPoints);
      filtered = filtered.map((student, index) => ({
        ...student,
        rank: index + 1
      }));
    }

    setFilteredRankings(filtered);
  };

  const availableYears = Array.from(
    new Set(
      rankings.flatMap(r => r.wins.map((w: any) => w.events?.year)).filter(Boolean)
    )
  ).sort((a, b) => (b as number) - (a as number));

  const handleViewDetails = (student: StudentRanking) => {
    setSelectedStudent(student);
  };

  const handleCloseModal = () => {
    setSelectedStudent(null);
  };

  // Initialize intersection observer for scroll animations
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
    
    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));
    
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [filteredRankings]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-pulse-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading rankings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="text-red-500 mb-4 text-4xl">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Rankings</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchRankings}
            className="px-6 py-3 bg-pulse-500 text-white rounded-full hover:bg-pulse-600 transition-colors shadow-lg"
          >
            Try Again
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="space-y-0">
        <RankingsHero />
        <RankingsFilters 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          availableYears={availableYears}
        />
        <RankingsList 
          rankings={filteredRankings}
          onViewDetails={handleViewDetails}
        />
      </main>
      
      <Footer />

      {/* Student Details Modal */}
      {selectedStudent && (
        <StudentDetailsModal 
          student={selectedStudent}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Rankings;