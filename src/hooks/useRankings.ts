import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

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
}

const calculatePoints = (position: string): number => {
  const pos = position.toLowerCase();
  if (pos.includes('1st') || pos.includes('first') || pos === '1') return 100;
  if (pos.includes('2nd') || pos.includes('second') || pos === '2') return 75;
  if (pos.includes('3rd') || pos.includes('third') || pos === '3') return 50;
  if (pos.includes('winner')) return 100;
  if (pos.includes('runner')) return 75;
  return 25; // Participation points
};

export const useRankings = (category: string = 'overall') => {
  return useQuery({
    queryKey: ['rankings', category],
    queryFn: async () => {
      // Fetch all winners
      const { data: winners, error } = await supabase
        .from('event_winners')
        .select(`
          *,
          events (
            id,
            name,
            event_type,
            category
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by student email and calculate rankings
      const studentMap = new Map<string, StudentRanking>();

      winners?.forEach((winner: any) => {
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

      // Convert to array and sort by points
      const rankings = Array.from(studentMap.values())
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .map((student, index) => ({
          ...student,
          rank: index + 1,
        }));

      return rankings;
    },
  });
};

// Hook to get individual student ranking
export const useStudentRanking = (email: string) => {
  return useQuery({
    queryKey: ['student-ranking', email],
    queryFn: async () => {
      const { data: wins, error } = await supabase
        .from('event_winners')
        .select('*')
        .eq('winner_email', email)
        .order('created_at', { ascending: false });

      if (error) throw error;

      let totalPoints = 0;
      let firstPlace = 0;
      let secondPlace = 0;
      let thirdPlace = 0;

      wins?.forEach(win => {
        totalPoints += calculatePoints(win.position);
        const pos = win.position.toLowerCase();
        if (pos.includes('1st') || pos.includes('first') || pos === '1') firstPlace++;
        if (pos.includes('2nd') || pos.includes('second') || pos === '2') secondPlace++;
        if (pos.includes('3rd') || pos.includes('third') || pos === '3') thirdPlace++;
      });

      return {
        email,
        totalPoints,
        eventsParticipated: wins?.length || 0,
        firstPlace,
        secondPlace,
        thirdPlace,
        wins: wins || [],
      };
    },
  });
};

// Hook to get top performers
export const useTopPerformers = (limit: number = 10) => {
  const { data: allRankings } = useRankings();
  
  return {
    data: allRankings?.slice(0, limit),
    isLoading: !allRankings,
  };
};