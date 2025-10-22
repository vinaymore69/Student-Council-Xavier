import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, TrendingUp, Target, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface StudentOverviewProps {
  studentData: any;
  winningsCount: number;
}

const StudentOverview: React.FC<StudentOverviewProps> = ({ studentData, winningsCount }) => {
  const [stats, setStats] = useState({
    totalWinnings: 0,
    firstPlace: 0,
    secondPlace: 0,
    thirdPlace: 0,
    totalPoints: 0,
    recentWins: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentData?.college_mail) {
      fetchStats();
    }
  }, [studentData]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data: winnings, error } = await supabase
        .from('event_winners')
        .select(`
          *,
          events (
            event_name,
            event_type,
            year
          )
        `)
        .eq('winner_email', studentData.college_mail.toLowerCase())
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (winnings) {
        let first = 0, second = 0, third = 0, points = 0;

        winnings.forEach(win => {
          const pos = win.position.toLowerCase();
          if (pos.includes('1st') || pos.includes('first') || pos === '1' || pos.includes('winner')) {
            first++;
            points += 100;
          } else if (pos.includes('2nd') || pos.includes('second') || pos === '2' || pos.includes('runner')) {
            second++;
            points += 75;
          } else if (pos.includes('3rd') || pos.includes('third') || pos === '3') {
            third++;
            points += 50;
          } else {
            points += 25;
          }
        });

        setStats({
          totalWinnings: winnings.length,
          firstPlace: first,
          secondPlace: second,
          thirdPlace: third,
          totalPoints: points,
          recentWins: winnings.slice(0, 5)
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
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
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Welcome back, {studentData.name?.split(' ')[0]}
        </h1>
        <p className="text-sm text-gray-500">
          {stats.totalWinnings > 0 
            ? `${stats.totalWinnings} achievement${stats.totalWinnings > 1 ? 's' : ''} across various events`
            : "Start your journey by participating in events"
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-gray-100">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-gray-900 mb-1">{stats.totalPoints}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Total Points</div>
          </CardContent>
        </Card>

        <Card className="border-gray-100">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-gray-900 mb-1">{stats.firstPlace}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">First Place</div>
          </CardContent>
        </Card>

        <Card className="border-gray-100">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                <span className="text-lg">🥈</span>
              </div>
            </div>
            <div className="text-2xl font-semibold text-gray-900 mb-1">{stats.secondPlace}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Second Place</div>
          </CardContent>
        </Card>

        <Card className="border-gray-100">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <span className="text-lg">🥉</span>
              </div>
            </div>
            <div className="text-2xl font-semibold text-gray-900 mb-1">{stats.thirdPlace}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Third Place</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card className="border-gray-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-900">Recent Achievements</h2>
            <span className="text-xs text-gray-500">{stats.recentWins.length} total</span>
          </div>

          {stats.recentWins.length > 0 ? (
            <div className="space-y-3">
              {stats.recentWins.map((win, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Trophy className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{win.sub_event_name}</h4>
                      <p className="text-xs text-gray-500 truncate">
                        {(win as any).events?.event_name} • {(win as any).events?.year}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-100 whitespace-nowrap ml-2">
                    {win.position}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                <Trophy className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-sm text-gray-500 mb-1">No achievements yet</p>
              <p className="text-xs text-gray-400">Participate in events to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-gray-100">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Academic Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Roll Number</span>
                <span className="font-medium text-gray-900">{studentData.roll_no}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Department</span>
                <span className="font-medium text-gray-900">{studentData.department}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Class</span>
                <span className="font-medium text-gray-900">{studentData.class} {studentData.division}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Performance</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Events</span>
                <span className="font-medium text-gray-900">{stats.totalWinnings}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Win Rate</span>
                <span className="font-medium text-gray-900">
                  {stats.totalWinnings > 0 
                    ? `${Math.round((stats.firstPlace / stats.totalWinnings) * 100)}%`
                    : '0%'
                  }
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Best Position</span>
                <span className="font-medium text-gray-900">
                  {stats.firstPlace > 0 ? '🥇 First' : stats.secondPlace > 0 ? '🥈 Second' : stats.thirdPlace > 0 ? '🥉 Third' : '—'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentOverview;